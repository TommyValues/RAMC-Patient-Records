:root {
  --green: #173f2a;
  --green-dark: #0c2418;
  --gold: #c9a646;
  --cream: #f6f1e6;
  --ink: #18211d;
  --muted: #68746e;
  --line: #d8d0bd;
  --danger: #9c1c1c;
  --white: #ffffff;
  font-family: Inter, Segoe UI, Arial, sans-serif;
}
* { box-sizing: border-box; }
body { margin: 0; background: var(--cream); color: var(--ink); }
.hidden { display: none !important; }
.login-page {
  min-height: 100vh; display: grid; place-items: center;
  background: radial-gradient(circle at top, #315d43, var(--green-dark)); padding: 24px;
}
.login-card {
  width: min(760px, 100%); background: rgba(255,255,255,.96); border-radius: 20px;
  padding: 34px; box-shadow: 0 24px 80px rgba(0,0,0,.35); border: 1px solid rgba(201,166,70,.45);
}
.logo-row { display: grid; grid-template-columns: 110px 1fr 110px; gap: 18px; align-items: center; text-align: center; }
h1, h2, h3 { margin: 0; }
.logo-row h1 { color: var(--green); font-size: clamp(1.6rem, 3vw, 2.5rem); }
.logo-row p, .brand p, .ai-box p { color: var(--muted); margin: 6px 0 0; }
.logo-box {
  display: grid; place-items: center; min-height: 92px; padding: 10px;
  border: 2px solid var(--gold); border-radius: 14px; color: var(--gold); background: var(--green);
  font-weight: 800; text-transform: uppercase; letter-spacing: .05em; font-size: .9rem;
}
.logo-box span { font-size: .7rem; color: #efe0a6; }
.logo-box.small { min-height: 54px; min-width: 58px; font-size: .75rem; }
.login-form, .record-form { display: grid; gap: 14px; }
.login-form { margin-top: 28px; }
label { font-weight: 700; display: grid; gap: 6px; }
input, textarea, select {
  width: 100%; border: 1px solid var(--line); border-radius: 10px; padding: 12px;
  font: inherit; background: white; color: var(--ink);
}
textarea { resize: vertical; }
button, .import-label {
  border: 0; border-radius: 10px; padding: 12px 16px; font-weight: 800; cursor: pointer;
  background: var(--green); color: white; text-align: center;
}
button:hover, .import-label:hover { filter: brightness(1.08); }
.secondary { background: #ece5d6; color: var(--green); border: 1px solid var(--line); }
.danger { background: var(--danger); }
.error { color: var(--danger); min-height: 20px; margin: 0; }
.app-header {
  display: flex; justify-content: space-between; align-items: center; gap: 16px;
  padding: 18px 24px; background: var(--green-dark); color: white; border-bottom: 4px solid var(--gold);
}
.brand, .header-actions { display: flex; align-items: center; gap: 14px; }
.toolbar {
  display: grid; grid-template-columns: 1fr auto auto auto; gap: 10px; padding: 16px 24px; background: #fffaf0; border-bottom: 1px solid var(--line);
}
.layout { display: grid; grid-template-columns: 360px 1fr; gap: 18px; padding: 18px 24px 32px; }
.records-panel, .editor-panel { background: white; border: 1px solid var(--line); border-radius: 16px; padding: 18px; box-shadow: 0 10px 30px rgba(23,63,42,.08); }
.record-list { display: grid; gap: 10px; margin-top: 14px; }
.record-card { border: 1px solid var(--line); border-radius: 12px; padding: 12px; cursor: pointer; background: #fffdf8; }
.record-card.active { border-color: var(--gold); box-shadow: inset 4px 0 0 var(--gold); }
.record-card strong { display: block; color: var(--green); }
.record-card span { color: var(--muted); font-size: .9rem; }
.form-header { display: flex; justify-content: space-between; align-items: center; gap: 12px; }
.status { color: var(--muted); font-size: .9rem; }
.grid { display: grid; grid-template-columns: repeat(2, minmax(0,1fr)); gap: 14px; }
.ai-box { display: grid; gap: 12px; border: 1px solid var(--gold); border-radius: 14px; padding: 14px; background: #fff9e8; }
.form-actions { display: flex; gap: 10px; flex-wrap: wrap; }
@media (max-width: 880px) {
  .logo-row, .layout, .toolbar, .grid { grid-template-columns: 1fr; }
  .app-header { align-items: flex-start; flex-direction: column; }
}
