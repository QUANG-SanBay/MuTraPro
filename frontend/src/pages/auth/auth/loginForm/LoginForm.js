import FormGroup from '~/components/formGroup/FormGroup';
import styles from './LoginForm.module.scss'
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '~/api/userService';

function LoginForm() {
    const navigate = useNavigate();
    const [form, setForm] = useState({email: '', password: ''});
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    
    const handleValue = (e) => {
        const {name, value} = e.target;
        setForm((prev) => (prev[name] === value ? prev : { ...prev, [name]: value }));
        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const validateForm = () => {
        const newErrors = {};
        
        // Email validation
        if (!form.email) {
            newErrors.email = 'Email là bắt buộc';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
            newErrors.email = 'Email không hợp lệ';
        }
        
        // Password validation
        if (!form.password) {
            newErrors.password = 'Mật khẩu là bắt buộc';
        }
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Clear previous messages
        setSuccessMessage('');
        setErrors({});
        
        // Validate form
        if (!validateForm()) {
            return;
        }
        
        setIsLoading(true);
        
        try {
            const response = await loginUser({
                email: form.email,
                password: form.password
            });
            
            // Store JWT tokens in localStorage
            localStorage.setItem('accessToken', response.access);
            localStorage.setItem('refreshToken', response.refresh);
            
            // Store user info
            localStorage.setItem('user', JSON.stringify(response.user));
            
            // Show success message
            setSuccessMessage(response.message || 'Đăng nhập thành công!');
            
            // Clear form
            setForm({ email: '', password: '' });
            
            // Redirect based on user role
            setTimeout(() => {
                switch (response.user.role) {
                    case 'admin':
                        navigate('/admin');
                        break;
                    case 'service_coordinator':
                        navigate('/service-coordinator');
                        break;
                    case 'transcription_specialist':
                    case 'arrangement_specialist':
                    case 'recording_artist':
                        navigate('/specialist');
                        break;
                    case 'studio_administrator':
                        navigate('/studio-admin');
                        break;
                    case 'customer':
                    default:
                        navigate('/customer');
                        break;
                }
            }, 1000);
            
        } catch (error) {
            console.error('Login error:', error);
            
            // Handle errors from backend
            if (error.data && error.data.errors) {
                setErrors(error.data.errors);
            } else {
                setErrors({
                    general: error.data?.message || 'Đăng nhập thất bại. Vui lòng thử lại.'
                });
            }
        } finally {
            setIsLoading(false);
        }
    };

    return ( 
        <form className={styles.form} onSubmit={handleSubmit}>
            {successMessage && (
                <div className={styles.successMessage}>
                    {successMessage}
                </div>
            )}
            
            {errors.general && (
                <div className={styles.errorMessage}>
                    {errors.general}
                </div>
            )}
            
            <FormGroup
                label='Email'
                type='email'
                name='email'
                placeholder='email@example.com'
                value={form.email}
                onChange={handleValue}
                autoComplete='email'
                error={errors.email}
                disabled={isLoading}
            />
            <FormGroup
                label='Mật khẩu'
                type='password'
                name='password'
                placeholder='••••••••'
                value={form.password}
                onChange={handleValue}
                autoComplete='current-password'
                error={errors.password}
                disabled={isLoading}
            />
            <button 
                type='submit' 
                className={styles.submit}
                disabled={isLoading}
            >
                {isLoading ? 'Đang xử lý...' : 'Đăng nhập'}
            </button>
        </form>
     );
}

export default LoginForm;