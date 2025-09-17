import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import logo from "./assets/logo.png";

export default function MindCareApp() {
  // user includes role, but role starts as null until chosen
  const [user, setUser] = useState({ name: "Guest", location: "Bengaluru", role: null });

  if (!user.role) {
    // show initial role selection screen
    return <RoleSelector setUser={setUser} />;
  }

  return <MindCarePrototype user={user} setUser={setUser} />;
}

/* --------------------------------------------------- */
/* ---------- Role Selector (first screen) ----------- */
function RoleSelector({ setUser }) {
  const [selected, setSelected] = useState("Guest");

  function startApp() {
    setUser({ name: "Guest", location: "Bengaluru", role: selected });
  }

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-indigo-100 via-sky-100 to-rose-100">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/70 backdrop-blur-lg p-8 rounded-2xl shadow-xl max-w-md w-full text-center"
      >
        <img src={logo} alt="MindCare Logo" className="mx-auto h-16 mb-4 drop-shadow" />
        <h1 className="text-2xl font-bold text-indigo-700">Welcome to MindCare</h1>
        <p className="mt-2 text-gray-600">Select your role to continue</p>

        <select
          value={selected}
          onChange={(e) => setSelected(e.target.value)}
          className="mt-6 w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-300"
        >
          <option value="Guest">Guest</option>
          <option value="Therapist">Therapist</option>
          <option value="Admin">Admin</option>
        </select>

        <button
          onClick={startApp}
          className="mt-6 w-full py-2 bg-gradient-to-r from-indigo-500 to-violet-500 text-white font-semibold rounded-xl shadow hover:opacity-90 transition"
        >
          Enter App
        </button>
      </motion.div>
    </div>
  );
}

/* --------------------------------------------------- */
/* ---------- Main MindCare Prototype ---------------- */
function MindCarePrototype({ user, setUser }) {
  const [route, setRoute] = useState("home");
  const [chatMessages, setChatMessages] = useState([
    { id: 1, from: "ai", text: "Hi — I’m MindCare. How are you feeling today?", time: now() },
  ]);
  const [messageText, setMessageText] = useState("");
  const [therapists] = useState(sampleTherapists());
  const [selectedTherapist, setSelectedTherapist] = useState(null);
  const [showSOSConfirm, setShowSOSConfirm] = useState(false);
  const [holdingSOS, setHoldingSOS] = useState(false);
  const holdTimer = useRef(null);

  useEffect(() => () => clearTimeout(holdTimer.current), []);

  function sendMessage() {
    if (!messageText.trim()) return;
    const text = messageText.trim();
    setChatMessages((prev) => [
      ...prev,
      { id: Date.now(), from: "user", text, time: now() },
    ]);
    setMessageText("");
    setTimeout(
      () =>
        setChatMessages((prev) => [
          ...prev,
          { id: Date.now() + 1, from: "ai", text: aiReply(text), time: now() },
        ]),
      900
    );
  }

  function startHoldSOS() {
    setHoldingSOS(true);
    holdTimer.current = setTimeout(() => {
      setHoldingSOS(false);
      setShowSOSConfirm(true);
    }, 2500);
  }
  function cancelHoldSOS() {
    clearTimeout(holdTimer.current);
    setHoldingSOS(false);
  }
  function confirmSOS() {
    setShowSOSConfirm(false);
    setChatMessages((prev) => [
      ...prev,
      {
        id: Date.now(),
        from: "system",
        text: "Connecting you to the 24/7 crisis helpline (Tele-MANAS) — demo.",
        time: now(),
      },
    ]);
    setRoute("chat");
  }

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-indigo-100 via-sky-100 to-rose-100">
      {/* Sidebar */}
      <aside className="hidden md:flex flex-col w-72 backdrop-blur-2xl bg-white/60 border-r border-white/40 p-5 shadow-xl">
        <header className="flex items-center gap-3">
          <img src={logo} alt="MindCare logo" className="h-10 w-auto drop-shadow" />
          <div>
            <h1 className="text-2xl font-extrabold text-indigo-700 tracking-tight">
              MindCare
            </h1>
            <p className="text-sm text-gray-600">Your bridge to wellness</p>
          </div>
        </header>

        <nav className="mt-6 space-y-1">
          {["home", "chat", "directory", "sessions", "settings"].map((r) => (
            <NavButton
              key={r}
              label={navLabel[r]}
              active={route === r}
              onClick={() => setRoute(r)}
            />
          ))}
        </nav>

        <div className="mt-6">
          <h3 className="text-xs text-gray-600 uppercase">Quick Actions</h3>
          <div className="mt-2 flex gap-2">
            <button
              onMouseDown={startHoldSOS}
              onMouseUp={cancelHoldSOS}
              onMouseLeave={cancelHoldSOS}
              className="flex-1 py-2 rounded-xl bg-gradient-to-r from-rose-500 to-rose-600 text-white font-semibold shadow hover:from-rose-600 hover:to-rose-700 transition"
              aria-pressed={holdingSOS}
            >
              SOS (hold)
            </button>
            <button
              className="flex-1 py-2 rounded-xl border border-indigo-200 hover:bg-indigo-50 transition"
              onClick={() => setRoute("directory")}
            >
              Find Help
            </button>
          </div>
        </div>

        <p className="mt-6 text-xs text-gray-400">
          Prototype demo only. Integrate secure APIs for live use.
        </p>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-4 md:p-8 overflow-x-hidden">
        <div className="max-w-5xl mx-auto">
          <AnimatePresence mode="wait">
            {route === "home" && (
              <motion.div
                key="home"
                initial={{ opacity: 0, y: 25 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
              >
                <Home user={user} setRoute={setRoute} />
              </motion.div>
            )}
            {route === "chat" && (
              <motion.div key="chat" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <Chat
                  messages={chatMessages}
                  text={messageText}
                  setText={setMessageText}
                  onSend={sendMessage}
                />
              </motion.div>
            )}
            {route === "directory" && (
              <motion.div key="dir" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <Directory
                  therapists={therapists}
                  onOpen={setSelectedTherapist}
                  setRoute={setRoute}
                />
              </motion.div>
            )}
            {route === "therapist" && selectedTherapist && (
              <motion.div key="therapist" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}>
                <Therapist t={selectedTherapist} onBack={() => setRoute("directory")} />
              </motion.div>
            )}
            {route === "sessions" && (
              <motion.div key="notes" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <Notes />
              </motion.div>
            )}
            {route === "settings" && (
              <motion.div key="settings" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <Settings user={user} setUser={setUser} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      <MobileBar setRoute={setRoute} startHoldSOS={startHoldSOS} cancelHoldSOS={cancelHoldSOS} />

      <AnimatePresence>
        {showSOSConfirm && (
          <Modal
            title="Confirm SOS"
            onClose={() => setShowSOSConfirm(false)}
            confirmSOS={confirmSOS}
          >
            <p className="text-sm">
              We will connect you to a 24/7 crisis helpline. This is not a
              replacement for local emergency services.
            </p>
          </Modal>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ----------------- Reusable Components ----------------- */
function NavButton({ label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`w-full text-left px-3 py-2 rounded-xl transition-colors ${
        active
          ? "bg-indigo-200/70 text-indigo-900 font-medium shadow-inner"
          : "hover:bg-indigo-100/50"
      }`}
    >
      {label}
    </button>
  );
}

function Home({ user, setRoute }) {
  return (
    <div>
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">
            Welcome back, {user.name}
          </h2>
          <p className="text-sm text-gray-500">
            Location: {user.location} • Role: {user.role}
          </p>
        </div>
        <button
          onClick={() => setRoute("chat")}
          className="px-5 py-2 rounded-full bg-gradient-to-r from-indigo-500 to-violet-500 text-white font-semibold shadow hover:opacity-90 transition"
        >
          Chat with AI
        </button>
      </div>

      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-5">
        {[
          {
            title: "Quick Check-in",
            text: "Use the AI for a quick mood check-in and suggestions.",
            route: "chat",
          },
          {
            title: "Find a Specialist",
            text: "Browse therapists by location, language and price.",
            route: "directory",
          },
          {
            title: "Resources & Exercises",
            text: "Guided self-help techniques and daily routines.",
            route: null,
          },
        ]
          // Example of role-based filtering (Admin sees all, Guest sees limited)
          .filter((card) => (user.role === "Guest" ? card.title !== "Resources & Exercises" : true))
          .map((c, i) => (
            <motion.div key={i} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
              <Card title={c.title} onClick={() => c.route && setRoute(c.route)}>
                {c.text}
              </Card>
            </motion.div>
          ))}
      </div>
    </div>
  );
}

function Card({ title, children, onClick }) {
  return (
    <div
      onClick={onClick}
      className="p-5 rounded-2xl bg-white/70 backdrop-blur-md shadow-md hover:shadow-xl cursor-pointer transition"
    >
      <h3 className="font-semibold text-indigo-700">{title}</h3>
      <p className="text-sm text-gray-700 mt-1">{children}</p>
    </div>
  );
}

function Chat({ messages, text, setText, onSend }) {
  const bottomRef = useRef();
  useEffect(() => bottomRef.current?.scrollIntoView({ behavior: "smooth" }), [messages]);

  return (
    <div className="backdrop-blur-md bg-white/70 rounded-2xl p-5 shadow-md">
      <h3 className="font-semibold text-indigo-700 text-lg">AI Support</h3>
      <div className="mt-4 max-h-96 overflow-y-auto space-y-2 p-3 bg-indigo-50/60 rounded-xl">
        {messages.map((m) => (
          <motion.div
            key={m.id}
            initial={{ opacity: 0, x: m.from === "user" ? 30 : -30 }}
            animate={{ opacity: 1, x: 0 }}
            className={`p-2 rounded-xl ${
              m.from === "user" ? "bg-white/80 text-right" : "bg-indigo-100/80"
            }`}
          >
            <div className="text-sm">{m.text}</div>
            <div className="text-xs text-gray-400 mt-1">{m.time}</div>
          </motion.div>
        ))}
        <div ref={bottomRef} />
      </div>
      <div className="mt-3 flex gap-2">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type a message"
          className="flex-1 px-3 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-300"
        />
        <button
          onClick={onSend}
          className="px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-500 text-white hover:opacity-90 transition"
        >
          Send
        </button>
      </div>
    </div>
  );
}

function Directory({ therapists, onOpen, setRoute }) {
  return (
    <div>
      <h3 className="text-lg font-semibold text-indigo-700">Find a Specialist</h3>
      <div className="mt-4 space-y-3">
        {therapists.map((t) => (
          <motion.div
            key={t.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 rounded-2xl bg-white/70 backdrop-blur-md flex justify-between items-center shadow hover:shadow-lg transition"
          >
            <div>
              <div className="font-medium">{t.name} — {t.qualification}</div>
              <div className="text-sm text-gray-500">
                {t.location} · {t.price} · {t.languages.join(", ")}
              </div>
            </div>
            <button
              onClick={() => {
                onOpen(t);
                setRoute("therapist");
              }}
              className="px-3 py-1 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700"
            >
              View
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function Therapist({ t, onBack }) {
  return (
    <div className="bg-white/70 backdrop-blur-md p-5 rounded-2xl shadow">
      <button onClick={onBack} className="text-sm text-gray-500 mb-3 hover:underline">
        ← Back
      </button>
      <h3 className="text-xl font-semibold">{t.name}</h3>
      <p className="text-sm text-gray-500">{t.qualification} • {t.location}</p>
      <p className="mt-3 text-sm text-gray-700">{t.bio}</p>
      <div className="mt-4 flex gap-2">
        <button className="px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700">
          Start Tele-consultation
        </button>
        <button className="px-4 py-2 border rounded-xl hover:bg-gray-50">
          Message
        </button>
      </div>
    </div>
  );
}

function Notes() {
  const demo = [
    { id: 1, title: "Session 2025-09-10", snippet: "S: Patient reports…" },
    { id: 2, title: "Session 2025-09-03", snippet: "S: Improved sleep…" },
  ];
  return (
    <div>
      <h3 className="text-lg font-semibold text-indigo-700">Saved Notes</h3>
      <div className="mt-3 space-y-3">
        {demo.map((n) => (
          <motion.div
            key={n.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 rounded-2xl bg-white/70 backdrop-blur-md shadow hover:shadow-lg transition"
          >
            <div className="font-medium">{n.title}</div>
            <div className="text-sm text-gray-500">{n.snippet}</div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function Settings({ user, setUser }) {
  return (
    <div className="bg-white/70 backdrop-blur-md p-5 rounded-2xl shadow">
      <h3 className="text-lg font-semibold text-indigo-700">Settings & Privacy</h3>
      <label className="block mt-4 text-sm font-medium">Display name</label>
      <input
        value={user.name}
        onChange={(e) => setUser({ ...user, name: e.target.value })}
        className="mt-1 px-3 py-2 border rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-indigo-300"
      />
      <label className="block mt-4 text-sm font-medium">Location</label>
      <input
        value={user.location}
        onChange={(e) => setUser({ ...user, location: e.target.value })}
        className="mt-1 px-3 py-2 border rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-indigo-300"
      />
    </div>
  );
}

function Modal({ title, children, onClose, confirmSOS }) {
  return (
    <motion.div
      className="fixed inset-0 flex items-center justify-center bg-black/50 z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white p-6 rounded-2xl shadow-lg max-w-md text-center"
      >
        <h3 className="text-lg font-semibold text-gray-800 mb-3">{title}</h3>
        <div className="text-gray-600 mb-4">{children}</div>
        <div className="flex justify-center gap-4">
          <button
            className="px-4 py-2 bg-rose-600 text-white rounded-xl hover:bg-rose-700"
            onClick={confirmSOS}
          >
            Connect
          </button>
          <button
            className="px-4 py-2 border rounded-xl hover:bg-gray-50"
            onClick={onClose}
          >
            Cancel
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

function MobileBar({ setRoute, startHoldSOS, cancelHoldSOS }) {
  return (
    <div className="md:hidden fixed bottom-4 left-1/2 -translate-x-1/2 w-[92%]">
      <div className="backdrop-blur-md bg-white/70 p-3 rounded-2xl shadow-lg flex justify-around">
        <button onClick={() => setRoute("home")} className="font-medium text-indigo-700">
          Home
        </button>
        <button onClick={() => setRoute("chat")} className="font-medium text-indigo-700">
          Chat
        </button>
        <button
          onTouchStart={startHoldSOS}
          onTouchEnd={cancelHoldSOS}
          className="px-4 py-1 bg-rose-600 text-white rounded-xl font-medium"
        >
          SOS
        </button>
      </div>
    </div>
  );
}

/* ----------------- Helpers ----------------- */
const navLabel = {
  home: "Home",
  chat: "Chat with AI",
  directory: "Find a Specialist",
  sessions: "Sessions / Notes",
  settings: "Settings",
};

function sampleTherapists() {
  return [
    {
      id: 1,
      name: "Dr. Aisha Rao",
      qualification: "MD Psychiatry",
      location: "Mumbai",
      price: "₹800 / session",
      languages: ["English", "Hindi"],
      bio: "Specialist in mood disorders and tele-psychiatry.",
    },
    {
      id: 2,
      name: "Mr. Vikram Sen",
      qualification: "Clinical Psychologist",
      location: "Kolkata",
      price: "₹600 / session",
      languages: ["English", "Bengali"],
      bio: "CBT and trauma-informed therapy.",
    },
  ];
}

function aiReply(text) {
  const s = text.toLowerCase();
  if (s.includes("sad") || s.includes("depress"))
    return "I’m sorry you’re feeling that way. When did this start?";
  if (s.includes("anx") || s.includes("nerv"))
    return "Anxiety can be tough. Try a grounding exercise: name 5 things you see.";
  return "Thanks for sharing — would you like a breathing exercise or to connect with a specialist?";
}

const now = () => new Date().toLocaleTimeString();
