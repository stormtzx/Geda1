var mysql = require("mysql");

const express = require("express");
const app = express();
var path = require("path");
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

app.post("/IscrizioneCliente", function (req, res) {
  console.log(req.body);
  var sql =
    "insert into gestioneAffitti.utenteCliente values('" +
    req.body.nome_iscrizioneC +
    "', '" +
    req.body.cognome_iscrizioneC +
    "', '" +
    req.body.email_iscrizioneC +
    "', '" +
    req.body.password_iscrizioneC +
    "')";
  con.query(sql, function (err) {
    if (err) {
      res.sendFile(
        path.join(
          __dirname,
          "../Sistema_Alberghi/views",
          "NotificaIscrizioneClienteFallita.html"
        )
      );
      return;
    }
    res.sendFile(
      path.join(
        __dirname,
        "../Sistema_Alberghi/views",
        "ConfermaIscrizioneCliente.html"
      )
    );
  });
});

app.post("/accessoCliente", function (req, res) {
  console.log(req.body);

  var sql =
    "SELECT gestioneAffitti.utenteCliente.nome, gestioneAffitti.utenteCliente.cognome, gestioneAffitti.utenteCliente.email FROM gestioneAffitti.utenteCliente WHERE gestioneAffitti.utenteCliente.email = '" +
    req.body.email_loginC +
    "' AND gestioneAffitti.utenteCliente.password = '" +
    req.body.password_loginC +
    "' ";

  con.query(sql, function (err, results) {
    if (results.length > 0) {
      console.log(results);
      res.render("SchermataProfiloCliente.html", { accessoCliente: results });
    } else {
      res.sendFile(
        path.join(
          __dirname,
          "../Sistema_Alberghi/views",
          "NotificaLoginClienteFallito.html"
        )
      );
    }
  });
});
