const express = require("express")
const bcrypt = require("bcryptjs")
const usersDb = require("../users/users-model")

const router = express.Router()

router.post("/register", async (req, res, next) => {
	try {
		const user = req.body
		console.log(user)

		// check if the user exists
		const userCheck = await usersDb.findBy(user.username) // { username } ???
		console.log(userCheck)

		if (!userCheck) {
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

module.exports = router