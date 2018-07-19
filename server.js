var express = require('express');
var app = express();


const { Pool } = require('pg');

const connectionString = process.env.DATABASE_URL || "postgres://artperson:art@localhost:5432/timsart";
const pool = new Pool({connectionString: connectionString}); 

app.set("port", process.env.PORT || 4000)
.use(express.static(__dirname + '/public'))
.use(express.json())
.use(express.urlencoded({extended:true}))
.get("/getImage", getImage)
.get("/home", getProducts)
.get("/string", getInformation)
.set('views', __dirname + '/views')
.set('view engine', 'ejs')
.listen(app.get("port"), function() {
    console.log("Now listening on port: ", + app.get("port"));
});

function getInformation(req, res) {
    var string = ["Find me", "Good Job"];
    res.send(string[0]);
}

function getProducts(req, res) {
    console.log("Getting Product information...");


    getProductsFromDB(function(error, result) {
        console.log("Back from database with result");

        if(error || result == null || result.length < 1) {
            console.log("Error from getProductsFromDB");
            res.status(500).json({success:false, data:error});
        }   
        else {
            res.render('pages/home', result);
        }
        
    })
} 

function getProductsFromDB(callback) {
    console.log("getProducts from DB");

    var sql = "SELECT id, title, description, dimensions, price, image FROM product";

    pool.query(sql, function(err, result) {
        if (err) {
            console.log("An error occured with the DB");
            console.log(err);
            callback(err, null);
        }
        callback(null, result);
    });
}

function getImage(req, res) {
    console.log("Getting Image information...");
    console.log(req.query.id);

    var id = req.query.id;
    console.log("Retrieving image with id:", id);

    getImageFromDB(id, function(error, result) {
        console.log("Back from database with result:", result);

        if(error || result == null || result.length != 1) {
            res.status(500).json({success:false, data:error});
        }   
        else {
            res.json(result[0]);
        }
        
    })
}

function getImageFromDB(id, callback) {
    console.log("getImageFromDB called with id:", id);

    var sql = "SELECT id, title, description, dimensions, price, image FROM product WHERE id = $1::int";

    var params = [id];

    pool.query(sql, params, function(err, result) {
        if (err) {
            console.log("An error occured with the DB");
            console.log(err);
            callback(err, null);
        }

        console.log("Result: ", result);
        console.log("Found DB result: " + JSON.stringify(result.rows));
        
        callback(null, result.rows);
    });
}