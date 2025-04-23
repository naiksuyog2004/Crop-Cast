import React from 'react';
import styles from './InputControl.module.css';
 // Import your chosen icons

function InputControl({ label, icon, ...props }) {
  return (
    <div className={styles.container}>
      {label && <label className={styles.label}>{label}</label>}
      <div className={styles.inputContainer}>
        {icon && <span className={styles.icon}>{icon}</span>} {/* Render icon if provided */}
        <input type="text" {...props} />
      </div>
    </div>
  );
}

export default InputControl;
