//-------------------------------------------------------------------------------------------------------------
// IMPORT DEPENDENCIES & DEFINE GLOBAL VARIABLES
//-------------------------------------------------------------------------------------------------------------

    // Import required 3rd Party Node Libraries
        const mysql = require('mysql');
        const inquirer = require('inquirer');

    // DEFINE GLOBAL VARIABLES
        let nextStep; // This will be set through the program to direct users to the next appropriate functoins based on inputs in inquirer 
        let currentDepartments = []; // This is set in the init function to hold the latest view of Department names & ids to be used in the add role function later
        let currentDepartmentNames; // This is set in the init function to specifically hold the list of names to be used in the add role prompt

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
// DECLARE INIT FUNCTION AND HELPER FUNCTIONS FOR RECURRING MESSAGING OR TASKS
//-------------------------------------------------------------------------------------------------------------

    // If they want to view departments...
    function init(){
        // Reset the next step variable that will be fluid during the prompt sequences...
         nextStep="";
        // Select all data from the departmenets table and populate it as the list of availible data...
        connection.query(`SELECT * FROM department_table`, (err, res) => {
            // If error log error
            if (err) throw err;
            // Log the results
            console.log(res);
            // Set the results equal to the array for currentDepartments so that the id and dept names are accessible in add role function later
            currentDepartments = res;
            // Set teh departmenet names array- this will be set to populate certain inquirer choices in the role creation prompt
            currentDepartmentNames = currentDepartments.map(a=>a.department_name);
            // Start the program
            startProgram();
        })
    }

    // Declare init function to be invoked at start of program sequence...
    function startProgram (){
        // Welcome the User
        console.log(`Welcome to the employee tracker! Choose from below to get started. When your finished, select "fininsh session" `);
       // Start the prompt
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
                name: "itemToAdd",
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
                    name: "departmentToAdd",
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
                    name: "newRoleTitle",
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
                    name: "newRoleSalary",
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
                },
                {
                    type: "list",
                    name: "newRoleDepartment",
                    message: "What departmenet will this role reside within? (If the department does not exist yet, please select this and create a new department first)",
                    choices: currentDepartmentNames
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

// Initialize the program (which loads required data, then calls the start program function)
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
        // Prompt them for what specific information they would like to add...
        addInfoPrompt()
            // Then capture the response and invoke the direct user from add info function...
            .then (response => {
                nextStep = response.itemToAdd;
                console.log(`nextStep is set to = ${nextStep}`);
                directUserFromAddInfo();
            })
            // If there is an error, log the error
            .catch(err => {if (err) throw err});
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

    // VIEWING INFO----------------------------------------------------------------------------------------------------------------------

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

        // If they want to view everything together in one table (except raw ids)
        function viewAll(){
            console.log(`viewAll function invoked`);
               // Select all data from the departmenets table
               connection.query(
                `SELECT 
                    employee_table.employee_firstname, 
                    employee_table.employee_lastname, 
                    role_table.employee_role_title, 
                    role_table.employee_salary,
                    department_table.department_name
                FROM ((employee_table 
                INNER JOIN role_table ON role_table.id=employee_table.role_id)
                INNER JOIN department_table ON role_table.department_id=department_table.id);`
                , 
                (err, res) => {
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

        
    // ADDING INFO--------------------------------------------------------------------------------------------------------------------------

    // If they chose to add information, determine what info they wanted to add and invoke the approropriate function to get adn display the data...
    function directUserFromAddInfo() {
        if (nextStep == "A new department") {
            addDepartmenet();
        }
        if (nextStep == "A new role") {
            addRole();
        }
        if (nextStep == "A new employee") {
            // insert function to call
        }  
    }

        // If they want to add a new department..
        function addDepartmenet() {
            // Declare a local variable to be used within this block
            let newDepartment;
            // Prompt them to answer some additional questions about what departmenet they want to add
            addDepartmentPrompt()
                // Then capture their input in a variable and invoke the next set of stems
                .then (response => {
                    newDepartment = response.departmentToAdd;
                    console.log(`New departmenet you want to add is set to = ${newDepartment}`);
                    insertNewDepartment();
                })
                // If there is an error, log the error
                .catch(err => {if (err) throw err});

            // Insert the new departmenet into the departmenet table
            function insertNewDepartment() {
                connection.query (
                    // Insert the new departmenet
                    `INSERT INTO department_table (
                        department_name
                    ) VALUES
                        ("${newDepartment}");`
                    ,
                    // Log the result
                    (err, res) => {
                        // If error log error
                        if (err) throw err;
                        console.log(res);
                        // Otherwise Log success and display the added department
                        console.log(`You have successfully added ${newDepartment}`);
                        // Then call the view Departmenets function to display the table and re pull up choices
                        viewDepartments();
                    }
                )
            } 
        }

        // If they want to add a role....
        function addRole() {
            // Declare some local variables to utilize when inserting this into the DB
            let newRoleTitle;
            let newRoleSalary;
            let newRoleDepartment;
            let newRoleDepartmentObject;
            let newRoleDepartmentID;
            // Prompt them to answer some additional questions about what role they want to add..
            addRolePrompt()
                // Then use the response to prepare variables for use in inserting new content to the DB...
                .then(response => {
                    // Prepare the appropriate inputs as variables...
                    newRoleTitle = response.newRoleTitle;
                    newRoleSalary = response.newRoleSalary;
                    newRoleDepartment = response.newRoleDepartment;
                    newRoleDepartmentObject = currentDepartments.find(obj=>obj.department_name===newRoleDepartment);
                    newRoleDepartmentID = newRoleDepartmentObject.id;
                    // Log the prepared values to the user
                    console.log(`New role you want to add is set to = ${newRoleTitle} with salaray of ${newRoleSalary} working in the ${newRoleDepartment} department with department id ${newRoleDepartmentID}`);
                    // And call the function to insert the new role into the role_table...
                    insertNewRole();
                })
                // If there is an error, log the error
                .catch(err => {if (err) throw err});

            // Insert the new role into the role_table
            function insertNewRole() {
                connection.query (
                    // Insert the new departmenet
                    `INSERT INTO role_table (
                        employee_role_title,
                        employee_salary,
                        department_id
                    ) VALUES
                        ("${newRoleTitle}", ${newRoleSalary}, ${newRoleDepartmentID});`
                    ,
                    // Log the result
                    (err, res) => {
                        // If error log error
                        if (err) throw err;
                        console.log(res);
                        // Otherwise Log success and display the added department
                        console.log(`You have successfully added ${newRoleTitle} to the roles database!`);
                        // Then call the view Roles function to display the table and re pull up choices
                        viewRoles();
                    }
                )
            }
        }


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

    
  