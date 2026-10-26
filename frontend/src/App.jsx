
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import EventForm from "./components/EventForm";
import Dashboard from "./pages/Dashboard";
import "./index.css";

function AppLayout() {
  return (
    <div className="app-shell">
      <Navbar />

      <main className="main-area">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/add-event" element={<EventForm />} />
          <Route path="/edit-event/:id" element={<EventForm />} />
          <Route path="*" element={<Dashboard />} />
        </Routes>

        <footer className="app-footer">
          <span>© {new Date().getFullYear()} Gather Event Studio</span>
          <span>Thoughtfully planned. Beautifully executed.</span>
        </footer>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppLayout />
    </BrowserRouter>
  );
}
