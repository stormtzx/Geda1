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
    "CREATE TABLE IF NOT EXISTS casa(id_casa CHARACTER(8) NOT NULL, nome VARCHAR(50) NOT NULL, indirizzo VARCHAR(100) NOT NULL, tipo_abitazione boolean NOT NULL, numero_camere int, numero_bagno int, perimetro_casa float NOT NULL, tariffa_giornaliera float NOT NULL, fasciatoio boolean NOT NULL, segnalatori_fumo boolean NOT NULL, servizi_disabili boolean NOT NULL, animali_ammessi boolean NOT NULL, cucina boolean NOT NULL, periodo_disponibilità boolean NOT NULL, proprietario VARCHAR(50) REFERENCES utenteProprietario(email),PRIMARY KEY(id_casa))";
  con.query(sql, function (err, result) {
    if (err) throw err;
    console.log("Table CASA creata");
  });
}

function crea_tablePrenotazione() {
  var sql =
    "CREATE TABLE IF NOT EXISTS prenotazione(id_cliente varchar(50) references utenteCliente(email),ref_casa character(50) references casa(id_casa), data_emissione date not null, check_in date not null, check_out date not null, prezzo float not null, ammontare_tasse float not null, prezzo_totale float not null, primary key(id_cliente, ref_casa, data_emissione))";
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
