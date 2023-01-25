# Chatapp
A full-functional and responsive Chat Application made using MERN stack, Tailwind CSS and Socket.io.

## Usage
The App has 2 options. 
1. Create a New room
2. Join an Existing Room

### Create New room 
A person can create his private room by entering a new username and password. This will create a New room and every new room created will have 6 digit a unique roomID.

### Join Room 
If a user wants to join a room the user should enter a valid roomID. After entering a Valid roomID he needs to enter a username and password. 
If the username allready exists in the DB and the password is correct then he will get access to the room and all the previous chats else, 
if username exists and password is incorrect, he will get a alert box saying wrong password. If the username does not exist in the DB, a new user will be created.
This new user enter the room and he will get direct access to the room and it's chats. 





