const express = require("express")
const helmet = require("helmet")
// missing cors

// import authRouter
const authRouter = require("./auth/auth-router")

const server = express()
const port = process.env.port || 4000 // uppercase "port"?

server.use(helmet())
server.use(express.json())

server.use("/api", authRouter)

server.get("/", (req, res, next) => {
	res.json({
		message: "Welcome to our API",
	})
})

server.use((err, req, res, next) => {
	console.log(err)
	res.status(500).json({
		message: "Something went wrong",
	})
})

server.listen(port, () => {
	console.log(`Running at http://localhost:${port}`)
})
