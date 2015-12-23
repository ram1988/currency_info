// Load the http module to create an http server.
var http = require('http');
var exchange = require("open-exchange-rates");
var fx = require("money");
var url = require('url');


exchange.set({ app_id: '4a14e14a007746b7801823ea87966ec3' })

exchange.latest(function() {
	fx.rates = exchange.rates;
	fx.base = exchange.base;
});

function forex_info(from,to) {
	fx.rates = exchange.rates;
	fx.base = exchange.base;
	
	// money.js is all set up:
	var rate = fx(1).from(from).to(to); // 1.586 or etc.
	
	console.log("Exchange--> "+ rate);
	
	return rate;
};

// Configure our HTTP server to respond with Hello World to all requests.
var server = http.createServer(function (request, response) {
  var url_parts = url.parse(request.url, true);
  var query = url_parts.query;
  var res_str = "";
  
  response.writeHead(200, {"Content-Type": "text/json"});
  if(query.from!=undefined && query.to!=undefined ) {
	var rate = forex_info(query.from,query.to);	
	res_str = "{'from':"+query.from+",'to':"+query.to+",'rate':"+rate+"}";
  } else {
	res_str = "{'error':'invalid from and to entries'";
  }
 
   
  response.end(res_str);
});

// Listen on port 8000, IP defaults to 127.0.0.1
server.listen(8000);

// Put a friendly message on the terminal
console.log("Server running at http://127.0.0.1:8000/");