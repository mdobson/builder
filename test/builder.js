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
});

