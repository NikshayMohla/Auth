const bcrypt = require("bcrypt")

const User = require("../model/user")

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