
import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
});

export const getEvents = () => API.get("/events");

export const getEvent = (id) => API.get(`/events/${id}`);

export const createEvent = (eventData) =>
  API.post("/events", eventData);

export const updateEvent = (id, eventData) =>
  API.put(`/events/${id}`, eventData);

export const deleteEvent = (id) =>
  API.delete(`/events/${id}`);
