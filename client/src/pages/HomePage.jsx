import React, { useState } from "react";
import styles from "./HomePage.module.css";

export default function HomePage({ onStart }) {
  const [mode, setMode] = useState("video");

  return (
    <div className={styles.page}>
<<<<<<< HEAD
      {/* Background grid */}
      <div className={styles.grid} aria-hidden />

      {/* Hero */}
=======
      <div className={styles.grid} aria-hidden />

>>>>>>> 50a43f1 (Updated files v2)
      <main className={styles.hero}>
        <div className={styles.badge}>Anonymous · Real-time · Free</div>

        <h1 className={styles.title}>
          <span className={styles.titleAccent}>hyvigle</span>
        </h1>

        <p className={styles.tagline}>
          Talk to strangers.<br />
          Instantly. Anonymously.
        </p>

        {/* Mode selector */}
        <div className={styles.modeSelector} role="group" aria-label="Chat mode">
<<<<<<< HEAD
=======

>>>>>>> 50a43f1 (Updated files v2)
          <button
            className={`${styles.modeBtn} ${mode === "video" ? styles.modeBtnActive : ""}`}
            onClick={() => setMode("video")}
          >
<<<<<<< HEAD
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
=======
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
>>>>>>> 50a43f1 (Updated files v2)
              <path d="M15 10l4.553-2.069A1 1 0 0121 8.845v6.31a1 1 0 01-1.447.894L15 14v-4z"/>
              <rect x="3" y="8" width="12" height="8" rx="2"/>
            </svg>
            Video Chat
          </button>
<<<<<<< HEAD
          <button
            className={`${styles.modeBtn} ${mode === "audio" ? styles.modeBtnActive : ""}`}
            onClick={() => setMode("audio")}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 1a3 3 0 00-3 3v8a3 3 0 006 0V4a3 3 0 00-3-3z"/>
              <path d="M19 10v2a7 7 0 01-14 0v-2M12 19v4M8 23h8"/>
            </svg>
            Audio Only
          </button>
        </div>

        <button
          className={styles.startBtn}
          onClick={() => onStart(mode)}
          aria-label="Start chatting"
        >
          <span>Start Chatting</span>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
=======

          <button
            className={`${styles.modeBtn} ${mode === "text" ? styles.modeBtnActive : ""}`}
            onClick={() => setMode("text")}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
            </svg>
            Text Only
          </button>

        </div>

        {/* Mode description */}
        <p className={styles.modeDesc}>
          {mode === "video"
            ? "Share your webcam and talk face-to-face with a stranger."
            : "Chat anonymously via text only — no camera or mic needed."
          }
        </p>

        <button className={styles.startBtn} onClick={() => onStart(mode)}>
          <span>Start Chatting</span>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
>>>>>>> 50a43f1 (Updated files v2)
            <path d="M5 12h14M12 5l7 7-7 7"/>
          </svg>
        </button>

        <p className={styles.disclaimer}>
          By clicking Start, you agree to our{" "}
          <a href="#terms" className={styles.link}>Terms</a> and confirm you are 18+.
          Please be kind and respectful.
        </p>

<<<<<<< HEAD
        {/* Features */}
        <div className={styles.features}>
          <div className={styles.feature}>
            <div className={styles.featureIcon}>⚡</div>
            <div>Instant matching</div>
          </div>
          <div className={styles.feature}>
            <div className={styles.featureIcon}>🔒</div>
            <div>No sign-up needed</div>
          </div>
          <div className={styles.feature}>
            <div className={styles.featureIcon}>🌍</div>
            <div>Global strangers</div>
          </div>
=======
        <div className={styles.features}>
          <div className={styles.feature}><span>⚡</span> Instant matching</div>
          <div className={styles.feature}><span>🔒</span> No sign-up</div>
          <div className={styles.feature}><span>🌍</span> Global strangers</div>
>>>>>>> 50a43f1 (Updated files v2)
        </div>
      </main>

      <footer className={styles.footer}>
        <span>© 2025 Hyvigle</span>
        <span className={styles.dot}>·</span>
        <a href="#privacy" className={styles.link}>Privacy</a>
        <span className={styles.dot}>·</span>
        <a href="#safety" className={styles.link}>Safety</a>
      </footer>
    </div>
  );
}
