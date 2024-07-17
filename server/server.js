const express = require('express');
const multer = require('multer');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
require('dotenv').config();
const mongoose = require('mongoose');
const Handlers = require('./handlers');
const Middlewares = require('./middlewares');

const uri = process.env.MONGODB_URI || 'mongodb+srv://avnig1905:MongoDbAvni@complaintfix.iqvxpa3.mongodb.net/?retryWrites=true&w=majority&appName=ComplaintFix';

// Connect to MongoDB
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Successfully connected to MongoDB');
  })
  .catch((err) => {
    console.error('Error connecting to MongoDB:', err.message);
  });

const privateKey = fs.readFileSync('./cert/key.pem', 'utf8');
const certificate = fs.readFileSync('./cert/cert.pem', 'utf8');
const upload = multer({ dest: 'uploads/' });
const credentials = { key: privateKey, cert: certificate };

const app = express();
const port = process.env.PORT || 5000;

app.use(cors({ origin: 'http://localhost:3000' }));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, '../build')));

app.get(['/', '/UserScreen', '/AdminScreen*', '/Registration'], (req, res) => {
  res.sendFile(path.join(__dirname, '../build', 'index.html'));
});

app.post(
  '/api/Registration',
  Middlewares.checkDuplicateUsernameOrEmail,
  Handlers.Registration
);

app.get('/api/AllUsers', Handlers.GetUsers);
app.post('/api/add-complaint', Middlewares.verifyToken, upload.single('image'), Handlers.AddComplaint);
app.post('/api/login', Handlers.login);
app.get('/api/GetAllComplaints', Middlewares.verifyToken, Handlers.GetComplaints);
app.get('/api/complaintsByUser', Middlewares.verifyToken, Handlers.GetComplaintsByUser);
app.get('/api/RefreshToken', Middlewares.verifyToken, Handlers.RefreshToken);

app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}`);
});
