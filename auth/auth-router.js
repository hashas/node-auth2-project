const express = require("express")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const usersDb = require("../users/users-model")
// import restrict middleware
const restrict = require("../middleware/restrict")

const router = express.Router()

// register
router.post("/register", async (req, res, next) => {
	try {
		const user = req.body
		console.log(user)

		// check if the user exists
		const userCheck = await usersDb.findBy(user.username) // { username } ???
		console.log(userCheck)

		if (userCheck) {
			return res.status(409).json({
				message: "username is already taken",
			})
		}

		// otherwise hash the password before adding to db
		user.password = await bcrypt.hash(user.password, 8)

		const newUser = await usersDb.add(user)
		console.log(newUser)
		res.status(201).json(newUser)
	} catch(err) {
		next(err)
	}
})

// login
router.post("/login", async (req, res, next) => {
	try {
		const payload = {
			username: req.body.username,
			password: req.body.password,
		}

		// check if username in payload matches a user in db
		// .first() returns a single object rather than an array
		// of one object
		// alternatively, could have destructured [ user ] = 
		const user = await usersDb.findBy(payload.username).first()
		console.log(user)
		console.log(payload.password)

		// if it doesn't exist return error message
		if (!user) {
			res.status(401).json({
				message: "Invalid credentials"
			})
		}

		// assuming user exists, check password against hash in db
		const passwordValidation = await bcrypt.compare(payload.password, user.password)
		console.log(passwordValidation)
		// if password is invalid return error message
		if (!passwordValidation) {
			res.status(401).json({
				message: "Invalid credentials"
			})
		}

		// otherwise send back jsonwebtoken to client
		// first, define the payload used to sign jwt
		const tokenPayload = {
			sub: user.id,
			name: user.username,
		}

		// use express method res.cookie() to set HTTP Set-Cookie header with
		// name of cookie, and a value equal to a jwt composed of tokenPayload
		// and secret stored in dotenv
		res.cookie("token", jwt.sign(tokenPayload, process.env.JWT_SECRET))
		res.json({
			message: `Welcome ${user.username}!`,
		})

	} catch(err) {
		next(err)
	}
})

// get all users
router.get("/users", restrict(), async (req, res, next) => {
	try {
		res.json(await usersDb.find())
	} catch(err) {
		next(err)
	}
})

module.exports = router
