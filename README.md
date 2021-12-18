#Restaurant Database Project
A web application built with MongoDB that allows users to order food from available restaurants, view and edit their profiles, and view public users and their orders. 

![](public\images\homepage.png)

Running the server:
- open a terminal and run mongo daemon
- open another terminal and navigate to the assignment folder directory
- in the terminal run the following commands:
    - npm install
    - node database-initializer.js 
        - the terminal should print "10 users successfully added (should be 10)."
    - node server.js

Testing the application:
/*** User Registration ***/
- Valid user registration 
    - Click on the "Register" link in the header
    - Enter in a unique username and password
    - Click on the "Register" button
    - New user is added to the db and the user is redirected to their profile 

- Invalid user registration 
    - Click on the "Register" button while the username/password fields are empty
        - An error alert is displayed
    - Enter in an existing username and password into the fields
        - An error message is displayed under the button 

/*** User Login ***/
- Valid user login 
    - Click on the "Login" link in the header
    - Enter in the credentials of an existing user in the db (e.g. pedro, pedro)
        - The user is logged in and redirected to their profile page

- Invalid user login 
    - Enter in the credentials of a non-existing user or incorrect credentials of an existing user 
        - An error message is displayed under the button

- Before user is logged in 
    - Navigation header has links to home, users, register, and login 
    - An error message is displayed if user tries to access http://localhost:3000/orderform 
    - Cannot change privacy status of any users 

- After user is logged in 
    - Navigation header has links to home, users, order form, user profile, and logout 
    - Error message displayed if user tries to login 
    - Can place orders 
    - Can change privacy status 

/*** Users Directory ***/
- Click on "Users" in the header 
- A list of all public users is displayed 
- Query for a name: 
    - add a name query to the url (e.g. http://localhost:3000/users?name=a)
        - all public users with usernames that match the query should be displayed
        - query is case insensitive 

/*** User Profile Page ***/
- Click on a username on the users page 
    - Get redirected to that user's profile page

Logged in user's profile
- Shows their username
- Access to edit their privacy 
- Order history 

Public user's profile (not logged in as them)
- Shows their username
- Order history 

Private user (not logged in as them)
- Error message saying user is private

/*** Order Summary Page ***/
- Click on an order displayed under a user's order history 

Logged in as user who placed the order / Public user's order
- Shows order id, username of user who placed the order, the order itself (items and quantity),
  subtotal, tax, delivery fee, total 

Private user (not logged in as them)
- Error message saying user is private