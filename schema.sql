DROP DATABASE IF EXISTS humanResources;
CREATE DATABASE humanResources;
USE humanResources;

CREATE TABLE departments (
    id int AUTO_INCREMENT PRIMARY KEY,
    department_name VARCHAR(50)
);

CREATE TABLE roles (
id INTEGER AUTO_INCREMENT PRIMARY KEY,
title VARCHAR(50),
salary DECIMAL,
department_id INT,
FOREIGN KEY (department_id) REFERENCES departments(id)
);

CREATE TABLE employees (
id integer not null AUTO_INCREMENT PRIMARY KEY,
first_name varchar(50),
last_name VARCHAR(50),
role_id INT,
manager_id INT,
FOREIGN KEY (role_id) REFERENCES roles(id),
FOREIGN KEY (manager_id) REFERENCES employees(id)
);

