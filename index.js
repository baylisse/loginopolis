const express = require('express');
const app = express();
const bcrypt = require('bcrypt');
const { User } = require('./db');

app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.get('/', async (req, res, next) => {
  try {
    res.send('<h1>Welcome to Loginopolis!</h1><p>Log in via POST /login or register via POST /register</p>');
  } catch (error) {
    console.error(error);
    next(error)
  }
});

// POST /register
// TODO - takes req.body of {username, password} and creates a new user with the hashed password

app.post("/register", async (req, res) => {
  const { username, password } = req.body;

  const hash = await bcrypt.hash(password, 10);

  await User.create({
    username: username,
    password: hash
  });

  res.status(200).send("successfully created user "+ username);
});

// POST /login
// TODO - takes req.body of {username, password}, finds user by username, and compares the password with the hashed version from the DB

app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  const user = await User.findAll({
    where: { username: username },
    limit: 1,
  });

  const isFound = await bcrypt.compare(password, user[0].password);

  if (isFound) {
    res.status(200).send("successfully logged in user "+ username);
  } else {
    res.status(401).send("incorrect username or password");
  };

});



// we export the app, not listening in here, so that we can run tests
module.exports = app;