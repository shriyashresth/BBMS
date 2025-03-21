const Workout = require('../models/workoutModel.js')
const mongoose = require('mongoose')
const {Connection} = require('../database/db.js')

const getCamps = async (req, res) => {
    try {
        // take out ID of the user who is logged in
        const user_id = req.user.id;
        const user_email =  req.query.email
        // console.log(user_email,user_id)
        // console.log(req.user)
        // console.log('hi',req.query)
        // find workouts which were created by the user and sort them on basis of how recent they were made
        Connection.query('SELECT * FROM request WHERE email = ? ORDER BY requestedAt DESC', [user_email], (error, rows) => {
            if (error) {
                console.error('Error retrieving requests from MySQL database: ' + error.stack);
                throw Error('Error retrieving requests from MySQL database');
            }
            // return workouts in json format
            res.status(200).json(rows);
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Server error' });
    }
};


// get a single workout ✅
const getCamp = async(req,res)=>{
    // get id of workout
    const {id} = req.params

    // check validation
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({error:'No such workout'})
    }

    // find thatt workout
    const workout = await Workout.findById(id)

    if(!workout){
        return res.status(404).json({error:'no such workout'})
    }

    // return that workout as json
    res.status(200).json(workout)
}

const createCamp = async (req, res) => {
    // take out title/load/reps from request
    const { bloodtype, units, user } = req.body;
  
    // checking whether some fields are empty or not
    let emptyFields = [];
    if (!bloodtype) {
      emptyFields.push("bloodtype");
    }
    if (!units) {
      emptyFields.push("units");
    }
    if (emptyFields.length > 0) {
      return res.status(400).json({ error: "please fill in all the fields", emptyFields });
    }
  
    // add doc to db if everything is fine
    try {
      // saving who is creating this workout
      const user_email = user.email;
  
      // create workout
      const newRequest = { firstname:user.user.firstname,secondname:user.user.lastname,bloodtype:bloodtype, units:units,email:user.email };
      Connection.query("INSERT INTO request SET ?", newRequest, (err, result) => {
        if (err) {
          console.error("Error inserting Request into MySQL database: " + err.stack);
          throw Error("Error inserting Request into MySQL database");
        }
        newRequest.id = result.insertId;
        // get the inserted workout
        Connection.query("SELECT * FROM request WHERE id = ?", [newRequest.id], (err, rows) => {
          if (err) {
            console.error("Error retrieving inserted request from MySQL database: " + err.stack);
            throw Error("Error retrieving inserted request from MySQL database");
          }
          const request = rows[0];
          res.status(200).json(request);
        });
      });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };

const deleteCamp = async (req, res) => {
    // getting id of the workout
    console.log(req.params)
    const { id } = req.params;
    if (!id) {
      return res.status(404).json({ error: 'No such workout' });
    }
    try {
      const result = await Connection.query('DELETE FROM request WHERE id = ?', [id]);
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'No such workout' });
      }
      res.status(200).json({ message: 'dontaion deleted successfully' });
    } catch (error) {
      console.error('Error deleting request from MySQL database: ' + error.stack);
      res.status(500).json({ error: 'Error deleting request' });
    }
  };
  

// Update workouts
const updateCamp = async(req,res)=>{
    const {id} = req.params

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({error:'No such workout'})
    }

    const workout = await Workout.findOneAndUpdate({_id:id},{
        ...req.body
    }) 
    if(!workout){
        return res.status(404).json({error:'no such workout'})
    }
    res.status(200).json(workout)
}

module.exports = {
    createCamp,
    getCamp,
    getCamps,
    deleteCamp,
    updateCamp
}