# Music Catalyst

## What it does and how it works

Allows users to register and save songs to their Music Catalyst account. Music Catalyst provides a user friendly login and registration frontend, developed in React. The backend was developed in JavaScript and databases storing user information are managed via MySQL. The server is hosted locally using Apache. Passwords are encrypted using bcrypt to ensure the safety of users. Saved song are able to have a title, YouTube embedded video link and lyrics. Music Catalyst is aimed at music enthusiasts who desire a platform to quickly save and clear playlists. With lyrics, users are able to sing along should they choose to or are able to use the app for social events such as karaoke. 

**Requirements:**

```
frontend:
npm install mobx --save
npm install mobx-react --save

backend:
npm install bcrypt --save
npm install express --save
npm install express-mysql-session --save
npm install express-session --save
npm install mysql --save
```

## Video Demo

A video has been created to demonstrate the functionality of Music Catalyst.

[Click here to view demo.](https://www.youtube.com/watch?v=zCJFEet8Yac)
