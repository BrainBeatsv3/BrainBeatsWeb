require("dotenv").config();
const bcrypt = require('bcryptjs');
const router = require("express").Router();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const { user, post } = new PrismaClient();
// const { JSON } = require("express");
const multer  = require('multer')
const upload = multer()
const fs = require('fs');
const { getJWT, verifyJWT } = require("../../utils/jwt");
const { getUserExists } = require("../../utils/database");

// Create a new user
router.post('/createUser', async (req, res) => {
    try {
        const { firstName, lastName, dob, email, username, password } = req.body;

        const userEmailExists = await getUserExists(email, "email");

        const userNameExists = await getUserExists(username, "username");

        if (userEmailExists || userNameExists) {
            return res.status(400).json({
                msg: "Email or username already exists. Please try again."
            });
        } else {
            //Encrypt user password
            encryptedPassword = await bcrypt.hash(password, 10);

            //Create a single record
            const newUser = await prisma.User.create({
                data: {
                    firstName,
                    lastName,
                    dob,
                    email,
                    username,
                    password: encryptedPassword
                }
            });

            // Create JWT
            const token = getJWT(newUser.id, newUser.email);

            const data = {
                user: newUser,
                token: token
            }

            res.json(data);
        }
    } catch (err) {
        return res.status(400).json({
            msg: "Could not create user."
        });
    }
});

// Login an existing user
router.post('/loginUser', async (req, res) => {
    try {
        // Get user input
        const { email, password } = req.body;

        // Validate if user exists in our database
        const userExists = await getUserExists(email, "email");

        // If password is related to the email console log a successful login
        if (userExists && (bcrypt.compare(password, userExists.password))) {
            const token = getJWT(userExists.id, userExists.email);
            const data = {
                user: userExists,
                token: token
            }
            res.json(data);
        } else {
            return res.status(400).json({
                msg: "Invalid credentials"
            });
        }

    } catch (err) {
        res.status(500).send({ msg: err });
    }
});

// Get all users in the database
router.get('/getAllUsers', async (req, res) => {
    try {
        const users = await prisma.User.findMany();
        res.json(users);
    } catch (err) {
        res.status(500).send({ msg: err });
    }
});

// Get user by username
router.get('/getUserByUsername', async (req, res) => {
    try {
        const userExists = await getUserExists(req.query.username, "username");

        if (!userExists) {
            return res.status(400).json({
                msg: "Username does not exist"
            });
        }
        res.json(userExists);
    } catch (err) {
        res.status(500).send({ msg: err });
    }
});

// Get user by user ID
router.get('/getUserByID', async (req, res) => {
    try {
        const userExists = await getUserExists(req.query.id, "id");

        if (!userExists) {
            return res.status(400).json({
                msg: "User does not exist"
            });
        }
        res.json(userExists);
    } catch (err) {
        res.status(500).send({ msg: err });
    }
});

// Update user info 
router.put('/updateUser', upload.single('profilePicture'), async (req, res) => {
    try{
        const { id, firstName, lastName, dob, email, username, bio, token } = req.body;

        const decoded = verifyJWT(token);

        if (!decoded) {
            return res.status(400).json({
                msg: "Invalid token"
                });
        }

        // Required field for profilePicture as an entry
        const profilePicture = req.file;
                
        // Check if the user already exists in db
        const userExists = await getUserExists(id, "id");

        if (!userExists) {
            return res.status(400).json({
                msg: "User ID not found"
            });
        } else {
            const updateUser = await prisma.User.update({
                where: { id },
                data: {
                    firstName: firstName,
                    lastName: lastName,
                    email: email,
                    dob: new Date(dob).toISOString(),
                    username: username,
                    bio: bio
                }
            });    
        
            const uploadPath = "../images/profilePicture/" + id;

            fs.writeFile(uploadPath, profilePicture.buffer, function(err) {
                if (err) throw new Error('Unable to save images');
            });
            // const profilepic2 = fs.readFile(uploadPath);
            // console.log(profilepic2);
            res.status(200).send({msg: "User was successfully updated"});
        }
    } catch (err) {
        res.status(500).send(err);
    }
});

// Delete user by ID
router.delete('/deleteUser', async (req, res) => {
    const decoded = verifyJWT(req.body.token);

    if (!decoded) {
        return res.status(400).json({
            msg: "Invalid token"
        });
    }

    try {
        const deleteUser = await prisma.User.delete({
            where: { id: req.body.id }
        });
        res.status(200).send({ msg: "Deleted a user" });
    } catch (err) {
        res.status(500).send(err);
    }
});

module.exports = router;