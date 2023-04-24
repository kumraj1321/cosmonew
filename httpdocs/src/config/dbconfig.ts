const dbconfig = () => {
	const config = {
		local: {
			url: 'mongodb://localhost:27017/cosmo_2023',
		},
		development: {
			url: 'mongodb://localhost:27017/cosmo_2023',
		},
		alpha: {
			url: 'mongodb://localhost:27017/cosmo_2023',
		},
		production: {
			url: 'mongodb://localhost:27017/cosmo_2023',
		}
	}
	return (typeof process.env.NODEENV != "undefined" ? config[process.env.NODEENV] : config["local"]);
}
export default dbconfig();