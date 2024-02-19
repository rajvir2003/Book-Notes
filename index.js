import express from "express";
import bodyParser from "body-parser";
import axios from "axios";
import pg from "pg";
import {format} from "date-fns";

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "capstone",
  password: "password",
  port: 5432
});
db.connect();

let sortMethod = "id";
let books = [];

app.get("/", async (req, res) => {
  let result;
  if(sortMethod == "id") {
    result = await db.query(`SELECT * FROM books ORDER BY ${sortMethod};`);
  } else {
    result = await db.query(`SELECT * FROM books ORDER BY ${sortMethod} DESC;`);
  }
  
  let arr = [];
  result.rows.forEach((record) => {
    arr.push({
      id: record.id,
      title: record.title,
      description: record.description,
      ISBN_code: record.isbn_code,
      rating: record.rating,
      date: format(record.read_date, 'yyyy-MM-dd')
    });
  });
  books = arr;
  console.log(arr);
  res.render("index.ejs", { books: books });
});

app.get("/sort/:method", (req, res) => {
  sortMethod = req.params.method;
  console.log(sortMethod);
  res.redirect("/");
});

app.get("/addBook", (req, res) => {
  res.render("addBook.ejs");
});

app.post("/addBook", async (req, res) => {
  const title = req.body.title;
  const desc = req.body.description;
  const isbn = req.body.isbn;
  const read_date = req.body.read_date;
  const rating = req.body.rating;

  await db.query("INSERT INTO books (title, description, isbn_code, rating, read_date) VALUES ($1,$2,$3,$4,$5);", [title, desc, isbn, rating, read_date]);
  res.redirect("/");
});

app.post("/edit", async (req, res) => {
  const id = req.body.id;
  const title = req.body.title;
  const desc = req.body.description;
  const isbn = req.body.isbn;
  const read_date = req.body.read_date;
  const rating = req.body.rating;

  await db.query("UPDATE books SET title = $1, description = $2, isbn_code = $3, rating = $4, read_date = $5 WHERE id = $6", [title, desc, isbn, rating, read_date, id]);
  res.redirect("/");
});

app.post("/delete", async (req, res) => {
  const id = req.body.id;
  await db.query("DELETE FROM books WHERE id = $1", [id]);
  res.redirect("/");
});

app.listen(port, () => {
  console.log(`Listening on port ${port}...`);
});