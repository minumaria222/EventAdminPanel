
import { useEffect, useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  CalendarDays,
  CalendarCheck,
  MapPin,
  Pencil,
  Plus,
  Search,
  Trash2,
  Users,
} from "lucide-react";
import { deleteEvent, getEvents } from "../services/eventApi";

function formatDate(date) {
  return new Date(date).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function Dashboard() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  const location = useLocation();
  const [notice, setNotice] = useState(location.state?.notice || "");

  useEffect(() => {
    getEvents()
      .then(({ data }) => setEvents(data))
      .catch(() => {
        setError("Could not load events. Check your backend.");
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!notice) return;

    const timer = setTimeout(() => setNotice(""), 3000);
    return () => clearTimeout(timer);
  }, [notice]);

  async function handleDelete(event) {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${event.eventName}"?`
    );

    if (!confirmed) return;

    try {
      await deleteEvent(event._id);

      setEvents((previous) =>
        previous.filter((item) => item._id !== event._id)
      );

      setNotice("Event deleted successfully.");
      setError("");
    } catch {
      setError("Could not delete this event. Please try again.");
    }
  }

  const filteredEvents = useMemo(() => {
    const term = search.toLowerCase().trim();

    return events.filter((event) =>
      [
        event.eventName,
        event.venue,
        event.description,
        event._id,
      ]
        .join(" ")
        .toLowerCase()
        .includes(term)
    );
  }, [events, search]);

  const totalRegistrations = events.reduce(
    (total, event) => total + (event.totalRegistrations || 0),
    0
  );

  const upcomingEvents = events.filter(
    (event) =>
      new Date(event.eventDate) >=
      new Date(new Date().toDateString())
  ).length;

  return (
    <section className="page-content">
      {notice && <div className="success-banner">{notice}</div>}

      <div className="dashboard-heading">
        <div>
          <span className="eyebrow">YOUR EVENT WORKSPACE</span>
          <h1>
            Good things are <span>happening.</span>
          </h1>
          <p>Manage your events in one place.</p>
        </div>

        <Link to="/add-event" className="button button-primary">
          <Plus size={18} />
          Add new event
        </Link>
      </div>

      <div className="stats-grid">
        <article className="stat-card">
          <div className="stat-icon purple">
            <CalendarDays size={21} />
          </div>
          <span className="stat-label">Total events</span>
          <strong>{events.length}</strong>
          <small>Events in your workspace</small>
        </article>

        <article className="stat-card">
          <div className="stat-icon orange">
            <CalendarCheck size={21} />
          </div>
          <span className="stat-label">Upcoming events</span>
          <strong>{upcomingEvents}</strong>
          <small>Today or later</small>
        </article>

        <article className="stat-card">
          <div className="stat-icon green">
            <Users size={21} />
          </div>
          <span className="stat-label">Total registrations</span>
          <strong>{totalRegistrations}</strong>
          <small>Across all events</small>
        </article>
      </div>

      <div className="events-panel">
        <div className="panel-heading">
          <div>
            <h2>
              All events{" "}
              <span className="count-pill">{events.length}</span>
            </h2>
            <p>View and manage your event details.</p>
          </div>

          <label className="search-box">
            <Search size={17} />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search events..."
              aria-label="Search events"
            />
          </label>
        </div>

        {error && <p className="error-message">{error}</p>}

        {loading ? (
          <div className="empty-state">Loading events...</div>
        ) : filteredEvents.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">
              <CalendarDays size={28} />
            </div>
            <h3>
              {search ? "No matching events" : "No events yet"}
            </h3>
            <p>
              {search
                ? "Try a different search term."
                : "Create your first event to get started."}
            </p>

            {!search && (
              <Link
                to="/add-event"
                className="button button-primary"
              >
                <Plus size={17} />
                Create your first event
              </Link>
            )}
          </div>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>EVENT</th>
                  <th>DATE</th>
                  <th>VENUE</th>
                  <th>REGISTRATIONS</th>
                  <th>ACTIONS</th>
                </tr>
              </thead>

              <tbody>
                {filteredEvents.map((event) => (
                  <tr key={event._id}>
                    <td>
                      <div className="event-cell">
                        <div className="event-avatar">
                          {event.eventName.charAt(0).toUpperCase()}
                        </div>
                        <div className="event-title">
                          <strong>{event.eventName}</strong>
                          <small>ID: {event._id}</small>
                        </div>
                      </div>
                    </td>

                    <td>
                      <div className="date-cell">
                        <CalendarDays size={15} />
                        {formatDate(event.eventDate)}
                      </div>
                    </td>

                    <td>
                      <div className="venue-cell">
                        <MapPin size={15} />
                        <span>{event.venue}</span>
                      </div>
                    </td>

                    <td>
                      <span className="registration-count">
                        <Users size={15} />
                        {event.totalRegistrations || 0}
                      </span>
                    </td>

                    <td>
                      <div className="row-actions">
                        <Link
                          to={`/edit-event/${event._id}`}
                          className="icon-button edit-action"
                          aria-label={`Edit ${event.eventName}`}
                          title="Update event"
                        >
                          <Pencil size={16} />
                        </Link>

                        <button
                          className="icon-button delete-action"
                          onClick={() => handleDelete(event)}
                          aria-label={`Delete ${event.eventName}`}
                          title="Delete event"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="panel-footer">
          Showing {filteredEvents.length} of {events.length} events
        </div>
      </div>
    </section>
  );
}

