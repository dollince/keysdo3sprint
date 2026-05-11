import React from 'react';

interface HouseIconProps {
    className?: string;
    width?: number;
    height?: number;
    onClick?: () => void;
    color?: string;
}

export const HouseIcon: React.FC<HouseIconProps> = ({
    className,
    width = 45,
    height = 46,
    onClick,
    color = "#5B8064"
}) => {
    return (
        <svg
            className={className}
            width={width}
            height={height}
            viewBox="0 0 45 46"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            onClick={onClick}
            style={{ cursor: onClick ? 'pointer' : 'default' }}
        >
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M19.9112 0.862084C21.0788 -0.287371 22.9525 -0.287352 24.1202 0.862084L43.1309 19.576C45.0436 21.4589 43.7104 24.7136 41.0264 24.7136H38.5499C38.8313 25.4087 38.9883 26.1677 38.9884 26.9636V39.0945C38.9882 42.408 36.3019 45.0944 32.9884 45.0945H11.044C7.73059 45.0943 5.04418 42.408 5.04402 39.0945V26.9636C5.04404 26.1677 5.20106 25.4086 5.4825 24.7136H3.00594C0.321856 24.7136 -1.01132 21.4589 0.901445 19.576L19.9112 0.862084Z"
                fill={color}
            />
        </svg>
    );
};