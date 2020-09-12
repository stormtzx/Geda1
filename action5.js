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
  app.post("/cancellaCliente", function (req, res, err) {
    var sql =
      "DELETE FROM gestioneAffitti.utenteCliente WHERE gestioneAffitti.utenteCliente.emailC = '" +
      req.session.emailC +
      "' ";

    con.query(sql, function (err, results) {
      if (!err) {
        req.session.emailC = "";
        console.log(results);
        res.sendFile(
          path.join(
            __dirname,
            "../Sistema_Alberghi/views",
            "OperazioneRiuscita.html"
          )
        );
      } else {
        console.log(results);
        res.sendFile(
          path.join(
            __dirname,
            "../Sistema_Alberghi/views",
            "QualcosaStorto.html"
          )
        );
      }
    });
  });

  app.post("/cancellaProprietario", function (req, res, err) {
    var sql =
      "DELETE FROM gestioneAffitti.utenteProprietario WHERE emailP = '" +
      req.session.emailP +
      "' ";

    con.query(sql, function (err, results) {
      console.log(results);
      if (!err) {
        req.session.emailP = "";
        console.log(results);
        res.sendFile(
          path.join(
            __dirname,
            "../Sistema_Alberghi/views",
            "OperazioneRiuscita.html"
          )
        );
      } else {
        console.log(results);
        res.sendFile(
          path.join(
            __dirname,
            "../Sistema_Alberghi/views",
            "QualcosaStorto.html"
          )
        );
        console.log(err);
      }
    });
  });

  app.post("/cancellaCasa", function (req, res, err) {
    var sql =
      "DELETE FROM gestioneAffitti.casa WHERE gestioneAffitti.casa.id_casa = " +
      req.session.id_casa +
      " ";

    con.query(sql, function (err, results) {
      if (!err) {
        console.log("CASA eliminata correttamente");
        res.sendFile(
          path.join(
            __dirname,
            "../Sistema_Alberghi/views",
            "OperazioneRiuscita.html"
          )
        );
        var sql2 =
          "SELECT * FROM gestioneAffitti.utenteProprietario WHERE emailP = '" +
          req.session.emailP +
          "' ";
        con.query(sql2, function (err, results) {
          if (err) {
            console.log(err);
            res.sendFile(
              path.join(
                __dirname,
                "../Sistema_Alberghi/views",
                "QualcosaStorto.html"
              )
            );
          } else if (results.length == 1) {
            req.session.emailP = results[0].emailP;
            res.render("SchermataProfiloProprietario.html", {
              accessoProprietario: results,
            });
          } else {
            res.sendFile(
              path.join(
                __dirname,
                "../Sistema_Alberghi/views",
                "QualcosaStorto.html"
              )
            );
          }
        });
      } else {
        console.log(results);
        res.sendFile(
          path.join(
            __dirname,
            "../Sistema_Alberghi/views",
            "QualcosaStorto.html"
          )
        );
      }
    });
  });

  app.post("/cancellaPrenotazione", function (req, res, err) {
    var sql =
      "DELETE FROM gestioneAffitti.prenotazione WHERE gestioneAffitti.prenotazione.id_prenotazione = " +
      req.session.id_prenotazione_r +
      " ";

    con.query(sql, function (err, results) {
      if (!err) {
        console.log("Prenotazione eliminata correttamente");
        res.sendFile(
          path.join(
            __dirname,
            "../Sistema_Alberghi/views",
            "OperazioneRiuscita.html"
          )
        );
      } else {
        console.log(err);
        res.sendFile(
          path.join(
            __dirname,
            "../Sistema_Alberghi/views",
            "QualcosaStorto.html"
          )
        );
      }
    });
  });

  app.post("/cancellaFoto", function (req, res, err) {
    var sql =
      "DELETE FROM gestioneAffitti.foto WHERE gestioneAffitti.prenotazione.ref_casa_f = " +
      req.session.id_casa +
      " ";

    con.query(sql, function (err, results) {
      if (!err) {
        console.log(results);
        var sql2 =
          "SELECT * FROM gestioneAffitti.casa WHERE gestioneAffitti.casa.id_casa = " +
          req.session.id_casa +
          " ";
        con.query(sql2, function (err, results) {
          if (err) {
            console.log(err);
          } else if (results.length == 1) {
            console.log(results);
            console.log(results[0].id_casa);
            req.session.id_casa = results[0].id_casa;
            console.log(`session: ${req.session.id_casa}`);
            req.session.nome_casa = results[0].nome_casa;
            req.session.indirizzo = results[0].indirizzo;
            req.session.citta = results[0].citta;

            res.render("SchermataGestioneCasa.html", { gestioneCasa: results });
          } else {
            res.sendFile(
              path.join(
                __dirname,
                "../Sistema_Alberghi/views",
                "QualcosaStorto.html"
              )
            );
          }
        });
      } else {
        console.log(results);
        res.sendFile(
          path.join(
            __dirname,
            "../Sistema_Alberghi/views",
            "QualcosaStorto.html"
          )
        );
      }
    });
  });
};
