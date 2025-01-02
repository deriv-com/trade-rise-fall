import React from 'react';
import './LoadingSpinner.scss';

interface LoadingSpinnerProps {
    size?: 'small' | 'medium' | 'large';
    color?: string;
    className?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
    size = 'medium',
    color = 'var(--text-color, #ffffff)',
    className = ''
}) => {
    return (
        <div className={`loading-spinner loading-spinner--${size} ${className}`}>
            <svg
                viewBox="0 0 50 50"
                style={{ fill: color }}
            >
                <circle
                    cx="25"
                    cy="25"
                    r="20"
                    className="loading-spinner__circle"
                />
            </svg>
            <span className="loading-spinner__text">Loading...</span>
        </div>
    );
};
