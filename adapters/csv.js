//Basic read adapter for CSV files
var fs = require("fs")
	pipeworks = require("pipeworks"),
	csv = require("fast-csv");


function CSVAdapter(){
	this.readData = null;
}

//Read
//filename -> absolute path of the file you'll be reading
//schema -> array of strings defining what data is in each column
//callback -> callback for handling data.
CSVAdapter.prototype.read = function(filename, schema, callback) {
	//Flow some data through pipeworks for parsing
	pipeworks()
		.fit(function(context, next){
			var parsedData = [];
			csv(filename)
				.on("data", function(data){
					parsedData.push(data);
				})
				.on("end", function(){
					next(parsedData);
				}).parse();
		}).fit(function(context, next){
			this.readData = [];
			for (var i = 0; i < context.length; i++) {
				var parsedRow = context[i];
				var parsedObject = {};
				for (var j = 0; j < schema.length; j++) {
					var schemaentry = schema[j];
					parsedObject[schemaentry] = parsedRow[j];
				};
			this.readData.push(parsedObject);
			};
			next(this.readData);
		}).fit(function(context, next){
			callback(null, this.readData);
			next(context);
		}).flow();
};

CSVAdapter.prototype.output = function() {
	console.log(this.readData);
};

module.exports = function(){
	return new CSVAdapter();
}
