import React from 'react';

interface PlusIconProps {
    className?: string;
    width?: number;
    height?: number;
    onClick?: () => void;
    color?: string;
}

export const PlusIcon: React.FC<PlusIconProps> = ({
    className,
    width = 45,
    height = 45,
    onClick,
    color = "#4B7554"
}) => {
    return (
        <svg
            className={className}
            width={width}
            height={height}
            viewBox="0 0 45 45"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            onClick={onClick}
            style={{ cursor: onClick ? 'pointer' : 'default' }}
        >
            <path
                d="M27.6924 13.3076C27.6924 15.5168 29.4832 17.3076 31.6924 17.3076H41C43.2091 17.3076 45 19.0985 45 21.3076V23.6924C45 25.9015 43.2091 27.6924 41 27.6924H31.6924C29.4832 27.6924 27.6924 29.4832 27.6924 31.6924V41C27.6924 43.2091 25.9015 45 23.6924 45H21.3076C19.0985 45 17.3076 43.2091 17.3076 41V31.6924C17.3076 29.4832 15.5168 27.6924 13.3076 27.6924H4C1.79086 27.6924 0 25.9015 0 23.6924V21.3076C0 19.0985 1.79086 17.3076 4 17.3076H13.3076C15.5168 17.3076 17.3076 15.5168 17.3076 13.3076V4C17.3076 1.79086 19.0985 0 21.3076 0H23.6924C25.9015 0 27.6924 1.79086 27.6924 4V13.3076Z"
                fill={color}
            />
        </svg>
    );
};