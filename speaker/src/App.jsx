import React, { useState } from "react";

export default function App() {
  const [text, setText] = useState("");
  const [voices, setVoices] = useState([]);
  const [voiceName, setVoiceName] = useState("");
  const [rate, setRate] = useState(1);
  const [pitch, setPitch] = useState(1);
  const [loadingVoices, setLoadingVoices] = useState(false);

  // 🔥 MOBILE SAFE voice loader
  const loadVoices = () => {
    const v = window.speechSynthesis.getVoices();
    if (v.length) {
      setVoices(v);
      setVoiceName(v[0].name);
      setLoadingVoices(false);
      return true;
    }
    return false;
  };

  const speak = () => {
    if (!text.trim()) return;

    // 📱 Mobile fix: load voices on click
    if (!voices.length) {
      setLoadingVoices(true);
      const ok = loadVoices();
      if (!ok) {
        setTimeout(speak, 300);
      }
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);

    const voice = voices.find(v => v.name === voiceName);
    if (voice) {
      utterance.voice = voice;
    } else {
      // 🍏 iOS fallback
      utterance.lang = "uz-UZ";
    }

    utterance.rate = rate;
    utterance.pitch = pitch;

    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white">
      <div className="w-full max-w-xl p-6 rounded-3xl border border-cyan-500/40 bg-black/70 backdrop-blur-xl shadow-2xl neon-glow">

        <h1 className="text-4xl font-bold text-center mb-6 neon-text-glow">
          🔊 NEON VOICE
        </h1>

        <textarea
          className="w-full min-h-[140px] p-4 rounded-xl bg-black border border-pink-500/40 outline-none"
          placeholder="Matnni yozing..."
          value={text}
          onChange={e => setText(e.target.value)}
        />

        {/* Voice select */}
        <div className="mt-4">
          <label className="text-sm text-cyan-400">OVOZ</label>
          <select
            className="w-full mt-2 p-3 rounded-xl bg-black border border-cyan-500/40"
            value={voiceName}
            onChange={e => setVoiceName(e.target.value)}
            disabled={!voices.length}
          >
            {voices.length === 0 && (
              <option>Ovoz yuklanadi...</option>
            )}
            {voices.map(v => (
              <option key={v.name} value={v.name}>
                {v.lang} — {v.name}
              </option>
            ))}
          </select>
        </div>

        {/* Rate */}
        <div className="mt-4">
          <label className="text-sm text-cyan-400">
            Tezlik: {rate.toFixed(1)}x
          </label>
          <input
            type="range"
            min="0.5"
            max="2"
            step="0.1"
            value={rate}
            onChange={e => setRate(+e.target.value)}
            className="w-full"
          />
        </div>

        {/* Pitch */}
        <div className="mt-4">
          <label className="text-sm text-cyan-400">
            Ohang: {pitch.toFixed(1)}
          </label>
          <input
            type="range"
            min="0"
            max="2"
            step="0.1"
            value={pitch}
            onChange={e => setPitch(+e.target.value)}
            className="w-full"
          />
        </div>

        <button
          onClick={speak}
          disabled={!text.trim()}
          className="mt-6 w-full py-4 rounded-2xl font-bold text-lg bg-gradient-to-r from-cyan-500 to-pink-500 neon-button-glow"
        >
          {loadingVoices ? "YUKLANMOQDA..." : "▶️ O‘QIB BER"}
        </button>
      </div>

      {/* ✅ ODDIY STYLE (mobile safe) */}
      <style>{`
        .neon-glow {
          box-shadow: 0 0 30px rgba(0,255,255,.4);
        }
        .neon-text-glow {
          text-shadow: 0 0 12px rgba(0,255,255,.8);
        }
        .neon-button-glow {
          box-shadow: 0 0 40px rgba(255,0,255,.6);
        }
      `}</style>
    </div>
  );
}
