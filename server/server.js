require('dotenv').config()                                      // dot env file
const express = require('express')                              // express
// const mongoose = require('mongoose')                            // mongoose
const mysql = require('mysql')
const {Connection} = require('./database/db.js')

// importing routes
// const workoutRoutes = require('./routes/workouts')              
const userRoutes = require('./routes/user')
const bloodRoutes = require('./routes/blood')
const bloodRequestRoutes = require('./routes/bloodrequest')
const campRoutes = require('./routes/camp')
const profileRoutes = require('./routes/profile')
const feedbackRoutes = require('./routes/feedback')
const bdtableRoutes = require('./routes/bdtable')
const brtableRoutes = require('./routes/brtable')



//express app
const app = express()

// middleware
app.use(express.json())

// this writes all requests that happen at browser
app.use((req,res,next)=>{
    console.log(req.path, req.method)
    next()
})

// routes
// app.use('/api/workouts',workoutRoutes)
app.use('/api/user',userRoutes)
app.use('/api/blood',bloodRoutes)
app.use('/api/bloodrequest',bloodRequestRoutes)
app.use('/api/admin/camp',campRoutes)
app.use('/api/user/profile',profileRoutes)
app.use('/api/feedback',feedbackRoutes)
app.use('/api/bdtable',bdtableRoutes)
app.use('/api/brtable',brtableRoutes)


Connection.connect(function(err){
    if(err){
        console.error('Error connecting to MySQL database: ' + err.stack);
        return;
    }
    console.log('Connected to MySQL database with ID ' + Connection.threadId);
    app.listen(process.env.PORT,()=>{
        console.log(`Listening on Port 4000`);
    })
})
