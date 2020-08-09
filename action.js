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
        req.session.emailP = req.body.email_loginP;
        res.render("SchermataProfiloProprietario.html", {
          accessoProprietario: results,
        });
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

  app.get("/logoutProprietario", function (req, res) {
    console.log(req.body);
    req.session.emailP;

    var sql =
      "SELECT gestioneAffitti.utenteProprietario.nome, gestioneAffitti.utenteProprietario.cognome, gestioneAffitti.utenteProprietario.email FROM gestioneAffitti.utenteProprietario WHERE gestioneAffitti.utenteProprietario.email = '" +
      req.session.emailP +
      "' ";

    con.query(sql, function (err) {
      if (err) {
        res.sendFile(
          path.join(
            __dirname,
            "../Sistema_Alberghi/views",
            "NotificaLogutFallita.html"
          )
        );
        return;
      } else {
        req.session.emailP = null;
        res.sendFile(
          path.join(
            __dirname,
            "../Sistema_Alberghi/views",
            "LogoutRiuscito.html"
          )
        );
      }
    });
  });
};
