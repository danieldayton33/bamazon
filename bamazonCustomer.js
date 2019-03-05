const mysql = require("mysql");
const inquirer = require("inquirer");

const ProductInfo = function(item_id, product_name, price){
    this.Item_id = item_id;
    this.Product = product_name;
    this.Price = price;
}

const connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: "root",
    password: "DoubleDeasy1",
    database: "bamazon"
});

connection.connect(err =>{
    if(err) throw err;
    console.log("Connected via: ", connection.threadId);
        displayData();
});

const displayData = ()=> {
    connection.query("select * from products",function(err, response){
        if (err) throw err;
        const itemArray = [];
        response.forEach(item => {
        const newItem = new ProductInfo(item.item_id, item.product_name, item.price);
        itemArray.push(newItem);
    });
    console.table(itemArray);
    pickItem();

});
}

const pickItem = ()=>{
    inquirer.prompt([
        {
            message: "What the Item_id of the product you would like to buy?",
            type: "input",
            name: "item"
        },
        {
            message: "How many would you like buy?",
            type: "input",
            name: "quantity"
        }
    ]).then(answer =>{
        connection.query("select * from products where item_id =?",[parseInt(answer.item)],function(err, response){
            if (err) throw err;
            //check quantity available
            let quantity = parseInt(answer.quantity);
            if(response[0].stock_quantity > quantity){
                updateStore(answer.item, quantity, response[0].stock_quantity, response[0].price);
            }
            else{
                inquirer.prompt([
                    {
                        message: "Unfortunately we do not have enough product to complete your order. Is there anything else you would like to buy?",
                        type: "confirm",
                        name: "somethingElse"
                    }
                ]).then(answer =>{
                    if(answer.somethingElse){
                        pickItem();
                    }
                    else{
                        console.log("Sorry we couldn't help you today. Y'all come back now, ya hear?")
                        connection.end();
                    }
                });
               
            }
            
        });
    });
}

const updateStore = (item, quantity, currentQuanity, priceItem)=>{
    const newQuantity = currentQuanity - quantity;
    let priceItems = quantity * priceItem;
    connection.query("update products set stock_quantity =? where item_id =?", [newQuantity,item],
        function(err, response){
        if(err) throw err;
        console.log("That will be $" + priceItems + ", please!");
        //see if they want anything else
        inquirer.prompt([
            {
                message: "Is there anything else we can get you?",
                type: "confirm",
                name: "moreStuff"
            }
        ]).then(answer => {
            if(answer.moreStuff){
                displayData();
            }
            else{
                console.log("Thanks for shopping with us today! Y'all come back now, ya hear?")
                connection.end();
            }
        });
    });
  
    }

   
