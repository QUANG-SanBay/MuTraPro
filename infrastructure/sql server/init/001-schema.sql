IF NOT EXISTS (SELECT * FROM sys.databases WHERE name = N'mutrapro')
BEGIN
    PRINT 'Creating database mutrapro';
    CREATE DATABASE mutrapro;
END
GO

USE mutrapro;
GO

IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = N'notifications')
BEGIN
    CREATE TABLE dbo.notifications (
        id BIGINT IDENTITY(1,1) PRIMARY KEY,
        title NVARCHAR(255) NOT NULL,
        message NVARCHAR(2000) NOT NULL,
        recipient NVARCHAR(255) NOT NULL,
        channel NVARCHAR(50) NOT NULL,
        createdAt DATETIMEOFFSET NOT NULL CONSTRAINT DF_notifications_createdAt DEFAULT SYSDATETIMEOFFSET(),
        readFlag BIT NOT NULL CONSTRAINT DF_notifications_readFlag DEFAULT 0
    );
END
GO
