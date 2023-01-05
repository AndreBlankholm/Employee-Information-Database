const fs = require("fs");
const inquirer = require("inquirer");
const Engineer = require("./lib/Engineer");
const Manager = require("./lib/Manager");
const Intern = require("./lib/Intern");

// generate the html
const generateHtml = require('./src/teamGenerator');


// propmts for the user and an empty array
const theTeamArray = [];

const addManager = () => {
  return (
    inquirer
      .prompt([
        {
          type: "input",
          name: "name",
          message: "What is the managers name?",
        },
        {
          type: "input",
          name: "id",
          message: "What is the managers Id number?",
        },
        {
          type: "input",
          name: "email",
          message: "What is the managers email address?",
        },
        {
          type: "input",
          name: "officeNumber",
          message: "What is the managers Office number?",
        },
      ])
      // after Questions are asked, push response to team array
      .then((managerResponse) => {
        const { name, id, email, officeNumber } = managerResponse;
        const manager = new Manager(name, id, email, officeNumber);
        theTeamArray.push(manager);
        console.log(manager);
      })
  );
};

const addEmployee = () => {
  return inquirer
    .prompt([
      {
        type: "list",
        name: "role",
        message: "What is the employees role? Engineer or Intern?",
        choices: ["Engineer", "Intern"],
      },
      {
        type: "input",
        name: "name",
        message: "What is the employee's name?",
      },
      {
        type: "input",
        name: "id",
        message: "What is the employee's Identification number",
      },
      {
        type: "input",
        name: "email",
        message: "What is your employee's email address",
      },
      {
        type: "input",
        name: "github",
        message: "What is you GitHub address?",
        when: (input) => input.role === "Engineer",
      },
      {
        type: "input",
        name: "school",
        message: "What school are you currently attending?",
        when: (input) => input.role === "Intern",
      },
      {
        type: "confirm",
        name: "confirmAddEmployee",
        message: "Do you want to add another employee",
        default: false,
      },
    ])

    .then((employeeData) => {
      let { name, id, email, role, github, school, confirmAddEmployee } =
        employeeData;

      //start an empty employee
      let employee;

      if (role === "Engineer") {
        employee = new Engineer(name, id, email, github);
        console.log(employee);
      } else if (role === "Intern") {
        employee = new Intern(name, id, email, school);
        console.log(employee);
      }
      theTeamArray.push(employee);
      if (confirmAddEmployee) {
        return addEmployee(theTeamArray);
      } else {
        return theTeamArray;
      }
    });
};

const writeToFile = data => {
  fs.writeFile("./dist/index.html", data, err => {
  console.log(data),
  err ? console.log(err) : console.log("Html with the Team Data succesfully created!")
  });
}

addManager()
  .then(addEmployee)
  .then((theTeamArray) => {
    return generateHtml(theTeamArray);
  })

  .then((pageHTML) => {
    return writeToFile(pageHTML);
  })

  .catch((err) => {
    console.log(err);
  });
