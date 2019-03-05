create database bamazon;

use bamazon;

create table products (
    item_id int not null, 
    product_name varchar(50),
    price decimal(10,2), 
    stock_quantity int, 
    primary key(item_id));

insert into products (item_id, product_name, price, stock_quantity)
values (1001, "toothpaste", 3.75, 50), (1002, "soup", 4.25, 75), 
(1003, "chewing gum", 1.75, 200), (1004, "6-pack beer", 9.99, 100),
(1005, "wine spritzer", 8.57, 60),(1006, "candles", 3.50, 80),
(1007, "flaming hot doritos", 2.85, 40),(1008, "beef jerky", 5.25, 70),
(1009, "cigarettes", 7.99, 200),(1010, "deodarant", 4.75, 80);

