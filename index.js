var csv = require("./adapters/csv"),
	MySQLAdapter = require("./adapters/mysql"),
	utils = require("util");


//Builder class constructor takes in a file, a data type, and database type
//These are used to build out your db types
function Builder(file, type, dbtype){
	this.file = file;
	this.type = type;
	this.dbtype = dbtype;
}

Builder.prototype.read = function(schema, callback) {
	if (this.type === "csv") {
		csv().read(this.file, schema, callback);
	}
};

Builder.prototype.makeTable = function(schemaObject, callback) {
	if(this.dbtype === "mysql") {
		var mysqlAdapter = new MySQLAdapter(schemaObject);
		mysqlAdapter.createTable(callback);
	}
};

Builder.prototype.createTable = function(schemaObject, connectionOptions, callback) {
	if(this.dbtype === "mysql") {
		var mysqlAdapter = new MySQLAdapter(schemaObject);
		mysqlAdapter.createTable(function(err, result){
			mysqlAdapter.executeCreateTable(result, connectionOptions, callback);
		});
	}
};

module.exports = Builder;