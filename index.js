// importing expressjs into my application
const express = require('express')
const appConfig = require('./config/appConfig')
const fs = require('fs')
const mongoose = require('mongoose')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const globalErrorMiddleware = require('./middlewares/appErrorHandler')
const routeLoggerMiddlewares = require('./middlewares/routeLoggerMiddlewares')
const helmet = require('helmet')


// declaring an applcation instance
const app = express()
const cors = require('cors')

app.use(cors());

//middlewares
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:false}))
app.use(cookieParser())

app.use(globalErrorMiddleware.globalErrorhandler)
app.use(routeLoggerMiddlewares.logIp)
app.use(helmet())




// Bootstrap the Models
let modelsPath = './models'
fs.readdirSync(modelsPath).forEach(function (file) {
    if (~file.indexOf('.js')) require(modelsPath + '/' + file);
})
// end of Bootstrap Models


// Bootstrape the routes
let routesPath = './routes'
fs.readdirSync(routesPath).forEach(function (file) {

    if (~file.indexOf('.js')) {
        console.log("including the following file");
        console.log(routesPath + '/' + file);
        let routes = require(routesPath + '/' + file);
        routes.setRouter(app);
    }

});
// end of the bootstrap routes

// calling global 404 handler after route

app.use(globalErrorMiddleware.globalNotFoundHandler)

// end global 404 handler


//this is about of listing the port where my application will run
//app.listen(3000, () => console.log(`Example app listening at http://localhost:${port}`))

app.listen(appConfig.port, () => {

    //console.log(`Example app listening at http://localhost:${appConfig.port}`)
    console.log(`Example app listening at http://api.gourav.tech`)
    let db = mongoose.connect(appConfig.db.uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true
    })
    console.log(`MongoDB connected on ${appConfig.db.uri}`)
})


//handling moongoose connection error
mongoose.connection.on('error', function (err) {

    console.log("database connection error");
    console.log(err)
}) // end mongoose connection error


// handling mongoose success event
mongoose.connection.on('open', function (err) {
    if (err) {
        console.log('database error');
        console.log(err)
    }
    else {
        console.log("database connected successfully");
    }
}) //  end mongoose success event handeling