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
        req.session.emailC = null;
        console.log(results);
        res.sendFile(
          path.join(
            __dirname,
            "../Sistema_Alberghi/views",
            "NotificaProfiloEliminato.html"
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
      "DELETE FROM gestioneAffitti.utenteProprietario WHERE gestioneAffitti.utenteProprietario.emailP = '" +
      req.session.emailP +
      "' ";

    con.query(sql, function (err, results) {
      if (!err) {
        req.session.emailP = null;
        console.log(results);
        res.sendFile(
          path.join(
            __dirname,
            "../Sistema_Alberghi/views",
            "NotificaProfiloEliminato.html"
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

  app.post("/cancellaCasa", function (req, res, err) {
    var sql =
      "DELETE FROM gestioneAffitti.casa WHERE gestioneAffitti.casa.id_casa = " +
      req.session.id_casa +
      " ";

    con.query(sql, function (err, results) {
      if (!err) {
        console.log(results);
        var sql2 =
          "SELECT * FROM gestioneAffitti.utenteProprietario WHERE emailP = '" +
          req.session.emailP +
          "' ";
        con.query(sql2, function (err, results) {
          if (err) {
            console.log(err);
          } else if (results.length == 1) {
            console.log(results);
            req.session.emailP = results[0].emailP;
            console.log(
              req.session.emailP + " ha effettuato l'accesso correttamente."
            );
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
};
