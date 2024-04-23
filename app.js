const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const TodoRoute = require("./routes/TodoRoutes");
const flash = require("connect-flash");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);
const csrf = require("csurf");
const config = require("./config");

const app = express();

let store = new MongoDBStore({
  uri: `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.zlveoht.mongodb.net/`,
  collection: "mySessions",
});

const PORT = 5000;
app.set("view engine", "pug");
app.set("views", "views");

app.use(bodyParser.urlencoded({ extended: false }));

// Configure session and flash middleware
app.use(
  session({
    secret: "my secret",
    resave: false,
    saveUninitialized: false,
    store: store,
  })
);

// Connect flash
app.use(flash());
app.use(TodoRoute);

// const csrfProtection = csrf();

// app.use(csrfProtection);

// app.use((req, res, next) => {
//   res.locals.isLoggedIn = req.session.isLoggedIn;
//   res.locals.csrfToken = req.csrfToken();
//   next();
// });

mongoose
  .connect(
    "mongodb+srv://shahmirnazir:DFcnSVv1MI506e8C@cluster0.zlveoht.mongodb.net/"
  )
  .then((response) => {
    if (response) {
      app.listen(5000, () => {
        console.log("Connected To Database.");
        console.log(`Server is running on ${PORT}`);
      });
    }
  })
  .catch((err) => {
    console.log("Connection to Database Failed!", err);
  });
