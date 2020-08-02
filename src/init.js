const inquirer = require("inquirer");

const init = async () => {
  const questions = [
    {
      message: "What would you like to do?",
      name: "action",
      type: "list",
      choices: [
        {
          name: "View All Employees",
          value: "viewAll",
          short: "View All Employees",
        },

        {
          name: "View All Employees By Department",
          value: "empByDepartment",
          short: "Employees By Department",
        },

        {
          name: "view employees by Roles",
          value: "employeesByRoles",
          short: "View employees by roles",
        },
        {
          name: "View employees By Manager",
          value: "employeesByManager",
          short: "employees by manager",
        },
        {
          name: "add employee",
          value: "addEmployee",
          short: "add employee",
        },
        {
          name: "add Department",
          value: "addDepartment",
          short: "add department",
        },
        {
          name: "add role",
          value: "addRole",
          short: "Add Role",
        },
        {
          name: "View All Employees",
          value: "viewAllEmployees",
          short: "View All Employees",
        },
        {
          name: "Update Employee Roll",
          value: "updateRoll",
          short: "Update Roll",
        },
        {
          name: "Update Employee Manager",
          value: "updateManager",
          short: "Update Employee Manager",
        },
        {
          name: "finish",
          value: "finish",
          short: "finish",
        },
      ],
    },
  ];

  const { action } = await inquirer.prompt(questions);

  if (action === "viewAll") {
    const query = `
      SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name as department, CONCAT(manager.first_name, ' ', manager.last_name) AS manager
      FROM employee LEFT JOIN role on employee.role_id = role.id
      LEFT JOIN department on role.department_id = department.id
      LEFT JOIN employee manager on manager.id = employee.manager_id;
      `;

    const onQuery = (err, rows) => {
      if (err) throw err;
      console.table(rows);

      init();
    };

    connection.query(query, onQuery);
  }
};

module.exports = init;
