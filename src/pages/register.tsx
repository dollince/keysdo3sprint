import React, { useState } from 'react';
import './login.css'; // используем тот же стиль
import { useNavigate, Link } from 'react-router-dom';
import {CloseEyesIcon} from "../icons/Closeeyesicon.tsx";
import {OpenEyesIcon} from "../icons/Openeyesicon.tsx";

const Register: React.FC = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const response = await fetch('http://localhost:8080/api/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },

            body: JSON.stringify({ name, email, password }),
        });

        if (response.ok) {
            alert('Регистрация успешна!');
            navigate('/login');
        } else {
            const contentType = response.headers.get("content-type");

            if (contentType && contentType.includes("application/json")) {

                const errors = await response.json();


                const errorMessages = Object.values(errors).join('\n');
                alert(errorMessages);
            } else {

                const errorText = await response.text();
                alert(errorText);
            }
        }
    };

    return (
        <div className="login-container">
            <div className="login-form">

                {/* Шапка */}
                <div className="login-header">
                    <h1 className="login-title">Registration</h1>
                    <span className="close-icon" onClick={() => window.location.href = '/'}>
                        X
                    </span>
                </div>

                <form className="form-content" onSubmit={handleSubmit}>

                    {/* Name */}
                    <div className="form-group-combined">
                        <label htmlFor="name">Name</label>
                        <input
                            id="name"
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="enter"
                            required
                        />
                    </div>

                    {/* Mail */}
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

                    {/* Password */}
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
                                style={{
                                    position: 'absolute',
                                    right: '20px',
                                    top: '50%',
                                    transform: 'translateY(-50%)',
                                    background: 'none',
                                    border: 'none',
                                    cursor: 'pointer',
                                    color: '#5B8064',
                                    fontSize: '1.2rem'
                                }}
                            >
                                {showPassword ? <OpenEyesIcon className="open-eye-icon" width={20} height={20} color="#5B8064" /> : <CloseEyesIcon className="close-eye-icon" width={20} height={20} color="#5B8064" />}
                            </button>
                        </div>
                    </div>

                    {/* Кнопка */}
                    <button type="submit" className="login-btn">
                        Register
                    </button>

                    {/* Ссылка */}
                    <p className="register-link">
                        Already have an account? <Link to ="/login">Log in</Link>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default Register;