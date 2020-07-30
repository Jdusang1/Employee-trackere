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
                case "View roles":
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

function addRole() {
    inquirer.prompt([
        {
            name: "roleType",
            message: "please enter a role type:",
        }
    ]).then((data) => {
        var title = data.roleType;
        connection.query("INSERT INTO role SET ?",
            {
                title: title
            },
            (err) => {
                console.log(err)
                if (err) throw err;
                start();
            }

        )
    })
};

function addEmployee() {
    inquirer.prompt([
        {
            name: "employeeFirstName",
            message: "please enter employees first name:"
        },
        {
            name: "employeeLastName",
            message: "please enter employees last name:"
        }
    ]).then((data) => {
        let firstName = data.employeeFirstName;
        let lastName = data.employeeLastName;
        connection.query("INSERT INTO employee SET ?",
            {
                first_name: firstName,
                last_name: lastName

            },
            (err) => {
                console.log(err)
                if (err) throw err;
                start();
            }

        )
    })
};

const viewDepartments = () => {
    inquirer.prompt([
        {
            type: "input",
            name: "department",
            message: "Please enter a department to search for:"

        }
    ]).then((data) => {
        const name = data.department
        connection.query("SELECT * FROM department WHERE name = ?", [name], (err, data) => {

            if (err) throw err;
            console.table(data);
            start();
        })

    })

};

const viewRoles = () => {
    inquirer.prompt([
        {
            type: "input",
            name: "role",
            message: "Pleas enter a role you would like to view:"
        }
    ]).then((data) => {
        const title = data.role;
        connection.query("SELECT * FROM employee WHERE title= ?", [title], (err, data) => {

            if (err) throw err;
            console.table(data);
            start();
        })
    })
};

const viewAllEmployees = () => {
    connection.query("SELECT * FROM employee", function (err, res) {
        if (err) throw err;
        console.table(res)
        start();
    })

}

const updateEmployeeRoles = async () => {
    const employee = await connection.query("SELECT * FROM employee");
    const role = await connection.query("SELECT * FROM role");

    const data = await inquirer.prompt([{
        type: "list",
        name: "chosenEmployee",
        message: "Which employee would you like to update?",
        choices: employee.map(employee => ({
            name: employee.first_name + " " + employee.last_name,
            value: employee.id
        }))
    },
    {
        type: "rawlist",
        name: "newRole",
        message: "What is the employees new role?",
        choices: role.map(role => ({
            name: role.title,
            value: role.id
        }))
    }
    ])

    const res = await connection.query("UPDATE employee SET ? WHERE ?", [{
        role_id: data.newRole
    },
    {
        id: data.chosenEmployee
    }
    ])
    console.log(`\n${res.affectedRows} has been updated.\n`);
    start();
};


connection.connect((err) => {

    if (err) throw err;
    console.log(`connected to my sql ${connection.threadId}`)
    start();


});

