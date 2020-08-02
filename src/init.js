const inquirer = require("inquirer");

const questions = require("./questions");
const viewAllEmployees = require("./viewAllEmployees");
const viewEmployeesByDepartment = require("./viewEmployeesByDepartment");
const viewEmployeesByRole = require("./viewEmployeesByRole");
const viewEmployeesByManager = require("./viewEmployeesByRole copy");

const init = async (connection) => {
  try {
    const { action } = await inquirer.prompt(questions);

    if (action === "viewAll") {
      viewAllEmployees(connection);
    }
    if (action === "empByDepartment") {
      const query = "SELECT * FROM department";

      const onQuery = async (err, rows) => {
        if (err) {
          throw err;
        }

        const choices = rows.map((row) => {
          return {
            name: row.name,
            value: row.id,
            short: row.name,
          };
        });

        const departmentQuestions = [
          {
            message: "Select a Department:",
            name: "departmentId",
            type: "list",
            choices,
          },
        ];

        const { departmentId } = await inquirer.prompt(departmentQuestions);
        viewEmployeesByDepartment(connection, departmentId);
      };

      connection.query(query, onQuery);
    }
    if (action === "employeesByRoles") {
      const query = "SELECT * FROM role";

      const onQuery = async (err, rows) => {
        if (err) {
          throw err;
        }

        const choices = rows.map((row) => {
          return {
            name: row.title,
            value: row.id,
            short: row.title,
          };
        });

        const roleQuestions = [
          {
            message: "Select a Role:",
            name: "roleId",
            type: "list",
            choices,
          },
        ];

        const { roleId } = await inquirer.prompt(roleQuestions);
        viewEmployeesByRole(connection, roleId);
      };

      connection.query(query, onQuery);
    }
    if (action === "employeesByManager") {
      const query = `SELECT employee.id, employee.first_name, employee.last_name FROM employee
      INNER JOIN (SELECT DISTINCT(manager_id) FROM roster_db.employee WHERE manager_id IS NOT NULL) as manager
      on employee.id = manager.manager_id`;

      const onQuery = async (err, rows) => {
        if (err) {
          throw err;
        }

        const choices = rows.map((row) => {
          return {
            name: `${row.first_name} ${row.last_name}`,
            value: row.id,
            short: `${row.first_name} ${row.last_name}`,
          };
        });

        const managerQuestions = [
          {
            message: "Select a Manager:",
            name: "managerId",
            type: "list",
            choices,
          },
        ];

        const { managerId } = await inquirer.prompt(managerQuestions);
        viewEmployeesByManager(connection, managerId);
      };

      connection.query(query, onQuery);
    }
    if (action === "addDepartment") {
      const addDepartmentQuestions = [
        {
          message: "Department Name:",
          name: "name",
        },
      ];

      const { name } = await inquirer.prompt(addDepartmentQuestions);

      const query = `INSERT INTO department (name) VALUES ("${name}") `;

      const onQuery = (err, rows) => {
        if (err) {
          throw err;
        }
        console.log("Successfully added department to db");
        init(connection);
      };

      connection.query(query, onQuery);
    }
  } catch (err) {
    throw err;
  }
};

module.exports = init;
