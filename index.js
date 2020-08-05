var mysql = require("mysql");

const express = require("express");
const app = express();
var path = require("path");
var session = require("express-session");
app.engine("html", require("ejs").renderFile);
app.set("view engine", "html");
const port = 3000;
const bodyParser = require("body-parser");
app.use(express.urlencoded({ extended: false }));
app.use(express.static("."));
app.use(express.static(path.join(__dirname, "views")));
app.listen(3000, function () {
  console.log("Example app listening on port 3000!");
});

var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "unipa",
});

con.connect(function (err) {
  if (err) throw err;
  console.log("Connesso");
  con.query("CREATE DATABASE IF NOT EXISTS gestioneAffitti", function (
    err,
    result
  ) {
    if (err) throw err;
    console.log("Database creato");
  });
});
const tables = require("./tables");
tables.crea_tableUtenteCliente();
tables.crea_tableUtenteProprietario();
tables.crea_tableCasa();
tables.crea_tablePrenotazione();

app.use(
  session({
    secret: "autorizzazione",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
  })
);
const action = require("./action")(app);
