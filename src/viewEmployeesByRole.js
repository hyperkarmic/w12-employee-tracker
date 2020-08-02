const viewEmployeesByRole = (connection, roleId) => {
  const query = `
        SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name as department, CONCAT(manager.first_name, ' ', manager.last_name) AS manager
        FROM employee LEFT JOIN role on employee.role_id = role.id
        LEFT JOIN department on role.department_id = department.id
        LEFT JOIN employee manager on manager.id = employee.manager_id
        WHERE role.id=${roleId};
        `;

  //query  for 'view Employees by roll'

  const onQuery = (err, rows) => {
    if (err) throw err;
    console.table(rows);

    require("./init")(connection);
  };

  connection.query(query, onQuery);
};

module.exports = viewEmployeesByRole;
