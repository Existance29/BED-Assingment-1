//import middlewares and controllers
const usersController = require("../controllers/userController")
const validateUser = require("../middlewares/validateUser")

//create routes
const userRoute = (app) =>{
    app.post("/users", validateUser, usersController.createUser)
    app.get("/users", usersController.getAllUsers)
    app.get("/users/:id", usersController.getUserById)
    app.get("/users/login/:email/:password", usersController.getUserByLogin)
}

module.exports = userRoute