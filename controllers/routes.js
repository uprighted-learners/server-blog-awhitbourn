const fs = require('fs');
const path = require('path');
const blogPath = path.join(__dirname, '../data/blog.json');

//Function to read blog.json comments

const getAllComments = (req, res) => {
    fs.readFile(blogPath, 'utf8', (err,data) => {
        if(err) {
            return res.status(500).json({ error: err.message});
        } 
        try {
            const comments = JSON.parse(data);
            res.json(comments);
        } catch (err) {
            res.status(500).json({ error: 'Error parsing JSON'});
        }
    }); 
};

module.exports = {
    getAllComments
};

const express = require('express');
const router = express.Router();
const commentController = reuire('../controllers/commentController');

router.get('/', commentController.getAllComments);

module.exports = router;