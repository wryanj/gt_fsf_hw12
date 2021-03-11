//-------------------------------------------------------------------------------------------------------------
// IMPORT DEPENDENCIES & DEFINE GLOBAL VARIABLES
//-------------------------------------------------------------------------------------------------------------

    // REQUIRE DOTENV TO PROTECT SERVER CREDENTIALS
        require('dotenv').config();

    // IMPORT REQUIRED THIRD PARTY DEPENDENCIES
        const mysql = require('mysql');
        const inquirer = require('inquirer');

    // DEFINE GLOBAL VARIABLES - variables used to support various functions and prompts within the program sequence. Always reset upon init or task complete to ensure latest data
        let nextStep; 
        let currentDepartments = []; 
        let currentDepartmentNames; 
        let currentRoles = []; 
        let currentRoleNames; 
        let currentEmployees; 
        let currentEmployeeNames = []; 
            
//-------------------------------------------------------------------------------------------------------------
// CREATE MYSQL DATABASE CONNECTION OBJECT AND FUNCTION TO TERMINATE CONNECTION WHEN USER ACTIONS ARE COMPLETED
//-------------------------------------------------------------------------------------------------------------

    // Create Connection Object so it's methods can be used within the program
    const connection = mysql.createConnection ({
        // Specify host
        host: process.env.DB_HOST,
        // Specify port
        port: 3306,
        // Enter username (should be 'root')
        user: process.env.DB_USER,
        // Your password and database you created in workbench with schema
        password: process.env.DB_PASS,
        database: process.env.DB_NAME,
    });

    // Delcare a function to invoke upon readiness to terminate connectoin to SQL database
    function endConnectionToSQL (){
        connection.end();
        console.log(`Your connection to SQL database is has been intentionally terminated`); 
    }

//-------------------------------------------------------------------------------------------------------------
// DECLARE INIT FUNCTION FOR USE IN PREPARING THE DATA NEEDED BY THE PROGRAM SEQUENCE UPON START OR TASK COMPLETION
//-------------------------------------------------------------------------------------------------------------

    // Initialize program on startup and each time a task is completed...
    function init(){
        // Call first function to trigger sequence of function calls leading to start of prompt
        clearGlobalVariables(); 
        // Reset values for fluid global variables and call get departments
        function clearGlobalVariables(){
            nextStep="";
            currentEmployees="";
            currentEmployeeNames=[];
            getCurrentDepartments();
        }
        // Get all of the latest department data..
        function getCurrentDepartments(){
            connection.query(`SELECT * FROM department_table`, (err, res) => {
                // If error log error
                if (err) throw err;
                // Set the current departments array equal to an array of department objects returned in the response
                currentDepartments = res;
                // Get the department names from the returned object and set them equal to a variable for use in inquirer choices
                currentDepartmentNames = currentDepartments.map(a=>a.department_name);
                // Get the latest roles information
                getCurrentRoles()
            })
        }
        // Get all of the latest roles data...
        function getCurrentRoles () {
            connection.query(`SELECT * FROM role_table`, (err, res) => {
                // If error log error
                if (err) throw err;
                // Set the current roles equal to the array of roles objects returned in the response
                currentRoles = res;
                // Pull out the role names and make them into an array for use in inquirer choices and other subsequent functions
                currentRoleNames = currentRoles.map(a=>a.employee_role_title);
                // Get the latest employee inforamtion.
                getCurrentEmployees();
            })
        }
        // Get all of the latest employee information
        function getCurrentEmployees(){
            connection.query(`SELECT * FROM employee_table`, (err, res) => {
                // If error log error
                if (err) throw err;
                // Set the current employes array to the array of employee objects retrieved from the database
                currentEmployees = res;
                // Combine the first and last name properties into a single full name variable for use in inquirer choices later
                for (i=0; i<res.length; i++) {
                    // Loop through and pull out the firstname and lastname and combine them into a full name variable declaried in this loop
                    let fullName = `${res[i].employee_firstname} ${res[i].employee_lastname}`;
                    // Each time add that into an array that will hold the full names for use in inquirer choices...
                    currentEmployeeNames.push(fullName);
                }
                // And start the main prompt
                startMainPrompt();
            })
        }
       
    }

    function taskComplete(){
        // Tell them the job is completed
        console.log (`\n You have completed this task!\n`);
        // Re run the init sequence 
        init();
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
                message: "What would you like to do next?",
                choices: [
                    "View departments, roles, or employees", 
                    "Add new departments, roles, or employees",
                    "Update the role for an existing employee",
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
                message: "What would you like to view?",
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
                    message: "What role would you like to add?",
                    choices: [
                        "Owner", 
                        "Head Coach",
                        "Assistant Coach",
                        "Backup Player",
                        "QB",
                        "RB",
                        "OL",
                        "WR",
                        "TE",
                        "DB",
                        "S",
                        "LB",
                        "DL",
                        "K",
                        "P"
                    ]
                },
                {
                    type: "list",
                    name: "newRoleSalary",
                    message: "What is the salary range for this role?",
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
                    message: "What departmenet will this role reside within? (If the department does not exist yet, please select that you dont see it and create a new department first)",
                    choices: currentDepartmentNames
                }
               
            ])
        }
        // Declare prompt if a user chooses to add A new employee...
        function addEmployeePrompt () {
            return inquirer.prompt ([
                {
                    type: "input",
                    name: "newEmployeeFirstName",
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
                    name: "newEmployeeLastName",
                    message: "Please enter the employee's last name",
                    validate: async(input) => {
                        if(input==="") {
                            return "Please enter a value"
                        }
                        return true
                    } 
                },
                {
                    type: "list",
                    name: "newEmployeeRole",
                    message: "Please select the employees role (If the role does yet, please selecet that you dont see it and create a new role first)",
                    choices: currentRoleNames
                },

            ])
        }
    // Declare prompts to allow them to select what information they specifically want to update...
    function updateInfoPrompt () {
        return inquirer.prompt ([
            {
                type: "list",
                name: "itemToUpdate",
                message: "What would you like to update?",
                choices: [
                    "The role for an existing employee"
                ]
            }
        ])
    }
        // Delcare prompt if user choose to update an employee's role
        function updateEmployeeRolePrompt () {
            return inquirer.prompt ([
                {
                    type: "list",
                    name: "EmployeeToUpdate",
                    message: "For which employee do you wish to update a role for?",
                    choices: currentEmployeeNames
                     
                },
                {
                    type: "list",
                    name: "EmployeeUpdatedRole",
                    message: "Which role would you like to assign for this employee? (If you do not see the role listed here, please be sure to add a new role from the main menu before completing this step).",
                    choices: currentRoleNames
                }
            ])
        }

//-------------------------------------------------------------------------------------------------------------
// DEFINE PROGRAM SEQUENCE
//-------------------------------------------------------------------------------------------------------------
    // Welcome the user For the first time
    console.log(`\n Welcome to the employee Tracker!\n`)

    // Run the init sequence... 
    init();

    // Start the main prompt sequence
    function startMainPrompt () {
        // Present the main prompt questions...
        mainPrompt()
            // Then capture the response in a nextStep global variable and invoke the next function to route them to the right prompt..
            .then(response => {
                nextStep = response.mainSelection;
                directUserFromMain();
            })
            // If there is an error, log the error
            .catch(err => {if (err) throw err});
        }

    // Depending on their main selection, direct them to the appropriate next steps. Will direct down one of three main paths (viewing, adding, updating) unless finish is selected
    function directUserFromMain () {
        if (nextStep == "View departments, roles, or employees") {
            // Prompt them which info they would like to view
            viewInfoPrompt()
                // Then capture the response and invoke the direct user from view info function
                .then (response => {
                    nextStep = response.itemToView;
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
                    directUserFromAddInfo();
                })
                // If there is an error, log the error
                .catch(err => {if (err) throw err});
        }
        if (nextStep == "Update the role for an existing employee") {
            // Prompt them for what specific information they would like to update on role, and for whom they would like to update for
            updateInfoPrompt()
                // Then capture the response and invoke the direct user from updtate info functoin
                .then(response => {
                    nextStep = response.itemToUpdate
                    directUserFromUpdateInfo();
                })
                // If there is an error, log the error
                .catch(err => {if (err) throw err});
        }
        if (nextStep == "Finish session") {
            // Log to the user the session is completed..
            console.log(`\nsession completed!\n`);
            // And end the connectoin to the DB...
            endConnectionToSQL();
            return;
        }
    }

// VIEWING INFO--------------------------------------------------------------------------------------------------

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
                // Run the task completed function
                taskComplete();
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
                // Run the task completed function
                taskComplete();
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
                // Run the task completed function
                taskComplete();
            })
        }
        // If they want to view all key information in a single view...
        function viewAll(){
            // Select important data from all three tables and join them into one view
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
                // Run the task completed function
                taskComplete();
            })
        }      

// ADDING INFO---------------------------------------------------------------------------------------------------------

    // If they chose to add information, determine what info they wanted to add and invoke the approropriate function to get adn display the data...
    function directUserFromAddInfo() {
        if (nextStep == "A new department") {
            addDepartmenet();
        }
        if (nextStep == "A new role") {
            addRole();
        }
        if (nextStep == "A new employee") {
            addEmployee();
        }  
    }

        // If they want to add a new department..
        function addDepartmenet() {
            // Declare a local variable to be used within this block
            let newDepartment;
            // Prompt them to answer some additional questions about what departmenet they want to add
            addDepartmentPrompt()
                // Then capture their input in a variable and invoke the next set of steps
                .then (response => {
                    newDepartment = response.departmentToAdd;
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
                        // Then call the view Departmenets function to display the latest data (this will also run into task completed)
                        viewDepartments();
                    }
                )
            } 
        }

        // If they want to add a role....
        function addRole() {
            // Declare some local variables to utilize in the database insertion process
            let newRoleTitle;
            let newRoleSalary;
            let newRoleDepartment;
            let newRoleDepartmentObject;
            let newRoleDepartmentID;
            // Add and escape option to the choices array
            currentDepartmentNames.push("I dont see my choice listed here");
            // Prompt them to answer some additional questions about what role they want to add..
            addRolePrompt()
                // Then use the response to prepare variables for use in inserting new content to the DB...
                .then(response => {
                    // If they need to escape, let them escape...
                    if (response.newRoleDepartment === "I dont see my choice listed here"){
                        // Tell them to add a new department...
                        console.log(`\nThats Ok! Please add the department you need first, then come back to adding your new role.\n`)
                        // Re-run the startprompt
                        startMainPrompt();
                    }
                    // Otherwise...Prepare the appropriate inputs as variables...
                    else{
                    newRoleTitle = response.newRoleTitle;
                    newRoleSalary = response.newRoleSalary;
                    newRoleDepartment = response.newRoleDepartment;
                    newRoleDepartmentObject = currentDepartments.find(obj=>obj.department_name===newRoleDepartment);
                    newRoleDepartmentID = newRoleDepartmentObject.id;
                    // Log the prepared values to the user
                    console.log(`New role you want to add is set to = ${newRoleTitle} with salaray of ${newRoleSalary} working in the ${newRoleDepartment} department with department id ${newRoleDepartmentID}`);
                    // And call the function to insert the new role into the role_table...
                    insertNewRole();
                    }   
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
                        // Otherwise Log success and display the added department
                        console.log(`You have successfully added ${newRoleTitle} to the roles database!`);
                        // Then call the view Roles function to display the latest data (this will also run into task completed)
                        viewRoles();
                    }
                )
            }
        }

        // If they want to add an employee...
        function addEmployee() {
            // Declare some local variables to utilize when inserting this into the DB
            let newEmployeeFirstName;
            let newEmployeeLastName;
            let newEmployeeRoleObject;
            let newEmployeeRoleID;
            // Add an escape option to the choices array
            currentRoleNames.push("I dont see the role for this employee shown here")
            // Prompt them to answer some additional questions about what role they want to add..
            addEmployeePrompt()
                // Then use the response to prepare variables for use in inserting new content to the DB...
                .then(response => {
                    // If they needed to exit to create a new role first...
                    if (response.newEmployeeRole === "I dont see the role for this employee shown here"){
                        // Tell them what to do next...
                        console.log(`\n No problem! Please make sure to add the role from the main menu before coming back to create this employee!\n`);
                        // Return them to the main prompt
                        startMainPrompt();
                    }
                    // Otherwise if they had all the info they needed....
                    else{
                    // Prepare the appropriate inputs as variables...
                    newEmployeeFirstName = response.newEmployeeFirstName;
                    newEmployeeLastName = response.newEmployeeLastName;
                    newEmployeeRole = response.newEmployeeRole;
                    newEmployeeRoleObject = currentRoles.find(obj=>obj.employee_role_title===newEmployeeRole);
                    newEmployeeRoleID = newEmployeeRoleObject.id;
                    // And call the function to insert the new role into the role_table...
                    insertNewEmployee();
                    } 
                })
                // If there is an error, log the error
                .catch(err => {if (err) throw err});
            // Insert the appropriate data to the DB...
            function insertNewEmployee() {
                connection.query (
                    // Insert the new departmenet
                    `INSERT INTO employee_table (
                        employee_firstname,
                        employee_lastname,
                        role_id,
                        manager_id
                    ) VALUES
                        ("${newEmployeeFirstName}", "${newEmployeeLastName}", ${newEmployeeRoleID}, 1);` // Come back to manager id when its more clear how this works from the demo. hardcoding to arty B.
                    ,
                    // Log the result
                    (err, res) => {
                        // If error log error
                        if (err) throw err;
                        // Otherwise give a success message to the user
                        console.log(`\nYou have added ${newEmployeeFirstName} ${newEmployeeLastName} to the employee database!\n`);
                        // Then call the view All function so they can see the results of their added employee reflected in the table
                        viewAll();
                    }
                )
            }

        }

// UPDATING INFO---------------------------------------------------------------------------------------------------

    // If they chose to update employee role...
    function directUserFromUpdateInfo () {
        if (nextStep == "The role for an existing employee") {
            updateEmployeeRole();
        }
    }
        // If they want to update an employee's role...
        function updateEmployeeRole() {
            // Declare some local variables to utilize when updating this into the DB
            let updatedRole;
            let updatedEmployee;
            let updatedEmployeeObject;
            let updatedEmployeeID;
            let updatedRoleObject;
            let updatedRoleID;
            // Prompt them to answer some additoinal questions about who's role they want to update, and what role they want to change
            updateEmployeeRolePrompt()
                // Then use the response to prepare variables for use in updating new content to the DB
                .then(response => {
                    // Identify the new role that I will assign to an existing employee...
                    updatedRole = response.EmployeeUpdatedRole;
                    // Identify the employee for whom's role I need to update...
                    updatedEmployee = response.EmployeeToUpdate;
                    // Identify the id for the employee for whom's role I need to update (I need this later to target this employee in the db)
                        // Split the full name into two strings, a first adn a last name
                        let splitNameArray = updatedEmployee.split(" ");
                        // Set first and last name into separate variables to use in mapping to the right id
                        let employeeFirstname = splitNameArray[0];  
                        let employeeLastname = splitNameArray [1]; 
                        // Find the the employee from the existing array of employees I get during init / task completed (returns an object for that employee)
                        updatedEmployeeObject = currentEmployees.find(obj=>obj.employee_firstname===employeeFirstname && obj.employee_lastname===employeeLastname);
                        // And Get the id for that employee from the employee table so we know where to update the role
                        updatedEmployeeID = updatedEmployeeObject.id;
                    // Find the role object from the roles table that I am going to assign to the employee
                    updatedRoleObject = currentRoles.find(obj=>obj.employee_role_title===updatedRole);
                    // Get the id for the role I am updating for the employee
                    updatedRoleID = updatedRoleObject.id;
                    // Call the function to update the employee information...
                    insertUpdatedEmployeeRole();
                })
                // If there is an error, log the error
                .catch(err => {if (err) throw err});
            // Insert the updated information
            function insertUpdatedEmployeeRole() {
                connection.query (
                    // Update the role volue for the specified employee
                    `UPDATE employee_table
                    SET
                    role_id = ${updatedRoleID}
                    WHERE
                    id = ${updatedEmployeeID};`
                    ,
                    // Log the result
                    (err, res) => {
                        // If error log error
                        if (err) throw err;
                        // Otherwise give a success message to the user
                        console.log(`Success`)
                        // Then call the view All function so they can see the added value
                        viewAll();
                    }
                )
            }
        }

 // BONUS---------------------------------------------------------------------------------------------------------------------------------------

    // (BONUS) If they chose to remove employees...

    // (BONUS) If they chose to update employee manager...

    // (BONUS) If they want to view combined salaray of all employees...

   
    
  