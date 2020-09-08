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

function convertiData(data) {
  date = new Date(data);
  year = date.getFullYear();
  month = date.getMonth() + 1;
  dt = date.getDate();

  if (dt < 10) {
    dt = "0" + dt;
  }
  if (month < 10) {
    month = "0" + month;
  }

  return (year + "-" + month + "-" + dt).toString();
}

module.exports = function (app) {
  app.post("/modificaCliente", function (req, res, err) {
    var sql =
      "UPDATE gestioneaffitti.utenteCliente set gestioneAffitti.utenteCliente.cognomeC = '" +
      req.body.cognome_iscrizioneP +
      "' set gestioneAffitti.utenteCliente.nomeC = '" +
      req.body.nome_iscrizioneP +
      "' set  gestioneAffitti.utenteCliente.emailC = '" +
      req.body.email_iscrizioneP +
      "' set gestioneAffitti.utenteCliente.passwordC = '" +
      req.body.password_iscrizioneP +
      "' WHERE gestioneAffitti.utenteCliente.emailC = '" +
      req.session.emailC +
      "' ";

    var sql2 =
      "SELECT gestioneAffitti.utenteCliente.nomeC, gestioneAffitti.utenteCliente.cognomeC, gestioneAffitti.utenteCliente.emailC FROM gestioneAffitti.utenteCliente WHERE gestioneAffitti.utenteCliente.emailC = '" +
      req.session.emailC +
      "' ";

    con.query(sql, function (err, results) {
      req.session.emailC = req.body.email_iscrizioneP;
      con.query(sql2, function (err, results) {
        if (err) {
          res.sendFile(
            path.join(
              __dirname,
              "../Sistema_Alberghi/views",
              "QualcosaStorto.html"
            )
          );
        } else {
          console.log(results);
          req.session.emailC = results[0].emailC;
          req.session.nomeC = results[0].nomeC;
          req.session.cognomeC = results[0].cognomeC;
          console.log(
            req.session.emailC + " ha modificato i dati correttamente."
          );
          res.render("SchermataProfiloClienteModificato.html", {
            modificaCliente: results,
          });
        }
      });
    });
  });

  app.get("/rendiconto", function (req, res) {
    var sql =
      "SELECT * FROM gestioneAffitti.prenotazione WHERE email_proprietario_t = '" +
      req.session.emailP +
      "' AND data_rendiconto = '" +
      +"'";

    con.query(sql, function (err, results) {
      if (results) {
        console.log("Prenotazioni con rendiconto da effettuare: ");
        console.log(results);
        var oggi = new Date().toISOString().slice(0, 19).replace("T", " ");
        var data_corrente = convertiData(oggi);
        for (var i = 0; i < results.lenght; i++) {
          var diffTime = data_corrente - results[i].check_out;
          var days = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          var giorni = parseInt(days);
          if (giorni >= 90) {
            var mailOptions = {
              from: "gedasistemabooking@gmail.com",
              to: indirizzo_ufficio_turismo,
              subject:
                "Rendiconto trimestrale di" +
                req.session.nomeP +
                " " +
                req.session.cognomeP,
              text: "Riepilogo prenotazione: " + results[i],
            };

            var sql2 =
              "UPDATE gestioneaffitti.prenotazione set gestioneAffitti.prenotazione.data_rendiconto = '" +
              data_corrente +
              "' WHERE gestioneAffitti.prenotazione.id_prenotazione = " +
              results[i].id_prenotazione +
              " ";
            console.log(
              "Rendiconto per la prenotazione " +
                results[i].id_prenotazione +
                " effettuato correttamente presso l'Ufficio del Turismo"
            );
            console.log(
              "Table PRENOTAZIONE aggiornata nella voce 'data_rendiconto'"
            );
          } else {
            continue;
          }
          con.query(sql2, function (err) {
            if (err) {
              console.log(err);
              res.sendFile(
                path.join(
                  __dirname,
                  "../Sistema_Alberghi/views",
                  "QualcosaStorto.html"
                )
              );
            } else {
              console.log("Nessuna prenotazione da rendicontare!");
              res.sendFile(
                path.join(
                  __dirname,
                  "../Sistema_Alberghi/views",
                  "OperazioneRiuscita.html"
                )
              );
            }
          });
        }
      } else {
        console.log("Nessuna prenotazione da rendicontare");
        res.sendFile(
          path.join(
            __dirname,
            "../Sistema_Alberghi/views",
            "OperazioneRiuscita.html"
          )
        );
      }
    });
  });
};
