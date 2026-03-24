const express = require("express");
const app = express();
require("dotenv").config();

const PORT = process.env.PORT || 3000;

app.use('/', () => (
    console.log('Homepage')
))

app.listen(3000, () => {
    console.log("Server started on port 3000");
});

module.exports = app;