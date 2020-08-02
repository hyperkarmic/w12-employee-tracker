const addRole = (connection, title, salary, departmentId) => {
  const query = `INSERT INTO role (title, salary, department_id) VALUES ("${title}", ${salary}, ${departmentId})`;

  const onQuery = (err, rows) => {
    if (err) throw err;

    console.log("Successfully added role to db");
    require("./init")(connection);
  };

  connection.query(query, onQuery);
};

module.exports = addRole;
