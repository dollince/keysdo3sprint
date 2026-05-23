import React, { useState } from 'react';
import './login.css';
import { Link } from 'react-router-dom';
import {OpenEyesIcon} from "../icons/Openeyesicon.tsx";
import {CloseEyesIcon} from "../icons/Closeeyesicon.tsx";

const Login: React.FC = () => {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const response = await fetch('http://localhost:8080/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
    });

    if (response.ok) {
        const data = await response.json();
        localStorage.setItem('token', data.token);
        window.location.href = '/';
    } else {
        alert('Ошибка входа');
    }
    };

    return (
        <div className="login-container">
            <div className="login-form">

                {/* Шапка формы: Log по центру, крестик справа */}
                <div className="login-header">
                    <h1 className="login-title">Log</h1>
                    <span className="close-icon" onClick={() => window.location.href = '/'}>X</span>
                </div>

                <form className="form-content" onSubmit={handleSubmit}>

                    {/* Поле Mail */}
                    <div className="form-group-combined">
                        <label htmlFor="email">Mail</label>
                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="enter"
                            required
                        />
                    </div>

                    {/* Поле Password с кнопкой "глаз" */}
                    <div className="form-group-combined">
                        <label htmlFor="password">Password</label>
                        <div style={{ position: 'relative', width: '100%' }}>
                            <input
                                id="password"
                                type={showPassword ? 'text' : 'password'}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="enter"
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="password-toggle"
                                style={{
                                    position: 'absolute',
                                    right: '20px',
                                    top: '50%',
                                    transform: 'translateY(-50%)',
                                    background: 'none',
                                    border: 'none',
                                    cursor: 'pointer',
                                    color: '#5B8064',
                                    fontSize: '1.2rem',
                                    display: 'flex',
                                    alignItems: 'center'
                                }}
                            >
                                {showPassword ? <OpenEyesIcon className="open-eye-icon" width={20} height={20} color="#5B8064" /> : <CloseEyesIcon className="close-eye-icon" width={20} height={20} color="#5B8064" />}
                            </button>
                        </div>
                    </div>

                    {/* Кнопка входа: центрирована через CSS */}
                    <button type="submit" className="login-btn">
                        Log in
                    </button>

                    {/* Ссылка под формой */}
                    <p className="register-link">
                        Don’t have an account? <Link to="/register">Register now.</Link>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default Login;