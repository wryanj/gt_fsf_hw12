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
        let currentRoles = []; // This is set in the init function to hold the latest view of Department names & ids to be used in the add role function later
        let currentRoleNames; // This is set in the initi function (and task completed function) to hold the latest list of role names for use in creating a new employee
        let currentEmployees;
        let currentEmployeeNames = [];
            
        

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
    // Init Function to load latest data prior to program script executing (Need to find a better way to get this async then let the start program run)
    function init(){
        // Reset values for fluid global variables
        nextStep="";
        currentEmployees="";
        currrentEmployeeNames="";
        // Start getting first data
        getCurrentDepartments();
        // Select all data from the departmenets table and populate it as the list of availible data...
        function getCurrentDepartments(){
            connection.query(`SELECT * FROM department_table`, (err, res) => {
                // If error log error
                if (err) throw err;
                // Set the results equal to the array for currentDepartments so that the id and dept names are accessible in add role function later
                currentDepartments = res;
                // Set teh departmenet names array- this will be set to populate certain inquirer choices in the role creation prompt
                currentDepartmentNames = currentDepartments.map(a=>a.department_name);
                console.log(`Lates department data retrieved`)
                // Move to get next data
                getCurrentRoles()
            })
        }
     
        // Select all data from the departmenets table and populate it as the list of availible data...
        function getCurrentRoles () {
            connection.query(`SELECT * FROM role_table`, (err, res) => {
                // If error log error
                if (err) throw err;
                // Set the results equal to the array for currentDepartments so that the id and dept names are accessible in add role function later
                currentRoles = res;
                // Set teh departmenet names array- this will be set to populate certain inquirer choices in the role creation prompt
                currentRoleNames = currentRoles.map(a=>a.employee_role_title);
                
                // Move to get next data..
                getCurrentEmployees();
            })
        }
        function getCurrentEmployees(){
            connection.query(`SELECT id, employee_firstname, employee_lastname FROM employee_table`, (err, res) => {
                // If error log error
                if (err) throw err;
                // Set currentEmployees to an array of returned objects with id included
                currentEmployees = res;
                console.log(JSON.stringify(currentEmployees));
                // Loop through the response object array to make a list of employee Names into a single array
                for (i=0; i<res.length; i++) {
                    // Create variables for the employee fullname
                    let fullName = `${res[i].employee_firstname} ${res[i].employee_lastname}`;
                    // Push that name into the array for current employees
                    currentEmployeeNames.push(fullName);
                }
                console.log(`currentEmployee's array is set to ${currentEmployeeNames}`);
                // Welcome the user and start the program as this is the last data to be retrieved + Reset next step to empty string
                console.log(`Welcome to the employee tracker! Choose from below to get started. When your finished, select "fininsh session" `);
                startMainPrompt();
            })
        }
       
    }

    // Declare choose again function to be invoked every time a user finishes a given operation
    function taskCompleted(){
        // Reset values for fluid global variables
        nextStep="";
        currentEmployees="";
        currrentEmployeeNames="";
         // Start getting first data
         getCurrentDepartments();
         // Select all data from the departmenets table and populate it as the list of availible data...
         function getCurrentDepartments(){
             connection.query(`SELECT * FROM department_table`, (err, res) => {
                 // If error log error
                 if (err) throw err;
                 // Set the results equal to the array for currentDepartments so that the id and dept names are accessible in add role function later
                 currentDepartments = res;
                 // Set teh departmenet names array- this will be set to populate certain inquirer choices in the role creation prompt
                 currentDepartmentNames = currentDepartments.map(a=>a.department_name);
                 console.log(`Lates department data retrieved`)
                 // Move to get next data
                 getCurrentRoles()
             })
         }
      
         // Select all data from the departmenets table and populate it as the list of availible data...
         function getCurrentRoles () {
             connection.query(`SELECT * FROM role_table`, (err, res) => {
                 // If error log error
                 if (err) throw err;
                 // Set the results equal to the array for currentDepartments so that the id and dept names are accessible in add role function later
                 currentRoles = res;
                 // Set teh departmenet names array- this will be set to populate certain inquirer choices in the role creation prompt
                 currentRoleNames = currentRoles.map(a=>a.employee_role_title);
                 
                 // Move to get next data..
                 getCurrentEmployees();
             })
         }
         function getCurrentEmployees(){
             connection.query(`SELECT id, employee_firstname, employee_lastname FROM employee_table`, (err, res) => {
                 // If error log error
                 if (err) throw err;
                 // Set currentEmployees to an array of returned objects with id included
                 currentEmployees = res;
                 console.log(JSON.stringify(currentEmployees));
                 // Loop through the response object array to make a list of employee Names into a single array
                 for (i=0; i<res.length; i++) {
                     // Create a variablt that holds the combined first and last name into one name
                     let fullName = `${res[i].employee_firstname} ${res[i].employee_lastname}`;
                     // Push that name into the array for current employees
                     currentEmployeeNames.push(fullName);
                 }
                 console.log(`currentEmployee's array is set to ${currentEmployeeNames}`);
                 // Welcome the user and start the program as this is the last data to be retrieved + Reset next step to empty string
                 nextStep="";
                 console.log(`task completed`);
                 startMainPrompt();
             })
         }
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
                        "DL",
                        "K",
                        "P"
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
                    message: "What departmenet will this role reside within? (If the department does not exist yet, please create a new department first)",
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
                    message: "Please select the employees role (If the role does yet, please create a new role first)",
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
                message: "What would you like to add?",
                choices: [
                    "An employee's role"
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
                    message: "For which employee do you wish to update roles for?",
                    choices: currentEmployeeNames
                     
                },
                {
                    type: "list",
                    name: "EmployeeUpdatedRole",
                    message: "Which role would you like to assign for this employee? If you do not see the role listed here, please be sure to add a new role from the main menu before completing this step.",
                    choices: currentRoleNames
                }
            ])
        }

//-------------------------------------------------------------------------------------------------------------
// DEFINE PROGRAM SEQUENCE
//-------------------------------------------------------------------------------------------------------------

// Run the init sequence... 
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
       // Prompt them for what specific information they would like to update on role, and for whom they would like to update for
       updateInfoPrompt()
            // Then capture the response and invoke the direct user from updtate info functoin
            .then(response => {
                nextStep = response.itemToUpdate
                console.log(`nextStep is set to = ${nextStep}`);
                directUserFromUpdateInfo();
            })
            // If there is an error, log the error
            .catch(err => {if (err) throw err});
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
            addEmployee();
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
                        // Otherwise Log success and display the added department
                        console.log(`You have successfully added ${newRoleTitle} to the roles database!`);
                        // Then call the view Roles function to display the table and re pull up choices
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

            // Prompt them to answer some additional questions about what role they want to add..
            addEmployeePrompt()

                // Then use the response to prepare variables for use in inserting new content to the DB...
                .then(response => {

                    // Prepare the appropriate inputs as variables...
                    newEmployeeFirstName = response.newEmployeeFirstName;
                    newEmployeeLastName = response.newEmployeeLastName;
                    newEmployeeRole = response.newEmployeeRole;
                    newEmployeeRoleObject = currentRoles.find(obj=>obj.employee_role_title===newEmployeeRole);
                    newEmployeeRoleID = newEmployeeRoleObject.id;
                   
                    // And call the function to insert the new role into the role_table...
                    insertNewEmployee();
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
                        console.log(`You have added ${newEmployeeFirstName} ${newEmployeeLastName} to the employee database!`);
                        // Then call the view All function so they can see the added value
                        viewAll();
                    }
                )
            }

        }

    // UPDATING INFO------------------------------------------------------------------------------------------------------------------------------

    // If they chose to update employee role...
    function directUserFromUpdateInfo () {
        console.log(`Direct user from update info functoin invoked`);
        if (nextStep == "An employee's role") {
            updateEmployeeRole();
        }
    }
        // If they want to update an employee's role...
        function updateEmployeeRole() {
            // Declare some local variables to utilize when updating this into the DB
            let updatedRole;
            let updatedEmployeeRoleObject;
            let employeeToUpdate;
            let updatedEmployeeObject;
            let updatedEmployeeID;
          
            // Prompt them to answer some additoinal questions about who's role they want to update, and what role they want to change
            updateEmployeeRolePrompt()

                // Then use the response to prepare variables for use in updating new content to the DB
                .then(response => {
                    // Set the role I will update for the employee
                    updatedRole = response.EmployeeUpdatedRole;
                    // Set the employee that I need to update this role for
                    employeeToUpdate = response.EmployeeToUpdate;
                    // Set the id for the employee I want to update the role for
                        // Split the full name into two strings, a first adn a last name
                        let splitNameArray = employeeToUpdate.split(" ");
                        // Set first and last name into separate variables to use in mapping to the right id
                        let employeeFirstname = splitNameArray[0];  
                        let employeeLastname = splitNameArray [1]; 
                        // Map to the id for the employee chosen
                        updatedEmployeeObject = currentEmployees.find(obj=>obj.employee_firstname===employeeFirstname && obj.employee_lastname===employeeLastname);
                        updatedEmployeeID = updatedEmployeeObject.id;
                        // Get the id for the role I want to update this employee for...
                        updatedEmployeeRoleObject = currentRoles.find(obj=>obj.employee_role_title===updatedRole);
                        updatedEmployeeRoleID = updatedEmployeeRoleObject.id;
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
                        role_id = ${updatedEmployeeRoleID}
                     WHERE
                        id = ${updatedEmployeeID};`
                    ,
                    // Log the result
                    (err, res) => {
                        // If error log error
                        if (err) throw err;
                        // Otherwise give a success message to the user
                        console.log(`You have updated the role for ${employeeToUpdate} to the role of ${updatedRole}`);
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

   
    
  