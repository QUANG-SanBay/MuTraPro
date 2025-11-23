"""
Django management command to seed permissions and default role-permission mappings.
Run with: python manage.py seed_permissions
"""

from django.core.management.base import BaseCommand
from django.db import transaction
from account.models import Permission, RolePermission, Role
import logging

logger = logging.getLogger(__name__)


# All available permissions in the system
ALL_PERMISSIONS = [
    # User & Profile permissions
    {'codename': 'view_own_profile', 'name': 'Xem hồ sơ cá nhân', 'category': 'Tài khoản | Hồ sơ'},
    {'codename': 'edit_own_profile', 'name': 'Chỉnh sửa hồ sơ cá nhân', 'category': 'Tài khoản | Hồ sơ'},
    {'codename': 'change_password', 'name': 'Đổi mật khẩu', 'category': 'Tài khoản | Bảo mật'},
    {'codename': 'view_all_users', 'name': 'Xem tất cả người dùng', 'category': 'Tài khoản | Người dùng'},
    {'codename': 'manage_users', 'name': 'Quản lý người dùng', 'category': 'Tài khoản | Người dùng'},

    # Order permissions
    {'codename': 'create_order', 'name': 'Tạo đơn hàng', 'category': 'Đơn hàng | Quản lý'},
    {'codename': 'view_own_orders', 'name': 'Xem đơn hàng của mình', 'category': 'Đơn hàng | Xem'},
    {'codename': 'view_all_orders', 'name': 'Xem tất cả đơn hàng', 'category': 'Đơn hàng | Xem'},
    {'codename': 'edit_order', 'name': 'Chỉnh sửa đơn hàng', 'category': 'Đơn hàng | Quản lý'},
    {'codename': 'cancel_order', 'name': 'Hủy đơn hàng', 'category': 'Đơn hàng | Quản lý'},
    {'codename': 'approve_order', 'name': 'Phê duyệt đơn hàng', 'category': 'Đơn hàng | Phê duyệt'},
    {'codename': 'reject_order', 'name': 'Từ chối đơn hàng', 'category': 'Đơn hàng | Phê duyệt'},
    {'codename': 'assign_order', 'name': 'Phân công đơn hàng cho chuyên gia', 'category': 'Đơn hàng | Phân công'},
    {'codename': 'track_order', 'name': 'Theo dõi tiến độ đơn hàng', 'category': 'Đơn hàng | Theo dõi'},

    # Payment permissions
    {'codename': 'create_payment', 'name': 'Tạo thanh toán', 'category': 'Thanh toán | Quản lý'},
    {'codename': 'view_own_payments', 'name': 'Xem thanh toán của mình', 'category': 'Thanh toán | Xem'},
    {'codename': 'view_all_payments', 'name': 'Xem tất cả thanh toán', 'category': 'Thanh toán | Xem'},
    {'codename': 'process_payment', 'name': 'Xử lý thanh toán', 'category': 'Thanh toán | Xử lý'},
    {'codename': 'refund_payment', 'name': 'Hoàn tiền', 'category': 'Thanh toán | Xử lý'},

    # Media permissions
    {'codename': 'upload_media', 'name': 'Tải lên file media', 'category': 'Media | Upload'},
    {'codename': 'view_own_media', 'name': 'Xem media của mình', 'category': 'Media | Xem'},
    {'codename': 'view_all_media', 'name': 'Xem tất cả media', 'category': 'Media | Xem'},
    {'codename': 'download_media', 'name': 'Tải xuống media', 'category': 'Media | Download'},
    {'codename': 'delete_media', 'name': 'Xóa media', 'category': 'Media | Quản lý'},
    {'codename': 'edit_media', 'name': 'Chỉnh sửa media', 'category': 'Media | Quản lý'},

    # Studio permissions
    {'codename': 'view_studio', 'name': 'Xem thông tin studio', 'category': 'Studio | Xem'},
    {'codename': 'manage_studio', 'name': 'Quản lý studio', 'category': 'Studio | Quản lý'},
    {'codename': 'manage_studio_equipment', 'name': 'Quản lý thiết bị studio', 'category': 'Studio | Thiết bị'},
    {'codename': 'manage_studio_schedule', 'name': 'Quản lý lịch studio', 'category': 'Studio | Lịch trình'},
    {'codename': 'book_studio', 'name': 'Đặt lịch studio', 'category': 'Studio | Đặt lịch'},

    # Task permissions
    {'codename': 'view_assigned_tasks', 'name': 'Xem nhiệm vụ được giao', 'category': 'Nhiệm vụ | Xem'},
    {'codename': 'view_all_tasks', 'name': 'Xem tất cả nhiệm vụ', 'category': 'Nhiệm vụ | Xem'},
    {'codename': 'update_task_status', 'name': 'Cập nhật trạng thái nhiệm vụ', 'category': 'Nhiệm vụ | Cập nhật'},
    {'codename': 'assign_task', 'name': 'Phân công nhiệm vụ', 'category': 'Nhiệm vụ | Phân công'},
    {'codename': 'complete_task', 'name': 'Hoàn thành nhiệm vụ', 'category': 'Nhiệm vụ | Cập nhật'},

    # Notification permissions
    {'codename': 'view_notifications', 'name': 'Xem thông báo', 'category': 'Thông báo | Xem'},
    {'codename': 'send_notification', 'name': 'Gửi thông báo', 'category': 'Thông báo | Gửi'},
    {'codename': 'mark_notification_read', 'name': 'Đánh dấu đã đọc', 'category': 'Thông báo | Quản lý'},

    # Report permissions
    {'codename': 'view_reports', 'name': 'Xem báo cáo', 'category': 'Báo cáo | Xem'},
    {'codename': 'generate_reports', 'name': 'Tạo báo cáo', 'category': 'Báo cáo | Tạo'},
    {'codename': 'export_reports', 'name': 'Xuất báo cáo', 'category': 'Báo cáo | Xuất'},
    {'codename': 'view_statistics', 'name': 'Xem thống kê', 'category': 'Báo cáo | Thống kê'}
]


# Default permissions for each role
DEFAULT_ROLE_PERMISSIONS = {
    Role.CUSTOMER: [
        'view_own_profile', 'edit_own_profile', 'change_password',
        'create_order', 'view_own_orders', 'cancel_order', 'track_order',
        'create_payment', 'view_own_payments',
        'upload_media', 'view_own_media', 'download_media',
        'view_studio', 'book_studio',
        'view_notifications', 'mark_notification_read'
    ],
    Role.SERVICE_COORDINATOR: [
        'view_own_profile', 'edit_own_profile', 'change_password',
        'view_all_users', 'view_all_orders', 'edit_order', 'approve_order', 'reject_order', 'assign_order', 'track_order',
        'view_all_payments', 'process_payment',
        'view_all_media', 'download_media',
        'view_studio', 'manage_studio_schedule',
        'view_all_tasks', 'assign_task',
        'view_notifications', 'send_notification', 'mark_notification_read',
        'view_reports', 'generate_reports', 'view_statistics'
    ],
    Role.TRANSCRIPTION_SPECIALIST: [
        'view_own_profile', 'edit_own_profile', 'change_password',
        'view_own_orders', 'track_order',
        'upload_media', 'view_own_media', 'download_media', 'edit_media',
        'view_studio',
        'view_assigned_tasks', 'update_task_status', 'complete_task',
        'view_notifications', 'mark_notification_read'
    ],
    Role.ARRANGEMENT_SPECIALIST: [
        'view_own_profile', 'edit_own_profile', 'change_password',
        'view_own_orders', 'track_order',
        'upload_media', 'view_own_media', 'download_media', 'edit_media',
        'view_studio',
        'view_assigned_tasks', 'update_task_status', 'complete_task',
        'view_notifications', 'mark_notification_read'
    ],
    Role.RECORDING_ARTIST: [
        'view_own_profile', 'edit_own_profile', 'change_password',
        'view_own_orders', 'track_order',
        'upload_media', 'view_own_media', 'download_media',
        'view_studio', 'book_studio',
        'view_assigned_tasks', 'update_task_status', 'complete_task',
        'view_notifications', 'mark_notification_read'
    ],
    Role.STUDIO_ADMINISTRATOR: [
        'view_own_profile', 'edit_own_profile', 'change_password',
        'view_all_orders', 'track_order',
        'view_all_payments',
        'view_all_media', 'download_media',
        'view_studio', 'manage_studio', 'manage_studio_equipment', 'manage_studio_schedule',
        'view_all_tasks',
        'view_notifications', 'send_notification', 'mark_notification_read',
        'view_reports', 'generate_reports', 'view_statistics'
    ]
}


class Command(BaseCommand):
    help = 'Seed permissions and default role-permission mappings'

    def add_arguments(self, parser):
        parser.add_argument(
            '--clear',
            action='store_true',
            help='Clear existing permissions and role-permissions before seeding',
        )

    def handle(self, *args, **options):
        clear_existing = options['clear']

        try:
            with transaction.atomic():
                if clear_existing:
                    self.stdout.write(self.style.WARNING('🗑️  Clearing existing permissions...'))
                    RolePermission.objects.all().delete()
                    Permission.objects.all().delete()

                # Seed permissions
                self.stdout.write(self.style.SUCCESS('📝 Seeding permissions...'))
                permissions_created = 0
                permissions_updated = 0

                for perm_data in ALL_PERMISSIONS:
                    permission, created = Permission.objects.update_or_create(
                        codename=perm_data['codename'],
                        defaults={
                            'name': perm_data['name'],
                            'category': perm_data['category']
                        }
                    )
                    if created:
                        permissions_created += 1
                    else:
                        permissions_updated += 1

                self.stdout.write(
                    self.style.SUCCESS(
                        f'✅ Permissions: {permissions_created} created, {permissions_updated} updated'
                    )
                )

                # Seed role-permission mappings
                self.stdout.write(self.style.SUCCESS('🔗 Seeding role-permission mappings...'))
                mappings_created = 0

                for role, permission_codenames in DEFAULT_ROLE_PERMISSIONS.items():
                    # Clear existing permissions for this role
                    RolePermission.objects.filter(role=role).delete()

                    # Create new mappings
                    permissions_to_create = []
                    permission_objects = Permission.objects.filter(codename__in=permission_codenames)

                    for perm_obj in permission_objects:
                        permissions_to_create.append(
                            RolePermission(role=role, permission=perm_obj)
                        )

                    RolePermission.objects.bulk_create(permissions_to_create)
                    mappings_created += len(permissions_to_create)

                    self.stdout.write(
                        f'  ✓ {role}: {len(permissions_to_create)} permissions assigned'
                    )

                self.stdout.write(
                    self.style.SUCCESS(
                        f'\n🎉 Successfully seeded {permissions_created} permissions and '
                        f'{mappings_created} role-permission mappings!'
                    )
                )

        except Exception as e:
            self.stdout.write(self.style.ERROR(f'❌ Error seeding permissions: {e}'))
            logger.exception('Failed to seed permissions')
            raise
