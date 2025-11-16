import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilter } from '@fortawesome/free-solid-svg-icons';
import styles from './UserFilters.module.scss';
import { getAllRoles } from '~/api/adminService';

const UserFilters = ({ filters, onFilterChange }) => {
    const roles = getAllRoles();

    /**
     * Handle role filter change
     */
    const handleRoleChange = (e) => {
        onFilterChange({
            ...filters,
            role: e.target.value
        });
    };

    /**
     * Handle status filter change
     */
    const handleStatusChange = (e) => {
        onFilterChange({
            ...filters,
            status: e.target.value
        });
    };

    /**
     * Handle clear filters
     */
    const handleClearFilters = () => {
        onFilterChange({
            role: 'all',
            status: 'all'
        });
    };

    return (
        <div className={styles.filtersPanel}>
            <div className={styles.filtersHeader}>
                <FontAwesomeIcon icon={faFilter} />
                <span>Bộ lọc</span>
            </div>

            <div className={styles.filtersContent}>
                {/* Role Filter */}
                <div className={styles.filterGroup}>
                    <label htmlFor="roleFilter">Vai trò</label>
                    <select
                        id="roleFilter"
                        value={filters.role}
                        onChange={handleRoleChange}
                    >
                        <option value="all">Tất cả vai trò</option>
                        {roles.map(role => (
                            <option key={role.value} value={role.value}>
                                {role.label}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Status Filter */}
                <div className={styles.filterGroup}>
                    <label htmlFor="statusFilter">Trạng thái</label>
                    <select
                        id="statusFilter"
                        value={filters.status}
                        onChange={handleStatusChange}
                    >
                        <option value="all">Tất cả trạng thái</option>
                        <option value="active">Đang hoạt động</option>
                        <option value="inactive">Đã vô hiệu hóa</option>
                    </select>
                </div>

                {/* Clear Filters Button */}
                <div className={styles.filterActions}>
                    <button
                        type="button"
                        className={styles.clearButton}
                        onClick={handleClearFilters}
                    >
                        Xóa bộ lọc
                    </button>
                </div>
            </div>
        </div>
    );
};

export default UserFilters;
