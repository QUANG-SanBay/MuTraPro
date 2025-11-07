import { useState } from "react";
import { useNavigate } from "react-router-dom";
import FormGroup from "~/components/formGroup/FormGroup";
import { registerUser } from "~/api/userService";
import styles from './Register.module.scss'

function RegisterForm() {
    const navigate = useNavigate();
    const [form, setForm] = useState({
        fullName: '',
        email: '',
        password: '',
        rePassword: ''
    });
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    
    const handleValue = (e) => {
        const {name, value} = e.target;
        setForm(prev => prev[name] === value ? prev : {...prev, [name]: value});
        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({...prev, [name]: ''}));
        }
    };
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({});
        setSuccessMessage('');
        setIsLoading(true);
        
        // Client-side validation
        const newErrors = {};
        if (!form.fullName.trim()) {
            newErrors.fullName = 'Vui lòng nhập họ tên';
        }
        if (!form.email.trim()) {
            newErrors.email = 'Vui lòng nhập email';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
            newErrors.email = 'Email không đúng định dạng';
        }
        if (!form.password) {
            newErrors.password = 'Vui lòng nhập mật khẩu';
        } else if (form.password.length < 8) {
            newErrors.password = 'Mật khẩu phải có ít nhất 8 ký tự';
        }
        if (!form.rePassword) {
            newErrors.rePassword = 'Vui lòng nhập lại mật khẩu';
        } else if (form.password !== form.rePassword) {
            newErrors.rePassword = 'Mật khẩu nhập lại không khớp';
        }
        
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            setIsLoading(false);
            return;
        }
        
        try {
            const response = await registerUser({
                email: form.email,
                fullName: form.fullName,
                password: form.password,
                rePassword: form.rePassword
            });
            
            setSuccessMessage(response.message || 'Đăng ký thành công!');
            
            // Clear form
            setForm({
                fullName: '',
                email: '',
                password: '',
                rePassword: ''
            });
            
            // Redirect to login after 2 seconds
            setTimeout(() => {
                navigate('/login');
            }, 2000);
            
        } catch (error) {
            console.error('Registration error:', error);
            
            if (error.data && error.data.errors) {
                // Handle validation errors from backend
                const backendErrors = {};
                Object.keys(error.data.errors).forEach(key => {
                    const messages = error.data.errors[key];
                    backendErrors[key] = Array.isArray(messages) ? messages[0] : messages;
                });
                setErrors(backendErrors);
            } else {
                setErrors({
                    general: error.data?.message || 'Đã có lỗi xảy ra. Vui lòng thử lại.'
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
                label='Họ và tên'
                type='text'
                name='fullName'
                id='fullName'
                placeholder='Nguyễn Văn A'
                value={form.fullName}
                onChange={handleValue}
                error={errors.fullName || errors.full_name}
                disabled={isLoading}
            />
            
            <FormGroup
                label='Email'
                type='email'
                name='email'
                id='email'
                placeholder='nguyenvana@example.com'
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
                id='password'
                placeholder='••••••••'
                value={form.password}
                onChange={handleValue}
                autoComplete='new-password'
                error={errors.password}
                disabled={isLoading}
            />
            
            <FormGroup
                label='Nhập lại mật khẩu'
                type='password'
                name='rePassword'
                id='rePassword'
                placeholder='••••••••'
                value={form.rePassword}
                onChange={handleValue}
                autoComplete='new-password'
                error={errors.rePassword || errors.re_password}
                disabled={isLoading}
            />
            
            <button 
                type="submit" 
                className={styles.submit}
                disabled={isLoading}
            >
                {isLoading ? 'Đang xử lý...' : 'Đăng ký'}
            </button>
        </form>
     );
}

export default RegisterForm;