
const express = require("express");
const mongoose = require("mongoose");
const Event = require("../models/Event");

const router = express.Router();

// GET all events
router.get("/", async (req, res) => {
  try {
    const events = await Event.find().sort({ createdAt: -1 });
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch events" });
  }
});

// GET one event
router.get("/:id", async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: "Invalid event ID" });
    }

    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    res.json(event);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch event" });
  }
});

// CREATE event
router.post("/", async (req, res) => {
  try {
    const { eventName, description, eventDate, venue } = req.body;

    if (
      !eventName?.trim() ||
      !description?.trim() ||
      !eventDate ||
      !venue?.trim()
    ) {
      return res.status(400).json({
        message: "All event fields are required",
      });
    }

    const event = await Event.create({
      eventName: eventName.trim(),
      description: description.trim(),
      eventDate,
      venue: venue.trim(),
    });

    res.status(201).json(event);
  } catch (error) {
    res.status(400).json({ message: "Could not create event" });
  }
});

// UPDATE event
router.put("/:id", async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: "Invalid event ID" });
    }

    const { eventName, description, eventDate, venue } = req.body;

    if (
      !eventName?.trim() ||
      !description?.trim() ||
      !eventDate ||
      !venue?.trim()
    ) {
      return res.status(400).json({
        message: "All event fields are required",
      });
    }

    const event = await Event.findByIdAndUpdate(
      req.params.id,
      {
        eventName: eventName.trim(),
        description: description.trim(),
        eventDate,
        venue: venue.trim(),
      },
      { new: true, runValidators: true }
    );

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    res.json(event);
  } catch (error) {
    res.status(400).json({ message: "Could not update event" });
  }
});

// DELETE event
router.delete("/:id", async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: "Invalid event ID" });
    }

    const event = await Event.findByIdAndDelete(req.params.id);

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    res.json({ message: "Event deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Could not delete event" });
  }
});

module.exports = router;
