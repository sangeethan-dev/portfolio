import styles from "./Button.module.css";

export default function Button({
  variant = "primary",
  href,
  children,
  className = "",
  ...rest
}) {
  const cls = [styles.btn, styles[variant], className].filter(Boolean).join(" ");

  if (href) {
    return <a href={href} className={cls} {...rest}>{children}</a>;
  }

  return <button className={cls} {...rest}>{children}</button>;
}
