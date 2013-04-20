var assert = require("assert"),
	Builder = require("../index.js");



describe("Builder#read", function(){
	it("Returns an array with an array of objects parsed into your schema.", function(done){
		var buildcsv = new Builder("./test/demo_tbl.csv", "csv", "mysql");
		buildcsv.read(["column name", "table name", "type", "default values", "form type"], function(err, result){
			assert.equal(4, result.length);
			for (var i = 0; i < result.length; i++) {
				assert.ok(result[i]["column name"]);
				assert.ok(result[i]["table name"]);
				assert.ok(result[i]["type"]);
				if (result[i]["default values"] != "") {
					assert.ok(result[i]["default values"]);
				}
				assert.ok(result[i]["form type"]);
			};
			done();
		});
	});
});

describe("Builder#createAndInsert", function(){
	it("Creates a table with a defined schema and seeds it with data", function(done){
		var options = {
			host:process.env.DB,
			port:process.env.DBPORT,
			password:process.env.DBPASS,
			user:process.env.DBUSER,
			database:process.env.DBNAME
		}

		var buildcsv = new Builder("./test/demo_tbl.csv", "csv", "mysql");
		var schemaObject = {
			name:"formmetadata",
			fields:[
				{
					"name":"name",
					"type":"varchar(100)"
				},
				{
					"name":"stored_in",
					"type":"varchar (100)"
				},
				{
					"name":"id",
					"type":"varchar(100)"
				},
				{
					"name":"data_type",
					"type":"varchar(100)"
				},
				{
					"name":"type",
					"type":"varchar(100)"
				},
				{
					"name":"defaults",
					"type":"varchar(100)"
				}
			]
		}
		var schema = ["name", "stored_in", "data_type", "defaults", "type"];
		buildcsv.createAndInsert(schema, schemaObject, options, function(err, result){
			assert.equal(true, result);
			done();
		});
	});
});

describe("Builder#makeTable", function(){
	it("returns a proper create statement for mysql", function(done){
		var buildMysql = new Builder("./test/demo_tbl.csv", "csv", "mysql");
		var schema = {
			name:"demographics",
			fields:[
				{
					"name":"age",
					"type":"varchar(100)"
				},
				{
					"name":"gender",
					"type":"varchar(100)"
				},
				{
					"name":"ethnicity",
					"type":"varchar(100)"
				},
				{
					"name":"race",
					"type":"varchar(100)"
				}
			]
		}
		buildMysql.makeTable(schema, function(err, result){
			assert.equal("CREATE TABLE demographics (age varchar(100),gender varchar(100),ethnicity varchar(100),race varchar(100))", result);
			done();
		})
	});

	it("creates a table", function(done){
		var buildMysql = new Builder("./test/demo_tbl.csv", "csv", "mysql");
		var schema = {
			name:"demographics",
			fields:[
				{
					"name":"age",
					"type":"varchar(100)"
				},
				{
					"name":"gender",
					"type":"varchar(100)"
				},
				{
					"name":"ethnicity",
					"type":"varchar(100)"
				},
				{
					"name":"race",
					"type":"varchar(100)"
				}
			]
		}

		var options = {
			host:process.env.DB,
			port:process.env.DBPORT,
			password:process.env.DBPASS,
			user:process.env.DBUSER,
			database:process.env.DBNAME
		}

		buildMysql.createTable(schema, options, function(err, result){
			assert.equal(true, result);
			done();
		});
	});
});

