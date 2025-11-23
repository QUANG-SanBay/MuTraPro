"""
RabbitMQ Event Publisher for User Service
Creates fresh connection for each publish - better for Django's multi-threaded environment
"""
import pika
import json
import logging
from datetime import datetime
from django.conf import settings

logger = logging.getLogger(__name__)


class RabbitMQPublisher:
    """
    RabbitMQ publisher that creates fresh connection for each publish
    """
    
    def __init__(self):
        """Initialize with connection parameters"""
        self.rabbitmq_host = getattr(settings, 'RABBITMQ_HOST', 'rabbitmq')
        self.rabbitmq_port = getattr(settings, 'RABBITMQ_PORT', 5672)
        self.rabbitmq_user = getattr(settings, 'RABBITMQ_USER', 'admin')
        self.rabbitmq_pass = getattr(settings, 'RABBITMQ_PASS', 'Admin@123')
        
        logger.info(f"📝 RabbitMQ Publisher initialized: {self.rabbitmq_user}@{self.rabbitmq_host}:{self.rabbitmq_port}")
    
    def publish_event(self, exchange, routing_key, event_data):
        """
        Publish event to RabbitMQ with fresh connection
        
        Args:
            exchange (str): Exchange name (e.g., 'user.events')
            routing_key (str): Routing key (e.g., 'user.registered')
            event_data (dict): Event payload
        
        Returns:
            bool: True if published successfully, False otherwise
        """
        connection = None
        channel = None
        
        try:
            # Create fresh connection
            credentials = pika.PlainCredentials(self.rabbitmq_user, self.rabbitmq_pass)
            parameters = pika.ConnectionParameters(
                host=self.rabbitmq_host,
                port=self.rabbitmq_port,
                credentials=credentials,
                heartbeat=0,  # Disable heartbeat for short-lived connections
                connection_attempts=3,
                retry_delay=1
            )
            
            connection = pika.BlockingConnection(parameters)
            channel = connection.channel()
            
            # Declare exchange (idempotent)
            channel.exchange_declare(exchange=exchange, exchange_type='fanout', durable=True)
            
            # Add metadata
            message = {
                'event_id': f"{event_data.get('event_type', 'unknown')}_{datetime.utcnow().timestamp()}",
                'timestamp': datetime.utcnow().isoformat() + 'Z',
                'service': 'user-service',
                **event_data
            }
            
            # Publish message
            channel.basic_publish(
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
            logger.debug(f"   Data: {json.dumps(message)[:200]}...")
            return True
            
        except Exception as e:
            logger.error(f"❌ Failed to publish event: {e}")
            return False
            
        finally:
            # Always close connection
            try:
                if connection and not connection.is_closed:
                    connection.close()
            except Exception as e:
                logger.error(f"⚠️ Error closing connection: {e}")


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
