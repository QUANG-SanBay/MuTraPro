/**
 * RabbitMQ WebSocket Bridge
 * Subscribes to RabbitMQ user.events exchange and broadcasts to WebSocket clients
 */

const amqp = require('amqplib');

class RabbitMQWebSocketBridge {
    constructor() {
        this.connection = null;
        this.channel = null;
        this.wsClients = new Set();
        this.isConnected = false;
        this.reconnectTimeout = null;
        this.reconnectDelay = 5000; // 5 seconds
    }

    /**
     * Initialize RabbitMQ connection and start consuming events
     */
    async connect() {
        try {
            const rabbitmqHost = process.env.RABBITMQ_HOST || 'rabbitmq';
            const rabbitmqPort = process.env.RABBITMQ_PORT || '5672';
            const rabbitmqUser = process.env.RABBITMQ_USER || 'guest';
            const rabbitmqPass = process.env.RABBITMQ_PASS || 'guest';

            const url = `amqp://${rabbitmqUser}:${rabbitmqPass}@${rabbitmqHost}:${rabbitmqPort}`;
            
            console.log('[RabbitMQ-WS] Connecting to RabbitMQ...');
            this.connection = await amqp.connect(url);
            this.channel = await this.connection.createChannel();

            // Declare exchange (should already exist, but ensure it)
            await this.channel.assertExchange('user.events', 'fanout', { durable: true });

            // Create exclusive queue for this WebSocket bridge
            const { queue } = await this.channel.assertQueue('', { exclusive: true });
            
            // Bind queue to user.events exchange
            await this.channel.bindQueue(queue, 'user.events', '');

            console.log('[RabbitMQ-WS] Connected successfully. Listening for user events...');
            this.isConnected = true;

            // Consume messages and broadcast to WebSocket clients
            await this.channel.consume(queue, (msg) => {
                if (msg) {
                    try {
                        const eventData = JSON.parse(msg.content.toString());
                        console.log('[RabbitMQ-WS] Received event:', eventData.event_type);
                        
                        // Broadcast to all connected WebSocket clients
                        this.broadcast(eventData);
                        
                        // Acknowledge message
                        this.channel.ack(msg);
                    } catch (error) {
                        console.error('[RabbitMQ-WS] Error processing message:', error);
                        this.channel.nack(msg, false, false); // Don't requeue malformed messages
                    }
                }
            }, { noAck: false });

            // Handle connection close
            this.connection.on('close', () => {
                console.warn('[RabbitMQ-WS] Connection closed. Attempting reconnect...');
                this.isConnected = false;
                this.scheduleReconnect();
            });

            // Handle connection error
            this.connection.on('error', (err) => {
                console.error('[RabbitMQ-WS] Connection error:', err.message);
                this.isConnected = false;
            });

        } catch (error) {
            console.error('[RabbitMQ-WS] Failed to connect:', error.message);
            this.isConnected = false;
            this.scheduleReconnect();
        }
    }

    /**
     * Schedule reconnection attempt
     */
    scheduleReconnect() {
        if (this.reconnectTimeout) {
            clearTimeout(this.reconnectTimeout);
        }
        
        this.reconnectTimeout = setTimeout(() => {
            console.log('[RabbitMQ-WS] Attempting to reconnect...');
            this.connect();
        }, this.reconnectDelay);
    }

    /**
     * Register a WebSocket client
     * @param {WebSocket} ws - WebSocket client instance
     */
    addClient(ws) {
        this.wsClients.add(ws);
        console.log(`[RabbitMQ-WS] Client connected. Total clients: ${this.wsClients.size}`);

        // Send connection status
        this.sendToClient(ws, {
            type: 'connection',
            status: 'connected',
            rabbitmqConnected: this.isConnected,
            timestamp: new Date().toISOString()
        });

        // Handle client disconnect
        ws.on('close', () => {
            this.wsClients.delete(ws);
            console.log(`[RabbitMQ-WS] Client disconnected. Total clients: ${this.wsClients.size}`);
        });

        ws.on('error', (error) => {
            console.error('[RabbitMQ-WS] WebSocket client error:', error.message);
            this.wsClients.delete(ws);
        });
    }

    /**
     * Send message to a specific client
     * @param {WebSocket} ws - WebSocket client
     * @param {Object} data - Data to send
     */
    sendToClient(ws, data) {
        try {
            if (ws.readyState === 1) { // OPEN state
                ws.send(JSON.stringify(data));
            }
        } catch (error) {
            console.error('[RabbitMQ-WS] Error sending to client:', error.message);
        }
    }

    /**
     * Broadcast message to all connected clients
     * @param {Object} eventData - Event data from RabbitMQ
     */
    broadcast(eventData) {
        const message = JSON.stringify({
            type: 'event',
            data: eventData,
            timestamp: new Date().toISOString()
        });

        let successCount = 0;
        let failCount = 0;

        this.wsClients.forEach((ws) => {
            try {
                if (ws.readyState === 1) { // OPEN state
                    ws.send(message);
                    successCount++;
                } else {
                    this.wsClients.delete(ws);
                    failCount++;
                }
            } catch (error) {
                console.error('[RabbitMQ-WS] Error broadcasting to client:', error.message);
                this.wsClients.delete(ws);
                failCount++;
            }
        });

        if (successCount > 0) {
            console.log(`[RabbitMQ-WS] Broadcasted event to ${successCount} client(s)`);
        }
        if (failCount > 0) {
            console.log(`[RabbitMQ-WS] Removed ${failCount} disconnected client(s)`);
        }
    }

    /**
     * Get connection status
     */
    getStatus() {
        return {
            rabbitmqConnected: this.isConnected,
            connectedClients: this.wsClients.size,
            timestamp: new Date().toISOString()
        };
    }

    /**
     * Cleanup and close connections
     */
    async close() {
        console.log('[RabbitMQ-WS] Closing connections...');
        
        if (this.reconnectTimeout) {
            clearTimeout(this.reconnectTimeout);
        }

        // Close all WebSocket clients
        this.wsClients.forEach((ws) => {
            try {
                ws.close(1000, 'Server shutting down');
            } catch (error) {
                console.error('[RabbitMQ-WS] Error closing client:', error.message);
            }
        });
        this.wsClients.clear();

        // Close RabbitMQ channel and connection
        try {
            if (this.channel) {
                await this.channel.close();
            }
            if (this.connection) {
                await this.connection.close();
            }
        } catch (error) {
            console.error('[RabbitMQ-WS] Error closing RabbitMQ connection:', error.message);
        }

        this.isConnected = false;
        console.log('[RabbitMQ-WS] Cleanup completed');
    }
}

// Export singleton instance
const bridge = new RabbitMQWebSocketBridge();
module.exports = bridge;
