const mysql = require("mysql");
const inquirer = require("inquirer");

const connection = mysql.createConnection({
  host: "localhost",

  // Your port; if not 3306
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "Cordoba@87",
  database: "humanResources",
});

connection.connect(function (err) {
  if (err) throw err;
  console.log("connected as id" + connection.threadId);
  init();
});


function init() {
  inquirer
    .prompt([
      {
        type: "list",
        message: "What would you like to do?",
        choices: [
          "Add departments, roles or employees",
          "View departments, roles or employees",
          "Update an employee's role",
          "Exit",
        ],
        name: "action",
      },
    ])
    .then(({ action }) => {
      if (action === "Add departments, roles or employees") {
        addToDB();
      } else if (action === "View departments, roles or employees") {
        viewDB();
      } else if (action === "Update an employee's role") {
        updateEmployee();
      } else if (action === "Exit") {
        exit();
      }
    });
}

function addToDB() {
  inquirer
    .prompt([
      {
        type: "list",
        choices: ["Add department", "Add role", "Add employee", "Exit"],
        name: "action",
        message: "What would you like to do?",
      },
    ])
    .then(({ action }) => {
      if (action === "Add department") {
        addDept();
      } else if (action === "Add role") {
        addRole();
      } else if (action === "Add employee") {
        addEmployee();
      } else {
        exit();
      }
    });
}

function viewDB() {
  inquirer
    .prompt([
      {
        type: "list",
        choices: [
          "View the departments table",
          "View the roles table",
          "View the employees table",
          "View employees by manager",
          "Exit",
        ],
        name: "action",
        message: "What would you like to do?",
      },
    ])
    .then(({ action }) => {
      if (action === "View the departments table") {
        viewDept();
      } else if (action === "View the roles table") {
        viewRoles();
      } else if (action === "View the employees table") {
        viewEmployees();
      } else if (action === "View employees by manager") {
        viewByManager();
      } else {
        exit();
      }
    });
}


function addDept() {
  inquirer
    .prompt([
      {
        type: "input",
        name: "newDept",
        message: "Provide name of the department you wish to add",
      },
    ])
    .then(({ newDept }) => {
      const queryString =
        "INSERT INTO departments (department_name) VALUES (?);";
      connection.query(queryString, [newDept], function (err, data) {
        if (err) throw err;
        const queryString = `SELECT id as ID, department_name as DEPARTMENT FROM departments`;
        connection.query(queryString, function (err, data) {
          if (err) throw err;
          console.table(data);
          addMore();
        });
      });
    });
}

function addRole() {
  connection.query("SELECT * FROM departments", (err, data) => {
    if (err) throw err;
    const departmentsArray = data.map((object) => object.department_name);
    inquirer
      .prompt([
        {
          type: "list",
          choices: departmentsArray,
          name: "department",
          message: "Which department will this new role be added to?",
        },
        {
          type: "input",
          name: "title",
          message: "What is the name of the new role?",
        },
        {
          type: "input",
          name: "salary",
          message:
            "What will the salary for this new role be? (do not use commas or special characters)",
        },
      ])
      .then((answer) => {
        let department = data.filter(
          (object) => object.department_name === answer.department
        );
        const queryString =
          "INSERT INTO roles (title, salary, department_id) VALUES (?, ?, ?)";
        connection.query(
          queryString,
          [answer.title, answer.salary, department[0].id],
          function (err, data) {
            if (err) throw err;
            const queryString =
              'SELECT id as ID, title as TITLE, salary as SALARY, department_id as "DEPARTMENT ID" FROM roles';
            connection.query(queryString, function (err, data) {
              if (err) throw err;
              console.table(data);
              addMore();
            });
          }
        );
      });
  });
}

function addEmployee() {
  const selectEmployees = "SELECT * FROM employees";
  const selectRoles = "SELECT * FROM roles";

  connection.query(selectEmployees, function (err, employeesTable) {
    if (err) throw err;

    connection.query(selectRoles, function (err, rolesTable) {
      if (err) throw err;
      const rolesArray = rolesTable.map((role) => {
        return {
          value: role.id,
          name: role.title,
        };
      });
      const employeesArray = employeesTable.map((employee) => {
        return {
          name: employee.first_name + " " + employee.last_name,
          value: employee.id,
        };
      });

      inquirer
        .prompt([
          {
            type: "list",
            choices: rolesArray,
            name: "title",
            message: "Which role will this new employee have?",
          },
          {
            type: "input",
            name: "name",
            message: "Enter the employee's First Name:",
          },
          {
            type: "input",
            name: "lastName",
            message: "Enter the employee's Last Name:",
          },
          {
            type: "list",
            choices: employeesArray,
            name: "manager",
            message: "Who will be the employee's manager?",
          },
        ])
        .then((answer) => {
          const queryString = `INSERT INTO employees (first_name, last_name, role_id, manager_id) values (?, ?, ?,?)`;
          connection.query(
            queryString,
            [answer.name, answer.lastName, answer.title, answer.manager],
            function (err, data) {
              if (err) throw err;
              const queryString = `SELECT emp.id as "EMPLOYEE ID", 
                concat(emp.first_name," ",emp.last_name) as "EMPLOYEE NAME", 
                r.id as "ROLE ID",
                r.title as TITLE,
                dept.department_name DEPARTMENT,
                mgr.id as "MANAGER ID", 
                concat(mgr.first_name, " ", 
                mgr.last_name) as "MANAGER NAME"
                from employees emp
                left join employees mgr
                on emp.manager_id = mgr.id
                join roles r
                on emp.role_id = r.id
                join departments dept
                on r.department_id = dept.id
                order by emp.id`;
              connection.query(queryString, function (err, data) {
                if (err) throw err;
                console.table(data);
                addMore();
              });
            }
          );
        });
    });
  });
}

function addMore() {
  inquirer
    .prompt([
      {
        type: "list",
        choices: ["Yes", "No"],
        name: "action",
        message: "Would you like to look at the options again?",
      },
    ])
    .then(({ action }) => {
      if (action === "Yes") {
        init();
      } else {
        exit();
      }
    });
}

function viewDept() {
  const queryString = `SELECT id as ID, department_name as DEPARTMENT FROM departments`;
  connection.query(queryString, function (err, data) {
    if (err) throw err;
    console.table(data);
    addMore();
  });
}

function viewRoles() {
  const queryString =
    'SELECT id as ID, title as TITLE, salary as SALARY, department_id as "DEPARTMENT ID" FROM roles';
  connection.query(queryString, function (err, data) {
    if (err) throw err;
    console.table(data);
    addMore();
  });
}

function viewEmployees() {
  const queryString = `SELECT emp.id as "EMPLOYEE ID", 
    concat(emp.first_name," ",emp.last_name) as "EMPLOYEE NAME", 
    r.id as "ROLE ID",
    r.title as TITLE,
    dept.department_name DEPARTMENT,
    mgr.id as "MANAGER ID", 
    concat(mgr.first_name, " ", 
    mgr.last_name) as "MANAGER NAME"
    from employees emp
    left join employees mgr
    on emp.manager_id = mgr.id
    join roles r
    on emp.role_id = r.id
    join departments dept
    on r.department_id = dept.id
    order by emp.id`;
  connection.query(queryString, function (err, data) {
    if (err) throw err;
    console.table(data);
    addMore();
  });
}

function viewByManager() {
    const selectManagers = `SELECT 
    DISTINCT
        emp.manager_id,
        mgr.id as "MANAGER ID", 
        mgr.first_name, 
        mgr.last_name
        from employees emp
        right join employees mgr
        on emp.manager_id = mgr.id;`;
  
    connection.query(selectManagers, function (err, managersTable) {
      if (err) throw err;
        const managersArray = managersTable.map((manager) => {
          return {
            name: manager.first_name + " " + manager.last_name,
            value: manager.first_name,
          };
        });  
        inquirer
          .prompt([
            {
              type: "list",
              choices: managersArray,
              name: "manager",
              message: "Which manager's employees would you like to see?",
            },
          ])
          .then((answer) => {
            const queryString = `SELECT emp.id as "Employee ID", 
            concat(emp.first_name," ",emp.last_name) as "EMPLOYEE NAME", 
            r.id as "ROLE ID",
            r.title as TITLE,
            dept.department_name DEPARTMENT,
            mgr.id as "MANAGER ID", 
            concat(mgr.first_name, " ", 
            mgr.last_name) as "MANAGER NAME"
            from employees emp
            left join employees mgr
            on emp.manager_id = mgr.id
            join roles r
            on emp.role_id = r.id
            join departments dept
            on r.department_id = dept.id
            WHERE mgr.first_name = ?
            order by emp.id;`
            connection.query(queryString,[answer.manager],function (err, data) {
                if (err) throw err;
                  console.table(data);
                  addMore();
                });
              }
            );
          });
      ;
}

function updateEmployee() {
    const selectEmployees = "SELECT * FROM employees";
    const selectRoles = "SELECT * FROM roles";
  
    connection.query(selectEmployees, function (err, employeesTable) {
      if (err) throw err;
  
      connection.query(selectRoles, function (err, rolesTable) {
        if (err) throw err;
        const rolesArray = rolesTable.map((role) => {
          return {
            name: role.title,
            value: role.id,            
          };
        });  
        const employeesArray = employeesTable.map((employee) => {
          return {
            name: employee.first_name + " " + employee.last_name,
            value: employee.id,
          };
        });
  
        inquirer
          .prompt([
            {
                type: "list",
                choices: employeesArray,
                name: "empid",
                message: "Which employee's role do you want to update?",
              },
            {
              type: "list",
              choices: rolesArray,
              name: "role",
              message: "Which role will this employee have from now on?",
            },
            
          ])
          .then((answer) => {
            const queryString = `UPDATE employees SET role_id = ? WHERE (id = ?)`;
            connection.query(
              queryString, [answer.role, answer.empid],
              function (err, data) {
                if (err) throw err;
                const queryString = `SELECT emp.id as "EMPLOYEE ID", 
                  concat(emp.first_name," ",emp.last_name) as "EMPLOYEE NAME", 
                  r.id as "ROLE ID",
                  r.title as TITLE,
                  dept.department_name DEPARTMENT,
                  mgr.id as "MANAGER ID", 
                  concat(mgr.first_name, " ", 
                  mgr.last_name) as "MANAGER NAME"
                  from employees emp
                  left join employees mgr
                  on emp.manager_id = mgr.id
                  join roles r
                  on emp.role_id = r.id
                  join departments dept
                  on r.department_id = dept.id
                  where emp.id = ?
                  order by emp.id`;
                connection.query(queryString,[answer.empid], function (err, data) {
                  if (err) throw err;
                  console.table(data);
                  addMore();
                });
              }
            );
          });
      });
    });
  }

function exit() {
  connection.end();
}



