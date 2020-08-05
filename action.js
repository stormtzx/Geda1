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
  app.get("/", function (req, res) {
    res.sendFile(
      path.join(
        __dirname,
        "../Sistema_Alberghi/views",
        "SchermataPrincipale.html"
      )
    );
  });

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

  app.post("/IscrizioneProprietario", function (req, res) {
    console.log(req.body);
    var sql =
      "insert into gestioneAffitti.utenteProprietario values('" +
      req.body.nome_iscrizioneP +
      "', '" +
      req.body.cognome_iscrizioneP +
      "', '" +
      req.body.email_iscrizioneP +
      "', '" +
      req.body.password_iscrizioneP +
      "')";
    con.query(sql, function (err) {
      if (err) {
        res.sendFile(
          path.join(
            __dirname,
            "../Sistema_Alberghi/views",
            "NotificaIscrizioneProprietarioFallita.html"
          )
        );
        return;
      }
      res.sendFile(
        path.join(
          __dirname,
          "../Sistema_Alberghi/views",
          "ConfermaIscrizioneProprietario.html"
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

  app.post("/accessoProprietario", function (req, res) {
    console.log(req.body);

    var sql =
      "SELECT gestioneAffitti.utenteProprietario.nome, gestioneAffitti.utenteProprietario.cognome, gestioneAffitti.utenteProprietario.email FROM gestioneAffitti.utenteProprietario WHERE gestioneAffitti.utenteProprietario.email = '" +
      req.body.email_loginP +
      "' AND gestioneAffitti.utenteProprietario.password = '" +
      req.body.password_loginP +
      "' ";

    con.query(sql, function (err, results) {
      if (results.length > 0) {
        console.log(results);
        res.render("SchermataProfiloProprietario.html", {
          accessoProprietario: results,
        });
        req.session.emailP = req.body.email_loginP;
      } else {
        res.sendFile(
          path.join(
            __dirname,
            "../Sistema_Alberghi/views",
            "NotificaLoginProprietarioFallito.html"
          )
        );
      }
    });
  });

  app.post("/nuovaCasa", function (req, res) {
    console.log(req.body);
    if (req.body.beb_nc == undefined) req.body.beb_nc = false;
    if (req.body.casa_vacanza_nc == undefined) req.body.casa_vacanza_nc = false;
    if (req.body.fasciatoio_nc == undefined) req.body.fasciatoio_nc = false;
    if (req.body.segnalatore_fumo_nc == undefined)
      req.body.segnalatore_fumo_nc = false;
    if (req.body.servizi_disabili_nc == undefined)
      req.body.servizi_disabili_nc = false;
    if (req.body.animali_nc == undefined) req.body.animali_nc = false;
    if (req.body.cucina_nc == undefined) req.body.cucina_nc = false;
    if (req.body.disponibilità_nc == undefined)
      req.body.disponibilità_nc = false;

    var sql =
      "insert into gestioneAffitti.casa values('" +
      req.body.indirizzo_nc +
      "', " +
      req.body.beb_nc +
      ", " +
      req.body.casa_vacanza_nc +
      ", '" +
      req.body.camere_nc +
      "', '" +
      req.body.bagni_nc +
      "', '" +
      req.body.perimetro_nc +
      "', '" +
      req.body.tariffa_nc +
      "', " +
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
      req.session.emailP +
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
