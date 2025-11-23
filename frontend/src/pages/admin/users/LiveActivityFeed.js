import { useState, useEffect, useRef } from 'react';
import styles from './LiveActivityFeed.module.scss';

/**
 * Compact Live Activity Feed Component
 * Shows recent user events (register/login) in real-time
 */
function LiveActivityFeed({ onHighlightUser }) {
    const [events, setEvents] = useState([]);
    const [isConnected, setIsConnected] = useState(false);
    const [stats, setStats] = useState({ totalRegistrations: 0, totalLogins: 0 });
    const wsRef = useRef(null);
    const reconnectTimeoutRef = useRef(null);
    const eventsEndRef = useRef(null);

    useEffect(() => {
        connectWebSocket();

        return () => {
            if (wsRef.current) {
                wsRef.current.close();
            }
            if (reconnectTimeoutRef.current) {
                clearTimeout(reconnectTimeoutRef.current);
            }
        };
    }, []);

    const connectWebSocket = () => {
        try {
            // WebSocket endpoint at gateway
            const wsUrl = process.env.REACT_APP_WS_URL || 'ws://localhost:8000/ws/events';
            console.log('[LiveActivityFeed] Connecting to WebSocket:', wsUrl);

            const ws = new WebSocket(wsUrl);
            wsRef.current = ws;

            ws.onopen = () => {
                console.log('[LiveActivityFeed] WebSocket connected');
                setIsConnected(true);
                
                // Request status
                ws.send(JSON.stringify({ type: 'status' }));
            };

            ws.onmessage = (event) => {
                try {
                    const data = JSON.parse(event.data);
                    console.log('[LiveActivityFeed] Received:', data);

                    // Handle direct event from RabbitMQ (via gateway broadcast)
                    if (data.event_type) {
                        handleNewEvent(data);
                    } 
                    // Handle wrapped message format
                    else if (data.type === 'event') {
                        handleNewEvent(data.data);
                    } 
                    // Handle connection status
                    else if (data.type === 'connection') {
                        console.log('[LiveActivityFeed] Connection status:', data.rabbitmqConnected);
                    }
                } catch (error) {
                    console.error('[LiveActivityFeed] Error parsing message:', error);
                }
            };

            ws.onerror = (error) => {
                console.error('[LiveActivityFeed] WebSocket error:', error);
                setIsConnected(false);
            };

            ws.onclose = () => {
                console.log('[LiveActivityFeed] WebSocket disconnected');
                setIsConnected(false);
                wsRef.current = null;

                // Reconnect after 5 seconds
                reconnectTimeoutRef.current = setTimeout(() => {
                    console.log('[LiveActivityFeed] Attempting to reconnect...');
                    connectWebSocket();
                }, 5000);
            };
        } catch (error) {
            console.error('[LiveActivityFeed] Error creating WebSocket:', error);
            setIsConnected(false);
        }
    };

    const handleNewEvent = (eventData) => {
        console.log('[LiveActivityFeed] New event:', eventData.event_type);
        
        setEvents((prevEvents) => {
            const newEvents = [eventData, ...prevEvents].slice(0, 10); // Keep last 10
            return newEvents;
        });

        // Update stats
        if (eventData.event_type === 'user.registered') {
            setStats(prev => ({ ...prev, totalRegistrations: prev.totalRegistrations + 1 }));
        } else if (eventData.event_type === 'user.login') {
            setStats(prev => ({ ...prev, totalLogins: prev.totalLogins + 1 }));
        }

        // Notify parent to highlight user in table
        // Event structure: { event_type: 'user.registered', user: { id, email, full_name, ... } }
        if (onHighlightUser && eventData.user?.id) {
            onHighlightUser(eventData.user.id, eventData.event_type);
        }
    };

    const formatTimestamp = (timestamp) => {
        const date = new Date(timestamp);
        const now = new Date();
        const diffMs = now - date;
        const diffMins = Math.floor(diffMs / 60000);
        
        if (diffMins < 1) return 'Vừa xong';
        if (diffMins < 60) return `${diffMins} phút trước`;
        if (diffMins < 1440) return `${Math.floor(diffMins / 60)} giờ trước`;
        return date.toLocaleDateString('vi-VN');
    };

    const getEventIcon = (eventType) => {
        return eventType === 'user.registered' ? '👤' : '🔐';
    };

    const getEventLabel = (eventType) => {
        return eventType === 'user.registered' ? 'Đăng ký' : 'Đăng nhập';
    };

    const getEventColor = (eventType) => {
        return eventType === 'user.registered' ? 'success' : 'info';
    };

    return (
        <div className={styles.liveActivityFeed}>
            <div className={styles.header}>
                <h3>🔴 Live Activity</h3>
                <div className={styles.status}>
                    <span className={`${styles.dot} ${isConnected ? styles.connected : ''}`}></span>
                    <span className={styles.statusText}>
                        {isConnected ? 'Đang kết nối' : 'Mất kết nối'}
                    </span>
                </div>
            </div>

            <div className={styles.eventList}>
                {events.length === 0 ? (
                    <div className={styles.empty}>
                        <p>⏳ Chờ events...</p>
                    </div>
                ) : (
                    events.map((event, index) => (
                        <div 
                            key={`${event.timestamp}-${index}`}
                            className={`${styles.eventItem} ${styles[getEventColor(event.event_type)]}`}
                        >
                            <span className={styles.icon}>{getEventIcon(event.event_type)}</span>
                            <div className={styles.content}>
                                <div className={styles.line1}>
                                    <strong>{event.user?.full_name || event.user?.email || event.user?.username || 'Unknown'}</strong>
                                    <span className={styles.action}>{getEventLabel(event.event_type)}</span>
                                </div>
                                <div className={styles.line2}>
                                    <span className={styles.role}>
                                        {event.user?.role || 'user'}
                                    </span>
                                    <span className={styles.time}>{formatTimestamp(event.timestamp)}</span>
                                </div>
                            </div>
                        </div>
                    ))
                )}
                <div ref={eventsEndRef} />
            </div>
        </div>
    );
}

export default LiveActivityFeed;
