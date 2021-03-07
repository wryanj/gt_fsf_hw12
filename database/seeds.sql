---------------------------------------------------------------------------------------------------------------------
-- SEEDS 
---------------------------------------------------------------------------------------------------------------------

-- Seeds for Department Table
INSERT INTO department_table (
    department_name
) VALUES
    ("Management"),
    ("Offense"),
    ("Offense"),
    ("Defense");


-- Seeds for Role Table
INSERT INTO role_table (
    employee_role_title,
    employee_salary,
    department_id
) VALUES
    ("Owner", 900.000, 1),
    ("QB", 500.000, 2),
    ("WR1", 300.000, 3),
    ("LB1", 200.000,4);


-- Seeds for employee Table
INSERT INTO employee_table (
    employee_firstname,
    employee_lastname,
    role_id,
    manager_id
) VALUES
    ("Arthur", "Blank", 1, null),
    ("Matt", "Ryan", 2, 1 ),
    ("Julio", "Jones", 3, 1),
    ("Deon", "Jones", 4, 1);

    
---------------------------------------------------------------------------------------------------------------------
-- VIEW TABLE STATEMENTS (FOR CHECKING IN WORKBENCH OR OTHER)
---------------------------------------------------------------------------------------------------------------------
    -- See Department Table
    SELECT * FROM department_table;

    -- See Role Table
    SELECT * FROM role_table;

    -- See Employee Table
    SELECT * FROM employee_table;

