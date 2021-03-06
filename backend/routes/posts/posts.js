require("dotenv").config();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const router = require("express").Router();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const { user, post } = new PrismaClient();
// const { JSON } = require("express");

// Create a post
router.post('/createPost', async (req, res) => {

    try {
        const { userID, title, bpm, key, visibility} = req.body
        const userExists = await prisma.User.findUnique({
            where: { id: userID }
        });

        if (!userExists) {
            return res.status(400).json({
                msg: "User not found"
            })
        } else {
            //Create a single record
            const newPost = await prisma.Post.create({
                data: {
                    userID: userID,
                    title: title,
                    bpm: bpm,
                    key: key,
                    visibility: visibility,
                    likeCount: 0
                }
            });

            res.json(newPost);
        }
    } catch (err) {
        res.status(500).send({ msg: err })
    }

});

// Get all posts based on a username
router.get('/getUserPostsByUsername', async (req, res) => {
    try {
        const username = req.query.username
        if (username === "") {
            const allPosts = await prisma.Post.findMany();
            res.json(allPosts);
            return;
        }

        const userExists = await prisma.User.findUnique({
            where: { username }
        });

        if (!userExists) {
            //return empty if no user is found
            res.json([])
            return 
        } else {
            // Find the records
            const userPosts = await prisma.Post.findMany({
                where: { userID: userExists.id }
            });

            if (!userPosts) {
                return res.status(400).json({
                    msg: "Posts not found"
                })
            }

            res.json(userPosts);
        }
    }
    catch (err) {
        res.status(500).send({ msg: err })
    }
});

// Get all posts based on a user ID
router.get('/getUserPostsByID', async (req, res) => {
    //res.json([req.body, 'hello'])
    try {
        const userPosts = await prisma.Post.findMany({
            where: { userID: req.query.userID },
        });
        //res.json([req.body, "hello"])

        if (!userPosts) {
            return res.status(400).json({
                msg: "User ID not found"
            })
        }

        res.json(userPosts)
    }
    catch (err) {
        res.status(500).send({ msg: err })
    }

});

// Get all posts
router.get('/getAllPosts', async (req, res) => {
    try {
        const posts = await prisma.Post.findMany();

        res.json(posts)
    }
    catch (err) {
        res.status(500).send({ msg: err })
    }

});

// Delete a post
router.delete('/deletePost', async (req, res) => {
    try {
        console.log(req.body.id)
        const deletePost = await prisma.Post.delete({
            where: { id: req.body.id }
        })
        res.status(200).send({ msg: "Deleted a user post" });
    }
    catch (err) {
        res.status(500).send(err);
    }
});

// Update user post info 
router.put('/updatePost', async (req, res) => {

    try {
        const { id, title, visibility, bio, thumbnail, likeCount} = req.body

        // Check if the id already exists in db
        const userIDExists = await prisma.Post.findUnique({
            where: { id },
        });

        if (!userIDExists) {
            return res.status(400).json({
                msg: "Post ID not found"
            })
        } else {
            
        const updatePost = await prisma.Post.update({
            where: { id },
            data: {
                title: title,
                bio: bio,
                likeCount: likeCount,
                visibility: visibility,
                thumbnail: thumbnail
            }
        })
        //   res.status(200).send({msg: "Updated OK"});
        res.json(updatePost);
      }
    }

    catch (err) {
        res.status(500).send(err);
    }

});

module.exports = router;