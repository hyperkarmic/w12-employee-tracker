const inquirer = require("inquirer");
//inquirer imported

const questions = require("./questions");
const viewAllEmployees = require("./viewAllEmployees");
const viewEmployeesByDepartment = require("./viewEmployeesByDepartment");
const viewEmployeesByRole = require("./viewEmployeesByRole");
const viewEmployeesByManager = require("./viewEmployeesByManager");
const addEmployee = require("./addEmployee");
const addRole = require("./addRole");
//questions and query functionality imported

//init is asynchronous - and takes in connection as an argument
const init = async (connection) => {
  try {
    const { action } = await inquirer.prompt(questions);
    //on connection, questions asked by inquirer

    if (action === "viewAll") {
      viewAllEmployees(connection);
      //this fires viewallEmployees function
    }
    if (action === "empByDepartment") {
      //on selection of department, a query is made, that returns employees of that department
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
        //employees in department mapped to this object structure

        const departmentQuestions = [
          {
            message: "Select a Department:",
            name: "departmentId",
            type: "list",
            choices,
          },

          //using inquirer to select a departent
        ];

        const { departmentId } = await inquirer.prompt(departmentQuestions);
        viewEmployeesByDepartment(connection, departmentId);
      };

      connection.query(query, onQuery);
    }
    if (action === "employeesByRoles") {
      //this allows the viewing of all employees in a particular role
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
        //this object provides a sructure for returned information

        const roleQuestions = [
          {
            message: "Select a Role:",
            name: "roleId",
            type: "list",
            choices,
          },
        ];
        //this inquirer question allows us to select a role to find employees.

        const { roleId } = await inquirer.prompt(roleQuestions);
        viewEmployeesByRole(connection, roleId);
      };

      connection.query(query, onQuery);
    }
    if (action === "employeesByManager") {
      const query = `SELECT employee.id, employee.first_name, employee.last_name FROM employee
      INNER JOIN (SELECT DISTINCT(manager_id) FROM roster_db.employee WHERE manager_id IS NOT NULL) as manager
      on employee.id = manager.manager_id`;
      //this provides a query to find employees by their amanger

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
        //the above object provides a structure for returned information.

        const managerQuestions = [
          {
            message: "Select a Manager:",
            name: "managerId",
            type: "list",
            choices,
          },
        ];
        //this inquirer question provides functionality to ask about managers - in order to get employee information

        const { managerId } = await inquirer.prompt(managerQuestions);
        viewEmployeesByManager(connection, managerId);
      };

      connection.query(query, onQuery);
    }
    if (action === "addDepartment") {
      //this function adds functionality to 'add department'
      const addDepartmentQuestions = [
        {
          message: "Department Name:",
          name: "name",
        },
      ];

      const { name } = await inquirer.prompt(addDepartmentQuestions);

      const query = `INSERT INTO department (name) VALUES ("${name}") `;
      //this is an 'insert into' query

      const onQuery = (err, rows) => {
        if (err) {
          throw err;
        }
        console.log("Successfully added department to db");
        //this confirms connection was succesful
        init(connection);
      };

      connection.query(query, onQuery);
    }
    if (action === "addEmployee") {
      //this provides 'add an employee' functionality
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
        //above object provides structure for returned data

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

        //inquirer questions allows an employee/role to be added

        const { firstName, lastName, roleId } = await inquirer.prompt(
          addEmployeeQuestions
        );

        addEmployee(connection, firstName, lastName, roleId);
      };

      connection.query(query, onQuery);
    }
    if (action === "addRole") {
      const query = `SELECT * FROM department`;

      //this allows 'add role' functionality

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
        //the above provides a structure for returned department information

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

        //the above allows for questions about role to be added

        const { title, salary, departmentId } = await inquirer.prompt(
          addRoleQuestions
        );

        addRole(connection, title, salary, departmentId);
      };

      connection.query(query, onQuery);
    }
    if (action === "updateRole") {
      const employeesQuery = "SELECT * FROM employee;SELECT * FROM role";
      //this provides the query to 'update role'

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
        //the above object will provide structure for returned data

        const employeeQuestions = [
          {
            message: "Select your employee:",
            name: "employeeId",
            type: "list",
            choices: employeeChoices,
          },
        ];
        //the above questions provide relevant data for 'update' re:employees

        const { employeeId } = await inquirer.prompt(employeeQuestions);

        const roleChoices = roles.map((role) => {
          return {
            name: role.title,
            value: role.id,
            short: role.title,
          };
        });
        //the object allows for structuring of returned data about role updates

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

        //inquirer questions for updating 'role'

        connection.query(updateRoleQuery, onQuery);
      };

      connection.query(employeesQuery, onQuery);
    }
    if (action === "updateManager") {
      const employeesQuery = "SELECT * FROM employee";
      const managersQuery = `SELECT employee.id, employee.first_name, employee.last_name FROM employee
      INNER JOIN (SELECT DISTINCT(manager_id) FROM roster_db.employee WHERE manager_id IS NOT NULL) as manager
      on employee.id = manager.manager_id`;
      //these queries allow for update manager functionality

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
        //the above object allows returned information to be structured

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
        //this allows for the structuring of  returned manager information

        const managerQuestions = [
          {
            message: "Select your Manager:",
            name: "managerId",
            type: "list",
            choices: managerChoices,
          },
        ];
        //allows manager slection

        const { managerId } = await inquirer.prompt(managerQuestions);

        const updateManagerQuery = `UPDATE employee SET manager_id=${managerId} WHERE id=${employeeId} `;
        //above query allows for the updating of manager

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
      //allows ending of CLI use!!!!
      process.exit();
    }
  } catch (err) {
    throw err;
  }
};

module.exports = init;
