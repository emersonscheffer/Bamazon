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

        inquirer.prompt({
            name: "choice",
            type: "list",
            choices: [
                "View Products for Sale",
                "View Low Inventory",
                "Add to Inventory",
                "Add New Product"
            ],
            message: "\n" + "\n" + "MANAGER HUB" + "\n" + "\n" + "Choose from list"
        }).then(answer => {

            let key = answer.choice;

            switch (key) {
                case "View Products for Sale":
                    connection.query("SELECT * FROM products", function (err, results) {
                        if (err) throw err;


                        console.log("\n\n" + " --  --  B A M A Z O N  --  -- " + "\n\n");

                        var values = [];
                        for (var l in results) {
                            values.push([results[l].id, results[l].name, results[l].department, results[l].price, results[l].stock]);
                        }

                        console.table(['Id', 'Name', 'Department', 'Price', 'Stock'], values);


                        console.log("\n");
                        endConnection();
                    })

                    break;


                case "View Low Inventory":

                    connection.query("SELECT * FROM products WHERE stock < 5", function (err, results) {
                        if (err) throw err;


                        console.log("\n\n" + " --  --  B A M A Z O N  --  -- " + "\n\n");

                        var values = [];
                        for (var l in results) {
                            values.push([results[l].id, results[l].name, results[l].department, results[l].price, results[l].stock]);
                        }

                        console.table(['Id', 'Name', 'Department', 'Price', 'Stock'], values);


                        console.log("\n");
                        endConnection();
                    })

                    break;


                case "Add to Inventory":

                    connection.query("SELECT * FROM products", function (err, resultsAdd) {
                        if (err) throw err;

                        console.log("\n\n" + " --  --  B A M A Z O N  --  -- " + "\n\n");

                        var values = [];
                        for (var l in resultsAdd) {
                            values.push([resultsAdd[l].id, resultsAdd[l].name, resultsAdd[l].stock]);
                        }

                        console.table(['Id', 'Name', 'Stock'], values);

                        console.log("\n");
                    })

                    inquirer.prompt([{
                        name: "productId",
                        type: "input",
                        message: "Enter a product id to Add to Inventory"
                    }, {
                        name: "quantity",
                        type: "input",
                        message: "Enter the quantity: "
                    }]).then(ans => {

                        connection.query("UPDATE products SET ? WHERE ? ",
                            [{
                                    stock: results[ans.productId - 1].stock + parseInt(ans.quantity)
                                },
                                {
                                    id: ans.productId
                                }
                            ],
                            function (err) {
                                if (err) throw err;
                            });

                        console.log("Stock Updated");
                        endConnection();
                    })

                    break;

                case "Add New Product":
                    inquirer.prompt(
                        [{
                                name: "prodName",
                                type: "input",
                                message: "Enter Product Name"
                            },
                            {
                                name: "prodDept",
                                type: "input",
                                message: "Enter Product Department"
                            },
                            {
                                name: "prodPrice",
                                type: "input",
                                message: "Enter Product Price"
                            },
                            {
                                name: "prodStock",
                                type: "input",
                                message: "Enter Quantity"
                            }
                        ]

                    ).then(answers => {
                        connection.query("INSERT INTO products SET ?", {
                                name: answers.prodName,
                                department: answers.prodDept,
                                price: answers.prodPrice,
                                stock: answers.prodStock
                            },
                            function (err) {
                                if (err) throw err;

                                console.log("Added " + answers.prodName + " to Inventory");
                            })
                        endConnection();
                    });

                    break;

            }

        })

    })

}

function endConnection() {
    connection.end();
}