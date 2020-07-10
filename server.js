const mysql = require("mysql");


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