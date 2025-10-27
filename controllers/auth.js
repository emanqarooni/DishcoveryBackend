const user = require("../models/User")
const middleware = require("../middleware")
const crypto = require("crypto")
const transporter = require("../config/nodemailer")
const bcrypt = require("bcrypt")

//this function is for pass validation
const validatePassword = (password) => {
  const passwordCheck = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\W).{8,}$/ //password checks for at least 8 chars long, 1 lowercase, 1 uppercase, and 1 special char
  return passwordCheck.test(password)
}

//func for email val
const validateEmail = (email) => {
  const emailCheck = /^[a-zA-Z0-9._%+-]+@gmail\.com$/ //only gmail is allowed
  return emailCheck.test(email)
}

const Register = async (req, res) => {
  try {
    // Extracts the necessary fields from the request body
    const { email, password, confirmPassword, username, gender } = req.body

    //check if passwords match
    if (password !== confirmPassword) {
      return res.status(400).json({ error: "Passwords do not match." })
    }

    //val for email before registering
    if (!validateEmail(email)) {
      return res.status(400).json({ error: "Please enter a gmail address." })
    }

    //vaildate pass before hashing
    if (!validatePassword(password)) {
      return res.status(400).json({
        error:
          "Password must be at least 8 characters long and include one uppercase letter, one lowercase letter, and one special character.",
      })
    }

    // Hashes the provided password
    let hashedPassword = await middleware.hashPassword(password)

    // Check if a user already exists with the same username
    let existingUsername = await user.exists({ username })
    if (existingUsername) {
      return res
        .status(400)
        .send("A user with that username has already been registered!")
    }

    let imagePath

    if (gender === "female") {
      imagePath = `/images/default_female.jpg`
    } else {
      imagePath = `/images/default_male.jpg`
    }

    // Checks if there has already been a user registered with that email
    let existingUser = await user.exists({ email })
    if (existingUser) {
      return res
        .status(400)
        .send("A user with that email has already been registered!")
    } else {
      // Creates a new user
      const newUser = await user.create({
        username,
        email,
        password: hashedPassword,
        gender,
        image: imagePath,
      })
      // Sends the user as a response
      res.status(200).send(newUser)
    }
  } catch (error) {
    throw error
  }
}

const Login = async (req, res) => {
  try {
    // Extracts the necessary fields from the request body
    const { email, password } = req.body
    // Finds a user by a particular field (in this case, email)
    const findUser = await user.findOne({ email })
    // Checks if the password matches the stored digest
    let matched = await middleware.comparePassword(password, findUser.password)
    // If they match, constructs a payload object of values we want on the front end
    if (matched) {
      let payload = {
        id: findUser._id,
        username: findUser.username,
        email: findUser.email,
      }
      // Creates our JWT and packages it with our payload to send as a response
      let token = middleware.createToken(payload)
      return res.status(200).send({ user: payload, token })
    }
    res.status(401).send({ status: "Error", msg: "Invalid Credential" })
  } catch (error) {
    console.log(error)
    res.status(401).send({ status: "Error", msg: "Email does not exist" })
  }
}

const UpdatePassword = async (req, res) => {
  try {
    // Extracts the necessary fields from the request body
    const { oldPassword, newPassword, confirmPassword } = req.body
    // Finds a user by a particular field (in this case, the user's id from the URL param)
    let findUser = await user.findById(req.params.id)
    // Checks if the password matches the stored digest
    let matched = await middleware.comparePassword(
      oldPassword,
      findUser.password
    )

    //if the pass that is written does not match the old pass
    if (!matched) {
      return res
        .status(401)
        .send({ status: "Error", msg: "Old password did not match!" })
    }

    //validate pass before hash and updating
    if (!validatePassword(newPassword)) {
      return res.status(400).json({
        error:
          "Password must be at least 8 characters long and include one uppercase letter, one lowercase letter, and one special character.",
      })
    }

    // Check confirm password
    if (newPassword !== confirmPassword) {
      return res.status(400).json({ error: "New passwords do not match." })
    }
    // If they match, hashes the new password, updates the db with the new digest, then sends the user as a response
    if (matched) {
      let password = await middleware.hashPassword(newPassword)
      findUser = await user.findByIdAndUpdate(req.params.id, {
        password,
      })
      let payload = {
        id: findUser._id,
        name: findUser.name,
        email: findUser.email,
      }
      return res
        .status(200)
        .send({ status: "Password Updated!", user: payload })
    }
    res
      .status(401)
      .send({ status: "Error", msg: "Old Password did not match!" })
  } catch (error) {
    console.log(error)
    res.status(401).send({
      status: "Error",
      msg: "An error has occurred updating password!",
    })
  }
}

const CheckSession = async (req, res) => {
  const { payload } = res.locals
  res.status(200).send(payload)
}

const ForgetPassword = async (req, res) => {
  try {
    const { email } = req.body

    const findUser = await user.findOne({ email })
    if (!findUser) {
      return res.status(404).json({ error: "Email not found" })
    }

    const token = crypto.randomBytes(20).toString("hex")
    findUser.resetPasswordToken = token
    findUser.resetPasswordExpires = Date.now() + 3600000 // 1 hour
    await findUser.save()

    const resetLink = `http://localhost:5173/auth/reset/${token}`

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: findUser.email,
      subject: "Password Reset Request",
      html: `
        <p>Hello ${findUser.username},</p>
        <p>You requested a password reset. Click the link below to set a new password:</p>
        <a href="${resetLink}" target="_blank">${resetLink}</a>
        <p>This link will expire in 1 hour.</p>
      `,
    })

    res.status(200).json({ message: "Password reset email sent successfully." })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: "Server error while sending reset email." })
  }
}

const ResetPassword = async (req, res) => {
  try {
    const { token } = req.params
    const { password, confirmPassword } = req.body

    const findUser = await user.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    })

    if (!findUser) {
      return res.status(400).json({ error: "Invalid or expired token" })
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ error: "Passwords do not match" })
    }

    //validate pass before hashing and resetting
    if (!validatePassword(password)) {
      return res.status(400).json({
        error:
          "Password must be at least 8 characters long and include one uppercase letter, one lowercase letter, and one special character.",
      })
    }

    const hashedPassword = await bcrypt.hash(password, 10)
    findUser.password = hashedPassword
    findUser.resetPasswordToken = undefined
    findUser.resetPasswordExpires = undefined
    await findUser.save()

    res.status(200).json({ message: "Password updated successfully!" })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: "Server error while resetting password." })
  }
}

module.exports = {
  Register,
  Login,
  UpdatePassword,
  CheckSession,
  ForgetPassword,
  ResetPassword,
}
