CREATE DATABASE humanResources;

CREATE TABLE departments (
    id int AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50)
);

CREATE TABLE roles (
id INTEGER AUTO_INCREMENT PRIMARY KEY,
title VARCHAR(50),
salary DECIMAL,
FOREIGN KEY department_id REFERENCES department(id)
)

CREATE TABLE employee (
id integer not null AUTO_INCREMENT PRIMARY KEY,
first_name varchar(50),
last_name VARCHAR(50),
FOREIGN KEY role_id REFERENCES role(id),
FOREIGN KEY (ManagerId) REFERENCES employee(Id);
);

