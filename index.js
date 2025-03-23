const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv').config();
const cors = require('cors');

const app = express();

app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 5500;

const taskRoutes = require('./routes/taskRoutes');

mongoose.connect(process.env.DB_CONNECT)
  .then(() => console.log("Database connected successfully"))
  .catch(err => console.log("Database connection error:", err));

app.use('/', taskRoutes);

app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));