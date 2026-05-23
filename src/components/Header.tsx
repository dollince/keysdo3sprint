import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { HouseIcon } from '../icons/houseicon';
import { PlusIcon } from '../icons/plusicon';
import './Header.css';

interface HeaderProps {
    onCreateTeam?: () => void;
    onMessages?: () => void;
    unreadCount?: number;
}

const Header: React.FC<HeaderProps> = ({ onCreateTeam, onMessages, unreadCount = 0 }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const isHomePage = location.pathname === '/';

    const handleIconClick = () => {
        if (isHomePage) {
            if (onCreateTeam) onCreateTeam();
        } else {
            navigate('/');
        }
    };

    return (
        <header className="main-header">
            <div className="home-icon-container" onClick={handleIconClick} title={isHomePage ? 'Создать команду' : 'На главную'}>
                {isHomePage ? (
                    <PlusIcon className="home-icon" color="#2d5a3b" />
                ) : (
                    <HouseIcon className="home-icon" color="#2d5a3b" />
                )}
            </div>

            <div className="header-title">name</div>

            <div className="header-right">
                {/* Кнопка сообщений — опущена чуть ниже */}
                <div 
                    className="header-messages-btn" 
                    onClick={onMessages} 
                    title="Messages"
                    style={{ transform: 'translateY(2px)' }} 
                >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M21 15C21 15.5304 20.7893 16.0391 20.4142 16.4142C20.0391 16.7893 19.5304 17 19 17H7L3 21V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H19C19.5304 3 20.0391 3.21071 20.4142 3.58579C20.7893 3.96086 21 4.46957 21 5V15Z" stroke="#2d5a3b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    {unreadCount > 0 && (
                        <span className="messages-badge">{unreadCount}</span>
                    )}
                </div>

                {/* КНОПКА ПРОФИЛЯ — ДОБАВЛЕН STYLE, ЧТОБЫ ПРИПОДНЯТЬ ЕЁ ЧУТЬ ВЫШЕ */}
                <div 
                    className="header-profile-link" 
                    onClick={() => navigate('/profile')}
                    style={{ transform: 'translateY(-2px)' }}
                >
                    profile
                </div>
            </div>
        </header>
    );
};

export default Header;