// import jwt to verify the jwt signature from client
jwt = require("jsonwebtoken")

function restrict() {
	return async (req, res, next) => {
		try {
			console.log(req.headers)

			// check if the client has sent any jwt in the cookie
			const token = req.cookies.token
			console.log(token)

			if (!token) {
				return res.status(401).json({
					message: "Invalid credentials"
				})
			}

			// if so, check the jwt signature received from the client
			// with our secret key
			jwt.verify(token, process.env.JWT_SECRET, (err, decodedPayload) => {
				// if there's an error the user isn't authenticated
				if (err) {
					return res.status(401).json({
						message: "Invalid credentials"
					})
				}
				console.log(decodedPayload)
				// otherwise assume user IS authenticated
				// assign decoded value to the request in case we need to access
				// that payload later from req.token
				req.token = decodedPayload
				console.log(req)
				next()
			}) 

		} catch(err) {
			next(err)
		}
	}

}

module.exports = restrict