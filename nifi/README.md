# Apache NiFi Integration

This directory contains all Apache NiFi related files and configurations for the MuTraPro project.

## Directory Structure

```
nifi/
├── docs/                           # Documentation
│   ├── NIFI_SETUP.md              # Detailed setup guide
│   └── NIFI_QUICK_REFERENCE.md    # Quick reference guide
├── templates/                      # Flow templates and examples
│   ├── README.md                  # Template usage guide
│   └── ORDER_PROCESSING_EXAMPLE.md # Example flow
├── config/                         # Connection configurations
│   ├── rabbitmq-connection.json   # RabbitMQ settings
│   ├── database-connection.json   # SQL Server databases
│   └── service-endpoints.json     # Microservices endpoints
├── extensions/                     # Custom extensions
│   └── drivers/                   # JDBC drivers
│       └── .gitkeep              # Place mssql-jdbc.jar here
└── scripts/                       # Helper scripts
    ├── start-nifi.ps1            # Quick start (Windows)
    ├── start-nifi.sh             # Quick start (Linux/Mac)
    └── download-jdbc-driver.ps1  # Download SQL Server JDBC driver
```

## Quick Start

### 1. Start NiFi
```powershell
# Windows
.\scripts\start-nifi.ps1

# Linux/Mac
./scripts/start-nifi.sh
```

### 2. Download JDBC Driver
```powershell
.\scripts\download-jdbc-driver.ps1
```

### 3. Access NiFi UI
- URL: http://localhost:8080/nifi
- Username: `admin`
- Password: `AdminPass123456`

## Documentation

- **Setup Guide**: Read `docs/NIFI_SETUP.md` for detailed installation and configuration
- **Quick Reference**: See `docs/NIFI_QUICK_REFERENCE.md` for common tasks
- **Templates**: Check `templates/` directory for pre-built flow examples

## Configuration Files

### RabbitMQ Connection (`config/rabbitmq-connection.json`)
Pre-configured with:
- Connection details for RabbitMQ
- Queue definitions (payment, order, notification, media)
- Exchange configuration

### Database Connection (`config/database-connection.json`)
Connection strings for all 6 databases:
- Mutrapro_Payment
- Mutrapro_Order
- Mutrapro_Notification
- Mutrapro_Media
- Mutrapro_User
- Mutrapro_ManagementStudio

### Service Endpoints (`config/service-endpoints.json`)
REST API endpoints for all microservices:
- Gateway, Payment, Order, Notification, Media, Management, User services

## Use Cases

NiFi can be used for:
1. **Event-driven order processing** - RabbitMQ → Payment → Notification flow
2. **Database ETL pipelines** - Data sync across services
3. **REST API orchestration** - Aggregate data from multiple services
4. **Real-time monitoring** - Track system events and alerts
5. **File processing** - Media upload and transformation

## Scripts

### start-nifi.ps1 / start-nifi.sh
Automated script to:
- Check Docker status
- Start all services including NiFi
- Wait for NiFi to be ready
- Display access information

### download-jdbc-driver.ps1
Downloads Microsoft SQL Server JDBC driver required for database connections.

## Docker Integration

NiFi service is configured in `docker-compose.yml` with:
- Ports: 8080 (HTTP), 8443 (HTTPS), 10000 (Site-to-Site)
- Persistent volumes for data and logs
- Connected to microservices network
- Pre-configured environment variables

## Next Steps

1. Start NiFi: `.\scripts\start-nifi.ps1`
2. Download JDBC driver: `.\scripts\download-jdbc-driver.ps1`
3. Read setup guide: `docs\NIFI_SETUP.md`
4. Try example flows: `templates\ORDER_PROCESSING_EXAMPLE.md`
5. Create your first data flow in NiFi UI

## Support

For issues or questions:
- Check `docs/NIFI_SETUP.md` troubleshooting section
- Review Docker logs: `docker logs nifi`
- Verify network: `docker network inspect mutrapro_microservices-net`
