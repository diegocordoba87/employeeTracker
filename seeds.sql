insert into roles(id, title, salary, department_id)
values (1,"Marketing Consultant", 50000, 1),
(2,'Accountant', 55000,2),
(3,'Sales representative', 40000, 3),
(4, 'Customer Service Representative', 35000, 4)

insert into departments(department_name)
values ('Marketing'),
('Finance'),
('Sales'),
('Customer Service');

SELECT * FROM humanResources.employee;

insert into employee (first_name, last_name, role_id)
values ('Bezalel','Simmel', 1),
('Parto','Bamford', 1),
('Chirstian','Koblick', 2),
('Kyoichi','Maliniak', 3),
('Anneke','Preusig', 3),
('Tzvetan','Zielinski',2),
('Saniya','Kalloufi', 3),
('Sumant','Peac', 4),
('Duangkaew','Piveteau', 4),
('Mary','Sluis', 4),
('Patricio','Bridgland', 3);

UPDATE employee
SET manager_id = 2
WHERE role_id = 1;

UPDATE employee
SET manager_id = 3
WHERE role_id = 2;

UPDATE employee
SET manager_id = 5
WHERE role_id = 3;

UPDATE employee
SET manager_id = 9
WHERE role_id = 4;


UPDATE employee
SET manager_id = null
WHERE id = 2;

UPDATE employee
SET manager_id = null
WHERE id = 3;

UPDATE employee
SET manager_id = null
WHERE id = 5;

UPDATE employee
SET manager_id = null
WHERE id = 9;