---------------------------------------------------------------------------------------------------------------------
-- CREATE AND USE SQL DATABASE
---------------------------------------------------------------------------------------------------------------------
    -- Drop DB if Exists
    DROP DATABASE IF EXISTS employee_tracker_DB;

    -- Create DB
    CREATE DATABASE employee_tracker_DB;

    -- Dictate Use of DB
    USE employee_tracker_DB;

---------------------------------------------------------------------------------------------------------------------
-- CREATE DB TABLES
---------------------------------------------------------------------------------------------------------------------
-- Create Department Table
    CREATE TABLE department_table (
        id INT NOT NULL AUTO_INCREMENT,
        department_name VARCHAR(30), -- department name
        PRIMARY KEY (id)
    );  
       
-- Create Role Table
    CREATE TABLE role_table (
        id INT NOT NULL AUTO_INCREMENT,
        employee_role_title VARCHAR(30), -- role title of employee
        employee_salary DECIMAL(6,3), -- employee salary
        department_id INT NOT NULL, -- id of the department the employee belongs to
        PRIMARY KEY (id)
    );

-- Create Employee Table
    CREATE TABLE employee_table (
        id INT NOT NULL AUTO_INCREMENT,
        employee_firstname VARCHAR(30), -- employee first name
        employee_lastname VARCHAR(30), -- employee last name
        role_id INT NOT NULL, -- Should be the id from role table
        manager_id INT, -- Should hold id of manager, can be null if no manager
        PRIMARY KEY (id)
    );

---------------------------------------------------------------------------------------------------------------------
-- VIEW TABLE STATEMENTS (FOR CHECKING IN WORKBENCH OR OTHER)
---------------------------------------------------------------------------------------------------------------------
    -- See Department Table
    SELECT * FROM department_table;

    -- See Role Table
    SELECT * FROM role_table;

    -- See Employee Table
    SELECT * FROM employee_table;
