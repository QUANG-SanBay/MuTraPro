import { useId } from 'react';
import clsx from 'clsx';
import styles from './FormGroup.module.scss';

function FormGroup({
  label,
  name,
  id,
  type = 'text',
  value,
  onChange,
  placeholder,
  required = false,
  error,
  className,
  autoComplete,
  disabled = false
}) {
  const autoId = useId();
  const inputId = id || `${name || 'input'}-${autoId}`;

  return (
    <div className={clsx(styles.group, className)}>
      {label && (
        <label htmlFor={inputId} className={styles.label}>
          {label} {required && <span className={styles.required}>*</span>}
        </label>
      )}
      <input
        id={inputId}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        autoComplete={autoComplete}
        disabled={disabled}
        className={clsx(styles.input, { [styles.invalid]: !!error })}
      />
      {error && <div className={styles.error}>{error}</div>}
    </div>
  );
}

export default FormGroup;