//-------------------------------------------------------------------------------------------------------------
// IMPORT DEPENDENCIES
//-------------------------------------------------------------------------------------------------------------

    // Import required 3rd Party Node Libraries
    const mysql = require('mysql');
    const inquirer = require('inquirer');

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
        console.log(`Welcome to the employee tracker! Select what you woud like to do first. When you finish, you may select to end your session.`);
        promptUser();
    }

    // Declare choose again function to be invoked every time a user finishes a given operation
    function chooseNext(){
        console.log(`You have complted this task. Please choose what you would like to do next, or select end session if you would like to finish`);
        promptUser();
    }

//-------------------------------------------------------------------------------------------------------------
// DECLARE INQUIRER PROMPT FUNCTIONS
//-------------------------------------------------------------------------------------------------------------

    // Declare main promptUser function for letting people choose what they would like to do

    // Declare addEmployee function to invoke when a user wishes to add an employee to the DB



//-------------------------------------------------------------------------------------------------------------
// DEFINE PROGRAM SEQUENCE
//-------------------------------------------------------------------------------------------------------------

// Upon start (entry of node index.js in CLI)....

// Prompt the user what they would like to do...

// Depending on their selection, invoke the appropriate next steps...

    // If they chose to view departments, roles, or employees

        // Prompt which info they would like to view...

            // If they want to view departments...

            // If they want to view roles...

            // If they want to view employees...

            // If they want to view everything together in one table...            

        // When completed, ask them to make their next selection

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

    
  