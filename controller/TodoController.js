const authUserModel = require("../models/authUser");
const bcrypt = require("bcryptjs");
const csrfTokenModel = require("../models/csrfToken");
const todoModel = require("../models/addTodo");
const nodemailer = require("nodemailer");
const crypto = require("crypto");
const config = require("../config");

const transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: "mohammadshahmeer024@gmail.com",
    pass: `${process.env.GMAIL_PASSWORD}`,
  },
});

exports.renderHomePageController = (req, res) => {
  console.log(config);
  const user = req.session.user;
  todoModel
    .find({ userEmail: user.email })
    .then((userTodos) => {
      res.render("Home", {
        pageTitle: "Todos",
        userTodos: userTodos,
        email: user.email,
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send("Internal Server Error");
    });
};

exports.renderLoginPageController = (req, res) => {
  res.render("LoginScreen", {
    pageTitle: "Login User",
  });
};

exports.renderSignUpPageController = (req, res) => {
  res.render("Signup", {
    pageTitle: "SignUp Form",
  });
};

exports.postSignupController = (req, res) => {
  const { email, password } = req.body;
  authUserModel
    .findOne({ email: email })
    .then((user) => {
      if (user) {
        // res.status(400).send({ error: "User Already Exist" });
        req.flash("error", "User Already Exists");
      } else {
        return bcrypt
          .hash(password, 12)
          .then((hashedPassword) => {
            const newUser = new authUserModel({
              email: email,
              password: hashedPassword,
            });
            return newUser.save();
          })
          .then((response) => {
            res.redirect("/login");
          })
          .catch((err) => {
            console.log(err);
          })
          .catch((err) => console.log(err));
      }
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.postLoginRequestController = (req, res) => {
  const { email, password } = req.body;

  authUserModel
    .findOne({ email: email })
    .then((user) => {
      if (!user) {
        res.status(400).send({ error: "User Does Not Exist." });
      } else {
        bcrypt
          .compare(password, user.password)
          .then((isValidPassword) => {
            if (!isValidPassword) {
              return res.redirect("/login");
            } else {
              req.session.isLoggedIn = true;
              req.session.user = user;

              //generate token
              // Create CSRF token entry in database
              const expirationTime = new Date(Date.now() + 1 * 60 * 60 * 1000);
              csrfTokenModel
                .findOne({ email: email })
                .then((tokenUser) => {
                  if (!tokenUser) {
                    // const csrfToken = new csrfTokenModel({
                    //   email: user.email,
                    //   password: user.password,
                    //   csrfToken: req.session.csrfSecret,
                    //   expirationTime: expirationTime,
                    // });
                    res.redirect("/");
                    // return csrfToken.save();
                  } else {
                    // res.redirect("/");
                  }
                })
                .catch((err) => {
                  console.log(err);
                });
            }
          })
          .catch((err) => console.log(err));
      }
    })
    .catch((err) => console.log(err));
};

exports.renderAddTodoScreenController = (req, res) => {
  res.render("AddTodo", {
    pageTitle: "Add Todos",
  });
};

exports.addTodosController = (req, res) => {
  const { todo, todoDate } = req.body;
  const newTodos = new todoModel({
    todo: todo,
    todoDate: todoDate,
    userId: req?.session?.user?._id,
    userEmail: req?.session?.user?.email,
  });
  newTodos.save();
  return res.redirect("/");
};

exports.editTodoController = (req, res) => {
  const { id } = req.params;
  todoModel.findById(id).then((editTodo) => {
    res.render("editTodo", {
      editTodo: editTodo,
    });
  });
};

exports.editTodoRequestController = (req, res) => {
  console.log("body", req.body);
  console.log("params", req.params);
  const { id } = req.params;
  const { todo, todoDate } = req.body;
  return todoModel
    .findByIdAndUpdate(id, {
      todo: todo || "",
      todoDate: todoDate || null,
    })
    .then(() => {
      res.redirect(`/`);
    });
};

exports.deleteTodoController = (req, res) => {
  const { id } = req.params;
  console.log(id);
  return todoModel.findById(id).then((document) => {
    console.log(document);
    res.render("DeleteTodo", {
      document: document,
    });
  });
  // res.render("DeleteTodo");
};

exports.deleteTodoControllerRequest = (req, res) => {
  const { id } = req.params;
  return todoModel
    .findByIdAndDelete(id)
    .then((document) => {
      return res.redirect("/");
    })
    .catch((err) => console.log(err));
};

exports.logoutController = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.log(err);
    } else {
      return res.redirect("/login");
    }
  });
};

exports.renderResetController = (req, res) => {
  res.render("ResetPasswordScreen");
};

exports.resetPasswordRequestController = (req, res) => {
  const { email } = req.body;

  const token = crypto.randomBytes(20).toString("hex");

  // Find the user by email
  authUserModel
    .findOne({ email: email })
    .then((user) => {
      if (!user) {
        return res.status(400).json({ message: "User not found" });
      } else {
        user.resetPasswordToken = token;
        user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
        user.save();

        // Send email with the reset link
        const mailOptions = {
          from: "mohammadshahmeer024@gmail.com",
          to: email,
          subject: "Password Reset",
          text:
            `You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n` +
            `Please click on the following link, or paste this into your browser to complete the process:\n\n` +
            `http://${req.headers.host}/resetPasswordScreen/${token}\n\n` +
            `If you did not request this, please ignore this email and your password will remain unchanged.\n`,
        };

        transporter.sendMail(mailOptions, (err, response) => {
          if (err) {
            console.error("Error sending email: ", err); // Log the error
            return res
              .status(500)
              .json({ message: "Error sending email", error: err.message });
          } else {
            console.log("Email sent: " + response.response);

            return res.render("emailSent");
          }
        });
      }
    })
    .catch((err) => {
      console.error("Database Error: ", err); // Log the database error
      res.status(500).json({ message: "Database Error", error: err.message });
    });
};

exports.renderResetPasswordScreenController = (req, res) => {
  res.render("resetPasswordScreeen");
};

exports.resetPasswordRequestWithEmailController = (req, res) => {
  const { email, newPassword } = req.body;
  const { id } = req.params;
  let resetUser;

  authUserModel.findOne({ email: email }).then((user) => {
    console.log("user", user);
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    } else {
      resetUser = user;
      return bcrypt.hash(newPassword, 12).then((hashedPassword) => {
        resetUser.email = email;
        resetUser.password = hashedPassword;
        resetUser.resetToken = undefined;
        resetUser.resetTokenExpiration = undefined;

        resetUser.save();
        return res.redirect("/login");
      });
    }
  });
};
