const express = require('express')
const helmet = require("helmet");
const morgan = require("morgan")
const bodyParser = require('body-parser');
const cors = require('cors')
const dotenv = require('dotenv')
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./todos.db');

const router = require("express").Router();
// require('dotenv').config();
const app = express();
const port = 8000

app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));

app.use(function (req, res, next) {
  res.header(
    "Access-Control-Allow-Methods",
    "OPTIONS, HEAD, GET, PUT, POST, DELETE"
  );
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
})


app.use(express.json())
app.use(morgan("tiny"))
app.use(cors());
app.use(express.urlencoded({ extended: true }))
app.use(express.static("public"))

app.get('/todos', (req, res) => {
  
  db.all('SELECT id, cat, text, isCompleted, date FROM todos', [], (err, rows) => {
    if (err) {
      console.error(err.message);
      res.status(500).send('Internal server error');
    } else {
      res.json(rows);
    }
  });
});

app.post('/todos', (req, res) => {
  const { text, isCompleted, date, cat } = req.body;
  db.run('INSERT INTO todos (text, isCompleted, date, cat) VALUES (?, ?, ?, ?)', [text, isCompleted, date, cat], function (err) {
    if (err) {
      console.error(err.message);
      res.status(500).send('Internal server error');
    } else {
      const id = this.lastID;
      res.json({ id, text, isCompleted, date });
    }
  });
});


app.put('/todos/:id', (req, res) => {
  const { id } = req.params;
  const { text, isCompleted, date } = req.body;
  db.run('UPDATE todos SET text = ?, isCompleted = ?, date = ? WHERE id = ?', [text, isCompleted, date, id], (err) => {
    if (err) {
      console.error(err.message);
      res.status(500).send('Internal server error');
    } else {
      res.sendStatus(200);
    }
  });
});

app.delete('/todos/:id', (req, res) => {
  const { id } = req.params;
  db.run('DELETE FROM todos WHERE id = ?', [id], (err) => {
    if (err) {
      console.error(err.message);
      res.status(500).send('Internal server error');
    } else {
      res.sendStatus(200);
    }
  });
});








app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)})