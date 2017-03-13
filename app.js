var express = require('express');
var ParseServer = require('parse-server').ParseServer;
var path = require('path');

var databaseUri = process.env.DATABASE_URI || process.env.MONGO_URI;

// if(!databaseUri) {
//     console.log('DATABASE_URI not specified, falling back to localhost.');
// }

var api = new ParseServer ({
    databaseURI: databaseUri || 'mongodb://localhost:27017/datespot',
    cloud: process.env.CLOUD_CODE_MAIN || __dirname + '/cloud/main.js',
    appId: process.env.APP_ID || 'myAppId',
    masterKey: process.env.MASTER_KEY || 'master', //Add your master key here. keep it secret!
    appName: "datespot",
    serverURL: process.env.SERVER_URL || 'http://localhost:1337/parse',
    liveQuery: {
        classNames: ["Posts", "Comments"] // List of classes to support for query subscriptioins
    }
});

//Require all the paths for the Router.
//example.
//var pupRoute = require('./routes/pup/pup.route');




var app = express();
// var apiRouter = express.Router();

// app.use(apiRouter);
// apiRouter.use('/facebooklogin', facebookloginRoute);
// apiRouter.use('/profile', profileRoute);
// apiRouter.use('/swipe', swipeRoute);
// apiRouter.use('/chat', chatRoute);
// apiRouter.use('/date', dateRoute)
//Serve static assets from the /public folder
app.use('/src', express.static(path.join(__dirname, '/src')));

//Serve the parse API on rhe /parse URL prefix
var mountPath = process.env.PARSE_MOUNT || '/parse';
app.use(mountPath, api);

//Parse Server plays nicely with the rest of your web routes
app.get('/',function(req, res) {
    res.status(200).send('This is the start of the DateSpot app');
});

//There will be a test page available on the /test path of your server URL
//Remove this before launching your app
app.get('/test', function(req, res) {
    res.sendFile(path.join(__dirname, '/src/test.html'));
});

var port = process.env.PORT || 1337;
var httpServer = require('http').createServer(app);
httpServer.listen(port, function() {
    console.log("Listening on port" + port);
});
