var mysql = require("mysql");

const express = require("express");
const app = express();
var path = require("path");
var session = require("express-session");
app.engine("html", require("ejs").renderFile);
app.set("view engine", "html");
const fs = require("fs");

const bodyParser = require("body-parser");
app.use(express.urlencoded({ extended: false }));
app.use(express.static("."));
app.use(express.static(path.join(__dirname, "views")));

const multer = require("multer");
const upload = multer({
  dest: "../Sistema_Alberghi/upload",
  // you might also want to set some limits: https://github.com/expressjs/multer#limits
});

const handleError = (err, res) => {
  res.status(500).contentType("text/plain").end("Oops! Something went wrong!");
};

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
      "insert into gestioneAffitti.casa(nome_casa, indirizzo, citta, proprietario, beb, casa_vacanza, numero_camere, numero_bagno, perimetro_casa, tariffa_giornaliera, ammontare_tasse, fasciatoio, segnalatori_fumo, servizi_disabili, animali_ammessi, cucina, prima_data, ultima_data) values('" +
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
      req.body.tasse_nc +
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
      } else {
        if (path.extname(req.file.originalname).toLowerCase() === ".png") {
          fs.rename(tempPath, targetPath, (err) => {
            if (err) return handleError(err, res);

            res.status(200).contentType("text/plain").end("File uploaded!");
          });
        } else {
          fs.unlink(tempPath, (err) => {
            if (err) return handleError(err, res);

            res
              .status(403)
              .contentType("text/plain")
              .end("Only .png files are allowed!");
          });
        }
        res.sendFile(
          path.join(
            __dirname,
            "../Sistema_Alberghi/views",
            "ConfermaAggiuntaCasa.html"
          )
        );
      }
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
        req.session.id_casa = results[0].id_casa;
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

  app.get("/image.png", function (req, res) {
    res.sendFile(path.join(__dirname, "./uploads/image.png"));
  });

  app.post("/calcoloTasse", function (req, res, err) {
    console.log(req.body);
    if (req.body.animali_p != undefined) req.body.animali_p = true;
    if (req.body.disabilita_p != undefined) req.body.disabilita_p = true;
    if (req.body.viaggio_lavoro_p != undefined)
      req.body.viaggio_lavoro_p = true;

    if (req.body.animali_p == undefined) req.body.animali_p = false;
    if (req.body.disabilita_p == undefined) req.body.disabilita_p = false;
    if (req.body.viaggio_lavoro_p == undefined)
      req.body.viaggio_lavoro_p = false;

    var check_in = new Date(req.body.data_check_in_p).getTime();
    var check_out = new Date(req.body.data_check_out_p).getTime();

    var sql =
      "SELECT * FROM gestioneAffitti.casa WHERE gestioneAffitti.casa.id_casa = '" +
      req.session.id_casa +
      "'";

    con.query(sql, function (err, results) {
      console.log(results);
      if (
        err ||
        check_out < check_in ||
        check_in < results.prima_data ||
        check_out > results.ultima_data
      ) {
        console.log(err);
        res.sendFile(
          path.join(
            __dirname,
            "../Sistema_Alberghi/views",
            "NotificaPrenotazioneFallita.html"
          )
        );
        return;
      } else {
        var diffTime = check_out - check_in;
        var days = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        var giorni = parseInt(days);
        var tariffa = parseInt(results.tariffa_giornaliera);

        var prezzo = giorni * results.tariffa_giornaliera;
        console.log(giorni + " giorni");
        console.log(prezzo + " euro");
        if (
          req.body.viaggio_lavoro_p == false &&
          req.body.disabilita_p == false
        ) {
          var tasse = results.ammontare_tasse;
        } else {
          var tasse = results.ammontare_tasse / 2;
        }

        var totale = prezzo + results.ammontare_tasse;
        console.log(tasse);
        console.log(totale);

        res.render("SchermataPrezzo.html", {
          datiPrenotazione: giorni,
          prezzo,
          tasse,
          totale,
        });
      }
    });
  });
};
