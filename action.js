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
      "insert into gestioneAffitti.utenteCliente values('" +
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
        req.session.emailC = req.body.email_loginC;
        req.session.nomeC = results[0].nome;
        req.session.cognomeC = results[0].cognome;
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
      "SELECT gestioneAffitti.utenteCliente.nome, gestioneAffitti.utenteCliente.cognome, gestioneAffitti.utenteCliente.email FROM gestioneAffitti.utenteCliente WHERE gestioneAffitti.utenteCliente.email = '" +
      req.body.email_loginP +
      "' AND gestioneAffitti.utenteCliente.password = '" +
      req.body.password_loginP +
      "' ";

    con.query(sql, function (err, results) {
      if ((results.length = 1)) {
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
      "SELECT gestioneAffitti.utenteCliente.email FROM gestioneAffitti.utenteCliente WHERE gestioneAffitti.utenteCliente.email = '" +
      req.session.emailP +
      "' ";

    con.query(sql, function (err) {
      if (err) {
        res.sendFile(
          path.join(
            __dirname,
            "../Sistema_Alberghi/views",
            "NotificaLogoutFallito.html"
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

  app.get("/logoutCliente", function (req, res) {
    console.log(req.body);
    req.session.emailC;

    var sql =
      "SELECT gestioneAffitti.utenteCliente.email FROM gestioneAffitti.utenteCliente WHERE gestioneAffitti.utenteCliente.email = '" +
      req.session.emailC +
      "' ";

    con.query(sql, function (err) {
      if (err) {
        res.sendFile(
          path.join(
            __dirname,
            "../Sistema_Alberghi/views",
            "NotificaLogoutFallito.html"
          )
        );
        return;
      } else {
        req.session.emailC = null;
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

  app.post("/recuperaPasswordProprietario", function (req, res) {
    console.log(req.body);

    var sql =
      "SELECT gestioneAffitti.utenteProprietario.email, gestioneAffitti.utenteProprietario.password FROM gestioneAffitti.utenteProprietario WHERE gestioneAffitti.utenteProprietario.email = '" +
      req.body.email_R +
      "' ";

    con.query(sql, function (err, results) {
      if (results.length > 0) {
        console.log(results);
        var pwd = new String(results[0].password);

        var mailOptions = {
          from: "gedasistemabooking@gmail.com",
          to: req.body.email_R,
          subject: "Recupero password",
          text: "La password è: " + pwd,
        };
        transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            return console.log(error);
          }
          console.log("Message %s sent: %s", info.messageId, info.response);
        });
        res.sendFile(
          path.join(
            __dirname,
            "../Sistema_Alberghi/views",
            "LogoutRiuscito.html"
          )
        );
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

  app.post("/recuperaPasswordCliente", function (req, res) {
    console.log(req.body);

    var sql =
      "SELECT gestioneAffitti.utenteCliente.email, gestioneAffitti.utenteCliente.password FROM gestioneAffitti.utenteCliente WHERE gestioneAffitti.utenteCliente.email = '" +
      req.body.email_R +
      "' ";

    con.query(sql, function (err, results) {
      if (results.length > 0) {
        console.log(results);
        var pwd = new String(results[0].password);

        var mailOptions = {
          from: "gedasistemabooking@gmail.com",
          to: req.body.email_R,
          subject: "Recupero password",
          text: "La password è: " + pwd,
        };
        transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            return console.log(error);
          }
          console.log("Message %s sent: %s", info.messageId, info.response);
        });
        res.sendFile(
          path.join(
            __dirname,
            "../Sistema_Alberghi/views",
            "LogoutRiuscito.html"
          )
        );
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
};
