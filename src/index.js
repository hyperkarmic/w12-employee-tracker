const mysql = require("mysql");
const init = require("./init");

const dbOptions = {
  host: "localhost",
  port: 3306,
  database: "roster_db",
  user: "root",
  password: "password1!",
  multipleStatements: true,
};

const connection = mysql.createConnection(dbOptions);

const onConnect = (err) => {
  if (err) {
    throw err;
  }
  console.log("successfully connected to DB!");
  init(connection);
};

connection.connect(onConnect);
