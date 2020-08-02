const addEmployee = (connection, firstName, lastName, roleId) => {
  const query = `INSERT INTO employee (first_name, last_name, role_id) VALUES ("${firstName}", "${lastName}", ${roleId})`;

  const onQuery = (err, rows) => {
    if (err) throw err;

    console.log("Successfully added employee to db");
    require("./init")(connection);
  };

  connection.query(query, onQuery);
};

module.exports = addEmployee;
