import React from 'react';
import classes from './Input.module.css';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const Input: React.FC<InputProps> = ({ label, error, ...props }) => {
  return (
    <div className={classes.container}>
      {label && <label className={classes.label}>{label}</label>}
      <input className={`${classes.input} ${error ? classes.error : ''}`} {...props} />
      {error && <span className={classes.errorMessage}>{error}</span>}
    </div>
  );
};

export default Input;