create database swish;

use swish;

create table users
(
    user_id int primary key auto_increment,
    store_name varchar(255) not null,
    phone_number varchar(15) not null,
	username varchar(60) unique not null
);



create table products
(
    product_id int primary key auto_increment,
    product_name varchar(255) not null,
    product_price decimal(10,2) not null,
	product_description varchar(3000),
	user_id int not null,
	foreign key (user_id) references users(user_id)
	on delete cascade
);
