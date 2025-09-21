import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
} from "chart.js";
import logo from "./assets/logo.png";

ChartJS.register(LineElement, PointElement, CategoryScale, LinearScale);

export default function MindCareApp() {
  const [user, setUser] = useState({ name: "Guest", role: null });
  return (
    <>
      {user.role ? (
        <Main user={user} setUser={setUser} />
      ) : (
        <RoleSelect setUser={setUser} />
      )}
      <SOSButton />
    </>
  );
}

/* ---------- Role Picker ---------- */
function RoleSelect({ setUser }) {
  const [role, setRole] = useState("User");
  const roles = ["User", "Therapist", "Support Coach", "Admin"];
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-100 via-sky-100 to-white">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/90 rounded-3xl shadow-2xl p-8 w-full max-w-md text-center mx-2"
      >
        <img src={logo} alt="MindCare" className="mx-auto h-16 mb-4" />
        <h1 className="text-3xl font-bold text-emerald-700">MindCare Virtual</h1>
        <p className="text-gray-600 mt-2">
          Choose how you’d like to explore the app
        </p>
        <select
          className="mt-6 w-full border border-emerald-500 bg-emerald-500 rounded-2xl px-4 py-3 text-lg focus:ring-4 focus:ring-emerald-300"
          value={role}
          onChange={(e) => setRole(e.target.value)}
        >
          {roles.map((r) => (
            <option key={r}>{r}</option>
          ))}
        </select>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setUser({ name: "Demo", role })}
          className="mt-6 w-full py-3 bg-gradient-to-r from-emerald-500 to-sky-500 text-white rounded-2xl font-bold"
        >
          Enter
        </motion.button>
      </motion.div>
    </div>
  );
}

/* ---------- Layout ---------- */
function Main({ user, setUser }) {
  const [route, setRoute] = useState(user.role.toLowerCase());
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gradient-to-tr from-emerald-50 via-sky-50 to-white">
      {/* Mobile menu toggle */}
      <div className="md:hidden flex justify-between items-center p-4 bg-white shadow">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="text-emerald-700 font-bold"
        >
          ☰ Menu
        </button>
        <span className="font-bold text-emerald-700">{user.role}</span>
      </div>

      <AnimatePresence>
        {(sidebarOpen || window.innerWidth >= 768) && (
          <Sidebar
            role={user.role}
            route={route}
            setRoute={setRoute}
            setUser={setUser}
            close={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      <main className="flex-1 p-4 md:p-6 overflow-y-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={route}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            {renderRoute(route)}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}

function Sidebar({ role, route, setRoute, setUser, close }) {
  return (
    <motion.aside
      initial={{ x: -250 }}
      animate={{ x: 0 }}
      exit={{ x: -250 }}
      className="fixed md:static z-20 top-0 left-0 h-full w-64 bg-white/90 backdrop-blur-md border-r p-5 shadow-xl flex flex-col"
    >
      <header className="flex items-center gap-3 mb-4">
        <img src={logo} alt="MindCare" className="h-10" />
        <h1 className="text-2xl font-extrabold text-emerald-700">MindCare</h1>
      </header>
      <NavBtn
        label={`${role} Dashboard`}
        active={route === role.toLowerCase()}
        onClick={() => {
          setRoute(role.toLowerCase());
          close();
        }}
      />
      <button
        onClick={() => setUser({ name: "Guest", role: null })}
        className="mt-auto text-sm text-gray-500 hover:underline"
      >
        Log out
      </button>
    </motion.aside>
  );
}

function NavBtn({ label, active, onClick }) {
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      className={`w-full text-left px-4 py-3 rounded-xl mb-1 text-lg transition ${
        active
          ? "bg-emerald-200 text-emerald-900 font-semibold shadow-inner"
          : "hover:bg-emerald-100"
      }`}
      onClick={onClick}
    >
      {label}
    </motion.button>
  );
}

function renderRoute(role) {
  switch (role) {
    case "therapist":
      return <TherapistDash />;
    case "support coach":
      return <CoachDash />;
    case "admin":
      return <AdminDash />;
    default:
      return <UserPortal />;
  }
}

/* ---------- User Portal ---------- */
function UserPortal() {
  return (
    <Section title="Your MindCare Space">
      <QuickAssessment />
      <AISelfHelp />
      <CommunityBoard />
      <SpecialistSuggest />
      <InstantConnect />
      <AIProblemIdentifier />
    </Section>
  );
}

/* ---------- Therapist / Coach / Admin ---------- */
function TherapistDash() {
  return (
    <Section title="Therapist Dashboard">
      <Card>View patient records, case history, and AI referrals.</Card>
      <AnalyticsDemo />
    </Section>
  );
}
function CoachDash() {
  return (
    <Section title="Support Coach Board">
      <Card>Manage group sessions, monitor activity & progress notes.</Card>
    </Section>
  );
}
function AdminDash() {
  return (
    <Section title="Admin Dashboard">
      <Card>Platform controls, user management & therapist onboarding.</Card>
    </Section>
  );
}

/* ---------- Features ---------- */
function QuickAssessment() {
  const [answers, setAnswers] = useState({});
  const [score, setScore] = useState(null);
  const questions = [
    "I often feel overwhelmed",
    "I have trouble sleeping",
    "I enjoy activities as before",
  ];
  const submit = () => {
    const total = Object.values(answers).reduce((a, b) => a + b, 0);
    setScore(total);
  };
  return (
    <Card title="AI Quick Self-Assessment">
      {questions.map((q, i) => (
        <div key={i} className="mb-2">
          <p className="text-sm">{q}</p>
          <select
            className="border border-emerald-300 bg-emerald-50 rounded-lg px-3 py-2 text-sm w-full focus:ring-2 focus:ring-emerald-300"
            onChange={(e) =>
              setAnswers({ ...answers, [i]: Number(e.target.value) })
            }
          >
            <option value="">Select</option>
            {[0, 1, 2, 3].map((v) => (
              <option key={v} value={v}>
                {v}
              </option>
            ))}
          </select>
        </div>
      ))}
      <button
        onClick={submit}
        className="mt-3 bg-emerald-500 text-white px-4 py-2 rounded-xl"
      >
        Analyze
      </button>
      {score !== null && <AICarePlan score={score} />}
    </Card>
  );
}

function AICarePlan({ score }) {
  let msg = "Your responses suggest mild stress. Keep healthy routines.";
  if (score > 4) msg = "Consider connecting with a therapist for further support.";
  if (score > 7) msg = "High stress detected. Immediate professional guidance recommended.";
  return <p className="mt-3 text-sm text-emerald-700 font-medium">{msg}</p>;
}

function AISelfHelp() {
  const [msgs, setMsgs] = useState([
    { from: "ai", text: "Hi, how are you feeling today?" },
  ]);
  const [input, setInput] = useState("");
  const endRef = useRef();
  const send = () => {
    if (!input.trim()) return;
    const txt = input.trim();
    setMsgs((m) => [...m, { from: "user", text: txt }]);
    setInput("");
    setTimeout(() => setMsgs((m) => [...m, { from: "ai", text: aiReply(txt) }]), 600);
  };
  useEffect(() => endRef.current?.scrollIntoView({ behavior: "smooth" }), [msgs]);

  return (
    <Card title="AI Self-Help Coach">
      <div className="max-h-56 overflow-y-auto mb-2 space-y-1">
        {msgs.map((m, i) => (
          <div
            key={i}
            className={`text-sm ${
              m.from === "ai" ? "text-emerald-700" : "text-gray-700 text-right"
            }`}
          >
            {m.text}
          </div>
        ))}
        <div ref={endRef} />
      </div>
      <div className="flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 border border-emerald-300 bg-emerald-50 rounded-xl px-2 py-2"
          placeholder="Type message"
        />
        <button
          onClick={send}
          className="bg-emerald-500 text-white px-4 rounded-xl"
        >
          Send
        </button>
      </div>
    </Card>
  );
}

function CommunityBoard() {
  const [posts, setPosts] = useState([{ id: 1, text: "You are not alone. 🌱" }]);
  const [txt, setTxt] = useState("");
  const post = () => {
    if (!txt.trim()) return;
    setPosts([{ id: Date.now(), text: txt }, ...posts]);
    setTxt("");
  };
  return (
    <Card title="Community Support">
      <div className="max-h-40 overflow-y-auto mb-2 space-y-1">
        {posts.map((p) => (
          <div key={p.id} className="text-sm text-gray-700">• {p.text}</div>
        ))}
      </div>
      <div className="flex gap-2">
        <input
          className="flex-1 border border-emerald-300 bg-emerald-50 rounded-xl px-2 py-2"
          value={txt}
          onChange={(e) => setTxt(e.target.value)}
          placeholder="Share something positive"
        />
        <button
          onClick={post}
          className="bg-emerald-500 text-white px-4 rounded-xl"
        >
          Post
        </button>
      </div>
    </Card>
  );
}

function SpecialistSuggest() {
  const [desc, setDesc] = useState("");
  const [sent, setSent] = useState(false);
  const send = () => {
    if (!desc.trim()) return;
    setSent(true);
  };
  return (
    <Card title="Need Professional Help?">
      {!sent ? (
        <>
          <input
            className="border border-emerald-300 bg-emerald-50 rounded-xl px-3 py-2 w-full mb-2"
            placeholder="Briefly describe your concern"
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
          />
          <button
            onClick={send}
            className="bg-emerald-500 text-white px-4 py-2 rounded-xl"
          >
            Request Specialist Recommendation
          </button>
        </>
      ) : (
        <p className="text-sm text-emerald-700">
          Our AI will match you with a licensed therapist and email the details.
        </p>
      )}
    </Card>
  );
}

function InstantConnect() {
  const [scheduled, setScheduled] = useState(false);
  return (
    <Card title="Instant Connect (Live)">
      {!scheduled ? (
        <button
          onClick={() => setScheduled(true)}
          className="bg-gradient-to-r from-sky-500 to-emerald-500 text-white px-4 py-3 rounded-xl w-full"
        >
          Connect with a Therapist Now
        </button>
      ) : (
        <p className="text-sm text-emerald-700">
          Session scheduled. A therapist will reach you in a few minutes.
        </p>
      )}
    </Card>
  );
}

/* --- New: AI Problem Identifier --- */
function AIProblemIdentifier() {
  const [desc, setDesc] = useState("");
  const [aiText, setAiText] = useState("");
  const analyze = () => {
    if (!desc.trim()) return;
    // Placeholder AI logic
    setAiText(
      "Based on your input, it seems like stress and anxiety are key concerns. A therapist consultation is suggested."
    );
  };
  return (
    <Card title="AI Problem Identifier">
      <textarea
        className="border border-emerald-300 bg-emerald-50 rounded-xl px-3 py-2 w-full mb-2 text-sm"
        placeholder="Describe how you feel"
        value={desc}
        onChange={(e) => setDesc(e.target.value)}
      />
      <button
        onClick={analyze}
        className="bg-emerald-500 text-white px-4 py-2 rounded-xl"
      >
        Analyze
      </button>
      {aiText && <p className="mt-3 text-sm text-emerald-700">{aiText}</p>}
    </Card>
  );
}

/* ---------- Shared ---------- */
function Section({ title, children }) {
  return (
    <div>
      <h2 className="text-3xl font-bold text-emerald-700 mb-4">{title}</h2>
      <div className="grid sm:grid-cols-1 md:grid-cols-2 gap-4">{children}</div>
    </div>
  );
}

function Card({ title, children }) {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="p-5 rounded-2xl bg-white/90 shadow-md"
    >
      {title && <h3 className="font-semibold text-emerald-700 mb-2">{title}</h3>}
      <div className="text-gray-700 text-sm">{children}</div>
    </motion.div>
  );
}

function aiReply(text) {
  const s = text.toLowerCase();
  if (s.includes("sad") || s.includes("depress"))
    return "I'm sorry you're feeling low. Would you like a short grounding exercise?";
  if (s.includes("anx") || s.includes("stress"))
    return "Try the 5-4-3-2-1 grounding: name 5 things you see, 4 you feel, 3 you hear...";
  return "Thanks for sharing. Would you like breathing tips or a meditation link?";
}

function AnalyticsDemo() {
  const data = {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri"],
    datasets: [
      {
        label: "Mood Score",
        data: [3, 4, 2, 5, 4],
        borderColor: "rgb(16,185,129)",
        backgroundColor: "rgba(16,185,129,0.3)",
      },
    ],
  };
  const options = { responsive: true, maintainAspectRatio: false };
  return (
    <Card title="Analytics">
      <div className="h-48">
        <Line data={data} options={options} />
      </div>
    </Card>
  );
}

/* ---------- Floating SOS Button ---------- */
function SOSButton() {
  const [show, setShow] = useState(false);
  return (
    <>
      <button
        onClick={() => setShow(true)}
        className="fixed bottom-6 right-6 bg-red-600 hover:bg-red-700 text-white font-bold rounded-full w-16 h-16 shadow-lg z-30"
      >
        SOS
      </button>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/40 flex items-center justify-center z-40"
        >
          <div className="bg-white rounded-2xl p-6 max-w-sm text-center shadow-xl">
            <h2 className="text-xl font-bold text-red-600 mb-2">Emergency</h2>
            <p className="text-gray-700 mb-4">
              If you feel unsafe or need urgent help, call your local emergency
              services (for example, 112 in India or 911 in the US).
            </p>
            <button
              onClick={() => setShow(false)}
              className="px-4 py-2 bg-emerald-500 text-white rounded-xl"
            >
              Close
            </button>
          </div>
        </motion.div>
      )}
    </>
  );
}
