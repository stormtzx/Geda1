var mysql = require("mysql");
var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "unipa",
  database: "gestioneAffitti",
});

function crea_tableUtenteCliente() {
  var sql =
    "CREATE TABLE IF NOT EXISTS utenteCliente(nome VARCHAR(50) not null, cognome VARCHAR(50) not null, email VARCHAR(50) not null, password VARCHAR (20) not null, PRIMARY KEY(email))";
  con.query(sql, function (err, result) {
    if (err) throw err;
    console.log("Table UTENTE-CLIENTE creata");
  });
}

function crea_tableUtenteProprietario() {
  var sql =
    "CREATE TABLE IF NOT EXISTS utenteProprietario(nome VARCHAR(50) not null, cognome VARCHAR(50) not null, email VARCHAR(50) not null, password VARCHAR (20) not null, PRIMARY KEY(email))";
  con.query(sql, function (err, result) {
    if (err) throw err;
    console.log("Table UTENTE-PROPRIETARIO creata");
  });
}

function crea_tableCasa() {
  var sql =
    "CREATE TABLE IF NOT EXISTS casa(indirizzo VARCHAR(100) not null, città VARCHAR(100) not null, proprietario VARCHAR(50) references utenteProprietario(email), beb boolean, casa_vacanza boolean, numero_camere int, numero_bagno int, perimetro_casa float not null, tariffa_giornaliera float not null, fasciatoio boolean, segnalatori_fumo boolean, servizi_disabili boolean, animali_ammessi boolean, cucina boolean, prima_data date not null, ultima_data date not null, PRIMARY KEY(indirizzo, città, proprietario))";
  con.query(sql, function (err, result) {
    if (err) throw err;
    console.log("Table CASA creata");
  });
}

function crea_tablePrenotazione() {
  var sql =
    "CREATE TABLE IF NOT EXISTS prenotazione(cliente varchar(50) references utenteCliente(email),ref_casa character(50) references casa(indirizzo), data_emissione date not null, check_in date not null, check_out date not null, prezzo float not null, ammontare_tasse float not null, prezzo_totale float not null, primary key(cliente, ref_casa, data_emissione))";
  con.query(sql, function (err, result) {
    if (err) throw err;
    console.log("Table PRENOTAZIONE creata");
  });
}

module.exports = {
  crea_tableUtenteCliente,
  crea_tableUtenteProprietario,
  crea_tableCasa,
  crea_tablePrenotazione,
};
