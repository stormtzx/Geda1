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

var nodemailer = require("nodemailer");

var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "unipa",
  database: "gestioneAffitti",
});

var transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: "gedasistemabooking@gmail.com",
    pass: "unipa2020",
  },
});

module.exports = function (app) {
  app.post("/modificaCliente", function (req, res, err) {
    var sql =
      "UPDATE gestioneaffitti.utenteCliente set gestioneAffitti.utenteCliente.cognomeC = '" +
      req.body.cognome_iscrizioneC +
      "', gestioneAffitti.utenteCliente.nomeC = '" +
      req.body.nome_iscrizioneC +
      "', gestioneAffitti.utenteCliente.emailC = '" +
      req.body.email_iscrizioneC +
      "', gestioneAffitti.utenteCliente.passwordC = '" +
      req.body.password_iscrizioneC +
      "' WHERE gestioneAffitti.utenteCliente.emailC = '" +
      req.session.emailC +
      "' ";

    con.query(sql, function (err, results) {
      console.log(results);
      req.session.emailC = req.body.email_iscrizioneC;
      var sql2 =
        "SELECT gestioneAffitti.utenteCliente.nomeC, gestioneAffitti.utenteCliente.cognomeC, gestioneAffitti.utenteCliente.emailC FROM gestioneAffitti.utenteCliente WHERE gestioneAffitti.utenteCliente.emailC = '" +
        req.session.emailC +
        "' ";
      con.query(sql2, function (err, results) {
        if (results.length == 1) {
          console.log(results);
          req.session.emailC = results[0].emailC;
          req.session.nomeC = results[0].nomeC;
          req.session.cognomeC = results[0].cognomeC;
          console.log(
            req.session.emailC + " ha effettuato l'accesso correttamente."
          );
          res.render("SchermataProfiloCliente.html", {
            accessoCliente: results,
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
    });
  });
};
