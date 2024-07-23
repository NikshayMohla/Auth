const express = require("express")
const router = express.Router()

const { login, signup } = require("../controllers/auth")
const { auth, isStudent, isAdmin } = require("../middleware/user")

router.post("/login", login)
router.post("/signup", signup)

router.get("/test", auth, (req, res) => {
    res.json({
        success: true,
        message: "Welcome to the protected route for test"
    })
})

router.get("/student", auth, isStudent, (req, res) => {
    res.json({
        success: true,
        message: "Welcome to the protected route for students"
    })
})
router.get("/admin", auth, isAdmin, (req, res) => {
    res.json({
        success: true,
        message: "Welcome to the protected route for Admin"
    })
})
module.exports = router