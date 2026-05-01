/* Soma logo explorations
   Design system:
   - Type: 'Fraunces' is overused — using 'Inter' for sans + 'Newsreader' for serif accents
     Actually let's avoid Inter. Using 'GT Walsheim'-feel via 'Manrope' (geometric humanist) for sans
     and 'Cormorant Garamond' for the soft serif option.
   - Palette anchor: warm off-white #F4F0EA, deep ink #18201C, sage accent oklch(0.62 0.05 145),
     terracotta accent oklch(0.62 0.10 45). Wellness-leaning, calm, modern.
*/

const SOMA_INK = "#18201C";
const SOMA_PAPER = "#F4F0EA";
const SOMA_SAGE = "oklch(0.62 0.05 145)";
const SOMA_TERRA = "oklch(0.62 0.10 45)";
const SOMA_DARK = "#0E1311";
const SOMA_SLATE = "oklch(0.62 0.04 240)";
const SOMA_SLATE_DEEP = "oklch(0.42 0.05 240)";

// ───────── 01. Pure wordmark, lowercase, geometric ─────────
function L01_Wordmark() {
  return (
    <div style={{ width: "100%", height: "100%", display: "grid", placeItems: "center", background: SOMA_PAPER }}>
      <div style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 500, fontSize: 132, letterSpacing: "-0.055em", color: SOMA_INK, lineHeight: 1 }}>
        soma
      </div>
    </div>
  );
}

// ───────── 02. Wordmark with the 'o' as a balance dot ─────────
function L02_BalanceO() {
  return (
    <div style={{ width: "100%", height: "100%", display: "grid", placeItems: "center", background: SOMA_PAPER }}>
      <div style={{ display: "flex", alignItems: "center", fontFamily: "'Manrope', sans-serif", fontWeight: 400, fontSize: 132, letterSpacing: "-0.04em", color: SOMA_INK, lineHeight: 1 }}>
        <span>s</span>
        <span style={{ display: "inline-grid", placeItems: "center", width: 96, height: 96, margin: "0 4px" }}>
          <span style={{ width: 92, height: 92, borderRadius: "50%", border: `2px solid ${SOMA_INK}`, position: "relative" }}>
            <span style={{ position: "absolute", left: "50%", top: "50%", transform: "translate(-50%,-50%)", width: 18, height: 18, borderRadius: "50%", background: SOMA_TERRA }}></span>
          </span>
        </span>
        <span>m</span>
        <span>a</span>
      </div>
    </div>
  );
}

// ───────── 03. Symbol: orb (body/sphere) + wordmark ─────────
function L03_Orb() {
  return (
    <div style={{ width: "100%", height: "100%", display: "grid", placeItems: "center", background: SOMA_PAPER }}>
      <div style={{ display: "flex", alignItems: "center", gap: 28 }}>
        <svg width="120" height="120" viewBox="0 0 120 120">
          <defs>
            <radialGradient id="orb3" cx="38%" cy="34%" r="70%">
              <stop offset="0%" stopColor="#E9D9C2" />
              <stop offset="55%" stopColor={SOMA_INK.replace('#','#').toString()} stopOpacity="0" />
            </radialGradient>
          </defs>
          <circle cx="60" cy="60" r="56" fill={SOMA_INK} />
          <circle cx="60" cy="60" r="56" fill="url(#orb3)" />
        </svg>
        <div style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 500, fontSize: 108, letterSpacing: "-0.05em", color: SOMA_INK, lineHeight: 1 }}>
          soma
        </div>
      </div>
    </div>
  );
}

// ───────── 04. Serif wordmark — soft, editorial wellness ─────────
function L04_Serif() {
  return (
    <div style={{ width: "100%", height: "100%", display: "grid", placeItems: "center", background: SOMA_PAPER }}>
      <div style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 400, fontStyle: "italic", fontSize: 156, letterSpacing: "-0.015em", color: SOMA_INK, lineHeight: 1 }}>
        Soma
      </div>
    </div>
  );
}

// ───────── 05. Stacked monogram — 'S' with horizon line ─────────
function L05_Horizon() {
  return (
    <div style={{ width: "100%", height: "100%", display: "grid", placeItems: "center", background: SOMA_PAPER }}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 18 }}>
        <svg width="140" height="140" viewBox="0 0 140 140">
          <circle cx="70" cy="70" r="64" fill="none" stroke={SOMA_INK} strokeWidth="2" />
          <path d="M 70 16 Q 30 70 70 124 Q 110 70 70 16" fill="none" stroke={SOMA_INK} strokeWidth="2" />
          <line x1="6" y1="70" x2="134" y2="70" stroke={SOMA_INK} strokeWidth="2" />
        </svg>
        <div style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 500, fontSize: 44, letterSpacing: "0.42em", color: SOMA_INK, paddingLeft: "0.42em" }}>
          SOMA
        </div>
      </div>
    </div>
  );
}

// ───────── 06. Seed — split sphere, two halves (intake / body) ─────────
function SeedMark({ a, b, size = 120 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 120 120">
      <circle cx="60" cy="60" r="56" fill={a} />
      <path d="M 60 4 A 56 56 0 0 1 60 116 A 28 56 0 0 0 60 4 Z" fill={b} />
    </svg>
  );
}
function L06_Lockup({ a = SOMA_SAGE, b = SOMA_INK, ink = SOMA_INK, bg = SOMA_PAPER, label }) {
  return (
    <div style={{ width: "100%", height: "100%", display: "grid", placeItems: "center", background: bg, position: "relative" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 28 }}>
        <SeedMark a={a} b={b} />
        <div style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 500, fontSize: 108, letterSpacing: "-0.05em", color: ink, lineHeight: 1 }}>
          soma
        </div>
      </div>
      {label ? (
        <div style={{ position: "absolute", left: 18, bottom: 14, fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: `${ink}88`, letterSpacing: "0.04em" }}>
          {label}
        </div>
      ) : null}
    </div>
  );
}
function L06_Seed() {
  return <L06_Lockup a={SOMA_SAGE} b={SOMA_INK} />;
}

// ───────── 07. Counter ring — completed-day ring around the 'o' ─────────
function Ring({ size = 120, r = 44, sw = 14, pct = 0.72, fg = SOMA_SLATE_DEEP, track = `${SOMA_SLATE_DEEP}22`, rotate = -90 }) {
  const C = 2 * Math.PI * r;
  const cx = size / 2, cy = size / 2;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <circle cx={cx} cy={cy} r={r} fill="none" stroke={track} strokeWidth={sw} />
      <circle cx={cx} cy={cy} r={r} fill="none" stroke={fg} strokeWidth={sw} strokeLinecap="round"
        strokeDasharray={`${C * pct} ${C}`} transform={`rotate(${rotate} ${cx} ${cy})`} />
    </svg>
  );
}
function L07_Ring() {
  return (
    <div style={{ width: "100%", height: "100%", display: "grid", placeItems: "center", background: SOMA_PAPER }}>
      <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
        <Ring />
        <div style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 500, fontSize: 108, letterSpacing: "-0.05em", color: SOMA_SLATE_DEEP, lineHeight: 1 }}>
          soma
        </div>
      </div>
    </div>
  );
}

// R-variants ──────────────────────────────────────────────────────────────
function R_Thin() {
  return (
    <div style={{ width: "100%", height: "100%", display: "grid", placeItems: "center", background: SOMA_PAPER }}>
      <div style={{ display: "flex", alignItems: "center", gap: 28 }}>
        <Ring sw={6} pct={0.72} />
        <div style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 500, fontSize: 108, letterSpacing: "-0.05em", color: SOMA_SLATE_DEEP, lineHeight: 1 }}>soma</div>
      </div>
    </div>
  );
}
function R_Heavy() {
  return (
    <div style={{ width: "100%", height: "100%", display: "grid", placeItems: "center", background: SOMA_PAPER }}>
      <div style={{ display: "flex", alignItems: "center", gap: 28 }}>
        <Ring sw={22} r={40} pct={0.72} />
        <div style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 500, fontSize: 108, letterSpacing: "-0.05em", color: SOMA_SLATE_DEEP, lineHeight: 1 }}>soma</div>
      </div>
    </div>
  );
}
function R_Full() {
  return (
    <div style={{ width: "100%", height: "100%", display: "grid", placeItems: "center", background: SOMA_PAPER }}>
      <div style={{ display: "flex", alignItems: "center", gap: 28 }}>
        <Ring pct={1.0} />
        <div style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 500, fontSize: 108, letterSpacing: "-0.05em", color: SOMA_SLATE_DEEP, lineHeight: 1 }}>soma</div>
      </div>
    </div>
  );
}
function R_TwoTone() {
  // ring + smaller filled slate disc inside (body inside the day)
  return (
    <div style={{ width: "100%", height: "100%", display: "grid", placeItems: "center", background: SOMA_PAPER }}>
      <div style={{ display: "flex", alignItems: "center", gap: 28 }}>
        <div style={{ position: "relative", width: 120, height: 120 }}>
          <Ring />
          <div style={{ position: "absolute", inset: 0, display: "grid", placeItems: "center" }}>
            <div style={{ width: 36, height: 36, borderRadius: "50%", background: SOMA_SLATE_DEEP }}></div>
          </div>
        </div>
        <div style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 500, fontSize: 108, letterSpacing: "-0.05em", color: SOMA_SLATE_DEEP, lineHeight: 1 }}>soma</div>
      </div>
    </div>
  );
}
function R_Stacked() {
  return (
    <div style={{ width: "100%", height: "100%", display: "grid", placeItems: "center", background: SOMA_PAPER }}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 22 }}>
        <Ring size={150} r={56} sw={16} pct={0.72} />
        <div style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 500, fontSize: 72, letterSpacing: "0.18em", textTransform: "uppercase", color: SOMA_SLATE_DEEP, lineHeight: 1, paddingLeft: "0.18em" }}>soma</div>
      </div>
    </div>
  );
}
function R_Dark() {
  return (
    <div style={{ width: "100%", height: "100%", display: "grid", placeItems: "center", background: SOMA_DARK }}>
      <div style={{ display: "flex", alignItems: "center", gap: 28 }}>
        <Ring fg={SOMA_SLATE} track={`${SOMA_PAPER}1f`} />
        <div style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 500, fontSize: 108, letterSpacing: "-0.05em", color: SOMA_PAPER, lineHeight: 1 }}>soma</div>
      </div>
    </div>
  );
}

// Ten dark variants ──────────────────────────────────────────────────────────
function RD_PaperRing() {
  return (
    <div style={{ width: "100%", height: "100%", display: "grid", placeItems: "center", background: SOMA_DARK }}>
      <div style={{ display: "flex", alignItems: "center", gap: 28 }}>
        <Ring fg={SOMA_PAPER} track={`${SOMA_PAPER}1a`} />
        <div style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 500, fontSize: 108, letterSpacing: "-0.05em", color: SOMA_PAPER, lineHeight: 1 }}>soma</div>
      </div>
    </div>
  );
}
function RD_Midnight() {
  return (
    <div style={{ width: "100%", height: "100%", display: "grid", placeItems: "center", background: "#0E1722" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 28 }}>
        <Ring fg={SOMA_SLATE} track={`${SOMA_SLATE}33`} />
        <div style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 500, fontSize: 108, letterSpacing: "-0.05em", color: "#E8E2D4", lineHeight: 1 }}>soma</div>
      </div>
    </div>
  );
}
function RD_DeepSlate() {
  return (
    <div style={{ width: "100%", height: "100%", display: "grid", placeItems: "center", background: SOMA_SLATE_DEEP }}>
      <div style={{ display: "flex", alignItems: "center", gap: 28 }}>
        <Ring fg={SOMA_PAPER} track={`${SOMA_PAPER}26`} />
        <div style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 500, fontSize: 108, letterSpacing: "-0.05em", color: SOMA_PAPER, lineHeight: 1 }}>soma</div>
      </div>
    </div>
  );
}
function RD_HeavyDark() {
  return (
    <div style={{ width: "100%", height: "100%", display: "grid", placeItems: "center", background: SOMA_DARK }}>
      <div style={{ display: "flex", alignItems: "center", gap: 28 }}>
        <Ring sw={22} r={40} pct={0.72} fg={SOMA_SLATE} track={`${SOMA_PAPER}1a`} />
        <div style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 500, fontSize: 108, letterSpacing: "-0.05em", color: SOMA_PAPER, lineHeight: 1 }}>soma</div>
      </div>
    </div>
  );
}
function RD_ThinDark() {
  return (
    <div style={{ width: "100%", height: "100%", display: "grid", placeItems: "center", background: SOMA_DARK }}>
      <div style={{ display: "flex", alignItems: "center", gap: 28 }}>
        <Ring sw={6} pct={0.72} fg={SOMA_SLATE} track={`${SOMA_PAPER}1a`} />
        <div style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 300, fontSize: 108, letterSpacing: "-0.05em", color: SOMA_PAPER, lineHeight: 1 }}>soma</div>
      </div>
    </div>
  );
}
function RD_FullSlate() {
  return (
    <div style={{ width: "100%", height: "100%", display: "grid", placeItems: "center", background: SOMA_DARK }}>
      <div style={{ display: "flex", alignItems: "center", gap: 28 }}>
        <Ring pct={1.0} fg={SOMA_SLATE} track={`${SOMA_PAPER}1a`} />
        <div style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 500, fontSize: 108, letterSpacing: "-0.05em", color: SOMA_PAPER, lineHeight: 1 }}>soma</div>
      </div>
    </div>
  );
}
function RD_StackedDark() {
  return (
    <div style={{ width: "100%", height: "100%", display: "grid", placeItems: "center", background: SOMA_DARK }}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 22 }}>
        <Ring size={150} r={56} sw={16} pct={0.72} fg={SOMA_SLATE} track={`${SOMA_PAPER}1a`} />
        <div style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 500, fontSize: 72, letterSpacing: "0.18em", textTransform: "uppercase", color: SOMA_PAPER, lineHeight: 1, paddingLeft: "0.18em" }}>soma</div>
      </div>
    </div>
  );
}
function RD_TwoToneDark() {
  return (
    <div style={{ width: "100%", height: "100%", display: "grid", placeItems: "center", background: SOMA_DARK }}>
      <div style={{ display: "flex", alignItems: "center", gap: 28 }}>
        <div style={{ position: "relative", width: 120, height: 120 }}>
          <Ring fg={SOMA_SLATE} track={`${SOMA_PAPER}1a`} />
          <div style={{ position: "absolute", inset: 0, display: "grid", placeItems: "center" }}>
            <div style={{ width: 36, height: 36, borderRadius: "50%", background: SOMA_PAPER }}></div>
          </div>
        </div>
        <div style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 500, fontSize: 108, letterSpacing: "-0.05em", color: SOMA_PAPER, lineHeight: 1 }}>soma</div>
      </div>
    </div>
  );
}
function RD_GraphiteDuotone() {
  // gradient ring, dark graphite ground
  return (
    <div style={{ width: "100%", height: "100%", display: "grid", placeItems: "center", background: "#171A1F" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 28 }}>
        <svg width="120" height="120" viewBox="0 0 120 120">
          <defs>
            <linearGradient id="rdg" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={SOMA_SLATE} />
              <stop offset="100%" stopColor={SOMA_PAPER} />
            </linearGradient>
          </defs>
          <circle cx="60" cy="60" r="44" fill="none" stroke={`${SOMA_PAPER}1a`} strokeWidth="14" />
          <circle cx="60" cy="60" r="44" fill="none" stroke="url(#rdg)" strokeWidth="14" strokeLinecap="round"
            strokeDasharray={`${2 * Math.PI * 44 * 0.72} ${2 * Math.PI * 44}`} transform="rotate(-90 60 60)" />
        </svg>
        <div style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 500, fontSize: 108, letterSpacing: "-0.05em", color: SOMA_PAPER, lineHeight: 1 }}>soma</div>
      </div>
    </div>
  );
}
function RD_RingOnly() {
  // big ring centered, no wordmark — pure dark mark
  return (
    <div style={{ width: "100%", height: "100%", display: "grid", placeItems: "center", background: SOMA_DARK }}>
      <Ring size={220} r={88} sw={20} pct={0.72} fg={SOMA_SLATE} track={`${SOMA_PAPER}1a`} />
    </div>
  );
}
function R_FillStates() {
  const pcts = [0, 0.25, 0.5, 0.75, 1.0];
  return (
    <div style={{ width: "100%", height: "100%", display: "grid", placeItems: "center", background: SOMA_PAPER }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 14, alignItems: "center" }}>
        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: `${SOMA_SLATE_DEEP}cc`, letterSpacing: "0.08em" }}>RING STATES · 0 · 25 · 50 · 75 · 100</div>
        <div style={{ display: "flex", gap: 20, alignItems: "center" }}>
          {pcts.map((p, i) => <Ring key={i} size={100} r={36} sw={12} pct={p} />)}
        </div>
      </div>
    </div>
  );
}
function Icon_Ring_Slate() {
  return (
    <div style={{ width: "100%", height: "100%", borderRadius: 72, background: SOMA_SLATE, display: "grid", placeItems: "center" }}>
      <Ring size={220} r={80} sw={26} pct={0.72} fg={SOMA_PAPER} track={`${SOMA_PAPER}33`} />
    </div>
  );
}
function Icon_Ring_OnPaper() {
  return (
    <div style={{ width: "100%", height: "100%", borderRadius: 72, background: SOMA_PAPER, display: "grid", placeItems: "center" }}>
      <Ring size={220} r={80} sw={26} pct={0.72} />
    </div>
  );
}

// ───────── 08. Lowercase 'a' as bowl — subtle calorie reference ─────────
function L08_Bowl() {
  return (
    <div style={{ width: "100%", height: "100%", display: "grid", placeItems: "center", background: SOMA_PAPER }}>
      <div style={{ display: "flex", alignItems: "baseline", fontFamily: "'Manrope', sans-serif", fontWeight: 500, fontSize: 132, letterSpacing: "-0.05em", color: SOMA_INK, lineHeight: 1 }}>
        <span>som</span>
        <span style={{ position: "relative", display: "inline-block", width: 96, height: 96, marginLeft: 4 }}>
          <span style={{ position: "absolute", left: 0, bottom: 6, width: 96, height: 50, borderRadius: "0 0 48px 48px", background: SOMA_INK }}></span>
          <span style={{ position: "absolute", left: 14, top: 8, width: 14, height: 14, borderRadius: "50%", background: SOMA_TERRA }}></span>
          <span style={{ position: "absolute", left: 40, top: 18, width: 10, height: 10, borderRadius: "50%", background: SOMA_SAGE }}></span>
        </span>
      </div>
    </div>
  );
}

// ───────── 09. Two-tone diacritic — body/breath dot above 'o' ─────────
function L09_Breath() {
  return (
    <div style={{ width: "100%", height: "100%", display: "grid", placeItems: "center", background: SOMA_PAPER }}>
      <div style={{ position: "relative", fontFamily: "'Manrope', sans-serif", fontWeight: 500, fontSize: 132, letterSpacing: "-0.05em", color: SOMA_INK, lineHeight: 1 }}>
        soma
        <span style={{ position: "absolute", left: "30%", top: "-18%", width: 18, height: 18, borderRadius: "50%", background: SOMA_TERRA }}></span>
      </div>
    </div>
  );
}

// ───────── App icon variants — slate + capsule system ─────────
// IC1 · Capsule centered on slate field
function Icon_CapsuleSlate() {
  return (
    <div style={{ width: "100%", height: "100%", borderRadius: 64, background: SOMA_SLATE, display: "grid", placeItems: "center" }}>
      <svg width="230" height="150" viewBox="0 0 260 170">
        <rect x="6" y="6" width="248" height="158" rx="79" fill={SOMA_PAPER} />
        <rect x="6" y="6" width="124" height="158" rx="79" fill={SOMA_INK} />
      </svg>
    </div>
  );
}
// IC2 · Capsule on paper, slate + ink
function Icon_CapsulePaper() {
  return (
    <div style={{ width: "100%", height: "100%", borderRadius: 64, background: SOMA_PAPER, display: "grid", placeItems: "center" }}>
      <svg width="230" height="150" viewBox="0 0 260 170">
        <rect x="6" y="6" width="248" height="158" rx="79" fill={SOMA_SLATE} />
        <rect x="6" y="6" width="124" height="158" rx="79" fill={SOMA_INK} />
      </svg>
    </div>
  );
}
// IC3 · Capsule, vertical orientation, ink ground
function Icon_CapsuleVertical() {
  return (
    <div style={{ width: "100%", height: "100%", borderRadius: 64, background: SOMA_INK, display: "grid", placeItems: "center" }}>
      <svg width="150" height="230" viewBox="0 0 170 260">
        <rect x="6" y="6" width="158" height="248" rx="79" fill={SOMA_SLATE} />
        <rect x="6" y="6" width="158" height="124" rx="79" fill={SOMA_PAPER} />
      </svg>
    </div>
  );
}
// IC4 · 'soma' wordmark on slate
function Icon_Wordmark() {
  return (
    <div style={{ width: "100%", height: "100%", borderRadius: 64, background: SOMA_SLATE, display: "grid", placeItems: "center" }}>
      <div style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 500, fontSize: 96, letterSpacing: "-0.05em", color: SOMA_PAPER, lineHeight: 1 }}>soma</div>
    </div>
  );
}
// stubs kept so old refs do not break — unused below
function _UNUSED_OLD() {
  return (
    <div style={{ display: "none" }}>
      <svg width="200" height="200" viewBox="0 0 120 120">
        <circle cx="60" cy="60" r="56" fill={SOMA_PAPER} />
        <path d="M 60 4 A 56 56 0 0 1 60 116 A 28 56 0 0 0 60 4 Z" fill={SOMA_INK} />
      </svg>
    </div>
  );
}

// ───────── Mono + dark wordmark ─────────
function L_Dark() {
  return (
    <div style={{ width: "100%", height: "100%", display: "grid", placeItems: "center", background: SOMA_DARK }}>
      <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
        <svg width="100" height="100" viewBox="0 0 120 120">
          <circle cx="60" cy="60" r="56" fill={SOMA_PAPER} />
          <path d="M 60 4 A 56 56 0 0 1 60 116 A 28 56 0 0 0 60 4 Z" fill={SOMA_DARK} />
        </svg>
        <div style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 500, fontSize: 108, letterSpacing: "-0.05em", color: SOMA_PAPER, lineHeight: 1 }}>
          soma
        </div>
      </div>
    </div>
  );
}

function L_Mono() {
  return (
    <div style={{ width: "100%", height: "100%", display: "grid", placeItems: "center", background: SOMA_PAPER }}>
      <div style={{ display: "flex", alignItems: "center", gap: 22 }}>
        <svg width="80" height="80" viewBox="0 0 120 120">
          <circle cx="60" cy="60" r="56" fill={SOMA_INK} />
        </svg>
        <div style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 500, fontSize: 84, letterSpacing: "-0.05em", color: SOMA_INK, lineHeight: 1 }}>
          soma
        </div>
      </div>
    </div>
  );
}

// ───────── Construction sheet ─────────
function L_Construction() {
  return (
    <div style={{ width: "100%", height: "100%", background: SOMA_PAPER, padding: 60, boxSizing: "border-box", display: "grid", placeItems: "center", position: "relative" }}>
      <div style={{ position: "absolute", inset: 60, border: `1px dashed ${SOMA_INK}33` }}></div>
      <div style={{ display: "flex", alignItems: "center", gap: 28, position: "relative" }}>
        <div style={{ position: "relative" }}>
          <svg width="120" height="120" viewBox="0 0 120 120">
            <circle cx="60" cy="60" r="56" fill={SOMA_INK} />
          </svg>
          <div style={{ position: "absolute", left: -14, top: -14, right: -14, bottom: -14, border: `1px dashed ${SOMA_INK}55`, borderRadius: "50%" }}></div>
        </div>
        <div style={{ position: "relative", fontFamily: "'Manrope', sans-serif", fontWeight: 500, fontSize: 108, letterSpacing: "-0.05em", color: SOMA_INK, lineHeight: 1 }}>
          soma
          <div style={{ position: "absolute", left: 0, right: 0, top: "0.74em", height: 1, background: `${SOMA_INK}55` }}></div>
          <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: 1, background: `${SOMA_INK}33` }}></div>
        </div>
      </div>
      <div style={{ position: "absolute", left: 60, bottom: 24, fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: `${SOMA_INK}88`, letterSpacing: "0.04em" }}>
        SOMA · σῶμα · "body" · wordmark v1 · clearspace = x-height
      </div>
    </div>
  );
}

const { DesignCanvas, DCSection, DCArtboard } = window;

// ───────── Slate explorations — alternative marks (no split-circle) ─────────

// SL1 · Type-driven dot — counter dot inside the 'o', slate fill
function SL_DotO({ slate = SOMA_SLATE }) {
  return (
    <div style={{ width: "100%", height: "100%", display: "grid", placeItems: "center", background: SOMA_PAPER }}>
      <div style={{ display: "flex", alignItems: "center", fontFamily: "'Manrope', sans-serif", fontWeight: 500, fontSize: 132, letterSpacing: "-0.05em", color: SOMA_INK, lineHeight: 1 }}>
        <span>s</span>
        <span style={{ position: "relative", display: "inline-grid", placeItems: "center", width: 96, height: 96, margin: "0 4px" }}>
          <span style={{ width: 92, height: 92, borderRadius: "50%", background: slate }}></span>
        </span>
        <span>m</span>
        <span>a</span>
      </div>
    </div>
  );
}

// SL2 · Stacked bars — three weights (a body-composition glyph)
function SL_Bars() {
  return (
    <div style={{ width: "100%", height: "100%", display: "grid", placeItems: "center", background: SOMA_PAPER }}>
      <div style={{ display: "flex", alignItems: "center", gap: 28 }}>
        <svg width="120" height="120" viewBox="0 0 120 120">
          <rect x="14" y="30" width="92" height="14" rx="7" fill={SOMA_INK} />
          <rect x="14" y="54" width="68" height="14" rx="7" fill={SOMA_SLATE} />
          <rect x="14" y="78" width="44" height="14" rx="7" fill={SOMA_INK} />
        </svg>
        <div style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 500, fontSize: 108, letterSpacing: "-0.05em", color: SOMA_INK, lineHeight: 1 }}>soma</div>
      </div>
    </div>
  );
}

// SL3 · Plumb / balance — vertical line through a slate disc
function SL_Plumb() {
  return (
    <div style={{ width: "100%", height: "100%", display: "grid", placeItems: "center", background: SOMA_PAPER }}>
      <div style={{ display: "flex", alignItems: "center", gap: 28 }}>
        <svg width="120" height="120" viewBox="0 0 120 120">
          <line x1="60" y1="6" x2="60" y2="114" stroke={SOMA_INK} strokeWidth="2.5" />
          <circle cx="60" cy="78" r="30" fill={SOMA_SLATE} />
        </svg>
        <div style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 500, fontSize: 108, letterSpacing: "-0.05em", color: SOMA_INK, lineHeight: 1 }}>soma</div>
      </div>
    </div>
  );
}

// SL4 · Concentric — three rings, slate inner
function SL_Concentric() {
  return (
    <div style={{ width: "100%", height: "100%", display: "grid", placeItems: "center", background: SOMA_PAPER }}>
      <div style={{ display: "flex", alignItems: "center", gap: 28 }}>
        <svg width="120" height="120" viewBox="0 0 120 120">
          <circle cx="60" cy="60" r="56" fill="none" stroke={SOMA_INK} strokeWidth="2" />
          <circle cx="60" cy="60" r="38" fill="none" stroke={SOMA_INK} strokeWidth="2" />
          <circle cx="60" cy="60" r="20" fill={SOMA_SLATE} />
        </svg>
        <div style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 500, fontSize: 108, letterSpacing: "-0.05em", color: SOMA_INK, lineHeight: 1 }}>soma</div>
      </div>
    </div>
  );
}

// SL5 · Lozenge / pill — soma as a body, simple capsule
function SL_Capsule() {
  return (
    <div style={{ width: "100%", height: "100%", display: "grid", placeItems: "center", background: SOMA_PAPER }}>
      <div style={{ display: "flex", alignItems: "center", gap: 36 }}>
        <svg width="260" height="170" viewBox="0 0 260 170">
          <rect x="6" y="6" width="248" height="158" rx="79" fill={SOMA_SLATE} />
          <rect x="6" y="6" width="124" height="158" rx="79" fill={SOMA_INK} />
        </svg>
        <div style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 500, fontSize: 144, letterSpacing: "-0.05em", color: SOMA_INK, lineHeight: 1 }}>soma</div>
      </div>
    </div>
  );
}

// SL6 · Slab serif S — single-letter mark, slate bg
function SL_Lettermark() {
  return (
    <div style={{ width: "100%", height: "100%", display: "grid", placeItems: "center", background: SOMA_PAPER }}>
      <div style={{ display: "flex", alignItems: "center", gap: 28 }}>
        <div style={{ width: 120, height: 120, borderRadius: 28, background: SOMA_SLATE, display: "grid", placeItems: "center" }}>
          <div style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", fontWeight: 500, fontSize: 110, color: SOMA_PAPER, lineHeight: 1, marginTop: -6 }}>S</div>
        </div>
        <div style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 500, fontSize: 108, letterSpacing: "-0.05em", color: SOMA_INK, lineHeight: 1 }}>soma</div>
      </div>
    </div>
  );
}

// SL7 · Type-only, slate accent — ligature underline
function SL_Underline() {
  return (
    <div style={{ width: "100%", height: "100%", display: "grid", placeItems: "center", background: SOMA_PAPER }}>
      <div style={{ position: "relative", fontFamily: "'Manrope', sans-serif", fontWeight: 500, fontSize: 156, letterSpacing: "-0.055em", color: SOMA_INK, lineHeight: 1 }}>
        soma
        <div style={{ position: "absolute", left: 0, right: "26%", bottom: -10, height: 8, background: SOMA_SLATE, borderRadius: 4 }}></div>
      </div>
    </div>
  );
}

// SL8 · Body / scale — thin horizontal line bisecting a soft slate field
function SL_Scale() {
  return (
    <div style={{ width: "100%", height: "100%", display: "grid", placeItems: "center", background: SOMA_PAPER }}>
      <div style={{ display: "flex", alignItems: "center", gap: 28 }}>
        <svg width="120" height="120" viewBox="0 0 120 120">
          <rect x="6" y="6" width="108" height="108" rx="22" fill={SOMA_SLATE} />
          <line x1="22" y1="60" x2="98" y2="60" stroke={SOMA_PAPER} strokeWidth="3" strokeLinecap="round" />
          <circle cx="60" cy="60" r="6" fill={SOMA_PAPER} />
        </svg>
        <div style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 500, fontSize: 108, letterSpacing: "-0.05em", color: SOMA_INK, lineHeight: 1 }}>soma</div>
      </div>
    </div>
  );
}

// SL9 · Wordmark, slate ink — pure type, no symbol
function SL_SlateWordmark() {
  return (
    <div style={{ width: "100%", height: "100%", display: "grid", placeItems: "center", background: SOMA_PAPER }}>
      <div style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 500, fontSize: 156, letterSpacing: "-0.055em", color: SOMA_SLATE_DEEP, lineHeight: 1 }}>soma</div>
    </div>
  );
}

// ───────── Capsule System — expanded ─────────
// Reusable horizontal capsule with a fill ratio (0..1) and palette
function Capsule({ width = 260, height = 170, fill = 0.5, fg = SOMA_INK, bg = SOMA_SLATE, stroke = null, strokeWidth = 0 }) {
  const r = height / 2;
  const innerW = Math.max(0, (width - 12) * fill);
  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
      <rect x="6" y="6" width={width - 12} height={height - 12} rx={r - 6} fill={bg} stroke={stroke || "none"} strokeWidth={strokeWidth} />
      {fill > 0 ? (
        <rect x="6" y="6" width={innerW} height={height - 12} rx={r - 6} fill={fg} />
      ) : null}
    </svg>
  );
}

// CP1 · Lockup, capsule + wordmark, slate/ink, 50% fill
function CP_Lockup50() {
  return (
    <div style={{ width: "100%", height: "100%", display: "grid", placeItems: "center", background: SOMA_PAPER }}>
      <div style={{ display: "flex", alignItems: "center", gap: 36 }}>
        <Capsule />
        <div style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 500, fontSize: 144, letterSpacing: "-0.05em", color: SOMA_INK, lineHeight: 1 }}>soma</div>
      </div>
    </div>
  );
}

// CP2 · Tighter proportions — taller capsule
function CP_Tall() {
  return (
    <div style={{ width: "100%", height: "100%", display: "grid", placeItems: "center", background: SOMA_PAPER }}>
      <div style={{ display: "flex", alignItems: "center", gap: 32 }}>
        <Capsule width={170} height={170} fill={0.55} />
        <div style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 500, fontSize: 144, letterSpacing: "-0.05em", color: SOMA_INK, lineHeight: 1 }}>soma</div>
      </div>
    </div>
  );
}

// CP3 · Outline only, ink/slate
function CP_Outline() {
  return (
    <div style={{ width: "100%", height: "100%", display: "grid", placeItems: "center", background: SOMA_PAPER }}>
      <div style={{ display: "flex", alignItems: "center", gap: 36 }}>
        <Capsule bg="transparent" fg={SOMA_SLATE_DEEP} fill={0.45} stroke={SOMA_INK} strokeWidth={3} />
        <div style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 500, fontSize: 144, letterSpacing: "-0.05em", color: SOMA_INK, lineHeight: 1 }}>soma</div>
      </div>
    </div>
  );
}

// CP4 · Vertical capsule (body axis)
function CP_VerticalLockup() {
  return (
    <div style={{ width: "100%", height: "100%", display: "grid", placeItems: "center", background: SOMA_PAPER }}>
      <div style={{ display: "flex", alignItems: "center", gap: 32 }}>
        <svg width="120" height="220" viewBox="0 0 170 260">
          <rect x="6" y="6" width="158" height="248" rx="79" fill={SOMA_SLATE} />
          <rect x="6" y="6" width="158" height="124" rx="79" fill={SOMA_INK} />
        </svg>
        <div style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 500, fontSize: 144, letterSpacing: "-0.05em", color: SOMA_INK, lineHeight: 1 }}>soma</div>
      </div>
    </div>
  );
}

// CP5 · Stacked lockup — progress-bar feel, wordmark below
function CP_Stacked() {
  const STEPS = 5;
  const FILLED = 3;
  return (
    <div style={{ width: "100%", height: "100%", display: "grid", placeItems: "center", background: SOMA_PAPER }}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 28 }}>
        <div style={{ position: "relative", width: 360, height: 36 }}>
          {/* track */}
          <div style={{ position: "absolute", inset: 0, background: `${SOMA_SLATE_DEEP}22`, borderRadius: 18 }}></div>
          {/* fill */}
          <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: `${(FILLED / STEPS) * 100}%`, background: SOMA_SLATE_DEEP, borderRadius: 18 }}></div>
          {/* tick marks */}
          {Array.from({ length: STEPS - 1 }).map((_, i) => (
            <div key={i} style={{
              position: "absolute",
              left: `${((i + 1) / STEPS) * 100}%`,
              top: 6,
              bottom: 6,
              width: 2,
              marginLeft: -1,
              background: SOMA_PAPER,
              opacity: 0.9,
            }}></div>
          ))}
        </div>
        <div style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 500, fontSize: 96, letterSpacing: "0.18em", textTransform: "uppercase", color: SOMA_SLATE_DEEP, lineHeight: 1, paddingLeft: "0.18em" }}>soma</div>
      </div>
    </div>
  );
}

// CP6 · Capsule, ratio strip — 5 fill states (calorie progress)
function CP_FillStates() {
  return (
    <div style={{ width: "100%", height: "100%", display: "grid", placeItems: "center", background: SOMA_PAPER }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 14, alignItems: "center" }}>
        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: `${SOMA_INK}99`, letterSpacing: "0.08em" }}>FILL STATES · 0 · 25 · 50 · 75 · 100</div>
        <div style={{ display: "flex", gap: 18, alignItems: "center" }}>
          <Capsule width={160} height={100} fill={0.0} />
          <Capsule width={160} height={100} fill={0.25} />
          <Capsule width={160} height={100} fill={0.5} />
          <Capsule width={160} height={100} fill={0.75} />
          <Capsule width={160} height={100} fill={1.0} />
        </div>
      </div>
    </div>
  );
}

// CP7 · Capsule, three-stop palette gradient suggestion (intake / balance / surplus)
function CP_TwoTone() {
  return (
    <div style={{ width: "100%", height: "100%", display: "grid", placeItems: "center", background: SOMA_PAPER }}>
      <div style={{ display: "flex", alignItems: "center", gap: 36 }}>
        <svg width="260" height="170" viewBox="0 0 260 170">
          <rect x="6" y="6" width="248" height="158" rx="79" fill={SOMA_SLATE} />
          <rect x="6" y="6" width="86"  height="158" rx="79" fill={SOMA_INK} />
          <rect x="92" y="6" width="80" height="158" fill={SOMA_INK} />
          <rect x="6" y="6" width="166" height="158" rx="79" fill="url(#capg)" opacity="0" />
        </svg>
        <div style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 500, fontSize: 144, letterSpacing: "-0.05em", color: SOMA_INK, lineHeight: 1 }}>soma</div>
      </div>
    </div>
  );
}

// CP8 · On dark
function CP_Dark() {
  return (
    <div style={{ width: "100%", height: "100%", display: "grid", placeItems: "center", background: SOMA_DARK }}>
      <div style={{ display: "flex", alignItems: "center", gap: 36 }}>
        <Capsule fg={SOMA_PAPER} bg={SOMA_SLATE} fill={0.5} />
        <div style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 500, fontSize: 144, letterSpacing: "-0.05em", color: SOMA_PAPER, lineHeight: 1 }}>soma</div>
      </div>
    </div>
  );
}

// CP9 · Construction sheet for capsule
function CP_Construction() {
  return (
    <div style={{ width: "100%", height: "100%", background: SOMA_PAPER, padding: 48, boxSizing: "border-box", display: "grid", placeItems: "center", position: "relative" }}>
      <div style={{ position: "absolute", inset: 48, border: `1px dashed ${SOMA_INK}33` }}></div>
      <div style={{ display: "flex", alignItems: "center", gap: 36, position: "relative" }}>
        <div style={{ position: "relative" }}>
          <Capsule />
          <div style={{ position: "absolute", left: "50%", top: -16, bottom: -16, width: 1, background: `${SOMA_INK}55` }}></div>
          <div style={{ position: "absolute", top: "50%", left: -16, right: -16, height: 1, background: `${SOMA_INK}55` }}></div>
        </div>
        <div style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 500, fontSize: 144, letterSpacing: "-0.05em", color: SOMA_INK, lineHeight: 1 }}>soma</div>
      </div>
      <div style={{ position: "absolute", left: 48, bottom: 18, fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: `${SOMA_INK}88`, letterSpacing: "0.04em" }}>
        CAPSULE · ratio 1 : 1.53 · radius = h/2 · split @ 50%
      </div>
    </div>
  );
}

// CP10 · App icon — capsule centered, big radius
function Icon_CapsuleBig() {
  return (
    <div style={{ width: "100%", height: "100%", borderRadius: 72, background: SOMA_PAPER, display: "grid", placeItems: "center" }}>
      <Capsule width={260} height={170} fill={0.5} />
    </div>
  );
}

// CP11 · App icon — vertical capsule on slate
function Icon_VertOnSlate() {
  return (
    <div style={{ width: "100%", height: "100%", borderRadius: 72, background: SOMA_SLATE, display: "grid", placeItems: "center" }}>
      <svg width="150" height="240" viewBox="0 0 170 260">
        <rect x="6" y="6" width="158" height="248" rx="79" fill={SOMA_PAPER} />
        <rect x="6" y="6" width="158" height="124" rx="79" fill={SOMA_INK} />
      </svg>
    </div>
  );
}

// CP12 · App icon — capsule fill 75% (progress feel)
function Icon_Progress() {
  return (
    <div style={{ width: "100%", height: "100%", borderRadius: 72, background: SOMA_INK, display: "grid", placeItems: "center" }}>
      <Capsule width={260} height={170} fill={0.75} fg={SOMA_PAPER} bg={SOMA_SLATE} />
    </div>
  );
}

function App() {
  return (
    <DesignCanvas>
      <DCSection id="primary" title="Primary directions">
        <DCArtboard id="01" label="01 · Pure wordmark" width={720} height={360}><L01_Wordmark /></DCArtboard>
        <DCArtboard id="06" label="06 · Split seed mark" width={760} height={360}><L06_Seed /></DCArtboard>
      </DCSection>

      <DCSection id="ring-dark" title="07 · Dark variants">
        <DCArtboard id="rd0"  label="R · On dark (base)"      width={760} height={360}><R_Dark /></DCArtboard>
        <DCArtboard id="rd1"  label="RD1 · Paper ring"         width={760} height={360}><RD_PaperRing /></DCArtboard>
        <DCArtboard id="rd2"  label="RD2 · Midnight blue"      width={760} height={360}><RD_Midnight /></DCArtboard>
        <DCArtboard id="rd3"  label="RD3 · Deep slate ground"  width={760} height={360}><RD_DeepSlate /></DCArtboard>
        <DCArtboard id="rd4"  label="RD4 · Heavy stroke"       width={760} height={360}><RD_HeavyDark /></DCArtboard>
        <DCArtboard id="rd5"  label="RD5 · Thin stroke"        width={760} height={360}><RD_ThinDark /></DCArtboard>
        <DCArtboard id="rd6"  label="RD6 · Full ring"          width={760} height={360}><RD_FullSlate /></DCArtboard>
        <DCArtboard id="rd7"  label="RD7 · Stacked, all caps"  width={520} height={460}><RD_StackedDark /></DCArtboard>
        <DCArtboard id="rd8"  label="RD8 · Ring + paper dot"   width={760} height={360}><RD_TwoToneDark /></DCArtboard>
        <DCArtboard id="rd9"  label="RD9 · Graphite duotone"   width={760} height={360}><RD_GraphiteDuotone /></DCArtboard>
        <DCArtboard id="rd10" label="RD10 · Ring only"         width={520} height={520}><RD_RingOnly /></DCArtboard>
      </DCSection>

      <DCSection id="conceptual" title="07 · Ring system (slate)">
        <DCArtboard id="07"     label="07 · Counter ring"        width={760} height={360}><L07_Ring /></DCArtboard>
        <DCArtboard id="07-thin" label="R · Thin stroke"          width={760} height={360}><R_Thin /></DCArtboard>
        <DCArtboard id="07-hvy"  label="R · Heavy stroke"         width={760} height={360}><R_Heavy /></DCArtboard>
        <DCArtboard id="07-full" label="R · Full ring"            width={760} height={360}><R_Full /></DCArtboard>
        <DCArtboard id="07-2t"   label="R · Ring + body dot"      width={760} height={360}><R_TwoTone /></DCArtboard>
        <DCArtboard id="07-stk"  label="R · Stacked, all caps"    width={520} height={460}><R_Stacked /></DCArtboard>
        <DCArtboard id="07-drk"  label="R · On dark"              width={760} height={360}><R_Dark /></DCArtboard>
        <DCArtboard id="07-fs"   label="R · Fill states"          width={1100} height={260}><R_FillStates /></DCArtboard>
        <DCArtboard id="07-ic1"  label="Icon · ring on slate"     width={360} height={360}><Icon_Ring_Slate /></DCArtboard>
        <DCArtboard id="07-ic2"  label="Icon · ring on paper"     width={360} height={360}><Icon_Ring_OnPaper /></DCArtboard>
      </DCSection>

      <DCSection id="capsule-system" title="Progress-bar lockup">
        <DCArtboard id="cp5"  label="CP5 · Progress-bar lockup"  width={760} height={460}><CP_Stacked /></DCArtboard>
      </DCSection>

      <DCSection id="icons" title="App icons">
        <DCArtboard id="ic1" label="Icon · capsule, paper"  width={360} height={360}><Icon_CapsuleBig /></DCArtboard>
        <DCArtboard id="ic2" label="Icon · vertical, slate" width={360} height={360}><Icon_VertOnSlate /></DCArtboard>
        <DCArtboard id="ic3" label="Icon · 75% progress"    width={360} height={360}><Icon_Progress /></DCArtboard>
        <DCArtboard id="ic4" label="Icon · wordmark, slate" width={360} height={360}><Icon_Wordmark /></DCArtboard>
      </DCSection>

      <DCSection id="seed-colors" title="06 · Color explorations">
        <DCArtboard id="s-mono"  label="A · Pure mono"            width={760} height={360}><L06_Lockup a={SOMA_INK}                  b={SOMA_PAPER}                ink={SOMA_INK}  bg={SOMA_PAPER} label="ink / paper"     /></DCArtboard>
        <DCArtboard id="s-stone" label="B · Warm stone"           width={760} height={360}><L06_Lockup a="#C9BBA8"                   b={SOMA_INK}                  ink={SOMA_INK}  bg={SOMA_PAPER} label="oat / ink"       /></DCArtboard>
        <DCArtboard id="s-clay"  label="C · Clay"                 width={760} height={360}><L06_Lockup a="oklch(0.68 0.07 50)"       b={SOMA_INK}                  ink={SOMA_INK}  bg={SOMA_PAPER} label="clay / ink"      /></DCArtboard>
        <DCArtboard id="s-rose"  label="D · Dusty rose"           width={760} height={360}><L06_Lockup a="oklch(0.74 0.06 20)"       b={SOMA_INK}                  ink={SOMA_INK}  bg={SOMA_PAPER} label="rose / ink"      /></DCArtboard>
        <DCArtboard id="s-butt"  label="E · Soft butter"          width={760} height={360}><L06_Lockup a="oklch(0.86 0.08 95)"       b={SOMA_INK}                  ink={SOMA_INK}  bg={SOMA_PAPER} label="butter / ink"    /></DCArtboard>
        <DCArtboard id="s-moss"  label="F · Deeper moss"          width={760} height={360}><L06_Lockup a="oklch(0.46 0.06 150)"      b={SOMA_PAPER}                ink={SOMA_INK}  bg={SOMA_PAPER} label="moss / paper"    /></DCArtboard>
        <DCArtboard id="s-ink"   label="G · Ink + paper inverted" width={760} height={360}><L06_Lockup a={SOMA_PAPER}                b={SOMA_INK}                  ink={SOMA_PAPER} bg={SOMA_INK}  label="paper / ink"     /></DCArtboard>
        <DCArtboard id="s-night" label="H · Midnight + bone"      width={760} height={360}><L06_Lockup a="#1B2430"                   b="#E8E2D4"                   ink="#E8E2D4"   bg="#0E1722"   label="night / bone"    /></DCArtboard>
        <DCArtboard id="s-plum"  label="I · Plum"                 width={760} height={360}><L06_Lockup a="oklch(0.42 0.07 340)"      b={SOMA_PAPER}                ink={SOMA_INK}  bg={SOMA_PAPER} label="plum / paper"    /></DCArtboard>
        <DCArtboard id="s-sky"   label="J · Slate sky"            width={760} height={360}><L06_Lockup a="oklch(0.62 0.04 240)"      b={SOMA_INK}                  ink={SOMA_INK}  bg={SOMA_PAPER} label="slate / ink"     /></DCArtboard>
      </DCSection>

      <DCSection id="slate-marks" title="Slate · alternative marks">
        <DCArtboard id="sl1" label="SL1 · Slate dot in 'o'"     width={760} height={360}><SL_DotO /></DCArtboard>
        <DCArtboard id="sl2" label="SL2 · Stacked bars"          width={760} height={360}><SL_Bars /></DCArtboard>
        <DCArtboard id="sl5" label="SL5 · Capsule"               width={900} height={420}><SL_Capsule /></DCArtboard>
      </DCSection>

      <DCSection id="systems" title="Mono · dark · construction">
        <DCArtboard id="m1" label="Mono / minimum size" width={520} height={260}><L_Mono /></DCArtboard>
        <DCArtboard id="d1" label="On dark" width={760} height={360}><L_Dark /></DCArtboard>
        <DCArtboard id="c1" label="Construction · wordmark v1" width={900} height={420}><L_Construction /></DCArtboard>
      </DCSection>
    </DesignCanvas>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
