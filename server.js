const mysql = require("mysql");
const inquirer = require("inquirer")


const connection = mysql.createConnection({
  host: "localhost",

  // Your port; if not 3306
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "Cordoba@87",
  database: "humanResources"
});

connection.connect(function(err) {
    if (err) throw err;
    console.log("connected as id"+ connection.threadId);
    init();  
  });

  function init() {
    inquirer
      .prompt([
        {
          type: "list",
          choices: [
            "Add departments, roles or employees",
            "View departments, roles or employees",
            "Update departments, roles or employees",
            "Exit",
          ],
          name: "action",
          message: "What would you like to do?",
        },
      ])
      .then(({ action }) => {
        if (action === "Add departments, roles or employees") {
          addToDB();
        } else if (action === "View departments, roles or employees") {
          searchBySong();
        } else if (action === "Update departments, roles or employees") {
          searchForRepeats();
        } else {
          exit();
        }
      });
  }

  function addToDB() {
    inquirer
    .prompt([
      {
        type: "list",
        choices: [
          "Add department",
          "Add role",
          "Add employee",
          "Exit",
        ],
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

function addDept(){
    inquirer.prompt([
        {type: 'input',
        name: "newDept",
        message: "Provide name of the department you wish to add"
    }
    ]).then(({newDept})=>{
    const queryString =
    "INSERT INTO departments (`department_name`) VALUES ('?');";
    connection.query(queryString, [newDept], function (err,  data) {
    if (err) throw err;
    console.log(newDept + 'has been added!')
    console.table(data);
    init();
  });
  })
}

function addRole(){
    connection.query("SELECT * FROM departments", (err, data) => {
      if (err) throw err;
      const departmentsArray = data.map((object)=> object.department_name)
      console.log(departmentsArray)
      inquirer.prompt([
          {
              type: "list",
              choices: departmentsArray,
              name: "department",
              message: "Which department will this new role be added to?"
          },
          {
            type: "input",
            name: "title",
            message: "What is the name of the new role?"
          },
          {
            type: "input",
              name: "salary",
              message: "What will the salary for this new role be? (do not use commas or special characters)"
          }
      ]).then((answer)=>{
        let department = data.filter(
        (object) => object.department_name === answer.department);
       const queryString =
      "INSERT INTO roles (title, salary, department_id) VALUES (?, ?, ?)";
      connection.query(queryString, [answer.title, answer.salary, department[0].id], function (err,  data) {
      if (err) throw err;
      const query = "SELECT * FROM roles";
      connection.query(query, function(err, role){
        if (err) throw err
        console.log(`Your new role has been added!`);
        console.table(role)
      })
      })
    })})}

    function addEmployee(){
        connection.query("SELECT * FROM roles", (err, dataRole) => {
          if (err) throw err;
          const rolesArray = dataRole.map((object)=> object.title)
          connection.query(`SELECT id, first_name, last_name FROM employee`, (err, employees) => {
            if (err) throw err;

            console.log(employees);
            const employeesArray = employees.map((object)=> object.last_name);
            console.log(employeesArray)
        inquirer.prompt([
  
            {
              type: "list",
              choices: rolesArray,
              name: "title",
              message: "Which role will this new employee have?"
          },
          {
              type: "input",
              name: "name",
              message: "Enter the employee's First Name:"
          },
          {
              type: "input",
              name: "lastName",
              message: "Enter the employee's Last Name:"
          },
          {
            type: "list",
            choices: employeesArray,
            name: "manager",
            message: "Who is the employee's manager?"
          }
        ]).then((answer)=>{
            console.log(answer)
          let role = dataRole.filter(
          (object) => object.title=== answer.title);
          let manager = employees.filter(
              (object) => object.manager = answer.manager)
              console.log(manager)         
         const queryString =
        "INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)";
        connection.query(queryString, [answer.name, answer.lastName, role[0].id, manager[0].id], function (err,  data) {
        if (err) throw err;
        const query = "SELECT * FROM employee";
        connection.query(query, function(err, employee){
          if (err) throw err
          console.log(`Your new employee has been added!`);
          console.table(employee)
        })
        })
      })})})}