USE mutrapro;
GO
IF NOT EXISTS (SELECT 1 FROM dbo.notifications)
BEGIN
    INSERT INTO dbo.notifications (title, message, recipient, channel)
    VALUES
      (N'Welcome', N'Notification service is ready', N'demo@mutrapro.local', N'INAPP'),
      (N'Getting Started', N'Create a notification from the UI', N'demo@mutrapro.local', N'INAPP');
END
GO
