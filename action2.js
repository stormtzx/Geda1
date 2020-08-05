var mysql = require("mysql");

const express = require("express");
const app = express();
var path = require("path");
app.engine("html", require("ejs").renderFile);
app.set("view engine", "html");

const bodyParser = require("body-parser");
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
  app.post("/nuovaCasa", function (req, res) {
    console.log(req.body);
    if (req.body.beb_nc != undefined) req.body.beb_nc = true;
    if (req.body.casa_vacanza_nc != undefined) req.body.casa_vacanza_nc = true;
    if (req.body.fasciatoio_nc != undefined) req.body.fasciatoio_nc = true;
    if (req.body.segnalatore_fumo_nc != undefined)
      req.body.segnalatore_fumo_nc = true;
    if (req.body.servizi_disabili_nc != undefined)
      req.body.servizi_disabili_nc = true;
    if (req.body.animali_nc != undefined) req.body.animali_nc = true;
    if (req.body.cucina_nc != undefined) req.body.cucina_nc = true;
    if (req.body.disponibilita_nc != undefined)
      req.body.disponibilita_nc = true;
    if (req.body.beb_nc == undefined) req.body.beb_nc = false;
    if (req.body.casa_vacanza_nc == undefined) req.body.casa_vacanza_nc = false;
    if (req.body.fasciatoio_nc == undefined) req.body.fasciatoio_nc = false;
    if (req.body.segnalatore_fumo_nc == undefined)
      req.body.segnalatore_fumo_nc = false;
    if (req.body.servizi_disabili_nc == undefined)
      req.body.servizi_disabili_nc = false;
    if (req.body.animali_nc == undefined) req.body.animali_nc = false;
    if (req.body.cucina_nc == undefined) req.body.cucina_nc = false;
    if (req.body.disponibilita_nc == undefined)
      req.body.disponibilita_nc = false;

    var sql =
      "insert into gestioneAffitti.casa values('" +
      req.body.indirizzo_nc +
      "', " +
      req.body.beb_nc +
      ", " +
      req.body.casa_vacanza_nc +
      ", " +
      req.body.camere_nc +
      ", " +
      req.body.bagni_nc +
      ", " +
      req.body.perimetro_nc +
      ", " +
      req.body.tariffa_nc +
      ", " +
      req.body.fasciatoio_nc +
      ", " +
      req.body.segnalatore_fumo_nc +
      ", " +
      req.body.servizi_disabili_nc +
      ", " +
      req.body.animali_nc +
      ", " +
      req.body.cucina_nc +
      ", " +
      req.body.disponibilita_nc +
      ", '" +
      req.session.emailP + //Il problema è che questo dovrebbe riportare quanto salvato nella riga 140, ma non succede nulla! Perché? Il Sistema classifica questo valore come "indefinito" quando il form viene compilato.
      "')";
    con.query(sql, function (err) {
      if (err) {
        console.log(err);
        res.sendFile(
          path.join(
            __dirname,
            "../Sistema_Alberghi/views",
            "NotificaNuovaCasaFallita.html"
          )
        );
        return;
      }
      res.sendFile(
        path.join(
          __dirname,
          "../Sistema_Alberghi/views",
          "ConfermaAggiuntaCasa.html"
        )
      );
    });
  });
};
