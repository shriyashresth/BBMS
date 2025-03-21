const Workout = require('../models/workoutModel.js')
const mongoose = require('mongoose')
const {Connection} = require('../database/db.js')

const getWorkouts = async (req, res) => {
    try {
        // take out ID of the user who is logged in
        const user_id = req.user.id;

        // find workouts which were created by the user and sort them on basis of how recent they were made
        Connection.query('SELECT * FROM workout WHERE userid = ? ORDER BY createdAt DESC', [user_id], (error, rows) => {
            if (error) {
                console.error('Error retrieving workouts from MySQL database: ' + error.stack);
                throw Error('Error retrieving workouts from MySQL database');
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
const getWorkout = async(req,res)=>{
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

const createWorkout = async (req, res) => {
    // take out title/load/reps from request
    const { title, load, reps } = req.body;
  
    // checking whether some fields are empty or not
    let emptyFields = [];
    if (!title) {
      emptyFields.push("title");
    }
    if (!load) {
      emptyFields.push("load");
    }
    if (!reps) {
      emptyFields.push("reps");
    }
    if (emptyFields.length > 0) {
      return res.status(400).json({ error: "please fill in all the fields", emptyFields });
    }
  
    // add doc to db if everything is fine
    try {
      // saving who is creating this workout
      const user_id = req.user.id;
  
      // create workout
      const newWorkout = { title, loads:load, reps, userid:user_id };
      Connection.query("INSERT INTO workout SET ?", newWorkout, (err, result) => {
        if (err) {
          console.error("Error inserting workout into MySQL database: " + err.stack);
          throw Error("Error inserting workout into MySQL database");
        }
        newWorkout.id = result.insertId;
        // get the inserted workout
        Connection.query("SELECT * FROM workout WHERE id = ?", [newWorkout.id], (err, rows) => {
          if (err) {
            console.error("Error retrieving inserted workout from MySQL database: " + err.stack);
            throw Error("Error retrieving inserted workout from MySQL database");
          }
          const workout = rows[0];
          res.status(200).json(workout);
        });
      });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };
  

// delete a workouts ✅
// const deleteWorkout = async (req,res)=>{
//     // getting id of the workout
//     const {id} = req.params
//     if (!mongoose.Types.ObjectId.isValid(id)) {
//         return res.status(404).json({error:'No such workout'})
//     }
//     const workout = await Workout.findOneAndDelete({_id:id})
//     if(!workout){
//         return res.status(404).json({error:'no such workout'})
//     }
//     res.status(200).json(workout)
// }

const deleteWorkout = async (req, res) => {
    // getting id of the workout
    console.log(req.params)
    const { id } = req.params;
    if (!id) {
      return res.status(404).json({ error: 'No such workout' });
    }
    try {
      const result = await Connection.query('DELETE FROM workout WHERE id = ?', [id]);
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'No such workout' });
      }
      res.status(200).json({ message: 'Workout deleted successfully' });
    } catch (error) {
      console.error('Error deleting workout from MySQL database: ' + error.stack);
      res.status(500).json({ error: 'Error deleting workout' });
    }
  };
  

// Update workouts
const updateWorkout = async(req,res)=>{
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
    getWorkouts,
    getWorkout,
    createWorkout,
    deleteWorkout,
    updateWorkout

}