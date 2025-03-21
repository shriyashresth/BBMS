const Workout = require('../models/workoutModel.js')
const mongoose = require('mongoose')
const {Connection} = require('../database/db.js')

const getProfiles = async (req, res) => {
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

const getProfilesCount = async (req, res) => {
    try {
        // take out ID of the user who is logged in
        const user_id = req.user.id;

        // find workouts which were created by the user and sort them on basis of how recent they were made
        Connection.query('SELECT COUNT(*) FROM profile', (error, rows) => {
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
const getProfile = async(req,res)=>{
    // get id of workout
    const {id} = req.params
    console.log('hehe',id)
    try {
        // find workouts which were created by the user and sort them on basis of how recent they were made
        Connection.query('SELECT * FROM profile WHERE personid = ?', [id], (error, rows) => {
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
}

const createProfile = async (req, res) => {
    // take out title/load/reps from request
    // console.log(req.body);
    const { firstName, secondName, dob, blood, phone, height, weight } = req.body;
  
    // checking whether some fields are empty or not
    let emptyFields = [];
    if (!firstName) {
      emptyFields.push("firstName");
    }
    if (!secondName) {
      emptyFields.push("secondName");
    }
    if (!dob) {
      emptyFields.push("dob");
    }
    if (!blood) {
        emptyFields.push("blood");
    }
    if (!phone) {
        emptyFields.push("phone");
    }
    if (!height) {
        emptyFields.push("height");
    }
    if (!weight) {
        emptyFields.push("weight");
    }
    if (emptyFields.length > 0) {
      return res.status(400).json({ error: "please fill in all the fields", emptyFields });
    }
  
    // // add doc to db if everything is fine
    try {
      // saving who is creating this workout
      const user_id = req.user.id;
  
      // create workout
      const newProfile = { firstname: firstName, lastname: secondName, dob,blood,phone, height, weight, personid:user_id };
      Connection.query("INSERT INTO profile SET ?", newProfile, (err, result) => {
        if (err) {
          console.error("Error inserting workout into MySQL database: " + err.stack);
          throw Error("Error inserting workout into MySQL database");
        }
        newProfile.id = result.insertId;
        // get the inserted workout
        Connection.query("SELECT * FROM profile WHERE id = ?", [newProfile.id], (err, rows) => {
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
  
  // Update workouts
  const updateProfile = async(req,res)=>{ 
        const { firstName, secondName, dob, blood, phone, height, weight } = req.body;
        try {
            const user_id = req.user.id;
            const updatedProfile = { firstname: firstName, lastname: secondName, dob,blood,phone, height, weight};
            Connection.query("UPDATE profile SET ? WHERE personid = ?", [updatedProfile ,user_id], (err, rows) => {
                if (err) {
                    console.error("Error retrieving inserted workout from MySQL database: " + err.stack);
                    throw Error("Error retrieving inserted workout from MySQL database");
                }
                if (res.affectedRows === 0) {
                    return res.status(404).json({ error: "No such user profile" });
                }
                // updatedProfile.id = res.insertId;
                // console.log('RESULT',res.insertId);
                // get the inserted workout
                Connection.query("SELECT * FROM profile WHERE personid = ?", [user_id], (err, rows) => {
                if (err) {
                    console.error("Error retrieving inserted workout from MySQL database: " + err.stack);
                    throw Error("Error retrieving inserted workout from MySQL database");
                }
                console.log('hello',rows)
                const workout = rows[0];
                console.log(workout);
                res.status(200).json(workout);
                });
            });
      } catch (error) {
        res.status(400).json({ error: error.message });
      }
  }

// delete a workouts ✅
// const deleteProfile = async (req,res)=>{
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

const deleteProfile = async (req, res) => {
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

module.exports = {
    getProfiles,
    getProfilesCount,
    getProfile,
    createProfile,
    deleteProfile,
    updateProfile,
}