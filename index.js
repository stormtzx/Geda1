var mysql = require("mysql");

const express = require("express");
const app = express();
var path = require("path");
app.engine("html", require("ejs").renderFile);
app.set("view engine", "html");
const port = 3000;
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static("."));
app.use(express.static(path.join(__dirname, "views")));
app.listen(3000, function () {
  console.log("Example app listening on port 3000!");
});

app.get("/", function (req, res) {
  res.sendFile(
    path.join(
      __dirname,
      "../Sistema_Alberghi/views",
      "SchermataPrincipale.html"
    )
  );
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

app.post("/views/PannelloIscrizioneCliente.html/submit", function (req, res) {
  console.log(req.body);
  var sql =
    "insert into gestioneAffitti.utenteCliente values('" +
    req.body.nome +
    "', '" +
    req.body.cognome +
    "', '" +
    req.body.email +
    "', '" +
    req.body.password +
    "')";
  con.query(sql, function (err) {
    if (err) {
      res.sendFile(
        path.join(
          __dirname,
          "../Sistema_Alberghi/views",
          "NotificaIscrizioneFallita.html"
        )
      );
      return;
    }
    res.sendFile(
      path.join(
        __dirname,
        "../Sistema_Alberghi/views",
        "ConfermaIscrizione.html"
      )
    );
  });
});
