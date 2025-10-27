import { useState } from "react";
import FormGroup from "~/components/formGroup/FormGroup";
import styles from './Register.module.scss'

function RegisterForm() {
    const [form, setForm] = useState({
        fullName: '',
        email: '',
        password: '',
        reEPassWord: ''
    }) 
    const handleValue = (e)=>{
        const {name, value} = e.target;
        setForm(prev => prev[name] === value ? prev : {...prev, [name]: value})
    }
    return ( 
        <form className={styles.form}>
            <FormGroup
                label='Họ và tên'
                type='text'
                name='fullName'
                id= 'fullName'
                placeholder='Nguyễn Văn A'
                value={form.fullName}
                onChange={handleValue}
            ></FormGroup>
            <FormGroup
                label='Email'
                type='email'
                name='email'
                id= 'email'
                placeholder='nguyenvana@example.com'
                value={form.email}
                onChange={handleValue}
                autoComplete='email'
            ></FormGroup>
            <FormGroup
                label='Mật khẩu'
                type='password'
                name='password'
                id= 'password'
                placeholder='••••••••'
                value={form.password}
                onChange={handleValue}
                autoComplete={false}
            ></FormGroup>
            <FormGroup
                label='Nhập lại mật khẩu'
                type='password'
                name='reEPassWord'
                id= 'reEPassWord'
                placeholder='••••••••'
                value={form.reEPassWord}
                onChange={handleValue}
                autoComplete={false}
            ></FormGroup>
            <button className={styles.submit}>Đăng ký</button>
        </form>
     );
}

export default RegisterForm;