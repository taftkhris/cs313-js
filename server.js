var express = require('express');
var app = express();

const { Pool } = require('pg');

const connectionString = process.env.DATABASE_URL || "postgres://artUser:elijah@localhost:5432/timsart";
const pool = new Pool({connectionString: connectionString});

app.set("port", process.env.PORT || 4000)
.use(express.static(__dirname + '/public'))
.use(express.json())
.use(express.urlencoded({extended:true}))
.get("/getImage", getImage)
// .get("/getDesciption", getDescription)
// .get("/getPrice", getPrice)
// .get("/getSizes", getSizes)
.listen(app.get("port"), function() {
    console.log("Now listening on port: ", + app.get("port"));
});

function getImage(req, res) {
    console.log("Getting Image information...");

    var id = req.query.id;
    console.log("Retrieving image with id:", id);

    getImageFromDB(id, function(error, result) {
        console.log("Back from database with result:", result)
    })
    var result = {id:1, title:"Test Title", price:"$200", description: "Test"};

    res.json(result);
}

function getImageFromDB(id, callback) {
    console.log("getPersonFromDB called with id:", id);

    var sql = "SELECT id, title, description, dimensions, price, image FROM product WHERE id = $1::int";

    var params = {id};

    pool.query(sql, function(err, result) {
        if (err) {
            console.log("An error occured with the DB");
            console.log(err);
            callback(err, null);
        }

        console.log("Found DB result: " + JSON.stringify(result.rows))

        callback(null, result.rows);
    });
}