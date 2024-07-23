const jwt = require("jsonwebtoken")

require("dotenv").config()

exports.auth = (req, res, next) => {
    try {
        const token = req.body.token
        // || req.cookies.token
        if (!token) {
            return res.status(401).json({
                success: false,
                message: "token missing"
            })
        }

        try {
            const payload = jwt.verify(token, process.env.JWT_SECRET)
            console.log(payload)

            req.user = payload
        } catch (e) {
            return res.status(401).json({
                success: false,
                message: `Token is Invalid ${e}`
            })
        }
        next()
    }
    catch (e) {
        return res.status(500).json({
            success: false,
            message: `ERROR IN user Auth MIDDLEWARE ${e}`
        })
    }
}
exports.isStudent = (req, res, next) => {
    try {
        if (req.user.role !== "Student") {
            return res.status(401).json({
                success: false,
                message: `this route is for Students `
            })
        }
        next()
    } catch (e) {
        return res.status(500).json({
            success: false,
            message: `ERROR IN user Auth MIDDLEWARE ${e}`
        })
    }
}
exports.isAdmin = (req, res, next) => {
    try {
        if (req.user.role !== "Admin") {
            return res.status(401).json({
                success: false,
                message: `this route is for Admin ${e}`
            })
        }
        next()
    } catch (e) {
        return res.status(500).json({
            success: false,
            message: `ERROR IN user Auth MIDDLEWARE ${e}`
        })
    }
}