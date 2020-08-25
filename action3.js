var mysql = require("mysql");

const express = require("express");
const app = express();
var path = require("path");
var session = require("express-session");
app.engine("html", require("ejs").renderFile);
app.set("view engine", "html");

const bodyParser = require("body-parser");
const { Console } = require("console");
app.use(express.urlencoded({ extended: false }));
app.use(express.static("."));
app.use(express.static(path.join(__dirname, "views")));

var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "unipa",
  database: "gestioneAffitti",
});

module.exports = function (app) {
  app.get("/visualizzaListaPrenotazioniCliente", function (req, res, err) {
    var sql =
      "SELECT * FROM gestioneAffitti.prenotazione WHERE email_cliente = '" +
      req.session.emailC +
      "'";

    con.query(sql, function (err, results) {
      if (err) throw err;
      if (results[0].id_prenotazione != null) {
        console.log("Prenotazioni effettuate dal Cliente: ");
        console.log(results);
        res.render("SchermataListaPrenotazioniCliente.html", {
          ListaPrenotazioniCliente: results,
        });
      } else {
        console.log("Nessuna prenotazione effettuata dal Cliente!");
        res.sendFile(
          path.join(
            __dirname,
            "../Sistema_Alberghi/views",
            "NotificaRicercaFallita.html"
          )
        );
      }
    });
  });

  app.get("/visualizzaPrenotazioneCliente", function (req, res) {
    var id = req.param("id");

    var sql =
      "SELECT * FROM gestioneAffitti.prenotazione WHERE id_prenotazione = " +
      id +
      "";
    con.query(sql, function (err, results) {
      if (err) {
        throw err;
      } else if (results.length == 1) {
        console.log("Dati prenotazione: ");
        console.log(results);

        res.render("RiepilogoPrenotazione.html", {
          visualizzaPrenotazione: results,
        });
      } else {
        res.sendFile(
          path.join(
            __dirname,
            "../Sistema_Alberghi/views",
            "NotificaRicercaFallita.html"
          )
        );
      }
    });
  });
};
