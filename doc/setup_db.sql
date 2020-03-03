
use dippnalf;
drop table if exists MenuCategory;
drop table if exists MenuItem;
drop table if exists Party;
drop table if exists PartyOrder;
drop table if exists OrderItem;

-- !!! keep below lines commented !!!
-- generate inserts for MenuCategory
#select concat('INSERT INTO MenuCategory(catID, catName) VALUES (',catID,',\'',catName,'\');') from MenuCategory;
-- generate inserts for MenuItem
#select concat('INSERT INTO MenuItem(itemNum, itemName, category, price, isVegetarian, isVegan, glutenFree, containsNuts) VALUES (',itemNum,',\'',itemName,'\',',category,',',price,',',isVegetarian,',',isVegan,',',glutenFree,',',containsNuts,');') from MenuItem;


create table MenuCategory(
	catID int primary key, 
	catName varchar(255) not null
);
CREATE TABLE MenuItem (
    itemNum INT PRIMARY KEY,
    itemName VARCHAR(255) NOT NULL UNIQUE,
    category INT REFERENCES MenuCategory (catID),
    price DECIMAL(5 , 2 ),
    isVegetarian BOOLEAN,
    isVegan BOOLEAN,
    glutenFree BOOLEAN,
    containsNuts BOOLEAN
);

-- MenuCategory inserts
INSERT INTO MenuCategory(catID, catName) VALUES (1,'Side Orders');
INSERT INTO MenuCategory(catID, catName) VALUES (2,'Tye Wan Mein');
INSERT INTO MenuCategory(catID, catName) VALUES (3,'Japanese Curries');
INSERT INTO MenuCategory(catID, catName) VALUES (4,'Fried Rice');
INSERT INTO MenuCategory(catID, catName) VALUES (5,'Lomen');
INSERT INTO MenuCategory(catID, catName) VALUES (6,'Zel-Chow');
-- MenuItem inserts
INSERT INTO MenuItem(itemNum, itemName, category, price, isVegetarian, isVegan, glutenFree, containsNuts) VALUES (2,'Duck Pancake Rolls',1,5.10,0,0,0,0);
INSERT INTO MenuItem(itemNum, itemName, category, price, isVegetarian, isVegan, glutenFree, containsNuts) VALUES (4,'Vegetable Rolls',1,4.90,1,1,0,0);
INSERT INTO MenuItem(itemNum, itemName, category, price, isVegetarian, isVegan, glutenFree, containsNuts) VALUES (6,'Tyepyedong Seafood Tempura',1,5.20,0,0,0,0);
INSERT INTO MenuItem(itemNum, itemName, category, price, isVegetarian, isVegan, glutenFree, containsNuts) VALUES (7,'Edamame',1,4.80,1,1,1,0);
INSERT INTO MenuItem(itemNum, itemName, category, price, isVegetarian, isVegan, glutenFree, containsNuts) VALUES (8,'Chicken Yakitori',1,5.20,0,0,0,0);
INSERT INTO MenuItem(itemNum, itemName, category, price, isVegetarian, isVegan, glutenFree, containsNuts) VALUES (10,'King Prawn Rolls',1,5.30,0,0,0,0);
INSERT INTO MenuItem(itemNum, itemName, category, price, isVegetarian, isVegan, glutenFree, containsNuts) VALUES (11,'Tyepyedong Soup - Ramen Noodles',2,10.80,0,0,0,0);
INSERT INTO MenuItem(itemNum, itemName, category, price, isVegetarian, isVegan, glutenFree, containsNuts) VALUES (12,'Chicken Soup - Ramen Noodles',2,9.70,0,0,0,0);
INSERT INTO MenuItem(itemNum, itemName, category, price, isVegetarian, isVegan, glutenFree, containsNuts) VALUES (14,'Yasai Soup - Ramen Noodles',2,9.50,1,0,0,0);
INSERT INTO MenuItem(itemNum, itemName, category, price, isVegetarian, isVegan, glutenFree, containsNuts) VALUES (15,'Tyepyedong Soup - Udon Noodles',2,10.80,0,0,0,0);
INSERT INTO MenuItem(itemNum, itemName, category, price, isVegetarian, isVegan, glutenFree, containsNuts) VALUES (16,'Malay Soup - Udon Noodles',2,10.90,0,0,0,1);
INSERT INTO MenuItem(itemNum, itemName, category, price, isVegetarian, isVegan, glutenFree, containsNuts) VALUES (17,'Chicken Soup - Udon Noodles',2,9.70,0,0,0,0);
INSERT INTO MenuItem(itemNum, itemName, category, price, isVegetarian, isVegan, glutenFree, containsNuts) VALUES (18,'Malay Soup - Mei Fun Noodles',2,10.90,0,0,0,1);
INSERT INTO MenuItem(itemNum, itemName, category, price, isVegetarian, isVegan, glutenFree, containsNuts) VALUES (19,'Tyepyedong Soup - Mei Fun Noodles',2,10.80,0,0,1,0);
INSERT INTO MenuItem(itemNum, itemName, category, price, isVegetarian, isVegan, glutenFree, containsNuts) VALUES (20,'Yasai Soup - Mei Fun Noodles',2,9.20,1,1,1,0);
INSERT INTO MenuItem(itemNum, itemName, category, price, isVegetarian, isVegan, glutenFree, containsNuts) VALUES (21,'Jarhon Udon',5,10.80,0,0,0,0);
INSERT INTO MenuItem(itemNum, itemName, category, price, isVegetarian, isVegan, glutenFree, containsNuts) VALUES (22,'Tyepyedong Stir Fry - Udon Noodles',5,10.70,0,0,0,0);
INSERT INTO MenuItem(itemNum, itemName, category, price, isVegetarian, isVegan, glutenFree, containsNuts) VALUES (23,'Malay Stir Fry - Udon Noodles',5,10.90,0,0,0,1);
INSERT INTO MenuItem(itemNum, itemName, category, price, isVegetarian, isVegan, glutenFree, containsNuts) VALUES (24,'Chicken Stir Fry - Udon Noodles',5,9.50,0,0,0,0);
INSERT INTO MenuItem(itemNum, itemName, category, price, isVegetarian, isVegan, glutenFree, containsNuts) VALUES (25,'Beef Stir Fry - Udon Noodles',5,9.50,0,0,0,0);
INSERT INTO MenuItem(itemNum, itemName, category, price, isVegetarian, isVegan, glutenFree, containsNuts) VALUES (26,'Yasai Stir Fry - Udon Noodles',5,9.30,1,1,0,0);
INSERT INTO MenuItem(itemNum, itemName, category, price, isVegetarian, isVegan, glutenFree, containsNuts) VALUES (27,'Tyepyedong Stir Fry - Yakisoba Noodles',5,10.70,0,0,0,0);
INSERT INTO MenuItem(itemNum, itemName, category, price, isVegetarian, isVegan, glutenFree, containsNuts) VALUES (28,'Malay Stir Fry - Yakisoba Noodles',5,10.90,0,0,0,1);
INSERT INTO MenuItem(itemNum, itemName, category, price, isVegetarian, isVegan, glutenFree, containsNuts) VALUES (29,'Chicken Stir Fry - Yakisoba Noodles',5,9.50,0,0,0,0);
INSERT INTO MenuItem(itemNum, itemName, category, price, isVegetarian, isVegan, glutenFree, containsNuts) VALUES (30,'Beef Stir Fry - Yakisoba Noodles',5,9.50,0,0,0,0);
INSERT INTO MenuItem(itemNum, itemName, category, price, isVegetarian, isVegan, glutenFree, containsNuts) VALUES (31,'Yasai Stir Fry - Yakisoba Noodles',5,9.30,1,1,0,0);
INSERT INTO MenuItem(itemNum, itemName, category, price, isVegetarian, isVegan, glutenFree, containsNuts) VALUES (32,'Donburi - Tyepyedong',6,10.80,0,0,1,0);
INSERT INTO MenuItem(itemNum, itemName, category, price, isVegetarian, isVegan, glutenFree, containsNuts) VALUES (34,'Donburi - Chicken',6,9.70,0,0,1,0);
INSERT INTO MenuItem(itemNum, itemName, category, price, isVegetarian, isVegan, glutenFree, containsNuts) VALUES (35,'Donburi - Beef',6,9.70,0,0,1,0);
INSERT INTO MenuItem(itemNum, itemName, category, price, isVegetarian, isVegan, glutenFree, containsNuts) VALUES (36,'Donburi - Yasai',6,11.80,1,1,1,0);
INSERT INTO MenuItem(itemNum, itemName, category, price, isVegetarian, isVegan, glutenFree, containsNuts) VALUES (37,'Sweet & Sour - Chicken',6,9.70,0,0,1,0);
INSERT INTO MenuItem(itemNum, itemName, category, price, isVegetarian, isVegan, glutenFree, containsNuts) VALUES (38,'Shredded Cantonese Beef',6,10.00,0,0,0,0);
INSERT INTO MenuItem(itemNum, itemName, category, price, isVegetarian, isVegan, glutenFree, containsNuts) VALUES (39,'Spicy Garlic - Chicken',6,9.90,0,0,1,0);
INSERT INTO MenuItem(itemNum, itemName, category, price, isVegetarian, isVegan, glutenFree, containsNuts) VALUES (40,'Spicy Garlic - Shredded Beef',6,10.00,0,0,1,0);
INSERT INTO MenuItem(itemNum, itemName, category, price, isVegetarian, isVegan, glutenFree, containsNuts) VALUES (41,'Szechwan - Chicken',6,9.70,0,0,0,0);
INSERT INTO MenuItem(itemNum, itemName, category, price, isVegetarian, isVegan, glutenFree, containsNuts) VALUES (42,'Szechwan - Beef',6,9.70,0,0,0,0);
INSERT INTO MenuItem(itemNum, itemName, category, price, isVegetarian, isVegan, glutenFree, containsNuts) VALUES (43,'Szechwan - Prawns',6,11.80,0,0,0,0);
INSERT INTO MenuItem(itemNum, itemName, category, price, isVegetarian, isVegan, glutenFree, containsNuts) VALUES (44,'"Wondering Dragon"',6,10.70,0,0,1,0);
INSERT INTO MenuItem(itemNum, itemName, category, price, isVegetarian, isVegan, glutenFree, containsNuts) VALUES (51,'Tyepyedong Fried Rice',4,10.60,0,0,1,0);
INSERT INTO MenuItem(itemNum, itemName, category, price, isVegetarian, isVegan, glutenFree, containsNuts) VALUES (52,'Yasai Fried Rice',4,9.20,1,0,0,0);
INSERT INTO MenuItem(itemNum, itemName, category, price, isVegetarian, isVegan, glutenFree, containsNuts) VALUES (53,'Sweet & Sour - Yasai',6,9.30,1,1,1,0);
INSERT INTO MenuItem(itemNum, itemName, category, price, isVegetarian, isVegan, glutenFree, containsNuts) VALUES (54,'Malay Fried Rice',4,10.60,0,0,0,1);
INSERT INTO MenuItem(itemNum, itemName, category, price, isVegetarian, isVegan, glutenFree, containsNuts) VALUES (55,'Spicy Garlic - Prawns',6,11.80,0,0,1,0);
INSERT INTO MenuItem(itemNum, itemName, category, price, isVegetarian, isVegan, glutenFree, containsNuts) VALUES (56,'Spicy Garlic - Yasai',6,9.30,1,1,1,0);
INSERT INTO MenuItem(itemNum, itemName, category, price, isVegetarian, isVegan, glutenFree, containsNuts) VALUES (57,'Sweet & Sour - Prawns',6,11.80,0,0,1,0);
INSERT INTO MenuItem(itemNum, itemName, category, price, isVegetarian, isVegan, glutenFree, containsNuts) VALUES (58,'Beef Fried Rice',4,9.60,0,0,1,0);
INSERT INTO MenuItem(itemNum, itemName, category, price, isVegetarian, isVegan, glutenFree, containsNuts) VALUES (59,'Chicken Fried Rice',4,9.60,0,0,1,0);
INSERT INTO MenuItem(itemNum, itemName, category, price, isVegetarian, isVegan, glutenFree, containsNuts) VALUES (60,'Prawns Fried Rice',4,11.60,0,0,1,0);
INSERT INTO MenuItem(itemNum, itemName, category, price, isVegetarian, isVegan, glutenFree, containsNuts) VALUES (61,'Szechwan - Tyepyedong',6,10.80,0,0,0,0);
INSERT INTO MenuItem(itemNum, itemName, category, price, isVegetarian, isVegan, glutenFree, containsNuts) VALUES (63,'"Hungry Monk"',6,9.30,1,1,1,0);
INSERT INTO MenuItem(itemNum, itemName, category, price, isVegetarian, isVegan, glutenFree, containsNuts) VALUES (64,'"Pheonix"',6,10.70,0,0,1,0);
INSERT INTO MenuItem(itemNum, itemName, category, price, isVegetarian, isVegan, glutenFree, containsNuts) VALUES (65,'Donburi - Prawns',6,11.80,0,0,1,0);
INSERT INTO MenuItem(itemNum, itemName, category, price, isVegetarian, isVegan, glutenFree, containsNuts) VALUES (81,'Chicken Curry with Fragrant Rice',3,9.80,0,0,0,1);
INSERT INTO MenuItem(itemNum, itemName, category, price, isVegetarian, isVegan, glutenFree, containsNuts) VALUES (82,'Beef Curry with Fragrant Rice',3,9.80,0,0,0,1);
INSERT INTO MenuItem(itemNum, itemName, category, price, isVegetarian, isVegan, glutenFree, containsNuts) VALUES (83,'Yasai Curry',3,9.30,1,0,0,1);
INSERT INTO MenuItem(itemNum, itemName, category, price, isVegetarian, isVegan, glutenFree, containsNuts) VALUES (87,'Tyepyedong Curry',3,10.80,0,0,0,1);
INSERT INTO MenuItem(itemNum, itemName, category, price, isVegetarian, isVegan, glutenFree, containsNuts) VALUES (89,'Prawns Curry with Fragrant Rice',3,11.80,0,0,0,1);
INSERT INTO MenuItem(itemNum, itemName, category, price, isVegetarian, isVegan, glutenFree, containsNuts) VALUES (111,'Tyepyedong Vegetable Tempura',1,4.90,1,1,0,0);
INSERT INTO MenuItem(itemNum, itemName, category, price, isVegetarian, isVegan, glutenFree, containsNuts) VALUES (112,'Boiled Rice',1,3.20,1,1,1,0);
INSERT INTO MenuItem(itemNum, itemName, category, price, isVegetarian, isVegan, glutenFree, containsNuts) VALUES (113,'Udon Stir-Fried',1,5.50,1,1,0,0);
INSERT INTO MenuItem(itemNum, itemName, category, price, isVegetarian, isVegan, glutenFree, containsNuts) VALUES (114,'Yakisoba Stir-Fried',1,5.50,1,1,0,0);
INSERT INTO MenuItem(itemNum, itemName, category, price, isVegetarian, isVegan, glutenFree, containsNuts) VALUES (116,'Fresh Chilli',1,1.00,0,0,0,0);
INSERT INTO MenuItem(itemNum, itemName, category, price, isVegetarian, isVegan, glutenFree, containsNuts) VALUES (117,'Japanese Pickled Red Ginger',1,1.00,0,0,0,0);
INSERT INTO MenuItem(itemNum, itemName, category, price, isVegetarian, isVegan, glutenFree, containsNuts) VALUES (119,'Tyepyedong Prawn Tempura',1,6.95,0,0,0,0);
INSERT INTO MenuItem(itemNum, itemName, category, price, isVegetarian, isVegan, glutenFree, containsNuts) VALUES (122,'Yasai Lact Tong',2,9.50,1,0,1,0);
INSERT INTO MenuItem(itemNum, itemName, category, price, isVegetarian, isVegan, glutenFree, containsNuts) VALUES (124,'Chicken Soup - Mei Fun Noodles',2,9.70,0,0,1,0);
INSERT INTO MenuItem(itemNum, itemName, category, price, isVegetarian, isVegan, glutenFree, containsNuts) VALUES (125,'Tyepyedong Soup - Pad Thai Noodles',2,10.80,0,0,1,0);
INSERT INTO MenuItem(itemNum, itemName, category, price, isVegetarian, isVegan, glutenFree, containsNuts) VALUES (126,'Malay Soup - Pad Thai Noodles',2,10.90,0,0,0,1);
INSERT INTO MenuItem(itemNum, itemName, category, price, isVegetarian, isVegan, glutenFree, containsNuts) VALUES (127,'Yasai Soup - Pad Thai Noodles',2,9.20,1,1,1,0);
INSERT INTO MenuItem(itemNum, itemName, category, price, isVegetarian, isVegan, glutenFree, containsNuts) VALUES (132,'Tyepyedong Stir Fry - Mei Fun Noodles',5,10.70,0,0,1,0);
INSERT INTO MenuItem(itemNum, itemName, category, price, isVegetarian, isVegan, glutenFree, containsNuts) VALUES (133,'Malay Stir Fry - Mei Fun Noodles',5,10.90,0,0,0,1);
INSERT INTO MenuItem(itemNum, itemName, category, price, isVegetarian, isVegan, glutenFree, containsNuts) VALUES (134,'Yasai Stir Fry - Mei Fun Noodles',5,9.30,1,1,1,0);
INSERT INTO MenuItem(itemNum, itemName, category, price, isVegetarian, isVegan, glutenFree, containsNuts) VALUES (135,'Prawn Stir Fry - Udon Noodles',5,11.80,0,0,0,0);
INSERT INTO MenuItem(itemNum, itemName, category, price, isVegetarian, isVegan, glutenFree, containsNuts) VALUES (136,'Prawn Stir Fry - Yakisoba Noodles',5,11.80,0,0,0,0);
INSERT INTO MenuItem(itemNum, itemName, category, price, isVegetarian, isVegan, glutenFree, containsNuts) VALUES (137,'Chicken Stir Fry - Mei Fun Noodles',5,9.50,0,0,1,0);
INSERT INTO MenuItem(itemNum, itemName, category, price, isVegetarian, isVegan, glutenFree, containsNuts) VALUES (138,'Prawn Stir Fry - Mei Fun Noodles',5,11.80,0,0,1,0);
INSERT INTO MenuItem(itemNum, itemName, category, price, isVegetarian, isVegan, glutenFree, containsNuts) VALUES (139,'Tyepyedong Stir Fry - Pad Thai Noodles',5,10.70,0,0,1,0);
INSERT INTO MenuItem(itemNum, itemName, category, price, isVegetarian, isVegan, glutenFree, containsNuts) VALUES (140,'Malay Stir Fry - Pad Thai Noodles',5,10.90,0,0,0,1);
INSERT INTO MenuItem(itemNum, itemName, category, price, isVegetarian, isVegan, glutenFree, containsNuts) VALUES (141,'Chicken Stir Fry - Pad Thai Noodles',5,9.50,0,0,1,0);
INSERT INTO MenuItem(itemNum, itemName, category, price, isVegetarian, isVegan, glutenFree, containsNuts) VALUES (142,'Beef Stir Fry - Pad Thai Noodles',5,9.50,0,0,1,0);
INSERT INTO MenuItem(itemNum, itemName, category, price, isVegetarian, isVegan, glutenFree, containsNuts) VALUES (143,'Yasai Stir Fry - Pad Thai Noodles',5,9.30,1,1,1,0);
INSERT INTO MenuItem(itemNum, itemName, category, price, isVegetarian, isVegan, glutenFree, containsNuts) VALUES (144,'Prawn Stir Fry - Pad Thai Noodles',5,11.80,0,0,1,0);
INSERT INTO MenuItem(itemNum, itemName, category, price, isVegetarian, isVegan, glutenFree, containsNuts) VALUES (145,'Beef Stir Fry - Mei Fun Noodles',5,9.50,0,0,1,0);
INSERT INTO MenuItem(itemNum, itemName, category, price, isVegetarian, isVegan, glutenFree, containsNuts) VALUES (146,'Malay Soup - Ramen Noodles',2,10.90,0,0,0,1);
INSERT INTO MenuItem(itemNum, itemName, category, price, isVegetarian, isVegan, glutenFree, containsNuts) VALUES (147,'Beef Soup - Ramen Noodles',2,9.70,0,0,0,0);
INSERT INTO MenuItem(itemNum, itemName, category, price, isVegetarian, isVegan, glutenFree, containsNuts) VALUES (148,'Beef Soup - Udon Noodles',2,9.70,0,0,0,0);
INSERT INTO MenuItem(itemNum, itemName, category, price, isVegetarian, isVegan, glutenFree, containsNuts) VALUES (149,'Beef Soup - Mei Fun Noodles',2,9.70,0,0,1,0);
INSERT INTO MenuItem(itemNum, itemName, category, price, isVegetarian, isVegan, glutenFree, containsNuts) VALUES (152,'Chicken Soup - Pad Thai Noodles',2,9.70,0,0,1,0);
INSERT INTO MenuItem(itemNum, itemName, category, price, isVegetarian, isVegan, glutenFree, containsNuts) VALUES (153,'Beef Soup - Pad Thai Noodles',2,9.70,0,0,1,0);
INSERT INTO MenuItem(itemNum, itemName, category, price, isVegetarian, isVegan, glutenFree, containsNuts) VALUES (154,'Yasai Soup - Udon Noodles',2,9.20,1,1,0,0);
INSERT INTO MenuItem(itemNum, itemName, category, price, isVegetarian, isVegan, glutenFree, containsNuts) VALUES (160,'Tyepyedong Soup - Rice Cake',2,11.30,0,0,0,0);
INSERT INTO MenuItem(itemNum, itemName, category, price, isVegetarian, isVegan, glutenFree, containsNuts) VALUES (161,'Malay Soup - Rice Cake',2,11.40,0,0,0,1);
INSERT INTO MenuItem(itemNum, itemName, category, price, isVegetarian, isVegan, glutenFree, containsNuts) VALUES (162,'Chicken Soup - Rice Cake',2,10.20,0,0,1,0);
INSERT INTO MenuItem(itemNum, itemName, category, price, isVegetarian, isVegan, glutenFree, containsNuts) VALUES (163,'Beef Soup - Rice Cake',2,10.20,0,0,1,0);
INSERT INTO MenuItem(itemNum, itemName, category, price, isVegetarian, isVegan, glutenFree, containsNuts) VALUES (164,'Yasai Soup - Rice Cake',2,9.70,1,0,1,0);
INSERT INTO MenuItem(itemNum, itemName, category, price, isVegetarian, isVegan, glutenFree, containsNuts) VALUES (165,'Tyepyedong Stir Fry - Rice Cake',5,11.20,0,0,1,0);
INSERT INTO MenuItem(itemNum, itemName, category, price, isVegetarian, isVegan, glutenFree, containsNuts) VALUES (166,'Malay Stir Fry - Rice Cake',5,11.40,0,0,0,1);
INSERT INTO MenuItem(itemNum, itemName, category, price, isVegetarian, isVegan, glutenFree, containsNuts) VALUES (167,'Chicken Stir Fry - Rice Cake',5,10.00,0,0,1,0);
INSERT INTO MenuItem(itemNum, itemName, category, price, isVegetarian, isVegan, glutenFree, containsNuts) VALUES (168,'Beef Stir Fry - Rice Cake',5,10.00,0,0,1,0);
INSERT INTO MenuItem(itemNum, itemName, category, price, isVegetarian, isVegan, glutenFree, containsNuts) VALUES (169,'Yasai Stir Fry - Rice Cake',5,9.80,1,1,1,0);
INSERT INTO MenuItem(itemNum, itemName, category, price, isVegetarian, isVegan, glutenFree, containsNuts) VALUES (170,'Prawn Stir Fry - Rice Cake',5,12.30,0,0,1,0);

create table Party(
	partyID int primary key auto_increment,
    tableNum int not null,
    partySize int,
    inHouse boolean,
    priorityCustomer boolean
);

create table PartyOrder(
	orderID int primary key auto_increment,
    party int references Party(partyID),
    orderNum int check(orderNum>0)
);

create table OrderItem(
	orderID int references PartyOrder(orderID),
    itemNum int references MenuItem(itemNum),
    quantity int not null check (quantity>0),
    notes text
);

show tables;







