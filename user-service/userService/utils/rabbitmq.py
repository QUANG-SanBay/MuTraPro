"""
RabbitMQ Event Publisher for User Service
Handles connection pooling and message publishing
"""
import pika
import json
import logging
from datetime import datetime
from django.conf import settings

logger = logging.getLogger(__name__)


class RabbitMQPublisher:
    """
    Singleton RabbitMQ connection manager for publishing events
    """
    _instance = None
    _connection = None
    _channel = None
    
    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(RabbitMQPublisher, cls).__new__(cls)
        return cls._instance
    
    def __init__(self):
        """Initialize RabbitMQ connection from environment variables"""
        if self._connection is None or self._connection.is_closed:
            self._connect()
    
    def _connect(self):
        """Establish connection to RabbitMQ"""
        try:
            # Get RabbitMQ configuration from environment or use defaults
            rabbitmq_host = getattr(settings, 'RABBITMQ_HOST', 'rabbitmq')
            rabbitmq_port = getattr(settings, 'RABBITMQ_PORT', 5672)
            rabbitmq_user = getattr(settings, 'RABBITMQ_USER', 'guest')
            rabbitmq_pass = getattr(settings, 'RABBITMQ_PASS', 'guest')
            
            credentials = pika.PlainCredentials(rabbitmq_user, rabbitmq_pass)
            parameters = pika.ConnectionParameters(
                host=rabbitmq_host,
                port=rabbitmq_port,
                credentials=credentials,
                heartbeat=600,
                blocked_connection_timeout=300
            )
            
            self._connection = pika.BlockingConnection(parameters)
            self._channel = self._connection.channel()
            
            # Declare exchanges (idempotent - safe to call multiple times)
            self._declare_exchanges()
            
            logger.info(f"✅ Connected to RabbitMQ at {rabbitmq_host}:{rabbitmq_port}")
        except Exception as e:
            logger.error(f"❌ Failed to connect to RabbitMQ: {e}")
            self._connection = None
            self._channel = None
    
    def _declare_exchanges(self):
        """Declare all required exchanges"""
        exchanges = [
            {
                'name': 'user.events',
                'type': 'fanout',
                'durable': True
            },
            {
                'name': 'notifications',
                'type': 'topic',
                'durable': True
            }
        ]
        
        for exchange in exchanges:
            try:
                self._channel.exchange_declare(
                    exchange=exchange['name'],
                    exchange_type=exchange['type'],
                    durable=exchange['durable']
                )
                logger.info(f"✅ Declared exchange: {exchange['name']}")
            except Exception as e:
                logger.error(f"❌ Failed to declare exchange {exchange['name']}: {e}")
    
    def publish_event(self, exchange, routing_key, event_data):
        """
        Publish event to RabbitMQ
        
        Args:
            exchange (str): Exchange name (e.g., 'user.events')
            routing_key (str): Routing key (e.g., 'user.registered')
            event_data (dict): Event payload
        
        Returns:
            bool: True if published successfully, False otherwise
        """
        try:
            # Reconnect if connection is closed
            if self._connection is None or self._connection.is_closed:
                self._connect()
            
            if self._channel is None:
                logger.error("❌ No active channel to publish message")
                return False
            
            # Add metadata
            message = {
                'event_id': f"{event_data.get('event_type', 'unknown')}_{datetime.utcnow().timestamp()}",
                'timestamp': datetime.utcnow().isoformat() + 'Z',
                'service': 'user-service',
                **event_data
            }
            
            # Publish message
            self._channel.basic_publish(
                exchange=exchange,
                routing_key=routing_key,
                body=json.dumps(message),
                properties=pika.BasicProperties(
                    delivery_mode=2,  # Persistent message
                    content_type='application/json',
                    content_encoding='utf-8'
                )
            )
            
            logger.info(f"📤 Published event: {routing_key} to {exchange}")
            return True
            
        except Exception as e:
            logger.error(f"❌ Failed to publish event: {e}")
            return False
    
    def close(self):
        """Close RabbitMQ connection"""
        try:
            if self._connection and not self._connection.is_closed:
                self._connection.close()
                logger.info("🔌 Closed RabbitMQ connection")
        except Exception as e:
            logger.error(f"❌ Error closing RabbitMQ connection: {e}")


# Global publisher instance
_publisher = None


def get_publisher():
    """Get or create global RabbitMQ publisher instance"""
    global _publisher
    if _publisher is None:
        _publisher = RabbitMQPublisher()
    return _publisher


def publish_user_event(event_type, user_data, extra_data=None):
    """
    Convenience function to publish user events
    
    Args:
        event_type (str): Event type (e.g., 'user.registered', 'user.login')
        user_data (dict): User information
        extra_data (dict): Additional event data
    
    Returns:
        bool: True if published successfully
    """
    publisher = get_publisher()
    
    event = {
        'event_type': event_type,
        'user': user_data,
    }
    
    if extra_data:
        event.update(extra_data)
    
    return publisher.publish_event(
        exchange='user.events',
        routing_key=event_type,
        event_data=event
    )


def publish_notification(notification_type, recipient, template, data=None, priority='normal'):
    """
    Convenience function to publish notification events
    
    Args:
        notification_type (str): Type (email, sms, push, multi_channel)
        recipient (dict): Recipient information (user_id, email, phone)
        template (str): Template name
        data (dict): Template data
        priority (str): Priority level (low, normal, high, critical)
    
    Returns:
        bool: True if published successfully
    """
    publisher = get_publisher()
    
    event = {
        'notification_type': notification_type,
        'recipient': recipient,
        'template': template,
        'data': data or {},
        'priority': priority
    }
    
    routing_key = f"notification.{notification_type}.{priority}"
    
    return publisher.publish_event(
        exchange='notifications',
        routing_key=routing_key,
        event_data=event
    )
