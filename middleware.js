//Loggar HTTP-metod (GET, POST, etc) och URL för varje request
//Inkluderar en tidsstämpel i ISO-format

//Logger-middleware
const logger = (req, res, next) => {

	const timeStamp = new Date().toISOString();
	console.log(`[${timeStamp}] ${req.method} ${req.url} `);
	
next(); //Skickar vidare förfrågan till route-handler
};

//Exporterar logger som ett objekt { logger }
module.exports = { logger };