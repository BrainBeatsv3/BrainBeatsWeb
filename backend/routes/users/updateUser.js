const router = require("express").Router();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const { user, post } = new PrismaClient();

//Update user info 
router.put('/updateUser', async (req, res) => {
    try 
    {
        const { id, name, email, username } = req.body
        const updateUser = await prisma.user.update({
            where: { id : id},
            data: {
                name: name,
                email: email,
                username: username
            }
          })
          res.status(200).send({msg: "Updated OK"});
    } 
    catch(err) {
        res.status(500).send(err);
    }
});

module.exports = router;