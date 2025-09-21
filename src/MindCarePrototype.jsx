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

/* ---------------- Main App ---------------- */
export default function MindCareApp() {
  const [user, setUser] = useState({ name: "Guest", role: null });
  return user.role ? (
    <Main user={user} setUser={setUser} />
  ) : (
    <RoleSelect setUser={setUser} />
  );
}

/* ---------------- Role Selection ---------------- */
function RoleSelect({ setUser }) {
  const roles = ["Guest", "Therapist", "Doctor", "Nurse", "Admin"];
  const [role, setRole] = useState("Guest");
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-100 via-sky-100 to-white">
      <motion.div
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-white/80 p-8 rounded-3xl shadow-2xl max-w-md w-full text-center"
      >
        <img src={logo} alt="logo" className="mx-auto h-20 mb-6" />
        <h1 className="text-3xl font-bold text-emerald-700">MindCare</h1>
        <p className="text-gray-600 mt-2">Select your role to explore</p>
        <select
          className="mt-6 w-full border rounded-2xl px-4 py-3 focus:ring-4 focus:ring-emerald-300"
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

/* ---------------- Layout ---------------- */
function Main({ user, setUser }) {
  const [route, setRoute] = useState(defaultRoute(user.role));
  return (
    <div className="min-h-screen flex bg-gradient-to-tr from-emerald-50 via-sky-50 to-white">
      <Sidebar role={user.role} route={route} setRoute={setRoute} setUser={setUser} />
      <main className="flex-1 p-6 overflow-y-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={route}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            {renderRoute(route, user.role)}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}

function Sidebar({ role, route, setRoute, setUser }) {
  return (
    <aside className="hidden md:flex flex-col w-72 backdrop-blur-xl bg-white/70 border-r p-5 shadow-xl">
      <header className="flex items-center gap-3 mb-4">
        <img src={logo} alt="MindCare" className="h-12" />
        <h1 className="text-2xl font-extrabold text-emerald-700">MindCare</h1>
      </header>
      {navItems(role).map((n) => (
        <NavBtn key={n.key} label={n.label} active={route === n.key} onClick={() => setRoute(n.key)} />
      ))}
      <button
        onClick={() => setUser({ name: "Guest", role: null })}
        className="mt-auto text-sm text-gray-500 hover:underline"
      >
        Log out
      </button>
    </aside>
  );
}

function NavBtn({ label, active, onClick }) {
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      className={`w-full text-left px-4 py-2 rounded-xl mb-1 transition ${
        active ? "bg-emerald-200/80 text-emerald-900 font-semibold shadow-inner" : "hover:bg-emerald-100/50"
      }`}
      onClick={onClick}
    >
      {label}
    </motion.button>
  );
}

/* ---------------- Role-based Routes ---------------- */
function renderRoute(route, role) {
  switch (role) {
    case "Therapist": return <TherapistDash />;
    case "Doctor":    return <DoctorDash />;
    case "Nurse":     return <NurseDash />;
    case "Admin":     return <AdminDash />;
    default:          return <PatientPortal />;
  }
}

/* ---------------- Patient / Guest ---------------- */
function PatientPortal() {
  return (
    <Section title="Patient Portal">
      <MoodTracker />
      <AISelfHelp />
      <CommunityBoard />
      <AppointmentRequest />
    </Section>
  );
}

/* ---------------- Therapist ---------------- */
function TherapistDash() {
  const [requests, setRequests] = useState([
    { id: 1, patient: "Rahul", time: "Mon 10:00", status: "Pending" },
    { id: 2, patient: "Sara", time: "Tue 2:00", status: "Pending" },
  ]);
  const approve = (id) =>
    setRequests((r) => r.map((x) => (x.id === id ? { ...x, status: "Approved" } : x)));
  return (
    <Section title="Therapist Dashboard">
      <h3 className="font-semibold text-emerald-700 mb-2">Appointment Requests</h3>
      {requests.map((r) => (
        <Card key={r.id} title={`${r.patient} – ${r.time}`}>
          Status: {r.status}
          {r.status === "Pending" && (
            <button
              onClick={() => approve(r.id)}
              className="ml-3 px-3 py-1 bg-emerald-500 text-white rounded-xl"
            >
              Approve
            </button>
          )}
        </Card>
      ))}
      <AnalyticsDemo />
    </Section>
  );
}

/* ---------------- Doctor ---------------- */
function DoctorDash() {
  const [patients] = useState([
    { id: 1, name: "Vikram", reason: "Headache", time: "9:30 AM" },
    { id: 2, name: "Leela", reason: "Check-up", time: "10:15 AM" },
  ]);
  return (
    <Section title="Doctor Dashboard">
      {patients.map((p) => (
        <Card key={p.id} title={p.name}>
          Reason: {p.reason} – {p.time}
        </Card>
      ))}
      <AISelfHelp compact />
    </Section>
  );
}

/* ---------------- Nurse ---------------- */
function NurseDash() {
  const [tasks, setTasks] = useState([
    { id: 1, task: "Check vitals – Room 101", done: false },
    { id: 2, task: "Administer meds – Bed 3", done: false },
  ]);
  const toggle = (id) => setTasks(tasks.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));
  return (
    <Section title="Nurse Dashboard">
      {tasks.map((t) => (
        <Card key={t.id} title="">
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={t.done} onChange={() => toggle(t.id)} />
            <span className={t.done ? "line-through text-gray-400" : ""}>{t.task}</span>
          </label>
        </Card>
      ))}
    </Section>
  );
}

/* ---------------- Admin ---------------- */
function AdminDash() {
  const [staff, setStaff] = useState([
    { id: 1, name: "Dr. Rao", role: "Doctor" },
    { id: 2, name: "Lata", role: "Nurse" },
  ]);
  const [name, setName] = useState("");
  const [role, setRole] = useState("Doctor");
  const add = () => {
    if (!name) return;
    setStaff([...staff, { id: Date.now(), name, role }]);
    setName("");
  };
  return (
    <Section title="Admin Dashboard">
      <div className="flex gap-2 mb-4">
        <input className="flex-1 border rounded-xl px-3 py-2" value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" />
        <select className="border rounded-xl px-3 py-2" value={role} onChange={(e) => setRole(e.target.value)}>
          <option>Doctor</option><option>Nurse</option><option>Therapist</option>
        </select>
        <button onClick={add} className="bg-emerald-500 text-white px-4 rounded-xl">Add</button>
      </div>
      {staff.map((s) => (
        <Card key={s.id} title={s.name}>Role: {s.role}</Card>
      ))}
    </Section>
  );
}

/* ---------------- Shared Components ---------------- */
function Section({ title, children }) {
  return (
    <div>
      <h2 className="text-3xl font-bold text-emerald-700 mb-4">{title}</h2>
      <div className="grid md:grid-cols-2 gap-4">{children}</div>
    </div>
  );
}

function Card({ title, children }) {
  return (
    <motion.div whileHover={{ scale: 1.02 }} className="p-4 rounded-2xl bg-white/80 shadow-md">
      {title && <h3 className="font-semibold text-emerald-700 mb-1">{title}</h3>}
      <div className="text-gray-700 text-sm">{children}</div>
    </motion.div>
  );
}

/* ---------------- Patient Features ---------------- */
function MoodTracker() {
  const [moods, setMoods] = useState([]);
  const logMood = (m) => setMoods([...moods, { m, t: new Date().toLocaleTimeString() }]);
  return (
    <Card title="Daily Mood Tracker">
      <div className="flex gap-2 mb-2">
        {["😊", "😐", "😞"].map((m) => (
          <button key={m} onClick={() => logMood(m)} className="text-2xl">
            {m}
          </button>
        ))}
      </div>
      {moods.length > 0 && <p className="text-xs">Logged: {moods.map((x) => x.m).join(" ")}</p>}
    </Card>
  );
}

function AISelfHelp({ compact }) {
  const [msgs, setMsgs] = useState([{ from: "ai", text: "Hello, how are you feeling today?" }]);
  const [input, setInput] = useState("");
  const endRef = useRef();

  const send = () => {
    if (!input.trim()) return;
    const text = input.trim();
    setMsgs((m) => [...m, { from: "user", text }]);
    setInput("");
    setTimeout(() => {
      setMsgs((m) => [
        ...m,
        { from: "ai", text: aiReply(text) },
      ]);
    }, 600);
  };
  useEffect(() => endRef.current?.scrollIntoView({ behavior: "smooth" }), [msgs]);

  return (
    <Card title="AI Self-Help Coach">
      <div className="max-h-56 overflow-y-auto mb-2 space-y-1">
        {msgs.map((m, i) => (
          <div key={i} className={`text-sm ${m.from === "ai" ? "text-emerald-700" : "text-gray-700 text-right"}`}>
            {m.text}
          </div>
        ))}
        <div ref={endRef} />
      </div>
      {!compact && (
        <div className="flex gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 border rounded-xl px-2 py-1"
            placeholder="Type message"
          />
          <button onClick={send} className="bg-emerald-500 text-white px-3 rounded-xl">
            Send
          </button>
        </div>
      )}
    </Card>
  );
}

function CommunityBoard() {
  const [posts, setPosts] = useState([{ id: 1, text: "Remember to breathe. One day at a time." }]);
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
          className="flex-1 border rounded-xl px-2 py-1"
          value={txt}
          onChange={(e) => setTxt(e.target.value)}
          placeholder="Share something"
        />
        <button onClick={post} className="bg-emerald-500 text-white px-3 rounded-xl">Post</button>
      </div>
    </Card>
  );
}

function AppointmentRequest() {
  const [reqs, setReqs] = useState([]);
  const [when, setWhen] = useState("");
  const send = () => {
    if (!when) return;
    setReqs([...reqs, { id: Date.now(), when }]);
    setWhen("");
  };
  return (
    <Card title="Request Appointment">
      <input
        className="border rounded-xl px-3 py-2 w-full mb-2"
        placeholder="Preferred date/time"
        value={when}
        onChange={(e) => setWhen(e.target.value)}
      />
      <button onClick={send} className="bg-emerald-500 text-white px-4 rounded-xl">Submit</button>
      {reqs.map((r) => (
        <div key={r.id} className="text-xs text-gray-600 mt-1">Requested: {r.when}</div>
      ))}
    </Card>
  );
}

/* ---------------- Demo Analytics ---------------- */
function AnalyticsDemo() {
  const data = {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri"],
    datasets: [
      {
        label: "Avg Mood",
        data: [2, 3, 4, 3, 5],
        fill: false,
        borderColor: "rgb(16, 185, 129)",
        tension: 0.2,
      },
    ],
  };
  return (
    <Card title="Patient Mood Trends">
      <Line data={data} options={{ scales: { y: { min: 1, max: 5 } }, plugins: { legend: { display: false } } }} />
    </Card>
  );
}

/* ---------------- Helpers ---------------- */
function aiReply(text) {
  const s = text.toLowerCase();
  if (s.includes("sad") || s.includes("depress"))
    return "I'm sorry you feel that way. Remember you’re not alone. Try 3 slow deep breaths.";
  if (s.includes("anx") || s.includes("stress"))
    return "Let’s do a quick grounding: name 3 things you see, 2 you hear, 1 you feel.";
  return "Thank you for sharing. Would you like a breathing exercise or a short meditation link?";
}
function navItems(role) {
  return [{ key: role.toLowerCase(), label: `${role} Dashboard` }];
}
function defaultRoute(role) {
  return role.toLowerCase();
}
