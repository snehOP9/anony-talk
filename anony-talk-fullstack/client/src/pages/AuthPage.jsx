import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import "./AuthPage.css";

const API = "";

export default function AuthPage() {
  const { login: authLogin } = useAuth();
  const [tab, setTab] = useState("login");
  const [ageGroup, setAgeGroup] = useState(null);
  const [loading, setLoading] = useState(false);
  const [ghostLoading, setGhostLoading] = useState(false);
  const [feedback, setFeedback] = useState({ type: "", msg: "" });

  const [login, setLogin] = useState({ email: "", password: "" });
  const [register, setRegister] = useState({
    username: "", email: "", password: "", confirm: "", age: "",
  });

  const clearFeedback = () => setFeedback({ type: "", msg: "" });

  const switchTab = (t) => {
    setTab(t);
    clearFeedback();
    setAgeGroup(null);
  };

  const pickGroup = (g) => {
    setAgeGroup(g);
    if (!register.age) {
      setRegister((p) => ({ ...p, age: g === "teen" ? "15" : "22" }));
    }
  };

  const handleAgeInput = (val) => {
    setRegister((p) => ({ ...p, age: val }));
    const n = parseInt(val);
    if (n >= 12 && n <= 19) setAgeGroup("teen");
    else if (n >= 20 && n <= 25) setAgeGroup("adult");
    else setAgeGroup(null);
  };

  const redirect = (ageGrp) => {
    if (ageGrp === "teen") window.location.href = "/teen-space";
    else if (ageGrp === "young-adult") window.location.href = "/young-adult-space";
    else window.location.href = "/dashboard";
  };

  // ── Login ──────────────────────────────────────────────────────────────────
  const doLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    clearFeedback();
    try {
      const res = await fetch(`${API}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: login.email, password: login.password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setFeedback({ type: "error", msg: data.message });
      } else {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        authLogin(data.user);
        setFeedback({ type: "success", msg: data.message });
        setTimeout(() => redirect(data.user.ageGroup), 1000);
      }
    } catch {
      setFeedback({ type: "error", msg: "Network error — is the server running?" });
    }
    setLoading(false);
  };

  // ── Register ───────────────────────────────────────────────────────────────
  const doRegister = async (e) => {
    e.preventDefault();
    clearFeedback();

    let age = parseInt(register.age);
    if (!register.age && ageGroup === "teen") age = 16;
    if (!register.age && ageGroup === "adult") age = 22;

    if (!ageGroup && (!register.age || isNaN(age)))
      return setFeedback({ type: "error", msg: "Please select your age group above." });
    if (age < 12 || age > 25)
      return setFeedback({ type: "error", msg: "Age must be between 12 and 25." });
    if (register.password !== register.confirm)
      return setFeedback({ type: "error", msg: "Passwords don't match." });
    if (register.password.length < 6)
      return setFeedback({ type: "error", msg: "Password must be at least 6 characters." });

    setLoading(true);
    try {
      const res = await fetch(`${API}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: register.username,
          email: register.email,
          password: register.password,
          age,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setFeedback({ type: "error", msg: data.message });
      } else {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        authLogin(data.user);
        setFeedback({ type: "success", msg: data.message });
        setTimeout(() => redirect(data.user.ageGroup), 1200);
      }
    } catch {
      setFeedback({ type: "error", msg: "Network error — is the server running?" });
    }
    setLoading(false);
  };

  // ── Ghost ──────────────────────────────────────────────────────────────────
  const doGhost = async () => {
    setGhostLoading(true);
    clearFeedback();
    const savedToken = localStorage.getItem("ghostToken");
    try {
      let res, data;
      if (savedToken) {
        res = await fetch(`${API}/api/auth/ghost/resume`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ghostToken: savedToken }),
        });
        data = await res.json();
      }
      if (!savedToken || !res.ok) {
        res = await fetch(`${API}/api/auth/ghost`, { method: "POST" });
        data = await res.json();
      }
      if (res.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        authLogin(data.user);
        if (data.ghostToken) localStorage.setItem("ghostToken", data.ghostToken);
        redirect(data.user.ageGroup);
      } else {
        setFeedback({ type: "error", msg: "Could not start ghost session. Try again." });
      }
    } catch {
      setFeedback({ type: "error", msg: "Network error — is the server running?" });
    }
    setGhostLoading(false);
  };

  return (
    <div className="auth-root">

      {/* Navbar */}
      <nav className="auth-nav">
        <div className="nav-logo">
          <span>🧠</span>
          <span className="nav-logo-name">AnonyTalk</span>
        </div>
        <a className="nav-back" href="/">← Back to home</a>
      </nav>

      <div className="auth-wrapper">

        {/* Privacy Banner */}
        <div className="privacy-banner">
          <span className="privacy-icon">🔒</span>
          <p className="privacy-text">
            <strong>Your privacy is our promise.</strong> All information you share with us is
            completely safe, encrypted, and will{" "}
            <strong>never be shared, sold, or shown to anyone</strong> — not even our team
            can see your personal details. We are committed to protecting your anonymity
            100%, always.
          </p>
        </div>

        {/* Card */}
        <div className="auth-card">

          <div className="card-head">
            <div className="card-icon">💬</div>
            <h1>Your Safe Space Awaits</h1>
            <p>Speak freely. No judgment. Completely anonymous.</p>
          </div>

          {/* Tabs */}
          <div className="auth-tabs">
            <button
              className={`auth-tab ${tab === "login" ? "active" : ""}`}
              onClick={() => switchTab("login")}
            >Log In</button>
            <button
              className={`auth-tab ${tab === "register" ? "active" : ""}`}
              onClick={() => switchTab("register")}
            >Sign Up</button>
          </div>

          {/* ══ LOGIN FORM ══ */}
          {tab === "login" && (
            <form className="auth-form" onSubmit={doLogin}>
              <div className="field">
                <label>Email</label>
                <input
                  type="email" placeholder="your@email.com"
                  value={login.email}
                  onChange={(e) => setLogin({ ...login, email: e.target.value })}
                  required
                />
              </div>
              <div className="field">
                <label>Password</label>
                <input
                  type="password" placeholder="••••••••"
                  value={login.password}
                  onChange={(e) => setLogin({ ...login, password: e.target.value })}
                  required
                />
              </div>

              {feedback.msg && (
                <div className={`feedback ${feedback.type}`}>
                  {feedback.type === "error" ? "⚠ " : "✓ "}{feedback.msg}
                </div>
              )}

              <button className="btn-primary" type="submit" disabled={loading}>
                {loading ? <span className="spinner" /> : "Enter my space →"}
              </button>

              <div className="or-row"><span>or</span></div>

              <button className="btn-ghost" type="button" onClick={doGhost} disabled={ghostLoading}>
                {ghostLoading ? <span className="spinner ghost-spin" /> : "👻 Continue as Ghost"}
              </button>
              <p className="ghost-note">No sign-up needed · nothing stored · fully invisible</p>
            </form>
          )}

          {/* ══ REGISTER FORM ══ */}
          {tab === "register" && (
            <form className="auth-form" onSubmit={doRegister}>
              <div className="field">
                <label>Nickname</label>
                <input
                  type="text" placeholder="pick a name you like 🎭"
                  value={register.username}
                  onChange={(e) => setRegister({ ...register, username: e.target.value })}
                  required
                />
              </div>
              <div className="field">
                <label>Email</label>
                <input
                  type="email" placeholder="your@email.com"
                  value={register.email}
                  onChange={(e) => setRegister({ ...register, email: e.target.value })}
                  required
                />
              </div>
              <div className="field">
                <label>Password</label>
                <input
                  type="password" placeholder="min. 6 characters"
                  value={register.password}
                  onChange={(e) => setRegister({ ...register, password: e.target.value })}
                  required
                />
              </div>
              <div className="field">
                <label>Confirm Password</label>
                <input
                  type="password" placeholder="repeat your password"
                  value={register.confirm}
                  onChange={(e) => setRegister({ ...register, confirm: e.target.value })}
                  required
                />
              </div>

              {/* Age Group */}
              <div className="age-section">
                <div className="section-label">I am in the age group of</div>
                <div className="age-tiles">
                  <div
                    className={`age-tile cyan-tile ${ageGroup === "teen" ? "selected" : ""}`}
                    onClick={() => pickGroup("teen")}
                  >
                    <div className="tile-dot">✓</div>
                    <div className="tile-emoji">🌱</div>
                    <div className="tile-range">12 – 19</div>
                    <div className="tile-sub">School &amp; Teen</div>
                  </div>
                  <div
                    className={`age-tile purple-tile ${ageGroup === "adult" ? "selected" : ""}`}
                    onClick={() => pickGroup("adult")}
                  >
                    <div className="tile-dot">✓</div>
                    <div className="tile-emoji">✨</div>
                    <div className="tile-range">20 – 25</div>
                    <div className="tile-sub">Young Adult</div>
                  </div>
                </div>
                <div className="divider"><span>or enter your exact age</span></div>
                <div className="age-wrap">
                  <span className="age-prefix">My exact age is</span>
                  <input
                    className="age-input"
                    type="number" placeholder="e.g. 17"
                    min="12" max="25"
                    value={register.age}
                    onChange={(e) => handleAgeInput(e.target.value)}
                  />
                </div>
              </div>

              {feedback.msg && (
                <div className={`feedback ${feedback.type}`}>
                  {feedback.type === "error" ? "⚠ " : "✓ "}{feedback.msg}
                </div>
              )}

              <button className="btn-primary" type="submit" disabled={loading}>
                {loading ? <span className="spinner" /> : "Create my safe space ✨"}
              </button>

              <div className="or-row"><span>or</span></div>

              <button className="btn-ghost" type="button" onClick={doGhost} disabled={ghostLoading}>
                {ghostLoading ? <span className="spinner ghost-spin" /> : "👻 Continue as Ghost — no details needed"}
              </button>
              <p className="ghost-note">Skip sign-up · browse fully anonymously · nothing is saved about you</p>
            </form>
          )}

          {/* Footer */}
          <div className="auth-footer">
            <p>🔒 End-to-end anonymous · Zero judgment · You are never alone</p>
            <div className="crisis-bar">
              Feeling unsafe right now? Please reach out —<br />
              iCall India <a href="tel:9152987821">9152987821</a>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
