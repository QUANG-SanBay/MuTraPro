# RabbitMQ

- UI: http://localhost:15672 (guest/guest)
- Auto-load **definitions.json** để tạo:
  - Exchange: `notifications.exchange` (topic)
  - Queue: `notifications.queue`
  - Binding: routing key `notifications.*`

Compose:
```yaml
rabbitmq:
  image: rabbitmq:3-management
  volumes:
    - ./infrastructure/rabbitmq/definitions.json:/etc/rabbitmq/definitions.json:ro
  environment:
    - RABBITMQ_SERVER_ADDITIONAL_ERL_ARGS=-rabbitmq_management load_definitions "/etc/rabbitmq/definitions.json"
