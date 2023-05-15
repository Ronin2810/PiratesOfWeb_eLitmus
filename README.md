# Pirates of Web

Welcome to Pirates of Web, an exciting online treasure hunt game based on the theme of cars! In this game, players will embark on a thrilling journey filled with riddles, clues, and the quest to find the ultimate treasure. The project is built using Node.js, Express.js, HTML, CSS, JavaScript, and MySQL.

**Hosting Link** : https://pirates-of-the-web.onrender.com/

**Note**:  
        
        1. Please use a PC/Laptop for a better user experience.

        2. There might be some delay in loading of some pages due to usage hosting website's free version of hosting.
        
        3. In case of any queries, you can contact the developer at adityapatilsy@gmail.com .

## Installation

1. Clone the repository: `git clone https://github.com/Ronin2810/eLitmus_PiratesOfWeb.git`
2. Navigate to the project directories of backend and frontend respectively: 
        `cd frontend`
        `cd backend`
3. Install the dependencies: `npm install`

## Usage

To start the Pirates of Web game, follow these steps:

1. Run the backend application by moving in the backend directory: 
    `cd backend`
    `npm start`
2. Run the frontend application by moving in the backend directory: 
    `cd frontend`
    `npm start`
3. The backend server will be running on : `http://localhost:5000`

4. Access the game through your web browser: `http://localhost:5555`

## Game Flow

The game consists of 7 riddles, 2 dead ends, and 1 correct path. Players must carefully read the prompts, understand the clues provided with each riddle, and come up with the correct answer to proceed to the next challenge. Beware of the dead ends, as they may lead to a temporary halt in the treasure hunt.

**NOTE**: Please refer the answers.md file for answers of the riddles.

## Features

1. **Load Game**: The player can continue from where they left off in the previous session. The game saves the progress of the player, allowing them to resume their riddle-solving journey seamlessly.

2. **Hover effects**: The clues are hidden inside the images displayed below the riddle prompt. By hovering over these images, players can reveal additional hints or vital information to help them solve the riddles more effectively. This feature adds an element of discovery and intrigue to the gameplay.

3. **Admin Dashboard**: The admin can track the progress of all users playing the riddle. It provides valuable insights to the admin for game improvements.

4. **Player Dashboard**: The user has a dedicated dashboard where they have the options to either restart the game or continue from where they left off. This feature empowers players to tailor their gaming experience according to their preferences, allowing them to start afresh or pick up where they left off.

5. **Password Encryption**: The users' passwords are in safe hands because only the encrypted passwords (done via bcrypt-js) are stored in the database. This ensures the security and protection of sensitive user information.

6. **Session Management**: This feature ensures a seamless and secure user experience by maintaining user-specific data across multiple page requests. It allows the game to remember the player's progress, preferences, and other relevant information, creating a personalized and uninterrupted gaming experience.

These features collectively enhance the gameplay experience, offering convenience, personalization, and an immersive journey of solving intriguing riddles. Whether you're a player looking for an engaging adventure or an admin seeking to manage and analyze user data efficiently, this riddle game provides a rich set of features to cater to your needs.

## User Entities

### Admin

The admin entity has special privileges and can perform administrative tasks within the game. They have access to the Admin Router for managing game content, user progress, and other administrative actions.


## Admin Router

The Admin Router handles administrative functionalities for managing the game content, user progress, and other administrative actions.

### Login

**Route:** `POST /admin/login`

This route is used for admin login. It accepts the admin's credentials and authenticates them. Upon successful authentication, if the session is authenticated, the user is redirected to the admin dashboard. If the session is not authenticated, the user is redirected to the login page.

### Dashboard

**Route:** `GET /admin/dashboard`

This route displays the admin dashboard, showing relevant information and statistics. It checks if the user is authenticated. If the user is authenticated, the route retrieves the admin's data from the database and fetches user data for display. The retrieved data is then rendered on the admin dashboard page.

### Logout

**Route:** `GET /logout`

This route logs out the admin, clearing the authentication cookie and destroying the session. After successful logout, the user is redirected to the login page.

Please note that the code snippets for the admin routes are not provided here. You would need to implement these routes in your project according to your specific requirements.

### Player

The player entity participates in the treasure hunt and attempts to solve the riddles to progress further in the game. Players can access the Player Router for gameplay-related actions.

#### Player Router

## Register
**Route:** `POST /register`

This route is used for player registration. It accepts the player's registration details and registers them in the system. Upon successful registration, if the session is authenticated, the user is redirected to the player dashboard. If the session is not authenticated, the user is redirected to the login page. If the player is already registered, they are redirected to the login page.

## Login
**Route:** `POST /player/login`

This route is used for player login. It accepts the player's credentials and authenticates them. Upon successful authentication, if the session is authenticated, the user is redirected to the player dashboard. If the session is not authenticated, the user is redirected to the login page.

## Dashboard
**Route:** `GET /player/dashboard`

This route displays the player dashboard, showing relevant information and statistics. It checks if the user is authenticated. If the user is authenticated, the route retrieves the player's data from the database and renders it on the player dashboard page.

## Riddle Restart
**Route:** `GET /player/riddle/restart`

This route allows the player to restart the riddle. It checks if the user is authenticated and restarts the riddle progress, redirecting the player to the first riddle.

## Riddle Continue
**Route:** `GET /player/riddle/continue`

This route allows the player to continue the riddle from their last saved progress. It checks if the user is authenticated and retrieves the player's last saved question number from the database. The player is then redirected to the corresponding riddle question page.

## Riddle Question
**Route:** `GET /player/riddle/q/:id`

This route displays a specific riddle question based on the provided question ID. It checks if the user is authenticated and compares the question ID with the player's current progress. If the player is allowed to access the question, it renders the corresponding riddle question page. Otherwise, it redirects the player to the appropriate question based on their current progress.

## Riddle Question Submit
**Route:** `POST /player/riddle/q/:id`

This route handles the submission of answers for a specific riddle question. It checks if the user is authenticated and validates the submitted answer against the expected answer in the database. If the answer is correct, the player is redirected to the next question. If the answer is wrong, an appropriate message is displayed, and the player is redirected back to the same question.

## Logout
**Route:** `GET /logout`

This route logs out the player, clearing the authentication cookie and destroying the session. After successful logout, the player is redirected to the login page.

Please note that the code snippets for the player routes are not provided here. You would need to implement these routes in your project according to your specific requirements.

# Database Tables

This project utilizes a MySQL database with the following tables:

## Table: questions

| Field          | Type         | Null | Key | Default | Extra |
| -------------- | ------------ | ---- | --- | ------- | ----- |
| question_no    | int          | NO   |     | NULL    |       |
| question       | varchar(255) | YES  |     | NULL    |       |
| answer         | varchar(20)  | YES  |     | NULL    |       |
| next_question  | int          | YES  |     | NULL    |       |

This table stores the questions and answers for a particular user. Each question has a unique identifier (question_no) and contains the actual question text (question), the corresponding answer (answer), and the identifier of the next question (next_question) to be asked.

## Table: users

| Field          | Type         | Null | Key | Default | Extra          |
| -------------- | ------------ | ---- | --- | ------- | -------------- |
| user_id        | int          | NO   | PRI | NULL    | auto_increment |
| user_name      | varchar(30)  | YES  |     | NULL    |                |
| user_email     | varchar(30)  | YES  |     | NULL    |                |
| user_password  | char(60)     | YES  |     | NULL    |                |

This table stores the information of registered users. Each user has a unique identifier (user_id) and includes their name (user_name), email address (user_email), and password (user_password).

## Table: user_status

| Field          | Type | Null | Key | Default | Extra |
| -------------- | ---- | ---- | --- | ------- | ----- |
| user_id        | int  | YES  | MUL | NULL    |       |
| question_no    | int  | YES  |     | NULL    |       |

This table tracks the progress of users in the question-answer sequence. It contains the user's identifier (user_id) and the identifier of the current question (question_no) they are on.

## Table: admin

| Field           | Type        | Null | Key | Default | Extra |
| --------------- | ------------| ---- | --- | ------- | ----- |
| admin_name      | varchar(30) | YES  |     | NULL    |       |
| admin_email     | varchar(30) | YES  |     | NULL    |       |
| admin_password  | char(60)    | YES  |     | NULL    |       |

This table stores the information of administrators. It includes the administrator's name (admin_name), email address (admin_email), and password (admin_password).



## Contributing

Contributions to Pirates of Web are welcome! If you have any suggestions, bug reports, or feature requests, please open an issue or submit a pull request.


