const Workout = require('../models/workoutModel.js')
const mongoose = require('mongoose')
const {Connection} = require('../database/db.js')

const getRequests = async (req, res) => {
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

const getRequestsUnit = async (req, res) => {
  try {
      // take out ID of the user who is logged in
      const user_id = req.user.id;

      // find workouts which were created by the user and sort them on basis of how recent they were made
      Connection.query('SELECT SUM(units) AS total_request FROM request', (error, rows) => {
          if (error) {
              console.error('Error retrieving donations from MySQL database: ' + error.stack);
              throw Error('Error retrieving donations from MySQL database');
          }
          // return workouts in json format
          // console.log(rows[0]['total_donation'])
          res.status(200).json(rows[0]['total_request']);
      });
  } catch (error) {
      console.log(error);
      res.status(500).json({ error: 'Server error' });
  }
};

const getRequestPerBlood = async (req, res) => {
  try {
      // take out ID of the user who is logged in
      const user_id = req.user.id;

      // find workouts which were created by the user and sort them on basis of how recent they were made
      Connection.query('SELECT bloodtype, SUM(units) AS unitsperblood FROM request GROUP BY bloodtype', (error, rows) => {
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
const getRequest = async(req,res)=>{
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

const createRequest = async (req, res) => {
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
  
    try {
      const user_email = user.email;
      // let unitstillnow = 0;
      const newRequest = { firstname:user.user.firstname,secondname:user.user.lastname,bloodtype:bloodtype, units:units,email:user.email };

      // INSERT Request
      Connection.query("INSERT INTO request SET ?", newRequest, (err, result) => {
        if (err) {
          console.error("Error inserting Request into MySQL database: " + err.stack);
          throw Error("Error inserting Request into MySQL database");
        }
        // TAKING OUT SUM OF UNITS OF THAT BLOOD GROUP
        // Connection.query('SELECT SUM(units) AS total_request FROM request WHERE bloodtype = ?',[bloodtype] ,(error, rows) => {
        //   if (error) {
        //     console.error('Error retrieving donations from MySQL database: ' + error.stack);
        //     throw Error('Error retrieving donations from MySQL database');
        //   }
        //   unitstillnow = rows[0]['total_request']
        // });
        
        // // CHECKING Whether that Blood Group Exits or Not.
        // Connection.query("SELECT * FROM brtable WHERE bloodgroup = ?", [bloodtype], (err, rows) => {
        //   if (err) {
        //     console.error("Error retrieving inserted request from MySQL database: " + err.stack);
        //     throw Error("Error retrieving inserted request from MySQL database");
        //   }
        //   // Does not exist, then INSERT
        //   if(rows.length===0){
        //     const fitblood = {bloodgroup:bloodtype,units:units};
        //     Connection.query("INSERT INTO brtable SET ?", fitblood, (err, res) => {
        //       if (err) {
        //         console.error("Error inserting brRequest into MySQL database: " + err.stack);
        //         throw Error("Error inserting Request into MySQL database");
        //       }
        //     });
        //   }
        //   // IF EXITS< UPDATE
        //   else{
        //     const id_to_change = rows[0].id;
        //     const groupRequest = {bloodgroup:bloodtype,units:unitstillnow};
        //     Connection.query("UPDATE brtable SET ? WHERE id = ?", [groupRequest ,id_to_change], (err, rows) => {
        //       if (err) {
        //           console.error("Error retrieving inserted workout from MySQL database: " + err.stack);
        //           throw Error("Error retrieving inserted workout from MySQL database");
        //       }
        //       if (res.affectedRows === 0) {
        //           return res.status(404).json({ error: "No such user profile" });
        //       }
        //     });
        //   }
        // });
        newRequest.id = result.insertId;

        // RETURN THE INSERTED PART
        Connection.query("SELECT * FROM request WHERE id = ?", [newRequest.id], (err, rows) => {
          if (err) {
            console.error("Error retrieving inserted request from MySQL database: " + err.stack);
            throw Error("Error retrieving inserted request from MySQL database");
          }
          const request = rows[0];
          res.status(200).json(request);
        });

        const user_id = req.user.id;
      });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };

const deleteRequest = async (req, res) => {
    // getting id of the workout
    console.log(req.params)
    const { id } = req.params;

    // let bloodgroup, bloodunit;
    // Connection.query("SELECT * FROM request WHERE id = ?", [id], (err, rows) => {
    //   if (err) {
    //     console.error("Error retrieving inserted request from MySQL database: " + err.stack);
    //     throw Error("Error retrieving inserted request from MySQL database");
    //   }
    //   console.log('huhu',rows[0])
    //   bloodgroup = rows[0].bloodtype;
    //   bloodunit = rows[0].units; 
    // });
    // let unitstillnow;
    // Connection.query('SELECT SUM(units) AS total_request FROM request WHERE bloodtype = ?',[bloodgroup] ,(error, rows) => {
    //   if (error) {
    //     console.error('Error retrieving donations from MySQL database: ' + error.stack);
    //     throw Error('Error retrieving donations from MySQL database');
    //   }
    //   unitstillnow = rows[0]['total_request']
    // });
    // console.log('hi',bloodgroup)
    // // CHECKING Whether that Blood Group Exits or Not.
    // Connection.query("SELECT * FROM brtable WHERE bloodgroup = ?", [bloodgroup], (err, rows) => {
    //   if (err) {
    //     console.error("Error retrieving inserted request from MySQL database: " + err.stack);
    //     throw Error("Error retrieving inserted request from MySQL database");
    //   }
    //   // Does not exist, then INSERT
    //   console.log(rows)
    //   if(rows.length===0){
    //     const fitblood = {bloodgroup,units:unitstillnow};
    //     Connection.query("INSERT INTO brtable SET ?", fitblood, (err, res) => {
    //       if (err) {
    //         console.error("Error inserting brRequest into MySQL database: " + err.stack);
    //         throw Error("Error inserting Request into MySQL database");
    //       }
    //     });
    //   }
    //   // IF EXITS< UPDATE
    //   else{
    //     const id_to_change = rows[0].id;
    //     const groupRequest = {bloodgroup,units:unitstillnow};
    //     Connection.query("UPDATE brtable SET ? WHERE id = ?", [groupRequest ,id_to_change], (err, rows) => {
    //       if (err) {
    //           console.error("Error retrieving inserted workout from MySQL database: " + err.stack);
    //           throw Error("Error retrieving inserted workout from MySQL database");
    //       }
    //       if (res.affectedRows === 0) {
    //           return res.status(404).json({ error: "No such user profile" });
    //       }
    //     });
    //   }
    // });

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
const updateRequest = async(req,res)=>{
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
    createRequest,
    getRequest,
    getRequests,
    deleteRequest,
    updateRequest,
    getRequestsUnit,
    getRequestPerBlood
}