const mysql = require("mysql");
const inquirer = require("inquirer")
const connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "DenverShred21@",
    database: "employee_db"
});

const start = () => {
    inquirer.prompt([
        {
            type: "list",
            name: "option",
            message: "What would you like to do?",
            choices: ["Add department",
                "Add role",
                "Add employee",
                "View departments",
                "View roles",
                "View all employees",
                "Update employee roles",
                "Exit"
            ]
        }]).then((data) => {
            switch (data.option) {
                case "Add department":
                    addDepartment();
                    break;
                case "Add role":
                    addRole();
                    break;
                case "Add employee":
                    addEmployee();
                    break;
                case "View departments":
                    viewDepartments();
                    break;
                case "View Roles":
                    viewRoles();
                    break;
                case "View all employees":
                    viewAllEmployees();
                    break;
                case "Update employee roles":
                    updateEmployeeRoles();
                    break;
                default: connection.end();

            }
        })
}

function addDepartment() {
    inquirer.prompt([
        {
            name: "departmentType",
            message: "please enter a department name:",
        }
    ]).then((data) => {
        var name = data.departmentType;
        connection.query(
            "INSERT INTO department SET ?",
            {
                name: name
            },
            (err) => {
                console.log(err)
                if (err) throw err;
                start();
            }


        )
    })
};














connection.connect((err) => {

    if (err) throw err;
    console.log(`connected to my sql ${connection.threadId}`)
    start();


});

