var utils = require("util"),
	mysql = require("mysql");

function MySQLAdapter(schema){
	this.schema = schema;
}

MySQLAdapter.prototype.createTable = function(callback) {
	var tableName = this.schema.name;
	var fields = [];
	for (var i = 0; i < this.schema.fields.length; i++) {
		var field = this.schema.fields[i];
		var createFieldString = utils.format("%s %s", field.name, field.type);
		fields.push(createFieldString);
	};
	var allFields = fields.join();
	var createTable = utils.format("CREATE TABLE %s (%s)", tableName, allFields);
	callback(null, createTable);
};

MySQLAdapter.prototype.executeCreateTable = function(query, options, callback) {
	var connection = mysql.createConnection({
	  host     : options.host,
	  user     : options.user,
	  port	   : options.port,
	  password : options.password,
	  database : options.database
	});

	connection.connect(function(err){
		if(err){
			callback(err);
		} else {
			connection.query(query, function(err, rows){
				if(err) {
					callback(err);
				} else {
					connection.end();
					callback(null, true);
				}
			});
		}

	});
};

module.exports = MySQLAdapter;