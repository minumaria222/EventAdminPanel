
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, CalendarDays, Save } from "lucide-react";
import { createEvent, getEvent, updateEvent } from "../services/eventApi";

const emptyForm = {
  eventName: "",
  description: "",
  eventDate: "",
  venue: "",
};

export default function EventForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const editing = Boolean(id);

  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(editing);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!editing) return;

    getEvent(id)
      .then(({ data }) => {
        setForm({
          eventName: data.eventName || "",
          description: data.description || "",
          eventDate: data.eventDate
            ? new Date(data.eventDate).toISOString().slice(0, 10)
            : "",
          venue: data.venue || "",
        });
      })
      .catch(() => setError("Unable to load this event."))
      .finally(() => setLoading(false));
  }, [editing, id]);

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((previous) => ({ ...previous, [name]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setSaving(true);

    try {
      if (editing) {
        await updateEvent(id, form);
        navigate("/", { state: { notice: "Event updated successfully." } });
      } else {
        await createEvent(form);
        navigate("/", { state: { notice: "Event created successfully." } });
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Unable to save the event. Check that the backend is running."
      );
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <div className="page-content loading">Loading event...</div>;
  }

  return (
    <section className="page-content">
      <Link to="/" className="back-link">
        <ArrowLeft size={16} /> Back to dashboard
      </Link>

      <div className="form-heading">
        <div>
          <span className="eyebrow">
            {editing ? "EVENT MANAGEMENT" : "CREATE SOMETHING SPECIAL"}
          </span>
          <h1>{editing ? "Edit event" : "Create an event"}</h1>
          <p>
            {editing
              ? "Update the details of your existing event."
              : "Fill in the details to add an event to your workspace."}
          </p>
        </div>
        <div className="form-heading-icon">
          <CalendarDays size={28} />
        </div>
      </div>

      <form className="event-form" onSubmit={handleSubmit}>
        <div className="form-section-title">
          <span>01</span>
          <div>
            <h2>Event information</h2>
            <p>Give your event a name and description.</p>
          </div>
        </div>

        <label className="field">
          Event name <span>*</span>
          <input
            name="eventName"
            value={form.eventName}
            onChange={handleChange}
            placeholder="e.g. Creative Minds Conference"
            maxLength={120}
            required
          />
        </label>

        <label className="field">
          Event description <span>*</span>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="What is this event about?"
            maxLength={2000}
            rows={4}
            required
          />
        </label>

        <div className="form-section-title section-spaced">
          <span>02</span>
          <div>
            <h2>When and where</h2>
            <p>Help attendees know the event details.</p>
          </div>
        </div>

        <div className="form-grid">
          <label className="field">
            Event date <span>*</span>
            <input
              type="date"
              name="eventDate"
              value={form.eventDate}
              onChange={handleChange}
              required
            />
          </label>

          <label className="field">
            Venue <span>*</span>
            <input
              name="venue"
              value={form.venue}
              onChange={handleChange}
              placeholder="e.g. City Convention Centre"
              maxLength={200}
              required
            />
          </label>
        </div>

        {error && <p className="error-message">{error}</p>}

        <div className="form-actions">
          <Link to="/" className="button button-light">Cancel</Link>
          <button className="button button-primary" disabled={saving}>
            <Save size={16} />
            {saving
              ? "Saving..."
              : editing
              ? "Save changes"
              : "Create event"}
          </button>
        </div>
      </form>
    </section>
  );
}
