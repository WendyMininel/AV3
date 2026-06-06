import React from 'react';
import styles from './Button.module.css';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'success' | 'danger' | 'secondary';
  children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({ variant = 'primary', children, ...props }) => {
  return (
    <button className={`${styles.button} ${styles[variant]}`} {...props}>
      {children}
    </button>
  );
};

export default Button;