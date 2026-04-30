import React, {
  useState,
  useRef,
  useEffect,
  useCallback,
} from "react";
import { useSocket } from "../hooks/useSocket.js";
import { useWebRTC } from "../hooks/useWebRTC.js";
import TextChat from "../components/TextChat.jsx";
import Controls from "../components/Controls.jsx";
import StatusOverlay from "../components/StatusOverlay.jsx";
import styles from "./ChatPage.module.css";

/**
 * Connection states
 * idle | requesting | searching | connected | disconnected
 */

export default function ChatPage({ mode = "video", onExit }) {
  const [status, setStatus] = useState("requesting"); // start by requesting permissions
  const [messages, setMessages] = useState([]);
  const [onlineCount, setOnlineCount] = useState(0);
  const [chatOpen, setChatOpen] = useState(false);
  const [unread, setUnread] = useState(0);
  const [reportSent, setReportSent] = useState(false);

  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);

  // ── Socket handlers ──────────────────────────────────────────────────────
  const socketHandlers = {
    connect: () => {
      console.log("[socket] connected");
    },
    waiting: () => {
      setStatus("searching");
    },
    matched: ({ initiator }) => {
      setStatus("connected");
      setMessages([]);
      setReportSent(false);
      if (initiator) {
        // Small delay to ensure both peers are ready
        setTimeout(() => startCall(), 300);
      }
    },
    offer: (data) => handleOffer(data),
    answer: (data) => handleAnswer(data),
    iceCandidate: (data) => handleIceCandidate(data),
    chatMessage: (msg) => {
      setMessages((prev) => [...prev, msg]);
      if (!chatOpen) setUnread((u) => u + 1);
    },
    partnerDisconnected: () => {
      closeConnection();
      setStatus("disconnected");
    },
    onlineCount: (count) => setOnlineCount(count),
    reportConfirmed: () => {
      setReportSent(true);
    },
    blocked: () => {
      alert("You have been blocked due to multiple reports.");
      onExit();
    },
    disconnect: () => {
      setStatus("idle");
    },
  };

  const { emit } = useSocket(socketHandlers);

  const {
    getLocalStream,
    startCall,
    handleOffer,
    handleAnswer,
    handleIceCandidate,
    closeConnection,
    stopLocalStream,
    toggleVideo,
    toggleAudio,
    mediaState,
  } = useWebRTC({ emit, localVideoRef, remoteVideoRef });

  // ── On mount: request permissions and join queue ───────────────────────
  useEffect(() => {
    let cancelled = false;

    async function init() {
      try {
        await getLocalStream(mode);
        if (!cancelled) {
          setStatus("searching");
          emit("joinQueue", { mode });
        }
      } catch (err) {
        if (!cancelled) {
          setStatus("error");
          console.error("[chat] media permission denied:", err);
        }
      }
    }

    init();

    return () => {
      cancelled = true;
    };
  }, []); // eslint-disable-line

  // ── Cleanup on unmount ────────────────────────────────────────────────────
  useEffect(() => {
    return () => {
      closeConnection();
      stopLocalStream();
    };
  }, []); // eslint-disable-line

  // ── Skip / Next ───────────────────────────────────────────────────────────
  const handleSkip = useCallback(() => {
    closeConnection();
    setMessages([]);
    setReportSent(false);
    setStatus("searching");
    emit("skip");
  }, [closeConnection, emit]);

  // ── Send chat message ─────────────────────────────────────────────────────
  const handleSendMessage = useCallback(
    (text) => {
      if (!text.trim()) return;
      emit("chatMessage", { text });
      setMessages((prev) => [
        ...prev,
        { text, from: "me", ts: Date.now() },
      ]);
    },
    [emit]
  );

  // ── Report ────────────────────────────────────────────────────────────────
  const handleReport = useCallback(() => {
    emit("report", { reason: "inappropriate" });
  }, [emit]);

  // ── Open chat (clear unread) ──────────────────────────────────────────────
  const handleToggleChat = () => {
    setChatOpen((o) => !o);
    setUnread(0);
  };

  // ── Exit ──────────────────────────────────────────────────────────────────
  const handleExit = () => {
    closeConnection();
    stopLocalStream();
    onExit();
  };

  const isAudio = mode === "audio";
  const isConnected = status === "connected";

  return (
    <div className={styles.page}>
      {/* Header */}
      <header className={styles.header}>
        <button className={styles.logo} onClick={handleExit} aria-label="Go home">
          hyvigle
        </button>
        {onlineCount > 0 && (
          <div className={styles.onlineCount}>
            <span className={styles.onlineDot} />
            {onlineCount.toLocaleString()} online
          </div>
        )}
      </header>

      {/* Video grid */}
      <div className={`${styles.videoGrid} ${isAudio ? styles.audioMode : ""}`}>
        {/* Remote */}
        <div className={`${styles.videoBox} ${styles.remote}`}>
          {!isAudio && (
            <video
              ref={remoteVideoRef}
              className={styles.video}
              autoPlay
              playsInline
            />
          )}
          {isAudio && isConnected && (
            <div className={styles.audioAvatar}>
              <div className={styles.avatarRing} />
              <div className={styles.avatarInner}>
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M12 1a3 3 0 00-3 3v8a3 3 0 006 0V4a3 3 0 00-3-3z"/>
                  <path d="M19 10v2a7 7 0 01-14 0v-2"/>
                </svg>
              </div>
            </div>
          )}
          <div className={styles.videoLabel}>Stranger</div>
          {!isConnected && (
            <StatusOverlay
              status={status}
              mode={mode}
              onRetry={() => emit("joinQueue", { mode })}
            />
          )}
        </div>

        {/* Local (picture-in-picture) */}
        {!isAudio && (
          <div className={styles.localPip}>
            <video
              ref={localVideoRef}
              className={`${styles.video} ${styles.localVideo}`}
              autoPlay
              playsInline
              muted
            />
            {!mediaState.videoEnabled && (
              <div className={styles.videoOff}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="1" y1="1" x2="23" y2="23"/>
                  <path d="M15 10l4.553-2.069A1 1 0 0121 8.845v6.31a1 1 0 01-1.447.894L15 14"/>
                  <rect x="3" y="8" width="12" height="8" rx="2"/>
                </svg>
              </div>
            )}
            <div className={styles.videoLabel}>You</div>
          </div>
        )}
      </div>

      {/* Controls bar */}
      <Controls
        onSkip={handleSkip}
        onToggleAudio={toggleAudio}
        onToggleVideo={isAudio ? null : toggleVideo}
        onReport={handleReport}
        onToggleChat={handleToggleChat}
        audioEnabled={mediaState.audioEnabled}
        videoEnabled={mediaState.videoEnabled}
        isConnected={isConnected}
        unread={unread}
        reportSent={reportSent}
        mode={mode}
      />

      {/* Text chat panel */}
      {chatOpen && (
        <TextChat
          messages={messages}
          onSend={handleSendMessage}
          onClose={handleToggleChat}
          isConnected={isConnected}
        />
      )}
    </div>
  );
}
