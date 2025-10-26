import FormGroup from '~/components/formGroup/FormGroup';
import styles from './LoginForm.module.scss'
import { useState } from 'react';
function LoginForm() {
    const [form, setForm] = useState({email: '', password: ''})
    const handleValue = (e)=>{
        const {name, value} = e.target;
        setForm((prev) => (prev[name] === value ? prev : { ...prev, [name]: value }))
    }

    return ( 
        <form className={styles.form}>
            <FormGroup
                label='Email'
                type='email'
                name='email'
                placeholder='email@example.com'
                value={form.email}
                onChange={handleValue}
                autoComplete='email'
            />
            <FormGroup
                label='Mật khẩu'
                type='password'
                name='password'
                placeholder='••••••••'
                value={form.password}
                onChange={handleValue}
                autoComplete='current-password'
            />
            <button type='submit' className={styles.submit}>Đăng nhập</button>
        </form>
     );
}

export default LoginForm;