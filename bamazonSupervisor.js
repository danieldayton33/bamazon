const mysql = require("mysql");
const inquirer = require("inquirer");

const connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: "root",
    password: "DoubleDeasy1",
    database: "bamazon"
});