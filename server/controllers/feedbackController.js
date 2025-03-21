// const Feedback = require('../models/FeedbackModel.js')
const mongoose = require('mongoose')
const {Connection} = require('../database/db.js')

const getFeedbacks = async (req, res) => {
    try {
        // take out ID of the user who is logged in
        const user_id = req.user.id;

        // find Feedbacks which were created by the user and sort them on basis of how recent they were made
        Connection.query('SELECT * FROM feedback ORDER BY feedbackAt DESC', (error, rows) => {
            if (error) {
                console.error('Error retrieving Feedbacks from MySQL database: ' + error.stack);
                throw Error('Error retrieving Feedbacks from MySQL database');
            }
            // return Feedbacks in json format
            res.status(200).json(rows);
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Server error' });
    }
};

 
// get a single Feedback ✅
const getFeedback = async(req,res)=>{
    // get id of Feedback
    const {id} = req.params

    // check validation
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({error:'No such Feedback'})
    }

    // find thatt Feedback
    const Feedback = await Feedback.findById(id)

    if(!Feedback){
        return res.status(404).json({error:'no such Feedback'})
    }

    // return that Feedback as json
    res.status(200).json(Feedback)
}

const createFeedback = async (req, res) => {
    // take out title/load/reps from request
    const { feedback } = req.body;
  
    // checking whether some fields are empty or not
    let emptyFields = [];
    if (!feedback) {
      emptyFields.push("feedback");
    }
    if (emptyFields.length > 0) {
      return res.status(400).json({ error: "please fill in all the fields", emptyFields });
    }
  
    try {
      const user_id = req.user.id;
  
      // create Feedback
      const newFeedback = { feedback, feedbackby:user_id };
      Connection.query("INSERT INTO feedback SET ?", newFeedback, (err, result) => {
        if (err) {
          console.error("Error inserting Feedback into MySQL database: " + err.stack);
          throw Error("Error inserting Feedback into MySQL database");
        }
        newFeedback.id = result.insertId;
        // get the inserted Feedback
        Connection.query("SELECT * FROM feedback WHERE id = ?", [newFeedback.id], (err, rows) => {
          if (err) {
            console.error("Error retrieving inserted Feedback from MySQL database: " + err.stack);
            throw Error("Error retrieving inserted Feedback from MySQL database");
          }
          const Feedback = rows[0];
          res.status(200).json(Feedback);
        });
      });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };
  

// delete a Feedbacks ✅
// const deleteFeedback = async (req,res)=>{
//     // getting id of the Feedback
//     const {id} = req.params
//     if (!mongoose.Types.ObjectId.isValid(id)) {
//         return res.status(404).json({error:'No such Feedback'})
//     }
//     const Feedback = await Feedback.findOneAndDelete({_id:id})
//     if(!Feedback){
//         return res.status(404).json({error:'no such Feedback'})
//     }
//     res.status(200).json(Feedback)
// }

const deleteFeedback = async (req, res) => {
    // getting id of the Feedback
    console.log(req.params)
    const { id } = req.params;
    if (!id) {
      return res.status(404).json({ error: 'No such Feedback' });
    }
    try {
      const result = await Connection.query('DELETE FROM feedback WHERE id = ?', [id]);
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'No such Feedback' });
      }
      res.status(200).json({ message: 'Feedback deleted successfully' });
    } catch (error) {
      console.error('Error deleting Feedback from MySQL database: ' + error.stack);
      res.status(500).json({ error: 'Error deleting Feedback' });
    }
  };
  

// Update Feedbacks
const updateFeedback = async(req,res)=>{
    const {id} = req.params

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({error:'No such Feedback'})
    }

    const Feedback = await Feedback.findOneAndUpdate({_id:id},{
        ...req.body
    }) 
    if(!Feedback){
        return res.status(404).json({error:'no such Feedback'})
    }
    res.status(200).json(Feedback)
}

module.exports = {
    getFeedbacks,
    getFeedback,
    createFeedback,
    deleteFeedback,
    updateFeedback

}