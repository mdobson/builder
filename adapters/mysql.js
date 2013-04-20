var utils = require("util"),
	mysql = require("mysql"),
	async = require("async");

function MySQLAdapter(schema, options){
	if(options) {
		this.connection = mysql.createConnection({
		  host     : options.host,
		  user     : options.user,
		  port	   : options.port,
		  password : options.password,
		  database : options.database
		});
	}
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

MySQLAdapter.prototype.executeCreateTable = function(query, callback) {
	var self = this;

	self.connection.query(query, function(err, rows){
		if(err) {
			callback(err);
		} else {
			callback(null, true);
		}
	});
};

MySQLAdapter.prototype.insertRows = function(tableName, rows, callback) {
	var transformedRowContexts = [];
	var self = this;
	rows.forEach(function(row){
		transformedRowContexts.push({tableName:tableName, row:row, self:self});
	})
	async.each(transformedRowContexts, this.insert, function(err){
    	if(err) {
    		callback(err);
    	} else {
    		callback(null, true);
    	}
	});
	
};

MySQLAdapter.prototype.insert = function(options, callback) {
	var columns = Object.keys(options.row);
	var values = [];
	columns.forEach(function(column){
		values.push("\""+options.row[column]+"\"");
		column = "\""+column+"\"";
	});
	var query = utils.format("INSERT INTO %s (%s) VALUES (%s)", options.tableName, columns.join(), values.join());
	options.self.connection.query(query, function(err, rows){
		if(err) {
			callback(err);
		} else {
			callback(null, true);
		}
	});
};

MySQLAdapter.prototype.close = function() {
	this.connection.end();
};

module.exports = MySQLAdapter;