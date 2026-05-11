import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { HouseIcon } from '../icons/houseicon';
import { PlusIcon } from '../icons/plusicon';
import './Header.css';

interface HeaderProps {
    onCreateTeam?: () => void;
}

const Header: React.FC<HeaderProps> = ({ onCreateTeam }) => {
    const navigate = useNavigate();
    const location = useLocation();

    const isHomePage = location.pathname === '/';

    const handleIconClick = () => {
        if (isHomePage) {
            if (onCreateTeam) {
                onCreateTeam();
            } else {
                console.log('Создать новый проект');
            }
        } else {
            navigate('/');
        }
    };

    return (
        <header className="main-header">
            <div className="home-icon-container" onClick={handleIconClick} title={isHomePage ? "Создать команду" : "На главную"}>
                {isHomePage ? (
                    <PlusIcon className="home-icon" color="#2d5a3b" />
                ) : (
                    <HouseIcon className="home-icon" color="#2d5a3b" />
                )}
            </div>

            <div className="header-title">name</div>

            <div className="header-profile-link" onClick={() => navigate('/profile')}>
                profile
            </div>
        </header>
    );
};

export default Header;