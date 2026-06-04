import styles from "./Sticker.module.css";

/**
 * Sticker — the signature "Charcoal & Butter" motif.
 *
 * Always butter-yellow, mono, uppercase. Rotation clamps to -6°..+6°.
 *
 * @param {object}   props
 * @param {React.ReactNode} props.children
 * @param {"rect"|"badge"|"tag"} [props.variant="rect"]
 * @param {number}   [props.rotate=-3]   degrees, clamped -6..+6
 * @param {"sm"|"md"|"lg"} [props.size="md"]
 * @param {boolean}  [props.interactive] wiggle + lift on hover
 * @param {string}   [props.href]        renders an <a> when present
 * @param {string}   [props.className]
 */
export default function Sticker({
  children,
  variant = "rect",
  rotate = -3,
  size = "md",
  interactive = false,
  href,
  className = "",
  ...rest
}) {
  const clampedRotate = Math.max(-6, Math.min(6, rotate));

  const cls = [
    styles.sticker,
    styles[variant] || styles.rect,
    styles[size] || styles.md,
    interactive ? styles.interactive : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const style = { "--rot": `${clampedRotate}deg` };

  if (href) {
    return (
      <a href={href} className={cls} style={style} {...rest}>
        {children}
      </a>
    );
  }

  return (
    <span className={cls} style={style} {...rest}>
      {children}
    </span>
  );
}
