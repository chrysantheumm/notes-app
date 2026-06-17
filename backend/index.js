const express = require('express');
const cors = require('cors');
require('dotenv').config();
const noteRoutes = require('./routes/noteRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use('/api', noteRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the Notes API' });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

