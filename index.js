//-------------------------------------------------------------------------------------------------------------
// IMPORT DEPENDENCIES & DEFINE GLOBAL VARIABLES
//-------------------------------------------------------------------------------------------------------------

    // Import required 3rd Party Node Libraries
    const mysql = require('mysql');
    const inquirer = require('inquirer');

    // DEFINE GLOBAL VARIABLES
    let nextStep;
    let availibleRoles = ["default1", "default2"]; // Used to provide inquirerer with of availible roles to choose from based on roles in DB
    let availibleManagers = ["default1", "default2"]; // Used to provide inquirerer with of availible managers to choose from based on roles in DB


//-------------------------------------------------------------------------------------------------------------
// CREATE MYSQL DATABASE CONNECTION OBJECT AND RELATED CONNECTION START AND END FUNCTIONS
//-------------------------------------------------------------------------------------------------------------

    // Create Connection Object
    const connection = mysql.createConnection ({
        // Specify host
        host: 'localhost',
        // Specify port
        port: 3306,
        // Enter username (should be 'root')
        user: 'root',
        // Your password and database you created in workbench with schema
        password: 'GoDawgs18$',
        database: 'employee_tracker_db',
    });

    // Function to invoke upon readiness to connect to SQL database
    function startConnectionToSQL (){
        connection.connect((err) => {
            // If connection is bad log the error
            if (err) throw err;
            // Otherwise console log my connectoin and id...
            console.log(`Your connection to SQL database is successful with connection id ${connection.threadId}`);
        })
    }

    // Function to invoke upon readiness to terminate connectoin to SQL database
    function endConnectionToSQL (){
        connection.end();
        console.log(`Your connection to SQL database is has been intentionally terminated`); 
    }

//-------------------------------------------------------------------------------------------------------------
// DECLARE HELPER FUNCTIONS FOR RECURRING MESSAGING OR TASKS
//-------------------------------------------------------------------------------------------------------------

    // Declare init function to be invoked at start of program sequence...
    function init (){
        // Reset the next step variable that will be fluid during the prompt sequences...
        nextStep="";
        // Welcome the User
        console.log(`Welcome to the employee tracker! Choose from below to get started. When your finished, select "fininsh session" `);
        // Invoke the start main prompt function
        startMainPrompt();
    }

    // Declare choose again function to be invoked every time a user finishes a given operation
    function taskCompleted(){
        // Reset the next step variable...
        nextStep="";
        // Provide a note the task is completed..
        console.log(`You have complted this task. You may now select what to do next`);
        
    }

//-------------------------------------------------------------------------------------------------------------
// DECLARE INQUIRER PROMPT FUNCTIONS
//-------------------------------------------------------------------------------------------------------------

    // Declare main promptUser function for letting people choose what they would like to do...
    function mainPrompt () {
        return inquirer.prompt ([
            {
                type: "list",
                name: "mainSelection",
                message: "Select an Option",
                choices: [
                    "View departments, roles, or employees", 
                    "Add new departments, roles, or employees",
                    "Update roles for an employee",
                    "Finish session"
                ]
            }
        ])
        
    }

    // Declare prompts to allow for selection what information they specifically want to view...
    function viewInfoPrompt () {
        return inquirer.prompt ([
            {
                type: "list",
                name: "itemToView",
                message: "What would you like to view",
                choices: [
                    "Departments", 
                    "Roles",
                    "Employees",
                    "All Information"
                ]
            }
        ])

    }

    // Declare prompts to allow them to select what information they specifically want to add...
    function addInfoPrompt () {
        return inquirer.prompt ([
            {
                type: "list",
                name: "itemAdded",
                message: "What would you like to add?",
                choices: [
                    "A new department", 
                    "A new role",
                    "A new employee"
                ]
            }
        ])
    }

        // Declare prompt if user chooses to add A new department...
        function addDepartmentPrompt () {
            return inquirer.prompt ([
                {
                    type: "input",
                    name: "mainSelections",
                    message: "Please enter the name of the department you would like to add",
                    validate: async(input) => {
                        if(input==="") {
                            return "Please enter a value"
                        }
                        return true
                    } 
                }
            ])
        }

        // Declare prompt if a user chooses to add A new role...
        function addRolePrompt () {
            return inquirer.prompt ([
                {
                    type: "list",
                    name: "roleTitle",
                    message: "What would you like to add?",
                    choices: [
                        "Owner", 
                        "Head Coach",
                        "Assistant Coach",
                        "QB",
                        "RB",
                        "OL",
                        "WR",
                        "TE",
                        "DB",
                        "S",
                        "LB",
                        "DL"
                    ]
                },
                {
                    type: "list",
                    name: "SalaryRange",
                    message: "Please select a salary range for this role",
                    choices: [
                        100.000,
                        200.000,
                        300.000,
                        400.000,
                        500.000,
                        600.000,
                        700.000,
                        800.000,
                        900.000
                    ]
                }
            ])
        }

        // Declare prompt if a user chooses to add A new employee...
        function addEmployeePrompt () {
            return inquirer.prompt ([
                {
                    type: "input",
                    name: "employeeFirstName",
                    message: "Please enter the employee's first name",
                    validate: async(input) => {
                        if(input==="") {
                            return "Please enter a value"
                        }
                        return true
                    } 
                },
                {
                    type: "input",
                    name: "employeeLastName",
                    message: "Please enter the employee's first name",
                    validate: async(input) => {
                        if(input==="") {
                            return "Please enter a value"
                        }
                        return true
                    } 
                },
                {
                    type: "input",
                    name: "employeeRole",
                    message: "Please select the employees role",
                    choices: availibleManagers 
                },

            ])
        }


//-------------------------------------------------------------------------------------------------------------
// DEFINE PROGRAM SEQUENCE
//-------------------------------------------------------------------------------------------------------------

// Upon start, present a message and invoke the startMainPrompt function
init();

// Start the main prompt sequence
function startMainPrompt () {

    // Presnt the main prompt questions...
    mainPrompt()

    // Then capture the response in a nextStep global variable and invoke the next function to route them to the right prompt..
    .then(response => {
        nextStep = response.mainSelection;
        console.log(`nextStep is set to = ${nextStep}`);
        directUserFromMain();
    })

    // If there is an error, log the error
    .catch(err => {if (err) throw err});
}

    


// Depending on their main selection, direct them to the appropriate next steps
function directUserFromMain () {
    
    // If they chose to view departments, roles, or employees, 
    if (nextStep == "View departments, roles, or employees") {

        // Prompt them which info they would like to view
        viewInfoPrompt()

            // Then capture the response and invoke the direct user from view info function
            .then (response => {
                nextStep = response.itemToView;
                console.log(`nextStep is set to = ${nextStep}`);
                directUserFromViewInfo();
            })

            // If there is an error, log the error
            .catch(err => {if (err) throw err});
    }
    if (nextStep == "Add new departments, roles, or employees") {
        addInfoPrompt();
    }
    if (nextStep == "Update roles for an employee") {
       // updateInfoPrompt(); - Have to add these into inquiere. 
    }
    if (nextStep == "Finish session") {
        console.log(`session completed!`)
        endConnectionToSQL();
        return;
     }
}

    // If they wanted to view info, determine what info they wanted to view and invoke the appropriate function to get and display the data...
    function directUserFromViewInfo() {
        if (nextStep == "Departments") {
            viewDepartments();
        }
        if (nextStep == "Roles") {
            viewRoles();
        }
        if (nextStep == "Employees") {
            viewEmployees();
        }
        if (nextStep == "All Information") {
            viewAll();
        }     
    }

        // If they want to view departments...
        function viewDepartments(){
            // Select all data from the departmenets table
            connection.query(`SELECT * FROM department_table`, (err, res) => {
                // If error log error
                if (err) throw err;
                // Display the data in a table format...
                console.table(res);
                // Run task completed function
                taskCompleted();
                // And start the main prompt function again
                startMainPrompt();
            })
        }

        // If they want to view roles...
        function viewRoles(){
            // Select all data from the departmenets table
            connection.query(`SELECT * FROM role_table`, (err, res) => {
                // If error log error
                if (err) throw err;
                // Display the data in a table format...
                console.table(res);
                // Run task completed function
                taskCompleted();
                // And start the main prompt function again
                startMainPrompt();
            })
        }

        // If they want to view employees...
        function viewEmployees(){
            console.log(`viewEmployees function invoked`);
             // Select all data from the departmenets table
             connection.query(`SELECT * FROM employee_table`, (err, res) => {
                // If error log error
                if (err) throw err;
                // Display the data in a table format...
                console.table(res);
                // Run task completed function
                taskCompleted();
                // And start the main prompt function again
                startMainPrompt();
            })
        }

        // If they want to view everything together in one table...
        function viewAll(){
            console.log(`viewAll function invoked`);
        }            

        

    // If they chose to add department, roles, or employees...

        // Prompt the user which they want to add...

            // If they want to add a department....

                // Prompt them to add a new department

                // Then take that response and insert it into the department table in the DB

            // If they want to add a role....

                // Prompt them to add a new role

                // Then take that response and insert it into the department table in the DB

                // When completed, ask them to make their next selection

            // If they want to add an employee...

                // Prompt them enter employee names and other required information..

                // Then assign the answers into a set of variables to use in creating new info in the DB...

                // Insert the appropriate data to the DB...
        
                // When completed, ask them to make their next selection

    // If they chose to update employee role...

    // (BONUS) If they chose to remove employees...

    // (BONUS) If they chose to update employee manager...

    // (BONUS) If they want to view combined salaray of all employees...

    // If they want to complete their session....

        // End the session by invoking the function defined at script top

    
  