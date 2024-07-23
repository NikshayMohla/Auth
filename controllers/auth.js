const bcrypt = require("bcrypt")

const User = require("../model/user")

const jwt = require("jsonwebtoken")

require("dotenv").config()

exports.signup = async (req, res) => {
    try {
        const { name, email, password, role } = req.body

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({
                success: false,
                message: "Invalid email format"
            });
        }

        const existingUser = await User.findOne({ email })

        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: `User Already Exists `
            })
        }
        let hashedPassword;
        try {
            hashedPassword = await bcrypt.hash(password, 10)
        } catch (e) {
            return res.status(400).json({
                success: false,
                message: `ERROR IN HASHING PASSWORD ${e}`
            })
        }

        const user = await User.create({
            name, email, password: hashedPassword, role
        })

        return res.status(200).json({
            success: true,
            message: "USER CREATED SUCCESSFULLY"
        })
    }
    catch (e) {
        return res.status(500).json({
            success: false,
            message: `ERROR IN Server ${e}`
        })
    }
}

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "plese fill all the details correctly"
            })
        }

        let user = await User.findOne({ email })

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "User is Not Registered "
            })
        }
        const payload = {
            email: user.email,
            id: user._id,
            role: user.role
        }


        if (await bcrypt.compare(password, user.password)) {
            let token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "2h" })
            user = user.toObject()
            user.token = token
            user.password = undefined
            const options = {
                expiresIn: new Date(Date.now + 3 * 24 * 60 * 600 * 1000)
            }

            res.cookie("token", token, options).status(200).json({
                success: true,
                token,
                user,
                message: "User Logged in SuccessFully"
            })
        }
        else {
            return res.status(403).json({
                success: false,
                message: "Password does not match"
            })
        }
    }
    catch (e) {
        return res.status(500).json({
            success: false,
            message: `ERROR IN Server ${e}`
        })
    }
}