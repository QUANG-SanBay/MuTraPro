import { useState, useEffect } from 'react';
import styles from './AdminHome.module.scss';
import {
    StatCard,
    RecentActivity,
    QuickActions,
    SystemStatus
} from './components';

function AdminHome() {
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalOrders: 0,
        revenue: 0,
        activeServices: 0
    });

    const [recentActivities, setRecentActivities] = useState([]);
    const [systemStatus, setSystemStatus] = useState({});

    // Mock data - Replace with API calls
    useEffect(() => {
        // Simulate API call
        setStats({
            totalUsers: 1245,
            totalOrders: 856,
            revenue: 125000000,
            activeServices: 24
        });

        setRecentActivities([
            {
                type: 'user_registered',
                description: 'Người dùng mới "Nguyễn Văn A" đã đăng ký tài khoản',
                time: '5 phút trước'
            },
            {
                type: 'order_created',
                description: 'Đơn hàng #ORD-2024-001 đã được tạo',
                time: '15 phút trước'
            },
            {
                type: 'payment_completed',
                description: 'Thanh toán đơn hàng #ORD-2024-002 thành công',
                time: '30 phút trước'
            },
            {
                type: 'role_changed',
                description: 'Phân quyền "Specialist" được cập nhật',
                time: '1 giờ trước'
            },
            {
                type: 'user_registered',
                description: 'Người dùng mới "Trần Thị B" đã đăng ký tài khoản',
                time: '2 giờ trước'
            }
        ]);

        setSystemStatus({
            server: 'online',
            database: 'online',
            api: 'online',
            storage: 'online'
        });
    }, []);

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(value);
    };

    return (
        <div className={styles.adminHome}>
            <div className={styles.container}>

                <div className={styles.header}>
                    <h1 className={styles.pageTitle}>Dashboard</h1>
                    <p className={styles.subtitle}>Tổng quan hệ thống quản lý MuTraPro</p>
                </div>

                {/* Stats Cards */}
                <div className={styles.statsGrid}>
                    <StatCard
                        title="Tổng người dùng"
                        value={stats.totalUsers.toLocaleString()}
                        icon="👥"
                        trend="up"
                        trendValue="+12%"
                        colorClass="blue"
                    />
                    <StatCard
                        title="Đơn hàng"
                        value={stats.totalOrders.toLocaleString()}
                        icon="📦"
                        trend="up"
                        trendValue="+8%"
                        colorClass="green"
                    />
                    <StatCard
                        title="Doanh thu"
                        value={formatCurrency(stats.revenue)}
                        icon="💰"
                        trend="up"
                        trendValue="+23%"
                        colorClass="orange"
                    />
                    <StatCard
                        title="Dịch vụ hoạt động"
                        value={stats.activeServices.toLocaleString()}
                        icon="⚡"
                        trend="down"
                        trendValue="-2%"
                        colorClass="purple"
                    />
                </div>

                {/* Quick Actions */}
                <div className={styles.section}>
                    <QuickActions />
                </div>

                {/* Two Column Layout */}
                <div className={styles.twoColumnLayout}>
                    {/* Recent Activity */}
                    <div className={styles.column}>
                        <RecentActivity activities={recentActivities} />
                    </div>

                    {/* System Status */}
                    <div className={styles.column}>
                        <SystemStatus status={systemStatus} />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AdminHome;
