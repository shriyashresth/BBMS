// import model
const User = require('../models/userModel.js')
const jwt = require('jsonwebtoken')
const mysql = require('mysql')
const {Connection} = require('../database/db.js')
const {signup, login} = require('../models/userModel.js')

const createToken = (_id) => {
    return jwt.sign({_id},process.env.SECRET,{expiresIn:'3d'})
}
 
const loginUser = async (req, res) => {
    const { email, password } = req.body;
    try {
      if (!email || !password) {
        throw new Error('All fields must be filled');
      }
      const user = await login(email, password);
      const token = createToken(user.id);
      res.status(200).json({ email,token,user });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };


// signup user
const signupUser = async (req, res) => {
  const { email, password, firstName, secondName } = req.body;
  // console.log(email, password, firstName, secondName);
  try {
    const user = await signup(email,password, firstName, secondName)
    // console.log(user)
    const token = createToken(user.id);

    res.status(200).json({ email, token, user });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// get a single workout ✅
const getUserById = async(req,res)=>{
  // get id of workout
  const {id} = req.params
  console.log('hehe',id)
  try {
      // find workouts which were created by the user and sort them on basis of how recent they were made
      Connection.query('SELECT * FROM login WHERE id = ?', [id], (error, rows) => {
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

module.exports = {loginUser,signupUser, getUserById}
