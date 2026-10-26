
import { NavLink } from "react-router-dom";
import { CalendarDays, LayoutDashboard, Plus, Sparkles } from "lucide-react";

export default function Navbar() {
  return (
    <aside className="sidebar">
      <NavLink to="/" className="brand">
        <span className="brand-mark">
          <CalendarDays size={23} />
        </span>
        <span>
          <strong>gather<span>.</span></strong>
          <small>EVENT STUDIO</small>
        </span>
      </NavLink>

      <p className="nav-caption">WORKSPACE</p>

      <nav className="side-nav">
        <NavLink
          to="/"
          end
          className={({ isActive }) =>
            `nav-item ${isActive ? "active" : ""}`
          }
        >
          <LayoutDashboard size={18} />
          Dashboard
        </NavLink>

        <NavLink
          to="/add-event"
          className={({ isActive }) =>
            `nav-item ${isActive ? "active" : ""}`
          }
        >
          <Plus size={18} />
          Add Event
        </NavLink>
      </nav>

      <div className="sidebar-bottom">
        <div className="sidebar-art">
          <Sparkles size={24} />
        </div>
        <strong>Make it memorable.</strong>
        <p>Great experiences start with thoughtful planning.</p>
        <span className="sidebar-version">EVENT MANAGEMENT · V1.0</span>
      </div>
    </aside>
  );
}
