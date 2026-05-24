import { useState, useEffect, useRef } from "react";

const APPS = [
  { id: 1, name: "Instagram", icon: "📸", category: "Social", color: "#E1306C", limit: 30, used: 47 },
  { id: 2, name: "YouTube", icon: "▶️", category: "Entertainment", color: "#FF0000", limit: 60, used: 38 },
  { id: 3, name: "Twitter", icon: "🐦", category: "Social", color: "#1DA1F2", limit: 20, used: 22 },
  { id: 4, name: "TikTok", icon: "🎵", category: "Entertainment", color: "#010101", limit: 25, used: 51 },
  { id: 5, name: "WhatsApp", icon: "💬", category: "Messaging", color: "#25D366", limit: 45, used: 29 },
  { id: 6, name: "Reddit", icon: "🔴", category: "Social", color: "#FF4500", limit: 20, used: 15 },
];

const WEEKLY = [
  { day: "Mon", hours: 4.2 },
  { day: "Tue", hours: 3.1 },
  { day: "Wed", hours: 5.8 },
  { day: "Thu", hours: 2.9 },
  { day: "Fri", hours: 6.1 },
  { day: "Sat", hours: 7.3 },
  { day: "Sun", hours: 3.4 },
];

const BADGES = [
  { id: 1, icon: "🔥", name: "7-Day Streak", desc: "Focus 7 days straight", earned: true },
  { id: 2, icon: "🧘", name: "Deep Work", desc: "2hr focus session", earned: true },
  { id: 3, icon: "⚡", name: "Speed Demon", desc: "10 Pomodoros in a day", earned: false },
  { id: 4, icon: "🌙", name: "Night Owl", desc: "No phone after 10pm", earned: false },
  { id: 5, icon: "🎯", name: "Goal Crusher", desc: "Hit goals 30 days", earned: false },
  { id: 6, icon: "👑", name: "Digital Monk", desc: "Under 2hrs/day for a week", earned: true },
];

const SESSIONS = [
  { label: "25 min", value: 25, tag: "Pomodoro" },
  { label: "45 min", value: 45, tag: "Deep Work" },
  { label: "90 min", value: 90, tag: "Flow State" },
  { label: "Custom", value: 0, tag: "" },
];

export default function BePresent() {
  const [tab, setTab] = useState("home");
  const [focusActive, setFocusActive] = useState(false);
  const [focusTime, setFocusTime] = useState(25 * 60);
  const [focusTotal, setFocusTotal] = useState(25 * 60);
  const [selectedSession, setSelectedSession] = useState(0);
  const [points, setPoints] = useState(2340);
  const [streak, setStreak] = useState(7);
  const [blockedApps, setBlockedApps] = useState([1, 4]);
  const [showCelebration, setShowCelebration] = useState(false);
  const [goalHours, setGoalHours] = useState(3);
  const timerRef = useRef(null);
  const [timerPaused, setTimerPaused] = useState(false);
  const [completedPomodoros, setCompletedPomodoros] = useState(3);
  const [animIn, setAnimIn] = useState(true);

  useEffect(() => {
    setAnimIn(false);
    const t = setTimeout(() => setAnimIn(true), 10);
    return () => clearTimeout(t);
  }, [tab]);

  useEffect(() => {
    if (focusActive && !timerPaused) {
      timerRef.current = setInterval(() => {
        setFocusTime(t => {
          if (t <= 1) {
            clearInterval(timerRef.current);
            setFocusActive(false);
            setPoints(p => p + 100);
            setCompletedPomodoros(p => p + 1);
            setShowCelebration(true);
            setTimeout(() => setShowCelebration(false), 3000);
            return 0;
          }
          return t - 1;
        });
      }, 1000);
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [focusActive, timerPaused]);

  const fmt = (s) => `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;
  const pct = focusTotal > 0 ? ((focusTotal - focusTime) / focusTotal) * 100 : 0;
  const totalUsed = APPS.reduce((a, b) => a + b.used, 0);
  const overLimit = APPS.filter(a => a.used > a.limit).length;

  const circumference = 2 * Math.PI * 54;

  return (
    <div style={{
      fontFamily: "'Outfit', sans-serif",
      background: "#0A0A0F",
      minHeight: "100vh",
      maxWidth: 420,
      margin: "0 auto",
      color: "#fff",
      position: "relative",
      overflow: "hidden",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&family=Space+Mono:wght@400;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { display: none; }
        
        .tab-btn { background: none; border: none; cursor: pointer; transition: all 0.2s; }
        .tab-btn:hover { transform: scale(1.1); }
        
        .card {
          background: linear-gradient(145deg, #13131A, #1A1A24);
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 20px;
          padding: 20px;
        }
        
        .glow-green { box-shadow: 0 0 20px rgba(74, 222, 128, 0.15); }
        .glow-violet { box-shadow: 0 0 20px rgba(139, 92, 246, 0.2); }
        
        .focus-ring {
          animation: pulse-ring 2s ease-in-out infinite;
        }
        @keyframes pulse-ring {
          0%, 100% { opacity: 0.6; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.02); }
        }
        
        .celebration {
          animation: pop-in 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        @keyframes pop-in {
          0% { transform: scale(0) translateY(20px); opacity: 0; }
          100% { transform: scale(1) translateY(0); opacity: 1; }
        }

        .slide-up {
          animation: slideUp 0.35s cubic-bezier(0.22, 1, 0.36, 1) both;
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(18px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .btn-primary {
          background: linear-gradient(135deg, #6C3DF4, #A855F7);
          border: none;
          border-radius: 16px;
          color: white;
          font-family: 'Outfit', sans-serif;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s;
        }
        .btn-primary:hover { transform: translateY(-2px); filter: brightness(1.1); }
        .btn-primary:active { transform: scale(0.97); }
        
        .btn-green {
          background: linear-gradient(135deg, #22c55e, #16a34a);
          border: none;
          border-radius: 16px;
          color: white;
          font-family: 'Outfit', sans-serif;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s;
        }
        .btn-green:hover { transform: translateY(-2px); filter: brightness(1.1); }
        
        .tag {
          background: rgba(255,255,255,0.07);
          border-radius: 8px;
          padding: 3px 10px;
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.5px;
          color: rgba(255,255,255,0.5);
        }

        .progress-bar-bg {
          background: rgba(255,255,255,0.07);
          border-radius: 99px;
          overflow: hidden;
        }

        .toggle {
          width: 42px;
          height: 24px;
          border-radius: 99px;
          position: relative;
          cursor: pointer;
          transition: background 0.3s;
          border: none;
          flex-shrink: 0;
        }
        .toggle::after {
          content: '';
          position: absolute;
          top: 3px;
          left: 3px;
          width: 18px;
          height: 18px;
          border-radius: 50%;
          background: white;
          transition: transform 0.3s;
        }
        .toggle.on { background: #6C3DF4; }
        .toggle.on::after { transform: translateX(18px); }
        .toggle.off { background: rgba(255,255,255,0.2); }
      `}</style>

      {/* Ambient BG */}
      <div style={{
        position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0,
        background: "radial-gradient(ellipse at 20% 0%, rgba(108,61,244,0.12) 0%, transparent 60%), radial-gradient(ellipse at 80% 100%, rgba(74,222,128,0.08) 0%, transparent 60%)"
      }} />

      {/* Celebration Toast */}
      {showCelebration && (
        <div className="celebration" style={{
          position: "fixed", top: 60, left: "50%", transform: "translateX(-50%)",
          background: "linear-gradient(135deg, #6C3DF4, #A855F7)",
          padding: "14px 28px", borderRadius: 20, zIndex: 100,
          fontWeight: 700, fontSize: 15, textAlign: "center",
          boxShadow: "0 8px 32px rgba(108,61,244,0.5)"
        }}>
          🎉 Session Complete! +100 pts
        </div>
      )}

      {/* Header */}
      <div style={{ padding: "52px 24px 16px", position: "relative", zIndex: 1 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", fontWeight: 500, letterSpacing: 1, textTransform: "uppercase" }}>Good morning</div>
            <div style={{ fontSize: 22, fontWeight: 800, marginTop: 2 }}>Shaik 👋</div>
          </div>
          <div style={{
            background: "linear-gradient(135deg, #6C3DF4, #A855F7)",
            borderRadius: 16, padding: "8px 16px",
            display: "flex", alignItems: "center", gap: 6,
            boxShadow: "0 4px 20px rgba(108,61,244,0.4)"
          }}>
            <span style={{ fontSize: 16 }}>⚡</span>
            <span style={{ fontWeight: 800, fontSize: 16 }}>{points.toLocaleString()}</span>
            <span style={{ fontSize: 11, opacity: 0.7, fontWeight: 500 }}>pts</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: "0 16px 100px", position: "relative", zIndex: 1 }}>
        {tab === "home" && <HomeTab streak={streak} totalUsed={totalUsed} overLimit={overLimit} goalHours={goalHours} points={points} completedPomodoros={completedPomodoros} />}
        {tab === "focus" && <FocusTab focusActive={focusActive} setFocusActive={setFocusActive} focusTime={focusTime} setFocusTime={setFocusTime} focusTotal={focusTotal} setFocusTotal={setFocusTotal} selectedSession={selectedSession} setSelectedSession={setSelectedSession} fmt={fmt} pct={pct} timerPaused={timerPaused} setTimerPaused={setTimerPaused} circumference={circumference} completedPomodoros={completedPomodoros} blockedApps={blockedApps} />}
        {tab === "apps" && <AppsTab apps={APPS} blockedApps={blockedApps} setBlockedApps={setBlockedApps} />}
        {tab === "stats" && <StatsTab weekly={WEEKLY} totalUsed={totalUsed} goalHours={goalHours} apps={APPS} />}
        {tab === "rewards" && <RewardsTab points={points} badges={BADGES} streak={streak} completedPomodoros={completedPomodoros} />}
      </div>

      {/* Bottom Nav */}
      <div style={{
        position: "fixed", bottom: 0, left: "50%", transform: "translateX(-50%)",
        width: "100%", maxWidth: 420,
        background: "rgba(10,10,15,0.92)", backdropFilter: "blur(20px)",
        borderTop: "1px solid rgba(255,255,255,0.07)",
        padding: "10px 0 24px",
        display: "flex", justifyContent: "space-around", alignItems: "center",
        zIndex: 50,
      }}>
        {[
          { id: "home", icon: "🏠", label: "Home" },
          { id: "focus", icon: "🎯", label: "Focus" },
          { id: "apps", icon: "📱", label: "Apps" },
          { id: "stats", icon: "📊", label: "Stats" },
          { id: "rewards", icon: "🏆", label: "Rewards" },
        ].map(({ id, icon, label }) => (
          <button key={id} className="tab-btn" onClick={() => setTab(id)} style={{
            display: "flex", flexDirection: "column", alignItems: "center", gap: 3,
            padding: "6px 12px", borderRadius: 12,
            background: tab === id ? "rgba(108,61,244,0.15)" : "none",
          }}>
            <span style={{ fontSize: 20 }}>{icon}</span>
            <span style={{ fontSize: 10, fontWeight: 600, color: tab === id ? "#A78BFA" : "rgba(255,255,255,0.3)", transition: "color 0.2s" }}>{label}</span>
            {tab === id && <div style={{ width: 4, height: 4, borderRadius: 99, background: "#A78BFA", marginTop: 1 }} />}
          </button>
        ))}
      </div>
    </div>
  );
}

// ───── HOME TAB ─────
function HomeTab({ streak, totalUsed, overLimit, goalHours, points, completedPomodoros }) {
  const usedHours = (totalUsed / 60).toFixed(1);
  const goalPct = Math.min((usedHours / goalHours) * 100, 100);

  return (
    <div className="slide-up" style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      {/* Daily Goal Card */}
      <div className="card" style={{ background: "linear-gradient(135deg, #6C3DF4 0%, #9333EA 100%)", border: "none" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
          <div>
            <div style={{ fontSize: 12, opacity: 0.7, fontWeight: 500, letterSpacing: 0.5 }}>TODAY'S SCREEN TIME</div>
            <div style={{ fontSize: 36, fontWeight: 900, marginTop: 4 }}>{usedHours}h</div>
            <div style={{ fontSize: 13, opacity: 0.7 }}>Goal: {goalHours}h limit</div>
          </div>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 30 }}>🔥</div>
            <div style={{ fontWeight: 800, fontSize: 18 }}>{streak}</div>
            <div style={{ fontSize: 11, opacity: 0.7 }}>day streak</div>
          </div>
        </div>
        <div style={{ background: "rgba(0,0,0,0.2)", borderRadius: 99, height: 8, overflow: "hidden" }}>
          <div style={{ width: `${goalPct}%`, height: "100%", background: goalPct > 90 ? "#FCD34D" : "#4ADE80", borderRadius: 99, transition: "width 1s ease" }} />
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6, fontSize: 11, opacity: 0.6 }}>
          <span>{usedHours}h used</span>
          <span>{Math.max(0, goalHours - usedHours).toFixed(1)}h remaining</span>
        </div>
      </div>

      {/* Quick Stats Row */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
        {[
          { label: "Over Limit", value: overLimit, icon: "⚠️", color: "#F87171" },
          { label: "Pomodoros", value: completedPomodoros, icon: "🍅", color: "#FB923C" },
          { label: "Points", value: `${(points / 1000).toFixed(1)}k`, icon: "⚡", color: "#A78BFA" },
        ].map(({ label, value, icon, color }) => (
          <div key={label} className="card" style={{ textAlign: "center", padding: 14 }}>
            <div style={{ fontSize: 22 }}>{icon}</div>
            <div style={{ fontSize: 20, fontWeight: 800, color, marginTop: 4 }}>{value}</div>
            <div style={{ fontSize: 10, color: "rgba(255,255,255,0.4)", marginTop: 2 }}>{label}</div>
          </div>
        ))}
      </div>

      {/* Today's Top Apps */}
      <div className="card">
        <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 14, color: "rgba(255,255,255,0.6)", letterSpacing: 0.5, textTransform: "uppercase" }}>Top Apps Today</div>
        {APPS.slice(0, 4).map(app => (
          <div key={app.id} style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
            <div style={{ fontSize: 22, width: 36, textAlign: "center" }}>{app.icon}</div>
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                <span style={{ fontWeight: 600, fontSize: 13 }}>{app.name}</span>
                <span style={{ fontSize: 12, color: app.used > app.limit ? "#F87171" : "rgba(255,255,255,0.4)", fontWeight: 600 }}>
                  {app.used}m {app.used > app.limit ? "⚠️" : ""}
                </span>
              </div>
              <div className="progress-bar-bg" style={{ height: 5 }}>
                <div style={{
                  width: `${Math.min((app.used / app.limit) * 100, 100)}%`,
                  height: "100%",
                  background: app.used > app.limit ? "#F87171" : app.color,
                  borderRadius: 99, transition: "width 0.8s ease"
                }} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Insight Card */}
      <div className="card" style={{ borderColor: "rgba(74,222,128,0.2)", background: "linear-gradient(145deg, rgba(74,222,128,0.05), rgba(20,20,30,0.8))" }}>
        <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
          <div style={{ fontSize: 28 }}>💡</div>
          <div>
            <div style={{ fontWeight: 700, marginBottom: 4 }}>Weekly Insight</div>
            <div style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", lineHeight: 1.5 }}>
              You use TikTok 104% over your limit. Try a 30-min focus block before opening social apps.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ───── FOCUS TAB ─────
function FocusTab({ focusActive, setFocusActive, focusTime, setFocusTime, focusTotal, setFocusTotal, selectedSession, setSelectedSession, fmt, pct, timerPaused, setTimerPaused, circumference, completedPomodoros, blockedApps }) {
  const r = 54;
  const strokeDash = circumference - (pct / 100) * circumference;

  const startSession = (idx) => {
    const s = SESSIONS[idx];
    const secs = s.value * 60;
    setFocusTime(secs);
    setFocusTotal(secs);
    setSelectedSession(idx);
    setFocusActive(false);
    setTimerPaused(false);
  };

  return (
    <div className="slide-up" style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      {/* Timer Ring */}
      <div className="card" style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "28px 20px" }}>
        <div style={{ position: "relative", width: 160, height: 160, marginBottom: 20 }}>
          {focusActive && <div className="focus-ring" style={{
            position: "absolute", inset: -8,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(108,61,244,0.2), transparent 70%)",
          }} />}
          <svg width="160" height="160" viewBox="0 0 120 120" style={{ transform: "rotate(-90deg)" }}>
            <circle cx="60" cy="60" r={r} fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="8" />
            <circle cx="60" cy="60" r={r} fill="none"
              stroke={focusActive ? "#6C3DF4" : "#4ADE80"}
              strokeWidth="8" strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDash}
              style={{ transition: "stroke-dashoffset 0.9s linear" }}
            />
          </svg>
          <div style={{
            position: "absolute", inset: 0, display: "flex", flexDirection: "column",
            alignItems: "center", justifyContent: "center"
          }}>
            <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 30, fontWeight: 700, letterSpacing: -1 }}>
              {fmt(focusTime)}
            </div>
            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", marginTop: 2 }}>
              {focusActive ? (timerPaused ? "PAUSED" : "FOCUSING") : "READY"}
            </div>
          </div>
        </div>

        <div style={{ display: "flex", gap: 10 }}>
          {!focusActive ? (
            <button className="btn-primary" onClick={() => setFocusActive(true)} style={{ padding: "13px 32px", fontSize: 15 }}>
              ▶ Start Focus
            </button>
          ) : (
            <>
              <button className="btn-primary" onClick={() => setTimerPaused(p => !p)} style={{ padding: "13px 20px", fontSize: 15 }}>
                {timerPaused ? "▶ Resume" : "⏸ Pause"}
              </button>
              <button onClick={() => { setFocusActive(false); setTimerPaused(false); }} style={{
                background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: 16, padding: "13px 20px", color: "white", cursor: "pointer",
                fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: 15
              }}>
                Stop
              </button>
            </>
          )}
        </div>

        <div style={{ display: "flex", gap: 8, marginTop: 16, fontSize: 12, color: "rgba(255,255,255,0.3)" }}>
          <span>🍅 {completedPomodoros} today</span>
          <span>·</span>
          <s
