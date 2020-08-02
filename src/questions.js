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

module.exports = questions;
