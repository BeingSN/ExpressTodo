const express = require("express");
const TodoController = require("../controller/TodoController");

const router = express.Router();

router.get("/", TodoController.renderHomePageController);

//render loginPage
router.get("/login", TodoController.renderLoginPageController);

// //post login Req
// router.post("/loginRequest", TodoController.postLoginRequest);

//render Singup Page
router.get("/signupUser", TodoController.renderSignUpPageController);

// make singup request
router.post("/signupRequest", TodoController.postSignupController);

//make login Request
router.post("/loginRequest", TodoController.postLoginRequestController);

router.get("/addTodosScreen", TodoController.renderAddTodoScreenController);

//add Todos
router.post("/addTodosRequest", TodoController.addTodosController);

//get editTodo Route
router.get("/editTodo/:id", TodoController.editTodoController);

//editTodo Req
router.post("/update-todo/:id", TodoController.editTodoRequestController);

//deleteTodo Route
router.get("/deleteTodo/:id", TodoController.deleteTodoController);

//deleteTodoRequest
router.post(
  "/deleteTodoRequest/:id",
  TodoController.deleteTodoControllerRequest
);

//route to render reset screen

router.get("/resetPassword", TodoController.renderResetController);

//route to make resetPassword Request
router.post(
  "/resetPasswordRequest",
  TodoController.resetPasswordRequestController
);

router.get(
  "/resetPasswordScreen/:id",
  TodoController.renderResetPasswordScreenController
);

//having email
router.post(
  "/reset-password-request",
  TodoController.resetPasswordRequestWithEmailController
);

router.post("/logout", TodoController.logoutController);

module.exports = router;
