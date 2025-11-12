import { useState, useEffect } from 'react';
import { getProfile } from '~/api/userService';
import { useNavigate } from 'react-router-dom';

/**
 * Custom hook to fetch and manage user profile
 * @returns {Object} { profile, isLoading, error, refetch }
 */
export const useProfile = () => {
    const navigate = useNavigate();
    const [profile, setProfile] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchProfile = async () => {
        try {
            setIsLoading(true);
            setError(null);
            
            const response = await getProfile();
            setProfile(response.user);
        } catch (err) {
            console.error('Error fetching profile:', err);
            setError(err.data?.message || 'Không thể tải thông tin người dùng');
            
            // If unauthorized, redirect to login
            if (err.status === 401) {
                navigate('/auth');
            }
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchProfile();
    }, []);

    return {
        profile,
        isLoading,
        error,
        refetch: fetchProfile
    };
};
