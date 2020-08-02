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
        name: "View employees by Role",
        value: "employeesByRoles",
        short: "View employees by role",
      },
      {
        name: "View employees By Manager",
        value: "employeesByManager",
        short: "employees by manager",
      },
      {
        name: "Add employee",
        value: "addEmployee",
        short: "Add employee",
      },
      {
        name: "Add Department",
        value: "addDepartment",
        short: "Add department",
      },
      {
        name: "Add role",
        value: "addRole",
        short: "Add Role",
      },
      {
        name: "Update Employee Role",
        value: "updateRole",
        short: "Update Role",
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
