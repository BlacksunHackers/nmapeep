// Nmapeep
// Node-based script to read Nmap XML output and screenshot HTTP/HTTPS servers
// Coded by Luis "noncetonic" Santana
// Blacksun Hackers Club
// http://blacksunhackers.club

var fs = require('fs'),
xml2js = require('xml2js'),
webshot = require('webshot');

var useragents = [
"Mozilla/5.0 (Windows NT 6.1; WOW64; rv:41.0) Gecko/20100101 Firefox/41.0",
"Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/45.0.2454.101 Safari/537.36",
"Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/46.0.2490.80 Safari/537.36",
"Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/46.0.2490.71 Safari/537.36",
"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11) AppleWebKit/601.1.56 (KHTML, like Gecko) Version/9.0 Safari/601.1.56",
"Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/46.0.2490.80 Safari/537.36",
"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_1) AppleWebKit/601.2.7 (KHTML, like Gecko) Version/9.0.1 Safari/601.2.7",
"Mozilla/5.0 (Windows NT 6.1; WOW64; Trident/7.0; rv:11.0) like Gecko",
"Mozilla/5.0 (Windows NT 6.1; WOW64; rv:41.0) Gecko/20100101 Firefox/41.0",
"Mozilla/5.0 (Windows NT 10.0; WOW64; rv:41.0) Gecko/20100101 Firefox/41.0",
"Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:41.0) Gecko/20100101 Firefox/41.0",
"Mozilla/5.0 (Windows NT 6.3; WOW64; rv:41.0) Gecko/20100101 Firefox/41.0",
"Mozilla/5.0 (Macintosh; Intel Mac OS X 10.10; rv:41.0) Gecko/20100101 Firefox/41.0",
"Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/45.0.2454.101 Safari/537.36",
"Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/46.0.2490.80 Safari/537.36",
"Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/46.0.2490.71 Safari/537.36",
"Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/46.0.2490.80 Safari/537.36",
"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/45.0.2454.101 Safari/537.36"
];

var random_agent = useragents[Math.floor(Math.random()*useragents.length)];

var options = {
	onLoadStarted: {
		fn: function() {
			return console.log("On Load Finished");
		}
	},

	onResourceRequested: {
		fn: function()
		{
			console.log(req);
		}
	},


	onResourceReceived:
	{
		fn: function(res) {
			console.log(res);
		}
	},

	phantomConfig: {'ignore-ssl-errors': 'true'},
	renderDelay: 1000,
	userAgent: random_agent
};

var parser = new xml2js.Parser();
fs.readFile(process.argv[2], function(err, data) {
	var timestamp = Date().toString();
	fs.mkdir(timestamp);
	parser.parseString(data, function (err, result) {
		result.nmaprun.host.forEach(function(element, key) {
			var ipAddress = element.address[0]["$"].addr; // Grabs IP Addresses
			var ports = element.ports[0]["port"];

			ports = ports.filter(function(service) {
				if (service.service[0]["$"].name == "http") {
					console.log("HTTP Server discovered at: " + ipAddress);
					webshot("http://" + ipAddress + ":" + service["$"].portid, __dirname + "/" + timestamp + "/" + ipAddress + "-" + service["$"].portid + ".png", options, function(res, err) {
						if (err) {
							console.log(err);
						}
						else {
							console.log(err);
							console.log(ipAddress + ":" + service["$"].portid + " saved");
						}
					});
				}
				else if (service.service[0]["$"].name == "https") {
					console.log("HTTPS Server discovered at: " + ipAddress + ":" + service["$"].portid);
					webshot("https://" + ipAddress + ":" + service["$"].portid, __dirname + "/" + timestamp + "/" + ipAddress + "-" + service["$"].portid + ".png", options, function(err) {
						if (err) {
							console.log(err);
						}
						else {
							console.log(ipAddress + ":" + service["$"].portid + " saved");
						}
					});
				}
			});
		});
});
});
