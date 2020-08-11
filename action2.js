var mysql = require("mysql");

const express = require("express");
const app = express();
var path = require("path");
var session = require("express-session");
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

    if (req.body.beb_nc == undefined) req.body.beb_nc = false;
    if (req.body.casa_vacanza_nc == undefined) req.body.casa_vacanza_nc = false;
    if (req.body.fasciatoio_nc == undefined) req.body.fasciatoio_nc = false;
    if (req.body.segnalatore_fumo_nc == undefined)
      req.body.segnalatore_fumo_nc = false;
    if (req.body.servizi_disabili_nc == undefined)
      req.body.servizi_disabili_nc = false;
    if (req.body.animali_nc == undefined) req.body.animali_nc = false;
    if (req.body.cucina_nc == undefined) req.body.cucina_nc = false;

    if (req.body.no_last_nc != undefined)
      req.body.ultima_data_nc = "9999-12-31";

    var sql =
      "insert into gestioneAffitti.casa(nome_casa, indirizzo, citta, proprietario, beb, casa_vacanza, numero_camere, numero_bagno, perimetro_casa, tariffa_giornaliera, fasciatoio, segnalatori_fumo, servizi_disabili, animali_ammessi, cucina, prima_data, ultima_data) values('" +
      req.body.nome_casa_nc +
      "', '" +
      req.body.indirizzo_nc +
      "', '" +
      req.body.citta_nc +
      "', '" +
      req.session.emailP +
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
      ", '" +
      req.body.prima_data_nc +
      "', '" +
      req.body.ultima_data_nc +
      "' ) ";
    con.query(sql, function (err) {
      if (
        err ||
        req.body.ultima_data_nc < req.body.prima_data_nc ||
        req.session.emailP == null
      ) {
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

  app.post("/ricerca", function (req, res) {
    console.log(req.body);
    if (req.body.check_in_r == "" && req.body.check_out_r == "") {
      var sql =
        "SELECT * FROM gestioneAffitti.casa WHERE gestioneAffitti.casa.citta = '" +
        req.body.citta_r +
        "' ";
    } else if (req.body.check_in_r == "") {
      sql =
        "SELECT * FROM gestioneAffitti.casa WHERE gestioneAffitti.casa.citta = '" +
        req.body.citta_r +
        "' AND gestioneAffitti.casa.ultima_data >= '" +
        req.body.check_out_r +
        "' ";
    } else if (req.body.check_out_r == "") {
      sql =
        "SELECT * FROM gestioneAffitti.casa WHERE gestioneAffitti.casa.citta = '" +
        req.body.citta_r +
        "' AND gestioneAffitti.casa.prima_data <= '" +
        req.body.check_in_r +
        "' ";
    } else {
      sql =
        "SELECT * FROM gestioneAffitti.casa WHERE gestioneAffitti.casa.citta = '" +
        req.body.citta_r +
        "' AND gestioneAffitti.casa.prima_data <= '" +
        req.body.check_in_r +
        "' AND gestioneAffitti.casa.ultima_data >= '" +
        req.body.check_out_r +
        "' ";
    }

    con.query(sql, function (err, results) {
      if (results.length > 0) {
        console.log(results);
        res.render("SchermataRicerca.html", { ricercaCase: results });
      } else {
        console.log(err);

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

  app.get("/visualizzaCasa", function (req, res) {
    var id = req.param("id");

    var sql =
      "SELECT * FROM gestioneAffitti.casa WHERE gestioneAffitti.casa.id_casa = '" +
      id +
      "'";
    con.query(sql, function (err, results) {
      if ((results.length = 1)) {
        console.log(results);
        res.render("SchermataCasa.html", { visualizzaCasa: results });
      } else {
        console.log(err);

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
