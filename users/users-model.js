const db = require("../database/config")

function findBy(username) {
	return db("users")
		.select("id", "username", "password", "department")
		.where("username", username)
		
}

async function add(user) {
	// .insert() returns an array of the index of the item created
	// so in order to return the newly created object, first we must
	// destructure the id value from the array
	const [ id ] = await db("users").insert(user)
	// then pass it to findById() function
	return findById(id)
}

function findById(id) {
	return db("users")
		.select("id", "username")
		.where("id", id)
		.first()
}

function find() {
	return db("users").select("id", "username")
}


module.exports = {
	findBy,
	add,
	findById,
	find,
}