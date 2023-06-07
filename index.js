const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const PromptRouter = require("./routers/PromptRouter");
const app = express();

const corsOpts = {
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type"],
};

app.use(cors(corsOpts));

// parse requests of content-type - application/json
app.use(express.json());
// parse requests of content-type - application/x-www-form-urlencoded
app.use(
    express.urlencoded({
        extended: true,
    })
);
app.use(
    bodyParser.json({
        limit: "128mb",
    })
);
app.use(
    bodyParser.urlencoded({
        extended: true,
        limit: "128mb",
    })
);

app.get("/", (req, res) => {
    res.send("SUCCESS");
});

// routing
app.use(function (req, res, next) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    res.setHeader("Access-Control-Allow-Credentials", true);
    next();
});
app.use(PromptRouter, function (req, res, next) {
    next();
});

app.listen(5000, () => {
    console.log("Server started on Port 5000.");
});
