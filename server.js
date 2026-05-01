const express = require('express');
const session = require('express-session');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(session({
  secret: 'mySecretKey',
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    maxAge: 1000 * 60 * 60 
  }
}));

const USER = {
  username: 'admin',
  password: '1234'
};

function isAuthenticated(req, res, next) {
  if (req.session && req.session.user) {
    return next();
  }
  return res.status(401).json({ message: 'Unauthorized. Please log in first.' });
}
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  if (username === USER.username && password === USER.password) {
    req.session.user = { username };
    return res.status(200).json({ message: 'Login Successful' });
  }

  return res.status(401).json({ message: 'Invalid Credentials' });
});

app.get('/dashboard', isAuthenticated, (req, res) => {
  return res.status(200).json({
    message: `Welcome to the dashboard, ${req.session.user.username}!`
  });
});


app.get('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ message: 'Logout failed' });
    }
    res.clearCookie('connect.sid');
    return res.status(200).json({ message: 'Logged out successfully' });
  });
});

app.listen(8000, () => {
  console.log('Server running on http://localhost:8000');
});