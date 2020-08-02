const inquirer = require("inquirer");

const questions = require("./questions");
const viewAllEmployees = require("./viewAllEmployees");
const viewEmployeesByDepartment = require("./viewEmployeesByDepartment");

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
  } catch (err) {
    throw err;
  }
};

module.exports = init;
