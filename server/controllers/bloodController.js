const Workout = require('../models/workoutModel.js')
const mongoose = require('mongoose')
const {Connection} = require('../database/db.js')

const getDonations = async (req, res) => {
    try {
        // take out ID of the user who is logged in
        const user_id = req.user.id;

        // find workouts which were created by the user and sort them on basis of how recent they were made
        Connection.query('SELECT * FROM donation ORDER BY donatedAt DESC', (error, rows) => {
            if (error) {
                console.error('Error retrieving donations from MySQL database: ' + error.stack);
                throw Error('Error retrieving donations from MySQL database');
            }
            // return workouts in json format
            res.status(200).json(rows);
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Server error' });
    }
};

const getDonationsUnit = async (req, res) => {
  try {
      // take out ID of the user who is logged in
      const user_id = req.user.id;

      // find workouts which were created by the user and sort them on basis of how recent they were made
      Connection.query('SELECT SUM(units) AS total_donation FROM donation', (error, rows) => {
          if (error) {
              console.error('Error retrieving donations from MySQL database: ' + error.stack);
              throw Error('Error retrieving donations from MySQL database');
          }
          // return workouts in json format
          // console.log(rows[0]['total_donation'])
          res.status(200).json(rows[0]['total_donation']);
      });
  } catch (error) {
      console.log(error);
      res.status(500).json({ error: 'Server error' });
  }
};

const getDonationPerBlood = async (req, res) => {
  try {
      // take out ID of the user who is logged in
      const user_id = req.user.id;

      // find workouts which were created by the user and sort them on basis of how recent they were made
      Connection.query('SELECT bloodtype, SUM(units) AS unitsperblood FROM donation GROUP BY bloodtype', (error, rows) => {
          if (error) {
              console.error('Error retrieving donations from MySQL database: ' + error.stack);
              throw Error('Error retrieving donations from MySQL database');
          }
          // return workouts in json format
          // console.log(rows[0]['total_donation'])
          // console.log(rows)
          res.status(200).json(rows);
      });
  } catch (error) {
      console.log(error);
      res.status(500).json({ error: 'Server error' });
  }
};

// get a single workout ✅
const getDonation = async(req,res)=>{
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



const createDonation = async (req, res) => {
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
      const newDonation = { firstname:user.user.firstname,secondname:user.user.lastname,bloodtype:bloodtype, units:units,email:user.email };
      Connection.query("INSERT INTO donation SET ?", newDonation, (err, result) => {
        if (err) {
          console.error("Error inserting donation into MySQL database: " + err.stack);
          throw Error("Error inserting donation into MySQL database");
        }
        newDonation.id = result.insertId;
        // get the inserted workout
        Connection.query("SELECT * FROM donation WHERE id = ?", [newDonation.id], (err, rows) => {
          if (err) {
            console.error("Error retrieving inserted workout from MySQL database: " + err.stack);
            throw Error("Error retrieving inserted workout from MySQL database");
          }
          const donation = rows[0];
          res.status(200).json(donation);
        });
      });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };

const deleteDonation = async (req, res) => {
    // getting id of the workout
    console.log(req.params)
    const { id } = req.params;
    if (!id) {
      return res.status(404).json({ error: 'No such workout' });
    }
    try {
      const result = await Connection.query('DELETE FROM donation WHERE id = ?', [id]);
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'No such workout' });
      }
      res.status(200).json({ message: 'dontaion deleted successfully' });
    } catch (error) {
      console.error('Error deleting donation from MySQL database: ' + error.stack);
      res.status(500).json({ error: 'Error deleting donation' });
    }
  };
  

// Update workouts
const updateDonation = async(req,res)=>{
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
    createDonation,
    getDonation,
    getDonations,
    deleteDonation,
    updateDonation,
    getDonationsUnit,
    getDonationPerBlood
}