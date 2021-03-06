require("dotenv").config();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const router = require("express").Router();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const { user, post } = new PrismaClient();
// const { JSON } = require("express");

// Create a new user
router.post('/createUser', async (req, res) => {

    try {
        const { firstName, lastName, dob, email, username, password } = req.body;

        // Check if the email already exists in db
        const userEmailExists = await prisma.User.findUnique({
            where: { email },
        });

        // Check if the username already exists in db
        const userNameExists = await prisma.User.findUnique({
            where: { username },
        });

        if (userEmailExists || userNameExists) {
            return res.status(400).json({
                msg: "Email or username already exists. Please try again."
            })
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

            // Create token

            // const token = jwtAPI.giveSignUpJWT(newUser.id, newUser.email);

            //----COMMENTED OUT TO CLOSE USER LOOP----\\ 
            // const token = jwt.sign(
            //     { userId: newUser.id, email },
            //     process.env.NEXT_PUBLIC_JWT_KEY,
            //     {
            //         expiresIn: "1h",
            //     }
            //     );

            // // save user token
            // newUser.token = token;

            res.json(newUser);
        }

    }
    catch (err) {
        console.log(err)
        res.status(500).json({ msg: "Unable to create user" })
    }

});

// Get all users with all records
router.get('/getAllUsers', async (req, res) => {

    try {
        const users = await prisma.User.findMany();
        res.json(users)
        // FIND THE LENGTH OF USERS IN MYSQL USER TABLE
        // res.json(users.length)
    }
    catch (err) {
        res.status(500).send({ msg: err })
    }

});

// Get user by username
router.get('/getUserByUsername', async (req, res) => {
    console.log(req.query.username)
    try {
        const findUser = await prisma.User.findUnique({
            where: { username: req.query.username }
        });

        if (!findUser) {
            return res.status(400).json({
                msg: "Username does not exist"
            })
        }
        res.json(findUser)
    }
    catch (err) {
        res.status(500).send({ msg: err })
    }

});

// Get user by user ID
router.get('/getUserByID', async (req, res) => {

    try {
        const findUser = await prisma.User.findUnique({
            where: { id: req.query.id }
        });

        if (!findUser) {
            return res.status(400).json({
                msg: "User does not exist"
            })
        }
        res.json(findUser)
    }
    catch (err) {
        res.status(500).send({ msg: err })
    }

});

// for (let i = 0; i <= user.length; i++) {
//     title: 'Song ' + i;
//     artist: user.lastName + user.lastName;
//     time: user.createdAt;
//     data: user.data;
//   };

// Update user info 
router.put('/updateUser', async (req, res) => {

    try {
        const { id, firstName, lastName, dob, email, username, bio, profilePicture } = req.body
        // Check if the id already exists in db
        const userIDExists = await prisma.User.findUnique({
            where: { id },
        });

        if (!userIDExists) {
            return res.status(400).json({
                msg: "User ID not found"
            })
        } else {
        const updateUser = await prisma.User.update({
            where: { id },
            data: {
                firstName: firstName,
                lastName: lastName,
                email: email,
                username: username,
                bio: bio,
                profilePicture: profilePicture
            }
        })
        //   res.status(200).send({msg: "Updated OK"});
        res.json(updateUser);
        }
    }

    catch (err) {
        res.status(500).send(err);
    }

});

// Delete user by ID
router.delete('/deleteUser', async (req, res) => {

    try {
        const deleteUser = await prisma.User.delete({
            where: { id: req.body.id }
        })
        res.status(200).send({ msg: "Deleted a user" });
    }
    catch (err) {
        res.status(500).send(err);
    }

});

module.exports = router;