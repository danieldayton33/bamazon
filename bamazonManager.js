const mysql = require("mysql");
const inquirer = require("inquirer");

const ProductInfo = function(item_id, product_name, price, currentStock){
    this.Item_id = item_id;
    this.Product = product_name;
    this.Price = price;
    this.Current_Stock = currentStock;
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
        checkWhatTheyWant();
});

const checkWhatTheyWant = ()=> {
    const managerOptions = ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product"]
    inquirer.prompt([
        {
            message: "Hello Manager! What would you like to do?",
            type: "rawlist",
            choices: managerOptions,
            name: "managerPick"
        }
    ]).then(answer=>{
        console.log(answer);
        switch (answer.managerPick) {
            case "View Products for Sale":
                displayData();
                break;
            case "View Low Inventory":
                checkLowInventory();
                break;
            case "Add to Inventory":
                pickItem();
                break;
            case "Add New Product":
                newProduct();
        }
    });
}

const displayData = ()=> {
    connection.query("select * from products",function(err, response){
        if (err) throw err;
        let itemArray = [];
        response.forEach(item => {
        const newItem = new ProductInfo(item.item_id, item.product_name, item.price, item.stock_quantity);
        itemArray.push(newItem);
    });
    console.table(itemArray);
    allFinished();
});
}

const pickItem = ()=>{
        inquirer.prompt([
        {
            message: "What the Item_id of the product you would like add inventory too?",
            type: "input",
            name: "item"
        },
        {
            message: "How many would you like add?",
            type: "input",
            name: "quantity"
        }
    ]).then(answer =>{
        let item = parseInt(answer.item)
        let quantity = parseInt(answer.quantity);
        connection.query("select * from products where item_id =?",[item],function(err, response){
            if (err) throw err;
            updateStore(item, quantity, response[0].stock_quantity);
        });
    });
}
            
const updateStore = (item, quantity, currentQuanity)=>{
    //add current inventory and added quantity
    const newQuantity = currentQuanity + quantity;
    //update the database
    connection.query("update products set stock_quantity =? where item_id =?", [newQuantity,item],
        function(err, response){
        if(err) throw err;
        console.log("The new inventory is "+  newQuantity);
        //see if they want anything else
        allFinished();
    });
}

const checkLowInventory = ()=> {
    connection.query("Select * from products where stock_quantity < 10",function(err, response){
            if(err) throw err;
        if(response.length > 0){
            let itemArray = [];
            response.forEach(item => {
            const newItem = new ProductInfo(item.item_id, item.product_name, item.price, item.stock_quantity);
            itemArray.push(newItem);
        });
        console.table(itemArray);
        } else{
            console.log("There are not items currently with low inventory.");
        }
        allFinished();
});
}

const newProduct = ()=> {
    inquirer.prompt([
        {
            message: "What's the item_id you would like to add?",
            type: "input",
            name: "item_id"
        },
        {
            message: "What's the name of the item you would like to add?",
            type: "input",
            name: "product_name"
        },
        {
            message: "What's the price of the item you would like to add?",
            type: "input",
            name: "price" 
        },
        {
        message: "How many would you like to add to the inventory?",
            type: "input",
            name: "inventory"
        }
    ]).then(answer =>{
        let price = parseInt(answer.price);
        let inventory = parseInt(answer.inventory);
        let idNum = parseInt(answer.item_id);
        connection.query("insert into products (item_id, product_name, price, stock_quantity) values (?, ?, ?, ?)",
        [idNum, answer.product_name, price, inventory],
        function(err, response){
            if (err) throw err;
            let addedItem = new ProductInfo (idNum, answer.product_name, price, inventory);
            console.table(addedItem); 
            console.log("You're item has been added!")
            allFinished();
        });
    });
    
}

    
const allFinished = ()=> {
    inquirer.prompt([
        {
            message: "Anything else you'd like to do?",
            type: "confirm",
            name: "doSomething"
        }
    ]).then(answer =>{
        if(answer.doSomething){
            checkWhatTheyWant();
        }
        else{
            console.log("Ok! Have a great rest of you day keeping the little man down!");
            connection.end();
        }
    }); 
}