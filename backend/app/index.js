'use strict';
var path = require('path');
var express = require('express');
var app = express();
module.exports = app;

app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', "*");
    // res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    // res.header('Access-Control-Allow-Headers', 'X-Requested-With, content-type, Authorization');
    // res.header('Access-Control-Allow-Origin', 'example.com');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,PATCH,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
});

// Pass our express application pipeline into the configuration
// function located at server/app/configure/index.js
require('./configure')(app);

// Routes that will be accessed via AJAX should be prepended with
// /api so they are isolated from our GET /* wildcard.
// In our index.js file in the app folder, we are res.sending the correct index.html
var rootPath = path.join(__dirname, '../../');
app.use('/api', require(path.join(rootPath, './backend/app/routes')));


/*
 This middleware will catch any URLs resembling a file extension
 for example: .js, .html, .css
 This allows for proper 404s instead of the wildcard '/*' catching
 URLs that bypass express.static because the given file does not exist.
 */
app.use(function (req, res, next) {

    if (path.extname(req.path).length > 0) {
        res.status(404).end();
    } else {
        next(null);
    }

});

// We are not serving up the index.html file from the server anymore - uncomment to change
// app.get('/*', function (req, res) {
//     res.sendFile(app.get('indexHTMLPath'));
// });

// Error catching endware.
app.use(function (err, req, res, next) {
    console.error(err)
    console.error(err.stack);
    res.status(err.status || 500).send(err.message || 'Internal server error.');
});
