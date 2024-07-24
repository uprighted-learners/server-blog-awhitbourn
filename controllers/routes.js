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
const { error } = require('console');
const router = express.Router();
const commentController = reuire('../controllers/commentController');

router.get('/', commentController.getAllComments);


//function to read data from json file
function readDataFromFile(callback) {
    fs.readFile('data.json', 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading file', err);
            callback([]);
            return;
        }

        try {
            const jsonData = JSON.parse(data);
            callback(jsonData);
        } catch (err) {
            console.error('Error parsing JSON:', err);
            callback([]);
        }
        })
    }

    //Route to get a comment by post_id
router.get('/api/comments/:post_id', (req,res) => {
    const postID = path.parseINT(req.params.post_id);

    readDataFromFile(data => {
        //post with matching post_id
        const post = data.find(post => post.post_id === postID);

        if (!post) {
            res.status(404).json({error: 'Post no found'});
            return;
        }

        const comment = post.comments

        res.json(comment);
    });
});

//function to write data to JSON file
function writeDataToFile(data, callback) {
    fs.writeFile('data.json', JSON.stringify(data, null, 2), 'utf8', (err) => {
        if (err) {
            console.error('Error writing file:', err);
            callback(false);
            return;
        }
        callback(true);
    });
}

//route to create a new entry
router.post('/api/posts', (req, res) => {
    const {title, author, body} = req.body;

    readDataFromFile(data => {
        //new post id
        const newPostID = data.length > 0 ? data[data.length - 1].post_id + 1: 1;

        // new post object
        const newPost = {
            post_id: newPostID,
            title,
            author,
            body,
            comments: [] //empty array for comments
        };

        //append new post to data array
        data.push(newPost);

        // write updated data back to file
        writeDataToFile(data, success => {
            if (!success) {
                res.status(500).json({error: 'Failed to write data to file'});
                return;
            }
            res.status(201).json({message: 'Post created successfully', post: newPost});
        })
    })
})

//route to update existing entry by post_id
router.put('/api/posts', (req, res) => {
    const postID = parseInt(req.query.post_id); //query param

    readDataFromFile(data => {
        // find index of post with matching post_id
        const index = data.findIndex(post => post.post_id === postId);

        if (index === -1) {
            res.status(404).json({ error: 'Post not found'});
            return;
        }

        //update post with data from request body
        const { title, author, body, comments } = req.body;
        if (title) data [index].title = title;
        if (author) data [index].author = author;
        if (body) data [index].body = body;
        if (comments) data [index].comments = comments;

        // write updated data back to file
        writeDataToFile(data, success => {
            if (!success) {
                res.status(500).json({error: 'Failed to write data to file'});
                return;
            }
            res.json({message: 'Post updated successfully', post: data[index]});
        });
    });
});

//route to delete an entry by post_id
router.delete('/api/posts/:post_id', (req, res) => {
    const postID = parseInt(req.params.post_id);

    readDataFromFile(data => {
        // find index of the post with matching post_id
        const index = data.findIndex(post => post.post_id === postID);

        if (index === -1) {
            res.status(404).json({ error: 'Post not found'});
            return;
        }
        // remove post
        const deletedPost = data.splice(index, 1)[0];

        // write updated data back to file
        writeDataToFile(data, success => {
            if (!success) {
                // if failed to write, add deleted post back
                data.splice(index, 0, deletedPost);
                res.status(500).json({ error: 'Failed to write data to file'});
                return;
            }
            res.json({ message: 'Post deleted successfully', post: deletedPost});
        });
    });
});

module.exports = router;
