// Nmapeep
// Node-based script to read Nmap XML output and screenshot HTTP/HTTPS servers
// Coded by Luis "noncetonic" Santana
// Blacksun Hackers Club
// http://blacksunhackers.club

var fs = require('fs'),
xml2js = require('xml2js'),
webshot = require('webshot');

var options = {
	phantomConfig: {'ignore-ssl-errors': 'true'},
	renderDelay: 1000
};

var parser = new xml2js.Parser();
fs.readFile(process.argv[2], function(err, data) {
	parser.parseString(data, function (err, result) {
		result.nmaprun.host.forEach(function(element, key) {
			var ipAddress = element.address[0]["$"].addr; // Grabs IP Addresses
			var ports = element.ports[0]["port"];

			ports = ports.filter(function(service) {
				if (service.service[0]["$"].name == "http") {
					console.log("HTTP Server discovered at: " + ipAddress);
					webshot("http://" + ipAddress + ":" + service["$"].portid, ipAddress + "-" + service["$"].portid + ".png", options, function(err) {
						if (err) {
							console.log(err);
						}
						else {
							console.log(ipAddress + ":" + service["$"].portid + " saved");
						}
					});
				}
				else if (service.service[0]["$"].name == "https") {
					console.log("HTTPS Server discovered at: " + ipAddress + ":" + service["$"].portid);
					webshot("https://" + ipAddress + ":" + service["$"].portid, ipAddress + "-" + service["$"].portid + ".png", options, function(err) {
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