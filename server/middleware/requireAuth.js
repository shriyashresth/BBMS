const jwt = require('jsonwebtoken')
const User = require('../models/userModel.js')
const {Connection} = require('../database/db.js')

// this is a middleware
const requireAuth = async (req,res,next)=>{

    //verify authentication
    // authorization is of the form 'Bearer <token>' and is present in header of reequest
    const {authorization} = req.headers
    if(!authorization){
        return res.status(401).json({error: 'Authorization token required'})
    }

    const token = authorization.split(' ')[1]

    try {
        const {_id} = jwt.verify(token,process.env.SECRET)
        // save the user who is coming inside the website
        const user = await new Promise((resolve, reject) => {
            Connection.query('SELECT id FROM login WHERE id = ?', [_id], (error, results) => {
                if (error) {
                    console.error('Error getting user ID from MySQL database: ' + error.stack);
                    reject(Error('Error getting user ID from MySQL database'));
                }
                if (results.length > 0) {
                    resolve(results[0]);
                } else {
                    reject(Error('User not found in database'));
                }
            });
        });
        req.user = user;
        next();
    } catch (error) {
        console.log(error)
        res.status(401).json({error:'Request is not authorized'})
        
    }
}

module.exports = requireAuth
