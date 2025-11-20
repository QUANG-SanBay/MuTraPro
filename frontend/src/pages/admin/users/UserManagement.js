import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faUsers, 
    faPlus, 
    faSearch, 
    faEdit, 
    faTrash, 
    faBan,
    faCheck,
    faFilter,
    faSync
} from '@fortawesome/free-solid-svg-icons';
import styles from './UserManagement.module.scss';
import { 
    getAllUsers, 
    searchUsers, 
    updateUserStatus,
    getRoleDisplayName 
} from '~/api/adminService';
import UserModal from './components/UserModal/UserModal';
import DeleteConfirmModal from './components/DeleteConfirmModal/DeleteConfirmModal';
import UserFilters from './components/UserFilters/UserFilters';

const UserManagement = () => {
    // State management
    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    
    // Search and filter state
    const [searchQuery, setSearchQuery] = useState('');
    const [filters, setFilters] = useState({
        role: 'all',
        status: 'all'
    });
    const [showFilters, setShowFilters] = useState(false);
    
    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const [usersPerPage] = useState(10);
    
    // Modal state
    const [showUserModal, setShowUserModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [modalMode, setModalMode] = useState('create'); // 'create' or 'edit'

    // Fetch users on component mount
    useEffect(() => {
        fetchUsers();
    }, []);

    // Apply filters when search query or filters change
    useEffect(() => {
        applyFilters();
    }, [searchQuery, filters, users]);

    /**
     * Fetch all users from API
     */
    const fetchUsers = async () => {
        setLoading(true);
        setError(null);
        
        try {
            const response = await getAllUsers();
            
            // Backend returns: { message, total, users }
            if (response && response.users) {
                setUsers(response.users || []);
            } else {
                setError(response?.message || 'Không thể tải danh sách người dùng');
            }
        } catch (err) {
            // Handle authentication errors
            if (err.status === 401 || err.code === 'NO_TOKEN') {
                setError('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
                // Redirect to login after 2 seconds
                setTimeout(() => {
                    window.location.href = '/auth';
                }, 2000);
            } else {
                setError(err.message || 'Có lỗi xảy ra khi tải danh sách người dùng');
            }
            console.error('Error fetching users:', err);
        } finally {
            setLoading(false);
        }
    };

    /**
     * Apply search and filters to users list
     */
    const applyFilters = async () => {
        const params = {
            query: searchQuery,
            role: filters.role,
            is_active: filters.status === 'all' ? null : filters.status === 'active'
        };
        
        const response = await searchUsers(params);
        
        // Backend returns: { message, total, users }
        if (response && response.users) {
            setFilteredUsers(response.users || []);
            setCurrentPage(1); // Reset to first page when filters change
        }
    };

    /**
     * Handle search input change
     */
    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    /**
     * Handle filter change
     */
    const handleFilterChange = (newFilters) => {
        setFilters(newFilters);
    };

    /**
     * Handle add new user button click
     */
    const handleAddUser = () => {
        setSelectedUser(null);
        setModalMode('create');
        setShowUserModal(true);
    };

    /**
     * Handle edit user button click
     */
    const handleEditUser = (user) => {
        setSelectedUser(user);
        setModalMode('edit');
        setShowUserModal(true);
    };

    /**
     * Handle delete user button click
     */
    const handleDeleteUser = (user) => {
        setSelectedUser(user);
        setShowDeleteModal(true);
    };

    /**
     * Handle toggle user status (active/inactive)
     */
    const handleToggleStatus = async (user) => {
        setLoading(true);
        setError(null);
        setSuccess(null);
        
        try {
            const response = await updateUserStatus(user.id, !user.is_active);
            
            // Backend returns: { message, user }
            if (response && response.message) {
                setSuccess(`${user.is_active ? 'Vô hiệu hóa' : 'Kích hoạt'} người dùng thành công`);
                fetchUsers(); // Refresh user list
                
                // Clear success message after 3 seconds
                setTimeout(() => setSuccess(null), 3000);
            } else {
                setError(response?.message || 'Không thể cập nhật trạng thái người dùng');
            }
        } catch (err) {
            setError('Có lỗi xảy ra khi cập nhật trạng thái người dùng');
            console.error('Error toggling user status:', err);
        } finally {
            setLoading(false);
        }
    };

    /**
     * Handle user modal close
     */
    const handleUserModalClose = () => {
        setShowUserModal(false);
        setSelectedUser(null);
    };

    /**
     * Handle user modal success (user created or updated)
     */
    const handleUserModalSuccess = (message) => {
        setShowUserModal(false);
        setSelectedUser(null);
        setSuccess(message);
        fetchUsers(); // Refresh user list
        
        // Clear success message after 3 seconds
        setTimeout(() => setSuccess(null), 3000);
    };

    /**
     * Handle delete modal close
     */
    const handleDeleteModalClose = () => {
        setShowDeleteModal(false);
        setSelectedUser(null);
    };

    /**
     * Handle delete modal success (user deleted)
     */
    const handleDeleteModalSuccess = (message) => {
        setShowDeleteModal(false);
        setSelectedUser(null);
        setSuccess(message);
        fetchUsers(); // Refresh user list
        
        // Clear success message after 3 seconds
        setTimeout(() => setSuccess(null), 3000);
    };

    /**
     * Handle refresh button click
     */
    const handleRefresh = () => {
        setSearchQuery('');
        setFilters({ role: 'all', status: 'all' });
        fetchUsers();
    };

    // Pagination calculations
    const indexOfLastUser = currentPage * usersPerPage;
    const indexOfFirstUser = indexOfLastUser - usersPerPage;
    const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
    const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

    /**
     * Handle page change
     */
    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    /**
     * Format date to Vietnamese format
     */
    const formatDate = (dateString) => {
        if (!dateString) return '-';
        const date = new Date(dateString);
        return date.toLocaleDateString('vi-VN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className={styles.userManagement}>
            {/* Page Header */}
            <div className={styles.pageHeader}>
                <div className={styles.headerLeft}>
                    <FontAwesomeIcon icon={faUsers} className={styles.headerIcon} />
                    <h1>Quản lý người dùng</h1>
                </div>
                <button className={styles.addButton} onClick={handleAddUser}>
                    <FontAwesomeIcon icon={faPlus} />
                    <span>Thêm người dùng</span>
                </button>
            </div>

            {/* Alert Messages */}
            {error && (
                <div className={styles.alert} data-type="error">
                    <span>{error}</span>
                    <button onClick={() => setError(null)}>&times;</button>
                </div>
            )}
            
            {success && (
                <div className={styles.alert} data-type="success">
                    <span>{success}</span>
                    <button onClick={() => setSuccess(null)}>&times;</button>
                </div>
            )}

            {/* Search and Filter Bar */}
            <div className={styles.searchFilterBar}>
                <div className={styles.searchBox}>
                    <FontAwesomeIcon icon={faSearch} className={styles.searchIcon} />
                    <input
                        type="text"
                        placeholder="Tìm kiếm theo tên, email, username..."
                        value={searchQuery}
                        onChange={handleSearchChange}
                        className={styles.searchInput}
                    />
                </div>
                
                <div className={styles.actionButtons}>
                    <button 
                        className={`${styles.filterButton} ${showFilters ? styles.active : ''}`}
                        onClick={() => setShowFilters(!showFilters)}
                    >
                        <FontAwesomeIcon icon={faFilter} />
                        <span>Bộ lọc</span>
                    </button>
                    
                    <button className={styles.refreshButton} onClick={handleRefresh}>
                        <FontAwesomeIcon icon={faSync} />
                        <span>Làm mới</span>
                    </button>
                </div>
            </div>

            {/* Filters Panel */}
            {showFilters && (
                <UserFilters
                    filters={filters}
                    onFilterChange={handleFilterChange}
                />
            )}

            {/* User Statistics */}
            <div className={styles.statistics}>
                <div className={styles.statCard}>
                    <span className={styles.statLabel}>Tổng số người dùng</span>
                    <span className={styles.statValue}>{filteredUsers.length}</span>
                </div>
                <div className={styles.statCard}>
                    <span className={styles.statLabel}>Đang hoạt động</span>
                    <span className={styles.statValue}>
                        {filteredUsers.filter(u => u.is_active).length}
                    </span>
                </div>
                <div className={styles.statCard}>
                    <span className={styles.statLabel}>Đã vô hiệu hóa</span>
                    <span className={styles.statValue}>
                        {filteredUsers.filter(u => !u.is_active).length}
                    </span>
                </div>
            </div>

            {/* Users Table */}
            <div className={styles.tableContainer}>
                {loading ? (
                    <div className={styles.loading}>
                        <FontAwesomeIcon icon={faSync} spin />
                        <span>Đang tải dữ liệu...</span>
                    </div>
                ) : currentUsers.length === 0 ? (
                    <div className={styles.empty}>
                        <FontAwesomeIcon icon={faUsers} />
                        <p>Không tìm thấy người dùng nào</p>
                    </div>
                ) : (
                    <>
                        <table className={styles.usersTable}>
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Họ và tên</th>
                                    <th>Email</th>
                                    <th>Vai trò</th>
                                    <th>Trạng thái</th>
                                    <th>Ngày tạo</th>
                                    <th>Thao tác</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentUsers.map((user) => (
                                    <tr key={user.id}>
                                        <td>{user.id}</td>
                                        <td>
                                            <div className={styles.userInfo}>
                                                <span className={styles.userName}>{user.full_name}</span>
                                                <span className={styles.userUsername}>@{user.username}</span>
                                            </div>
                                        </td>
                                        <td>{user.email}</td>
                                        <td>
                                            <span className={`${styles.roleBadge} ${styles[user.role]}`}>
                                                {getRoleDisplayName(user.role)}
                                            </span>
                                        </td>
                                        <td>
                                            <span className={`${styles.statusBadge} ${user.is_active ? styles.active : styles.inactive}`}>
                                                {user.is_active ? 'Hoạt động' : 'Vô hiệu hóa'}
                                            </span>
                                        </td>
                                        <td>{formatDate(user.created_at)}</td>
                                        <td>
                                            <div className={styles.actionButtons}>
                                                <button
                                                    className={styles.editButton}
                                                    onClick={() => handleEditUser(user)}
                                                    title="Chỉnh sửa"
                                                >
                                                    <FontAwesomeIcon icon={faEdit} />
                                                </button>
                                                
                                                <button
                                                    className={user.is_active ? styles.banButton : styles.activateButton}
                                                    onClick={() => handleToggleStatus(user)}
                                                    title={user.is_active ? 'Vô hiệu hóa' : 'Kích hoạt'}
                                                >
                                                    <FontAwesomeIcon icon={user.is_active ? faBan : faCheck} />
                                                </button>
                                                
                                                <button
                                                    className={styles.deleteButton}
                                                    onClick={() => handleDeleteUser(user)}
                                                    title="Xóa"
                                                >
                                                    <FontAwesomeIcon icon={faTrash} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className={styles.pagination}>
                                <button
                                    className={styles.pageButton}
                                    onClick={() => handlePageChange(currentPage - 1)}
                                    disabled={currentPage === 1}
                                >
                                    Trước
                                </button>
                                
                                {[...Array(totalPages)].map((_, index) => (
                                    <button
                                        key={index + 1}
                                        className={`${styles.pageButton} ${currentPage === index + 1 ? styles.active : ''}`}
                                        onClick={() => handlePageChange(index + 1)}
                                    >
                                        {index + 1}
                                    </button>
                                ))}
                                
                                <button
                                    className={styles.pageButton}
                                    onClick={() => handlePageChange(currentPage + 1)}
                                    disabled={currentPage === totalPages}
                                >
                                    Sau
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>

            {/* User Modal (Create/Edit) */}
            {showUserModal && (
                <UserModal
                    mode={modalMode}
                    user={selectedUser}
                    onClose={handleUserModalClose}
                    onSuccess={handleUserModalSuccess}
                />
            )}

            {/* Delete Confirm Modal */}
            {showDeleteModal && (
                <DeleteConfirmModal
                    user={selectedUser}
                    onClose={handleDeleteModalClose}
                    onSuccess={handleDeleteModalSuccess}
                />
            )}
        </div>
    );
};

export default UserManagement;
