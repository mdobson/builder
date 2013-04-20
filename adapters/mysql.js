var utils = require("util");

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

module.exports = MySQLAdapter;