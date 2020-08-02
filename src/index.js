const mysql = require("mysql");
const init = require("./init");
//dependency importation

const dbOptions = {
  host: "localhost",
  port: 3306,
  database: "roster_db",
  user: "root",
  password: "password1!",
  multipleStatements: true,
};
//this object allows database connection

const connection = mysql.createConnection(dbOptions);
//mysql connection

const onConnect = (err) => {
  if (err) {
    throw err;
  }
  console.log("successfully connected to DB!");
  init(connection);
};
//confirms connection of fires error handling

connection.connect(onConnect);
