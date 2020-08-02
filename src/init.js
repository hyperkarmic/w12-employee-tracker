const inquirer = require("inquirer");

const questions = require("./questions");
const viewAllEmployees = require("./viewAllEmployees");
const viewEmployeesByDepartment = require("./viewEmployeesByDepartment");
const viewEmployeesByRole = require("./viewEmployeesByRole");
const viewEmployeesByManager = require("./viewEmployeesByManager");
const addEmployee = require("./addEmployee");
const addRole = require("./addRole");

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
    if (action === "addEmployee") {
      const query = `SELECT * FROM role`;

      const onQuery = async (err, rows) => {
        if (err) {
          throw err;
        }
        const roles = rows;
        const choices = roles.map((role) => {
          return {
            name: role.title,
            value: role.id,
            short: role.title,
          };
        });

        const addEmployeeQuestions = [
          {
            message: "What is your first name?",
            name: "firstName",
            type: "input",
          },
          {
            message: "What is your last name?",
            name: "lastName",
            type: "input",
          },
          {
            message: "Select a role",
            name: "roleId",
            type: "list",
            choices: choices,
          },
        ];

        const { firstName, lastName, roleId } = await inquirer.prompt(
          addEmployeeQuestions
        );

        addEmployee(connection, firstName, lastName, roleId);
      };

      connection.query(query, onQuery);
    }
    if (action === "addRole") {
      const query = `SELECT * FROM department`;

      const onQuery = async (err, rows) => {
        if (err) {
          throw err;
        }
        const departments = rows;
        const choices = departments.map((department) => {
          return {
            name: department.name,
            value: department.id,
            short: department.name,
          };
        });

        const addRoleQuestions = [
          {
            message: "What is the name of the role?",
            name: "title",
            type: "input",
          },
          {
            message: "What is the salary?",
            name: "salary",
            type: "input",
          },
          {
            message: "Select a department",
            name: "departmentId",
            type: "list",
            choices: choices,
          },
        ];

        const { title, salary, departmentId } = await inquirer.prompt(
          addRoleQuestions
        );

        addRole(connection, title, salary, departmentId);
      };

      connection.query(query, onQuery);
    }
    if (action === "updateRole") {
      const employeesQuery = "SELECT * FROM employee;SELECT * FROM role";

      const onQuery = async (err, [employees, roles]) => {
        if (err) {
          throw err;
        }

        const employeeChoices = employees.map((employee) => {
          return {
            name: `${employee.first_name} ${employee.last_name}`,
            value: employee.id,
            short: `${employee.first_name} ${employee.last_name}`,
          };
        });

        const employeeQuestions = [
          {
            message: "Select your employee:",
            name: "employeeId",
            type: "list",
            choices: employeeChoices,
          },
        ];

        const { employeeId } = await inquirer.prompt(employeeQuestions);

        const roleChoices = roles.map((role) => {
          return {
            name: role.title,
            value: role.id,
            short: role.title,
          };
        });

        const roleQuestions = [
          {
            message: "Select your role:",
            name: "roleId",
            type: "list",
            choices: roleChoices,
          },
        ];

        const { roleId } = await inquirer.prompt(roleQuestions);

        const updateRoleQuery = `UPDATE employee SET role_id=${roleId} WHERE id=${employeeId} `;

        const onQuery = (err) => {
          if (err) {
            throw err;
          }
          console.log("Successfully updated role in db!");
          init(connection);
        };

        connection.query(updateRoleQuery, onQuery);
      };

      connection.query(employeesQuery, onQuery);
    }
    if (action === "updateManager") {
      const employeesQuery = "SELECT * FROM employee";
      const managersQuery = `SELECT employee.id, employee.first_name, employee.last_name FROM employee
      INNER JOIN (SELECT DISTINCT(manager_id) FROM roster_db.employee WHERE manager_id IS NOT NULL) as manager
      on employee.id = manager.manager_id`;

      const query = `${employeesQuery};${managersQuery}`;

      const onQuery = async (err, [employees, managers]) => {
        if (err) {
          throw err;
        }

        const employeeChoices = employees.map((employee) => {
          return {
            name: `${employee.first_name} ${employee.last_name}`,
            value: employee.id,
            short: `${employee.first_name} ${employee.last_name}`,
          };
        });

        const employeeQuestions = [
          {
            message: "Select your employee:",
            name: "employeeId",
            type: "list",
            choices: employeeChoices,
          },
        ];

        const { employeeId } = await inquirer.prompt(employeeQuestions);

        const managerChoices = managers.map((manager) => {
          return {
            name: `${manager.first_name} ${manager.last_name}`,
            value: manager.id,
            short: `${manager.first_name} ${manager.last_name}`,
          };
        });

        const managerQuestions = [
          {
            message: "Select your Manager:",
            name: "managerId",
            type: "list",
            choices: managerChoices,
          },
        ];

        const { managerId } = await inquirer.prompt(managerQuestions);

        const updateManagerQuery = `UPDATE employee SET manager_id=${managerId} WHERE id=${employeeId} `;

        const onQuery = (err) => {
          if (err) {
            throw err;
          }
          console.log("Successfully updated manager in db!");
          init(connection);
        };

        connection.query(updateManagerQuery, onQuery);
      };

      connection.query(query, onQuery);
    }
    if (action === "finish") {
      process.exit();
    }
  } catch (err) {
    throw err;
  }
};

module.exports = init;
