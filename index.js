// code away!
const express = require("express")
const logger = require("./middleware/logger")
const welcomeRouter = require("./welcome/welcomeRouter")
const userRouter = require("./users/userRouter")
const postRouter = require("./posts/postRouter")

const server = express()
const port = 3000

server.use(express.json())
server.use(welcomeRouter)
server.use(userRouter)
server.use(postRouter)
server.use(logger("long"))

server.use((err, res, req, next) => {
    console.log(err)
    res.status(500).json({
        message: "Something went wroung, please try again later"
    })
})

server.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`)
})