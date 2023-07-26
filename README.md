# Anonymous Messaging Platform

1. Getting Started
2. About the project
3. Project Structure
4. Routes
5. Stacks
6. Important Note
7. Feedback

### Getting Started

#### Welcome

 this assumes that you have NodeJs installed in your system


* clone this repo by running the command in your terminal.
  ```
  git clone https://https://github.com/King-diablo/AnonymousMessenger.git
  ```

* after thats done run the following commands:
   ```
   cd AnonymousMessenger
   ```

* then you now install all the dependencey
  ```
  npm install
  ```

* when all is done you can start the server
  ``` 
  node server.js
  ```

***

### OR

* you can download the zip and extract it into any folder of your
  choice

* then open your terminal and navigate to where it's located
* and run the following command
  ``` 
  npm install
  ```
* after its down installing you can start the server
  ``` 
  node server.js 
  ```


### About the project

this is a simple messaging api that can send and recive message between registered
users.

### Project Structure

* src
  * config
  * controller
  * helper
  * middleware
  * models
  * routes

### Routes
  this routes can only be hit using postman or its alternative

* root
  ```
  https://localhost3000/api/v1
  ```

* Register route
    ```
    "/register"
    ```
    ```
    to register you need to pass in {email} and {password} to the body
    ```

* Login route
  ```
  "/login"
  ```
  ```
  to login you need to pass in {email} and {password} to the body
  ```

* User-Update route
  ```
  "/user/update"
  ```

  ```
  in update you can add the following

  - userName
  - firstName
  - lastName
  - picture

  to the body of the api

  you can also update your password but you cannot change your email
  ```
* Message route
    ```
    "/user/message"
    ```

    ```
    in this route you are required to add this to the body

    to -> as the user to send the message to
    message -> the message to send
    ```
* Inbox route
  ```
  "/user/inbox"
  ```

  ```
  this is a GET request no info is required but you must be logged in to use it

  this gets all the messages sent to you and it also hides the sender
  ```
* Reporting-Message route
  ```
  "/user/report"
  ```

  ```
  You will need the messageId passed into the body of the api to report the message.
  if a message is reported 6 times it is automatically deleted
  ```

* Delete-User route
  ```
  "/user/delete"
  ```
  ```
  this requires email and password to be passed to the body
  before the user can be deleted
  ```
### Stacks
this was built with
* nodejs & expressjs
* mongoosedb

### Important Note

> environment variables needed
> * *SALT_ROUNDS*
> * *PORT*
> * *DATABASE_URL*

This project is far from complete as it's missing its most important feature that is
the messaging feature.

[socket.io](https://socket.io/) was to be used to create the feature but was not.

I have not used the package before and decided not to use untill i understood it better. that being said i might come back to implement it after i understand it

Instead mongodb was used to fake the sending and reciving of messages

### Got Feedback?
have any feedback, info or tip. am always looking to improve what i know. so if you have any feedback please create an issue.

Thanks.