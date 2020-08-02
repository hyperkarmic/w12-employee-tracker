const inquirer = require("inquirer");

const questions = require("./questions");
const viewAllEmployees = require("./viewAllEmployees");

const init = async (connection) => {
  try {
    const { action } = await inquirer.prompt(questions);

    if (action === "viewAll") {
      viewAllEmployees(connection);
    }
  } catch (err) {
    throw err;
  }
};

module.exports = init;
