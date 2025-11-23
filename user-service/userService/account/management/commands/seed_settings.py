"""
Management command to seed default system settings
"""

from django.core.management.base import BaseCommand
from account.models import SystemSettings


class Command(BaseCommand):
    help = 'Seed default system settings'

    def add_arguments(self, parser):
        parser.add_argument(
            '--clear',
            action='store_true',
            help='Clear existing settings before seeding',
        )

    def handle(self, *args, **options):
        if options['clear']:
            self.stdout.write('🗑️  Clearing existing settings...')
            SystemSettings.objects.all().delete()
            self.stdout.write(self.style.SUCCESS('✅ Cleared existing settings'))

        # Default settings
        default_settings = {
            'general': {
                'siteName': 'MuTraPro',
                'siteDescription': 'Hệ thống quản lý chuyển soạn nhạc chuyên nghiệp',
                'contactEmail': 'contact@mutrapro.com',
                'supportPhone': '1900-xxxx',
                'timezone': 'Asia/Ho_Chi_Minh',
                'language': 'vi',
                'maintenanceMode': False
            },
            'email': {
                'smtpHost': 'smtp.gmail.com',
                'smtpPort': '587',
                'smtpUser': '',
                'smtpPassword': '',
                'fromEmail': 'noreply@mutrapro.com',
                'fromName': 'MuTraPro System',
                'enableEmailNotifications': True
            },
            'payment': {
                'vnpayEnabled': True,
                'vnpayTmnCode': '',
                'vnpayHashSecret': '',
                'momoEnabled': False,
                'momoPartnerCode': '',
                'momoAccessKey': '',
                'momoSecretKey': '',
                'bankTransferEnabled': True,
                'bankName': 'Vietcombank',
                'bankAccountNumber': '',
                'bankAccountName': ''
            },
            'storage': {
                'storageProvider': 'local',
                'localStoragePath': '/media',
                'maxFileSize': 100,
                'allowedFileTypes': '.mp3,.wav,.flac,.pdf,.doc,.docx',
                's3Enabled': False,
                's3Bucket': '',
                's3Region': 'ap-southeast-1',
                's3AccessKey': '',
                's3SecretKey': ''
            },
            'service': {
                'autoAssignTasks': True,
                'taskTimeout': 24,
                'allowCancellation': True,
                'cancellationDeadline': 2,
                'requireApproval': True,
                'maxRevisions': 3,
                'notifyOnStatusChange': True,
                'notifyOnNewOrder': True
            }
        }

        self.stdout.write('🌱 Seeding default system settings...')

        created_count = 0
        updated_count = 0

        for category, settings_data in default_settings.items():
            settings_obj, created = SystemSettings.objects.get_or_create(
                category=category,
                defaults={'settings_data': settings_data}
            )

            if created:
                created_count += 1
                self.stdout.write(f'  ✅ Created {category} settings')
            else:
                # Update existing settings with new defaults (merge)
                settings_obj.settings_data = settings_data
                settings_obj.save()
                updated_count += 1
                self.stdout.write(f'  🔄 Updated {category} settings')

        self.stdout.write(
            self.style.SUCCESS(
                f'\n🎉 Successfully seeded system settings! '
                f'(Created: {created_count}, Updated: {updated_count})'
            )
        )
