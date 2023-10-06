# Facility Management System
Facility Management System is a web application is an incubating idea for colleges that aims to battle problems of facility and resource management in large institutions such as DSCE.


## Table of Contents
* [Features](#features)
* [Technologies used](#technologies-used)
* [npm packages used](#npm-packages-used)
* [Prerequisites](#prerequisites)
* [Installation and setup](#installation-and-setup)


## Features
- The system consists of three types of users: admins, faculty and staff.
- Admins: They control the allotment of the auditorium for events.
- Faculty: They are the driving users of the application who raise the tickets.
- Staff: They are responsible for attending to the ticket raised by the faculty.
- Each user should have an account.
- Every user also has a dashboard where they can view several things in a short summary.
- The application provides signup, login and logout functionalities.

## Technologies used
- HTML
- CSS
- Bootstrap
- Javascript
- Node.js
- Express.js
- Mongodb
- ejs

## npm packages used
- express
- ejs
- express-ejs-layouts
- mongoose
- express-session
- bcryptjs
- passport
- passport-local
- connect-flash
- method-override
- dotenv

## Prerequisites
For running the application:
- Node.js must be installed on the system.
- You should have a MongoDB database.
- You should have a code editor (preferred: VS Code)

## Installation and Setup
1. Download the source code in the desired location on your system.
2. Open the code in your code editor.
3. To install all the dependencies (listed in package.json file) in your project, go to terminal and type the following command and hit enter:
	```sh
	npm install
	```
4. Create a file named ".env" and enter the following credentials:
	```js
	MONGO_URI=your-mongo-uri
	```
5. Go to terminal and type the following command and hit enter:
	```sh
	npm start
	```
6. Open browser and go to url: http://localhost:5100
7. You need to first signup and then login to run the application.

