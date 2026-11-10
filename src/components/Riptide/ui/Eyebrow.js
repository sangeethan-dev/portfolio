import styles from "./Eyebrow.module.css";

/* Small section label above a heading: "● WHAT WE TREAT" */
export default function Eyebrow({ children, className = "" }) {
  return (
    <p className={`${styles.eyebrow} ${className}`}>
      <span className={styles.dot} aria-hidden="true" />
      <span>{children}</span>
    </p>
  );
}
