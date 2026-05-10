const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const db = require('../db');

// ── Middleware: verify JWT ────────────────────────────────────────────────────
const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No token provided' });
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ error: 'Invalid or expired token' });
  }
};

// ── GET /api/trips  — all trips for the logged-in user ───────────────────────
router.get('/', authMiddleware, async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT * FROM Trips WHERE user_id = ? ORDER BY start_date ASC',
      [req.user.id]
    );
    res.json(rows);
  } catch (err) {
    console.error('Get trips error:', err);
    res.status(500).json({ error: 'Failed to fetch trips' });
  }
});

// ── POST /api/trips  — create a new trip ─────────────────────────────────────
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { destination, start_date, end_date, budget, image_url } = req.body;
    if (!destination || !start_date || !end_date) {
      return res.status(400).json({ error: 'destination, start_date and end_date are required' });
    }

    const [result] = await db.query(
      `INSERT INTO Trips (user_id, destination, start_date, end_date, budget, trip_data)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        req.user.id,
        destination,
        start_date,
        end_date,
        budget || 0,
        JSON.stringify({ image_url: image_url || null, itinerary: [] })
      ]
    );

    const [[newTrip]] = await db.query('SELECT * FROM Trips WHERE id = ?', [result.insertId]);
    res.status(201).json(newTrip);
  } catch (err) {
    console.error('Create trip error:', err);
    res.status(500).json({ error: 'Failed to create trip' });
  }
});

// ── DELETE /api/trips/:id  — delete a trip ───────────────────────────────────
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    await db.query('DELETE FROM Trips WHERE id = ? AND user_id = ?', [req.params.id, req.user.id]);
    res.json({ message: 'Trip deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete trip' });
  }
});

// ── GET /api/trips/:id  — get single trip ────────────────────────────────────
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const [[trip]] = await db.query(
      'SELECT * FROM Trips WHERE id = ? AND user_id = ?',
      [req.params.id, req.user.id]
    );
    if (!trip) return res.status(404).json({ error: 'Trip not found' });
    res.json(trip);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch trip' });
  }
});

// ── PATCH /api/trips/:id  — update trip_data (itinerary) ─────────────────────
router.patch('/:id', authMiddleware, async (req, res) => {
  try {
    const { trip_data } = req.body;
    await db.query(
      'UPDATE Trips SET trip_data = ? WHERE id = ? AND user_id = ?',
      [JSON.stringify(trip_data), req.params.id, req.user.id]
    );
    res.json({ message: 'Trip updated' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update trip' });
  }
});

module.exports = router;
