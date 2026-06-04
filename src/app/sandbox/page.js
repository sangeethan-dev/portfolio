import Sticker from "@/components/Sticker/Sticker";

/*
 * THROWAWAY sandbox — preview every Sticker variant / size / rotation.
 * Delete this route once the foundation pass is approved.
 */

const row = {
  display: "flex",
  flexWrap: "wrap",
  alignItems: "center",
  gap: "28px",
  marginBottom: "48px",
};

const labelStyle = {
  fontFamily: "var(--mono)",
  fontSize: "11px",
  letterSpacing: "0.2em",
  textTransform: "uppercase",
  color: "var(--color-text-mute)",
  marginBottom: "20px",
  display: "block",
};

export default function SandboxPage() {
  return (
    <main style={{ minHeight: "100vh", padding: "120px 56px", background: "var(--color-bg)" }}>
      <h1 style={{ fontFamily: "var(--display)", fontSize: "clamp(40px, 8vw, 96px)", color: "var(--color-text)", marginBottom: "12px" }}>
        Sticker <span className="serif-italic">sandbox</span>
      </h1>
      <p style={{ fontFamily: "var(--mono)", fontSize: "13px", color: "var(--color-text-mute)", marginBottom: "72px" }}>
        Charcoal &amp; Butter foundation pass — throwaway preview.
      </p>

      <span style={labelStyle}>Variant: rect — sizes sm / md / lg</span>
      <div style={row}>
        <Sticker size="sm">EST. 2018 · SRI LANKA</Sticker>
        <Sticker size="md">EST. 2018 · SRI LANKA</Sticker>
        <Sticker size="lg">EST. 2018 · SRI LANKA</Sticker>
      </div>

      <span style={labelStyle}>Variant: badge — seals / stamps</span>
      <div style={row}>
        <Sticker variant="badge" rotate={4}>LIVE</Sticker>
        <Sticker variant="badge" rotate={-2}>✓ APPROVED</Sticker>
        <Sticker variant="badge" size="lg" rotate={2}>01</Sticker>
      </div>

      <span style={labelStyle}>Variant: tag — punched hole</span>
      <div style={row}>
        <Sticker variant="tag" rotate={-5}>5–7 DAYS</Sticker>
        <Sticker variant="tag" size="lg" rotate={3}>FROM $2.5K</Sticker>
      </div>

      <span style={labelStyle}>Rotation range — clamped -6° … +6°</span>
      <div style={row}>
        <Sticker rotate={-6}>-6°</Sticker>
        <Sticker rotate={-3}>-3°</Sticker>
        <Sticker rotate={0}>0°</Sticker>
        <Sticker rotate={3}>+3°</Sticker>
        <Sticker rotate={6}>+6°</Sticker>
        <Sticker rotate={20}>20° → clamps to 6°</Sticker>
      </div>

      <span style={labelStyle}>Interactive — hover to lift + wiggle</span>
      <div style={row}>
        <Sticker interactive rotate={3}>HOVER ME</Sticker>
        <Sticker interactive variant="badge" rotate={-3}>WORK WITH ME →</Sticker>
        <Sticker interactive href="#contact" variant="tag" rotate={4}>GET IN TOUCH</Sticker>
      </div>
    </main>
  );
}
