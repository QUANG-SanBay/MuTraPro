import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faChartLine,
    faFileAlt,
    faDownload,
    faCalendarAlt,
    faUsers,
    faDollarSign,
    faShoppingCart,
    faStar,
    faFilter,
    faSync,
    faTrendUp,
    faTrendDown,
    faArrowUp,
    faArrowDown,
    faClock,
    faCheckCircle,
    faExclamationCircle,
    faUserClock
} from '@fortawesome/free-solid-svg-icons';
import styles from './ReportsStatistics.module.scss';

const ReportsStatistics = () => {
    // State management
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [dateRange, setDateRange] = useState({
        from: new Date(new Date().setDate(new Date().getDate() - 30)).toISOString().split('T')[0],
        to: new Date().toISOString().split('T')[0]
    });
    const [reportType, setReportType] = useState('overview'); // overview, service, revenue, staff, quality

    // Mock data - Replace with API calls later
    const [statistics, setStatistics] = useState({
        overview: {
            totalOrders: 1250,
            totalRevenue: 458750000,
            totalStaff: 45,
            averageRating: 4.7,
            orderTrend: 12.5, // percentage change
            revenueTrend: 18.3,
            staffTrend: 5.2,
            ratingTrend: 2.1
        },
        orders: {
            byStatus: [
                { status: 'Hoàn thành', count: 850, percentage: 68 },
                { status: 'Đang xử lý', count: 280, percentage: 22.4 },
                { status: 'Chờ xác nhận', count: 80, percentage: 6.4 },
                { status: 'Đã hủy', count: 40, percentage: 3.2 }
            ],
            byService: [
                { service: 'Phiên âm', count: 520, revenue: 156000000 },
                { service: 'Hòa âm', count: 380, revenue: 190000000 },
                { service: 'Thu âm', count: 350, revenue: 112750000 }
            ]
        },
        revenue: {
            monthly: [
                { month: 'T1', revenue: 35000000 },
                { month: 'T2', revenue: 42000000 },
                { month: 'T3', revenue: 38500000 },
                { month: 'T4', revenue: 45000000 },
                { month: 'T5', revenue: 52000000 },
                { month: 'T6', revenue: 48000000 }
            ],
            byPaymentMethod: [
                { method: 'Chuyển khoản', amount: 275250000, percentage: 60 },
                { method: 'Tiền mặt', amount: 137625000, percentage: 30 },
                { method: 'Ví điện tử', amount: 45875000, percentage: 10 }
            ]
        },
        staff: {
            performance: [
                { name: 'Nguyễn Văn A', role: 'Chuyên gia phiên âm', completedTasks: 185, rating: 4.8, efficiency: 95 },
                { name: 'Trần Thị B', role: 'Chuyên gia hòa âm', completedTasks: 162, rating: 4.9, efficiency: 98 },
                { name: 'Lê Văn C', role: 'Nghệ sĩ thu âm', completedTasks: 148, rating: 4.6, efficiency: 90 },
                { name: 'Phạm Thị D', role: 'Điều phối viên', completedTasks: 220, rating: 4.7, efficiency: 92 },
                { name: 'Hoàng Văn E', role: 'Chuyên gia phiên âm', completedTasks: 175, rating: 4.5, efficiency: 88 }
            ],
            byRole: [
                { role: 'Chuyên gia phiên âm', count: 15, avgRating: 4.6 },
                { role: 'Chuyên gia hòa âm', count: 12, avgRating: 4.8 },
                { role: 'Nghệ sĩ thu âm', count: 10, avgRating: 4.5 },
                { role: 'Điều phối viên', count: 8, avgRating: 4.7 }
            ]
        },
        quality: {
            customerSatisfaction: {
                excellent: 65, // percentage
                good: 25,
                average: 8,
                poor: 2
            },
            commonIssues: [
                { issue: 'Chất lượng âm thanh', count: 15, severity: 'medium' },
                { issue: 'Giao hàng trễ', count: 8, severity: 'high' },
                { issue: 'Sai yêu cầu', count: 5, severity: 'high' },
                { issue: 'Khác', count: 12, severity: 'low' }
            ],
            responseTime: {
                average: 2.5, // hours
                fastest: 0.5,
                slowest: 8
            }
        }
    });

    // Fetch statistics data
    useEffect(() => {
        fetchStatistics();
    }, [dateRange]);

    const fetchStatistics = async () => {
        setLoading(true);
        setError(null);
        
        try {
            // TODO: Replace with actual API call
            // const response = await getStatistics(dateRange);
            // setStatistics(response);
            
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));
        } catch (err) {
            setError('Không thể tải dữ liệu báo cáo');
            console.error('Error fetching statistics:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleDateChange = (field, value) => {
        setDateRange(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleRefresh = () => {
        fetchStatistics();
    };

    const handleExport = (type) => {
        // TODO: Implement export functionality
        console.log('Exporting report as:', type);
        alert(`Đang xuất báo cáo dạng ${type}...`);
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(amount);
    };

    const formatNumber = (num) => {
        return new Intl.NumberFormat('vi-VN').format(num);
    };

    const getTrendIcon = (trend) => {
        return trend >= 0 ? faTrendUp : faTrendDown;
    };

    const getTrendClass = (trend) => {
        return trend >= 0 ? styles.trendUp : styles.trendDown;
    };

    return (
        <div className={styles.reportsStatistics}>
            {/* Header */}
            <div className={styles.pageHeader}>
                <div className={styles.headerLeft}>
                    <FontAwesomeIcon icon={faChartLine} />
                    <h1>Báo cáo & Thống kê</h1>
                </div>
                <div className={styles.headerActions}>
                    <button 
                        className={styles.refreshButton}
                        onClick={handleRefresh}
                        disabled={loading}
                    >
                        <FontAwesomeIcon icon={faSync} spin={loading} />
                        Làm mới
                    </button>
                    <div className={styles.exportButtons}>
                        <button 
                            className={styles.exportButton}
                            onClick={() => handleExport('pdf')}
                        >
                            <FontAwesomeIcon icon={faDownload} />
                            Xuất PDF
                        </button>
                        <button 
                            className={styles.exportButton}
                            onClick={() => handleExport('excel')}
                        >
                            <FontAwesomeIcon icon={faDownload} />
                            Xuất Excel
                        </button>
                    </div>
                </div>
            </div>

            {/* Error message */}
            {error && (
                <div className={`${styles.alert} ${styles.error}`}>
                    <FontAwesomeIcon icon={faExclamationCircle} />
                    {error}
                </div>
            )}

            {/* Filters */}
            <div className={styles.filtersSection}>
                <div className={styles.dateRangeFilter}>
                    <FontAwesomeIcon icon={faCalendarAlt} />
                    <div className={styles.dateInputs}>
                        <div className={styles.dateField}>
                            <label>Từ ngày:</label>
                            <input
                                type="date"
                                value={dateRange.from}
                                onChange={(e) => handleDateChange('from', e.target.value)}
                                max={dateRange.to}
                            />
                        </div>
                        <div className={styles.dateField}>
                            <label>Đến ngày:</label>
                            <input
                                type="date"
                                value={dateRange.to}
                                onChange={(e) => handleDateChange('to', e.target.value)}
                                min={dateRange.from}
                                max={new Date().toISOString().split('T')[0]}
                            />
                        </div>
                    </div>
                </div>

                <div className={styles.reportTypeFilter}>
                    <label>
                        <FontAwesomeIcon icon={faFileAlt} />
                        Loại báo cáo:
                    </label>
                    <select 
                        value={reportType} 
                        onChange={(e) => setReportType(e.target.value)}
                    >
                        <option value="overview">Tổng quan</option>
                        <option value="service">Dịch vụ</option>
                        <option value="revenue">Doanh thu</option>
                        <option value="staff">Nhân sự</option>
                        <option value="quality">Chất lượng</option>
                    </select>
                </div>
            </div>

            {/* Loading state */}
            {loading && (
                <div className={styles.loadingState}>
                    <FontAwesomeIcon icon={faSync} spin />
                    <p>Đang tải dữ liệu...</p>
                </div>
            )}

            {/* Statistics Cards - Overview */}
            {!loading && (
                <>
                    <div className={styles.statsCards}>
                        <div className={`${styles.statCard} ${styles.orders}`}>
                            <div className={styles.cardIcon}>
                                <FontAwesomeIcon icon={faShoppingCart} />
                            </div>
                            <div className={styles.cardContent}>
                                <h3>Tổng đơn hàng</h3>
                                <p className={styles.mainValue}>{formatNumber(statistics.overview.totalOrders)}</p>
                                <div className={getTrendClass(statistics.overview.orderTrend)}>
                                    <FontAwesomeIcon icon={getTrendIcon(statistics.overview.orderTrend)} />
                                    <span>{Math.abs(statistics.overview.orderTrend)}%</span>
                                </div>
                            </div>
                        </div>

                        <div className={`${styles.statCard} ${styles.revenue}`}>
                            <div className={styles.cardIcon}>
                                <FontAwesomeIcon icon={faDollarSign} />
                            </div>
                            <div className={styles.cardContent}>
                                <h3>Tổng doanh thu</h3>
                                <p className={styles.mainValue}>{formatCurrency(statistics.overview.totalRevenue)}</p>
                                <div className={getTrendClass(statistics.overview.revenueTrend)}>
                                    <FontAwesomeIcon icon={getTrendIcon(statistics.overview.revenueTrend)} />
                                    <span>{Math.abs(statistics.overview.revenueTrend)}%</span>
                                </div>
                            </div>
                        </div>

                        <div className={`${styles.statCard} ${styles.staff}`}>
                            <div className={styles.cardIcon}>
                                <FontAwesomeIcon icon={faUsers} />
                            </div>
                            <div className={styles.cardContent}>
                                <h3>Tổng nhân sự</h3>
                                <p className={styles.mainValue}>{formatNumber(statistics.overview.totalStaff)}</p>
                                <div className={getTrendClass(statistics.overview.staffTrend)}>
                                    <FontAwesomeIcon icon={getTrendIcon(statistics.overview.staffTrend)} />
                                    <span>{Math.abs(statistics.overview.staffTrend)}%</span>
                                </div>
                            </div>
                        </div>

                        <div className={`${styles.statCard} ${styles.rating}`}>
                            <div className={styles.cardIcon}>
                                <FontAwesomeIcon icon={faStar} />
                            </div>
                            <div className={styles.cardContent}>
                                <h3>Đánh giá TB</h3>
                                <p className={styles.mainValue}>{statistics.overview.averageRating}/5.0</p>
                                <div className={getTrendClass(statistics.overview.ratingTrend)}>
                                    <FontAwesomeIcon icon={getTrendIcon(statistics.overview.ratingTrend)} />
                                    <span>{Math.abs(statistics.overview.ratingTrend)}%</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Report Sections based on type */}
                    {reportType === 'overview' && (
                        <div className={styles.reportContent}>
                            {/* Orders by Status */}
                            <div className={styles.reportSection}>
                                <h2>
                                    <FontAwesomeIcon icon={faShoppingCart} />
                                    Đơn hàng theo trạng thái
                                </h2>
                                <div className={styles.tableWrapper}>
                                    <table className={styles.dataTable}>
                                        <thead>
                                            <tr>
                                                <th>Trạng thái</th>
                                                <th>Số lượng</th>
                                                <th>Tỷ lệ</th>
                                                <th>Biểu đồ</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {statistics.orders.byStatus.map((item, index) => (
                                                <tr key={index}>
                                                    <td>
                                                        <span className={styles.statusBadge}>
                                                            {item.status}
                                                        </span>
                                                    </td>
                                                    <td className={styles.numberCell}>{formatNumber(item.count)}</td>
                                                    <td className={styles.numberCell}>{item.percentage}%</td>
                                                    <td>
                                                        <div className={styles.progressBar}>
                                                            <div 
                                                                className={styles.progressFill}
                                                                style={{ width: `${item.percentage}%` }}
                                                            ></div>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            {/* Revenue by Service */}
                            <div className={styles.reportSection}>
                                <h2>
                                    <FontAwesomeIcon icon={faDollarSign} />
                                    Doanh thu theo dịch vụ
                                </h2>
                                <div className={styles.tableWrapper}>
                                    <table className={styles.dataTable}>
                                        <thead>
                                            <tr>
                                                <th>Dịch vụ</th>
                                                <th>Số đơn</th>
                                                <th>Doanh thu</th>
                                                <th>TB/đơn</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {statistics.orders.byService.map((item, index) => (
                                                <tr key={index}>
                                                    <td className={styles.serviceName}>{item.service}</td>
                                                    <td className={styles.numberCell}>{formatNumber(item.count)}</td>
                                                    <td className={styles.moneyCell}>{formatCurrency(item.revenue)}</td>
                                                    <td className={styles.moneyCell}>
                                                        {formatCurrency(item.revenue / item.count)}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                        <tfoot>
                                            <tr>
                                                <td><strong>Tổng cộng</strong></td>
                                                <td className={styles.numberCell}>
                                                    <strong>
                                                        {formatNumber(
                                                            statistics.orders.byService.reduce((sum, item) => sum + item.count, 0)
                                                        )}
                                                    </strong>
                                                </td>
                                                <td className={styles.moneyCell}>
                                                    <strong>
                                                        {formatCurrency(
                                                            statistics.orders.byService.reduce((sum, item) => sum + item.revenue, 0)
                                                        )}
                                                    </strong>
                                                </td>
                                                <td></td>
                                            </tr>
                                        </tfoot>
                                    </table>
                                </div>
                            </div>
                        </div>
                    )}

                    {reportType === 'staff' && (
                        <div className={styles.reportContent}>
                            {/* Staff Performance */}
                            <div className={styles.reportSection}>
                                <h2>
                                    <FontAwesomeIcon icon={faUserClock} />
                                    Hiệu suất làm việc của nhân sự
                                </h2>
                                <div className={styles.tableWrapper}>
                                    <table className={styles.dataTable}>
                                        <thead>
                                            <tr>
                                                <th>Nhân viên</th>
                                                <th>Vai trò</th>
                                                <th>Nhiệm vụ hoàn thành</th>
                                                <th>Đánh giá</th>
                                                <th>Hiệu suất</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {statistics.staff.performance.map((item, index) => (
                                                <tr key={index}>
                                                    <td className={styles.staffName}>{item.name}</td>
                                                    <td>{item.role}</td>
                                                    <td className={styles.numberCell}>{formatNumber(item.completedTasks)}</td>
                                                    <td className={styles.ratingCell}>
                                                        <FontAwesomeIcon icon={faStar} />
                                                        {item.rating}/5.0
                                                    </td>
                                                    <td>
                                                        <div className={styles.efficiencyBar}>
                                                            <div 
                                                                className={styles.efficiencyFill}
                                                                style={{ 
                                                                    width: `${item.efficiency}%`,
                                                                    backgroundColor: item.efficiency >= 90 ? '#10b981' : 
                                                                                    item.efficiency >= 80 ? '#f59e0b' : '#ef4444'
                                                                }}
                                                            >
                                                                {item.efficiency}%
                                                            </div>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            {/* Staff by Role */}
                            <div className={styles.reportSection}>
                                <h2>
                                    <FontAwesomeIcon icon={faUsers} />
                                    Thống kê nhân sự theo vai trò
                                </h2>
                                <div className={styles.roleCards}>
                                    {statistics.staff.byRole.map((item, index) => (
                                        <div key={index} className={styles.roleCard}>
                                            <div className={styles.roleIcon}>
                                                <FontAwesomeIcon icon={faUsers} />
                                            </div>
                                            <h3>{item.role}</h3>
                                            <div className={styles.roleStats}>
                                                <div className={styles.roleStat}>
                                                    <span className={styles.label}>Số lượng:</span>
                                                    <span className={styles.value}>{item.count}</span>
                                                </div>
                                                <div className={styles.roleStat}>
                                                    <span className={styles.label}>Đánh giá TB:</span>
                                                    <span className={styles.value}>
                                                        <FontAwesomeIcon icon={faStar} />
                                                        {item.avgRating}/5.0
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {reportType === 'quality' && (
                        <div className={styles.reportContent}>
                            {/* Customer Satisfaction */}
                            <div className={styles.reportSection}>
                                <h2>
                                    <FontAwesomeIcon icon={faStar} />
                                    Mức độ hài lòng của khách hàng
                                </h2>
                                <div className={styles.satisfactionGrid}>
                                    <div className={`${styles.satisfactionCard} ${styles.excellent}`}>
                                        <div className={styles.satisfactionIcon}>
                                            <FontAwesomeIcon icon={faCheckCircle} />
                                        </div>
                                        <h3>Xuất sắc</h3>
                                        <p className={styles.percentage}>{statistics.quality.customerSatisfaction.excellent}%</p>
                                    </div>
                                    <div className={`${styles.satisfactionCard} ${styles.good}`}>
                                        <div className={styles.satisfactionIcon}>
                                            <FontAwesomeIcon icon={faCheckCircle} />
                                        </div>
                                        <h3>Tốt</h3>
                                        <p className={styles.percentage}>{statistics.quality.customerSatisfaction.good}%</p>
                                    </div>
                                    <div className={`${styles.satisfactionCard} ${styles.average}`}>
                                        <div className={styles.satisfactionIcon}>
                                            <FontAwesomeIcon icon={faClock} />
                                        </div>
                                        <h3>Trung bình</h3>
                                        <p className={styles.percentage}>{statistics.quality.customerSatisfaction.average}%</p>
                                    </div>
                                    <div className={`${styles.satisfactionCard} ${styles.poor}`}>
                                        <div className={styles.satisfactionIcon}>
                                            <FontAwesomeIcon icon={faExclamationCircle} />
                                        </div>
                                        <h3>Kém</h3>
                                        <p className={styles.percentage}>{statistics.quality.customerSatisfaction.poor}%</p>
                                    </div>
                                </div>
                            </div>

                            {/* Common Issues */}
                            <div className={styles.reportSection}>
                                <h2>
                                    <FontAwesomeIcon icon={faExclamationCircle} />
                                    Vấn đề thường gặp
                                </h2>
                                <div className={styles.tableWrapper}>
                                    <table className={styles.dataTable}>
                                        <thead>
                                            <tr>
                                                <th>Vấn đề</th>
                                                <th>Số lần gặp</th>
                                                <th>Mức độ</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {statistics.quality.commonIssues.map((item, index) => (
                                                <tr key={index}>
                                                    <td>{item.issue}</td>
                                                    <td className={styles.numberCell}>{formatNumber(item.count)}</td>
                                                    <td>
                                                        <span className={`${styles.severityBadge} ${styles[item.severity]}`}>
                                                            {item.severity === 'high' && 'Cao'}
                                                            {item.severity === 'medium' && 'Trung bình'}
                                                            {item.severity === 'low' && 'Thấp'}
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            {/* Response Time */}
                            <div className={styles.reportSection}>
                                <h2>
                                    <FontAwesomeIcon icon={faClock} />
                                    Thời gian phản hồi
                                </h2>
                                <div className={styles.responseTimeCards}>
                                    <div className={styles.timeCard}>
                                        <h4>Trung bình</h4>
                                        <p className={styles.timeValue}>{statistics.quality.responseTime.average}h</p>
                                    </div>
                                    <div className={styles.timeCard}>
                                        <h4>Nhanh nhất</h4>
                                        <p className={styles.timeValue}>{statistics.quality.responseTime.fastest}h</p>
                                    </div>
                                    <div className={styles.timeCard}>
                                        <h4>Chậm nhất</h4>
                                        <p className={styles.timeValue}>{statistics.quality.responseTime.slowest}h</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {(reportType === 'service' || reportType === 'revenue') && (
                        <div className={styles.reportContent}>
                            <div className={styles.comingSoon}>
                                <FontAwesomeIcon icon={faChartLine} />
                                <h2>Đang phát triển</h2>
                                <p>Chức năng này đang được xây dựng và sẽ sớm ra mắt</p>
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default ReportsStatistics;
