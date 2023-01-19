# JoyAR Admin API

Admin API for JoyAR app
used to
- Create
- Read
- Update
- Delete

products to be used in the main JoyAR app

Stored in a MongoDB database

## Run Dev

```sudo docker start mongodb```
```yarn run dev```

## TODO

- App
  - [X] Routes
  - [X] Database Connection
  - [ ] Containerize

- User
  - [X] Register
  - [X] Login
  - [X] Update
  - [x] Delete
  - [X] Forgot Password
  - [ ] Email Forgot Password
  - [X] Change Password
  - [X] JWT Authentication
  - [X] JWT Authorization  


- Product
  - [X] Relationship Product <-> Image
  - [X] Create
  - [X] Read
  - [X] Update
  - [X] Delete
  - [ ] Image Compression
  - [X] Image Local Saving
  - [X] Image Upload


## Using

App
  - NodeJS
  - Yarn
  - Express
  - MongoDB
  - Mongoose
  - Bcrypt
  - Crypto
  - Json Web Token (JWT)
  - Body Parser

Dev
  - Node Mailer
  - Nodemon