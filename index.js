const { Client } = require("pg")

const client = new Client("postgres://localhost:5432/pet_shop")

client.connect()

function insert() {
	client
		.query("begin")
		.then((res) => {
			return client.query(
				"INSERT INTO pets (name, species) VALUES ($1, $2), ($3, $4)",
				["Fido", "dog", "Albert", "cat"]
			)
		})
		.then((res) => {
			return client.query(
				"INSERT INTO food (name, quantity) VALUES ($1, $2), ($3, $4)",
				["Dog Biscuit", 3, "Cat Food", 5]
			)
		})
		.then((res) => {
			return client.query("commit")
		})
		.then((res) => {
			console.log("transaction completed")
		})
		.catch((err) => {
			console.error("error while querying:", err)
			return client.query("rollback")
		})
		.catch((err) => {
			console.error("error while rolling back transaction:", err)
		})
}

function readAndUpdate() {
	client
		.query("begin")
		.then((res) => {
			return client.query(
				"INSERT INTO pets (name, species) VALUES ($1, $2), ($3, $4)",
				["Fido", "dog", "Albert", "cat"]
			)
		})
		.then((res) => {
			return client.query("SELECT COUNT(*) FROM pets WHERE species='cat'")
		})
		.then((res) => {
			const catCount = parseInt(res.rows[0].count)
			return client.query(
				"UPDATE food SET quantity=quantity+$1 WHERE name='Cat Food'",
				[10 * catCount]
			)
		})
		.then((res) => {
			return client.query("commit")
		})
		.then((res) => {
			console.log("transaction completed")
		})
		.catch((err) => {
			console.error("error while querying:", err)
			return client.query("rollback")
		})
		.catch((err) => {
			console.error("error while rolling back transaction:", err)
		})
}

readAndUpdate()
