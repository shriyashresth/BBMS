const Workout = require('../models/workoutModel.js')
const mongoose = require('mongoose')
const {Connection} = require('../database/db.js')

const getTable = async (req, res) => {
    try {
        // take out ID of the user who is logged in
        console.log('aaya')
        const user_id = req.user.id;
        const user_bloodtype =  req.query.bloodgroup
        const user_unit = req.query.unit
        console.log(user_bloodtype)
        // console.log(user_bloodtype)
        // console.log(user_email,user_id)
        // console.log(req.user)
        // console.log('hi',req.query)
        let totalOftheKind = 0;
        Connection.query('SELECT SUM(units) AS total_units FROM request WHERE bloodtype = ?',[user_bloodtype], (error, rows) => {
            if (error) {
                console.error('Error retrieving workouts from MySQL database: ' + error.stack);
                throw Error('Error retrieving workouts from MySQL database');
            }
            console.log(rows)
            totalOftheKind = rows[0]['total_units']
            console.log(totalOftheKind)
        });
        totalOftheKind=Number(totalOftheKind) + Number(user_unit);
        // find workouts which were created by the user and sort them on basis of how recent they were made
        Connection.query('SELECT * FROM brtable WHERE bloodgroup = ?', [user_bloodtype], (error, rows) => {
            if (error) {
                console.error('Error retrieving requests from MySQL database: ' + error.stack);
                throw Error('Error retrieving requests from MySQL database');
            }
            if (rows.length===0) {
                const newRequest = { bloodgroup: user_bloodtype, units: totalOftheKind };
                Connection.query("INSERT INTO brtable SET ?", newRequest, (err, result) => {
                    if (err) {
                      console.error("Error inserting donation into MySQL database: " + err.stack);
                      throw Error("Error inserting donation into MySQL database");
                    }
                    newRequest.id = result.insertId;
                });
            }else{
                console.log(rows)
                // const new_units = Number(rows[0].units) + Number(user_unit);
                const updatedCount = {bloodgroup:user_bloodtype,units:totalOftheKind};
                Connection.query("UPDATE brtable SET ? WHERE bloodgroup = ?", [updatedCount ,user_bloodtype], (err, rows) => {
                    if (err) {
                        console.error("Error retrieving inserted workout from MySQL database: " + err.stack);
                        throw Error("Error retrieving inserted workout from MySQL database");
                    }
                    if (res.affectedRows === 0) {
                        return res.status(404).json({ error: "No such user profile" });
                    }
                  });
            }
            // return workouts in json format
            res.status(200).json(rows);
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Server error' });
    }
};

const createTable = async (req, res) => {
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
      let unitstillnow = 0;
      const newRequest = { firstname:user.user.firstname,secondname:user.user.lastname,bloodtype:bloodtype, units:units,email:user.email };

      // INSERT Request
      Connection.query("INSERT INTO request SET ?", newRequest, (err, result) => {
        if (err) {
          console.error("Error inserting Request into MySQL database: " + err.stack);
          throw Error("Error inserting Request into MySQL database");
        }

        // TAKING OUT SUM OF UNITS OF THAT BLOOD GROUP
        Connection.query('SELECT SUM(units) AS total_request FROM request WHERE bloodtype = ?',[bloodtype] ,(error, rows) => {
          if (error) {
            console.error('Error retrieving donations from MySQL database: ' + error.stack);
            throw Error('Error retrieving donations from MySQL database');
          }
          unitstillnow = rows[0]['total_request']
        });
        
        // CHECKING Whether that Blood Group Exits or Not.
        Connection.query("SELECT * FROM brtable WHERE bloodgroup = ?", [bloodtype], (err, rows) => {
          if (err) {
            console.error("Error retrieving inserted request from MySQL database: " + err.stack);
            throw Error("Error retrieving inserted request from MySQL database");
          }
          // Does not exist, then INSERT
          if(rows.length===0){
            const fitblood = {bloodgroup:bloodtype,units:units};
            Connection.query("INSERT INTO brtable SET ?", fitblood, (err, res) => {
              if (err) {
                console.error("Error inserting brRequest into MySQL database: " + err.stack);
                throw Error("Error inserting Request into MySQL database");
              }
            });
          }
          // IF EXITS< UPDATE
          else{
            const id_to_change = rows[0].id;
            const groupRequest = {bloodgroup:bloodtype,units:unitstillnow};
            Connection.query("UPDATE brtable SET ? WHERE id = ?", [groupRequest ,id_to_change], (err, rows) => {
              if (err) {
                  console.error("Error retrieving inserted workout from MySQL database: " + err.stack);
                  throw Error("Error retrieving inserted workout from MySQL database");
              }
              if (res.affectedRows === 0) {
                  return res.status(404).json({ error: "No such user profile" });
              }
            });
          }
        });
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

module.exports = {
    getTable,
    createTable
}