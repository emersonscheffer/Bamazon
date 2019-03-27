let mysql = require('mysql');

let inquirer = require('inquirer');

const cTable = require('console.table');

let connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "Nicolas2017",
    database: "bamazon"
});

connection.connect(function (err) {
    if (err) throw err;
    starting();
});

function starting() {
    connection.query("SELECT * FROM products", function (err, results) {
        if (err) throw err;

        console.log("\n\n" + " --  --  B A M A Z O N  --  -- " + "\n\n");

        var values = [];
        for (var l in results) {
            values.push([results[l].id, results[l].name, results[l].department, results[l].price, results[l].stock]);
        }

        console.table(['Id', 'Name', 'Department', 'Price', 'Stock'], values);


        console.log("\n");
        inquirer.prompt(
            [{
                    name: "id",
                    type: "input",
                    message: "Enter the product id you want to buy"
                },
                {
                    name: "quantity",
                    type: "input",
                    message: "Enter the quantity"
                }
            ]
        ).then(answer => {
            inquirer.prompt({
                name: "choice",
                type: "list",
                choices: ["yes", "no"],
                message: "\nYour Order ===== ****\n" + "\n" + answer.quantity + " " + results[answer.id - 1].name + "\n" +"\n" +"TOTAL" + "\n" + "$" + results[answer.id - 1].price * answer.quantity + "\n" + "\nPlace Order?\n"
            }).then(res => {
                if (res.choice === "yes") {
                    if (answer.quantity > results[answer.id - 1].stock) {
                        console.log("Insufficient quantity!");
                        inquirer.prompt({
                            name: "choice",
                            type: "list",
                            choices: ["yes", "no"],
                            message: "Do you wanna start over?"
                        }).then(resTwo => {
                            if (resTwo.choice === "yes") {
                                starting();
                            } else {
                                endConnection();
                            }
                        });

                    } else {
                        connection.query("UPDATE products SET ? WHERE ?",
                            [{
                                    stock: results[answer.id - 1].stock - answer.quantity
                                },
                                {
                                    id: results[answer.id - 1].id
                                }
                            ],
                            function (err) {
                                if (err) throw err;

                                console.log("Stock updated");

                            })
                        console.log("Parcel is on the way");
                        endConnection();
                    }

                } else {
                    console.log("Thank you for visiting our store");
                    endConnection();
                }

            })

        })
        //connection.end();
    })
}

function endConnection() {
    connection.end();
}