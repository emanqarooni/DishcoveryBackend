const express = require("express")
const app = express()

//require
const logger = require("morgan")
const dotenv = require("dotenv")
const cors = require("cors")
const path = require("path")

dotenv.config()
const PORT = process.env.PORT || 3000

const db = require("./config/db")


//use app
app.use(logger("dev"))
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(express.static(path.join(__dirname, "public")))
app.use(express.static("public"))

//require router
const authRouter = require("./routes/auth")
const recipeRouter = require("./routes/recipe")
const ratingRouter = require("./routes/rating")

//use router
app.use("/auth", authRouter)
app.use("/recipe", recipeRouter)
app.use("/rating", ratingRouter)

app.use("/", (req, res) => {
  res.send(`Connected!`)
})

app.listen(PORT, () => {
  console.log(`Running Express server on Port ${PORT} . . .`)
})
