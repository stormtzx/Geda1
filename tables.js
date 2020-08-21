var mysql = require("mysql");
var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "unipa",
  database: "gestioneAffitti",
});

function crea_tableUtenteCliente() {
  var sql =
    "CREATE TABLE IF NOT EXISTS utenteCliente(nomeC VARCHAR(50) not null, cognomeC VARCHAR(50) not null, emailC VARCHAR(50) not null, passwordC VARCHAR (20) not null, PRIMARY KEY(emailC))";
  con.query(sql, function (err, result) {
    if (err) throw err;
    console.log("Table UTENTE-CLIENTE creata");
  });
}

function crea_tableUtenteProprietario() {
  var sql =
    "CREATE TABLE IF NOT EXISTS utenteProprietario(nomeP VARCHAR(50) not null, cognomeP VARCHAR(50) not null, emailP VARCHAR(50) not null, passwordP VARCHAR (20) not null, PRIMARY KEY(emailP))";
  con.query(sql, function (err, result) {
    if (err) throw err;
    console.log("Table UTENTE-PROPRIETARIO creata");
  });
}

function crea_tableCasa() {
  var sql =
    "CREATE TABLE IF NOT EXISTS casa(id_casa INT AUTO_INCREMENT, nome_casa VARCHAR(50) NOT NULL, indirizzo VARCHAR(100) not null, citta VARCHAR(100) not null, proprietario VARCHAR(50) references utenteProprietario(emailP), beb boolean, casa_vacanza boolean, numero_camere int, numero_bagno int, perimetro_casa float not null, tariffa_giornaliera float not null, ammontare_tasse float not null, capienza_max int not null, fasciatoio boolean, segnalatori_fumo boolean, servizi_disabili boolean, animali_ammessi boolean, cucina boolean, prima_data date not null, ultima_data date not null, PRIMARY KEY(id_casa))";
  con.query(sql, function (err, result) {
    if (err) throw err;
    console.log("Table CASA creata");
  });
}

function crea_tablePrenotazione() {
  var sql =
    "CREATE TABLE IF NOT EXISTS prenotazione(id_prenotazione int auto_increment, ref_casa int references casa(id_casa), ref_proprietario VARCHAR(50) references utenteProprietario(emailP), ref_nome_casa VARCHAR(50) references casa(nome_casa), nome_cliente varchar(50) references utenteCliente(nomeC), cognome_cliente varchar(50) references utenteCliente(cognomeC), email_cliente VARCHAR(50) references utenteCliente(emailC), numero_ospiti_adulti int not null, numero_ospiti_bambini int, data_emissione date not null, check_in date not null, check_out date not null, animali boolean not null, disabilita boolean not null, viaggio_lavoro boolean not null, prezzo float not null, tasse float not null, prezzo_totale float not null, primary key(id_prenotazione))";
  con.query(sql, function (err, result) {
    if (err) throw err;
    console.log("Table PRENOTAZIONE creata");
  });
}

function crea_tableData() {
  var sql =
    "CREATE TABLE IF NOT EXISTS data(data_soggiorno date not null, ref_casa_o int references casa(id_casa), disponibilita boolean, primary key (data_soggiorno, ref_casa_o))";
  con.query(sql, function (err, result) {
    if (err) throw err;
    console.log("Table DATA creata");
  });
}

module.exports = {
  crea_tableUtenteCliente,
  crea_tableUtenteProprietario,
  crea_tableCasa,
  crea_tablePrenotazione,
  crea_tableData,
};
