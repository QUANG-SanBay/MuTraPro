import { useState, useEffect } from 'react';
import styles from './AdminHome.module.scss';
import {
    StatCard,
    RecentActivity,
    QuickActions,
    SystemStatus
} from './components';
import { getAllUsers } from '~/api/adminService';

function AdminHome() {
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalOrders: 0,
        revenue: 0,
        activeServices: 0
    });

    const [recentActivities, setRecentActivities] = useState([]);
    const [systemStatus, setSystemStatus] = useState({});
    const [loading, setLoading] = useState(true);
    const [wsConnected, setWsConnected] = useState(false);

    // WebSocket connection for real-time activity
    useEffect(() => {
        const wsUrl = process.env.REACT_APP_WS_URL || 'ws://localhost:8000/ws/events';
        let ws = null;
        let reconnectTimeout = null;

        const connectWebSocket = () => {
            try {
                ws = new WebSocket(wsUrl);

                ws.onopen = () => {
                    console.log('[AdminHome] WebSocket connected');
                    setWsConnected(true);
                };

                ws.onmessage = (event) => {
                    try {
                        const message = JSON.parse(event.data);
                        console.log('[AdminHome] Received event:', message);

                        // Handle wrapped event from gateway
                        let eventData = null;
                        if (message.type === 'event' && message.data) {
                            eventData = message.data;
                        } else if (message.event_type) {
                            // Direct event (fallback)
                            eventData = message;
                        }

                        if (eventData && (eventData.event_type === 'user.registered' || eventData.event_type === 'user.login')) {
                            const userData = eventData.user || {};
                            const newActivity = {
                                type: eventData.event_type === 'user.registered' ? 'user_registered' : 'user_login',
                                description: eventData.event_type === 'user.registered' 
                                    ? `Người dùng mới "${userData.full_name || userData.email || 'Unknown'}" đã đăng ký tài khoản`
                                    : `Người dùng "${userData.full_name || userData.email || 'Unknown'}" đã đăng nhập`,
                                time: 'Vừa xong',
                                timestamp: new Date().toISOString()
                            };

                            console.log('[AdminHome] Adding new activity:', newActivity);
                            setRecentActivities(prev => [newActivity, ...prev.slice(0, 9)]);

                            // Refresh user stats
                            if (eventData.event_type === 'user.registered') {
                                fetchUserStats();
                            }
                        }
                    } catch (error) {
                        console.error('[AdminHome] Error parsing WebSocket message:', error);
                    }
                };

                ws.onerror = (error) => {
                    console.error('[AdminHome] WebSocket error:', error);
                    setWsConnected(false);
                };

                ws.onclose = () => {
                    console.log('[AdminHome] WebSocket disconnected, reconnecting in 5s...');
                    setWsConnected(false);
                    reconnectTimeout = setTimeout(connectWebSocket, 5000);
                };
            } catch (error) {
                console.error('[AdminHome] Failed to create WebSocket:', error);
                reconnectTimeout = setTimeout(connectWebSocket, 5000);
            }
        };

        connectWebSocket();

        return () => {
            if (reconnectTimeout) clearTimeout(reconnectTimeout);
            if (ws) {
                ws.close();
            }
        };
    }, []);

    // Fetch user statistics
    const fetchUserStats = async () => {
        try {
            const response = await getAllUsers();
            if (response && response.users) {
                const activeUsers = response.users.filter(u => u.is_active).length;
                setStats(prev => ({
                    ...prev,
                    totalUsers: response.total || response.users.length,
                    activeServices: activeUsers
                }));
            }
        } catch (error) {
            console.error('[AdminHome] Error fetching user stats:', error);
        }
    };

    // Fetch all data on mount
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                // Fetch user stats
                await fetchUserStats();

                // Mock data for orders and revenue (replace with real API calls later)
                setStats(prev => ({
                    ...prev,
                    totalOrders: 856,
                    revenue: 125000000
                }));

                // Initialize recent activities (will be updated by WebSocket)
                setRecentActivities([
                    {
                        type: 'system_start',
                        description: 'Hệ thống đã khởi động thành công',
                        time: 'Vừa xong'
                    }
                ]);

                // Check system status
                setSystemStatus({
                    server: 'online',
                    database: 'online',
                    api: 'online',
                    storage: 'online',
                    websocket: wsConnected ? 'online' : 'offline'
                });
            } catch (error) {
                console.error('[AdminHome] Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // Update system status when WebSocket connection changes
    useEffect(() => {
        setSystemStatus(prev => ({
            ...prev,
            websocket: wsConnected ? 'online' : 'offline'
        }));
    }, [wsConnected]);

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
                    <p className={styles.subtitle}>
                        Tổng quan hệ thống quản lý MuTraPro
                        {wsConnected && <span className={styles.wsIndicator}> 🟢 Live</span>}
                    </p>
                </div>

                {loading ? (
                    <div className={styles.loading}>
                        <div className={styles.spinner}></div>
                        <p>Đang tải dữ liệu...</p>
                    </div>
                ) : (
                    <>
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
                                trend="stable"
                                trendValue="0%"
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
                    </>
                )}
            </div>
        </div>
    );
}

export default AdminHome;
