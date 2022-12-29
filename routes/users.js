const express = require("express");
const router = express.Router();
const Joi = require("joi");
const crypto= require('crypto');

const usersStore = require("../store/users");
const validateWith = require("../middleware/validation");
const userMapper = require("../mappers/users");

const schema = {
  name: Joi.string().required().min(2),
  email: Joi.string().email().required(),
  password: Joi.string().required().min(5),
};

const hashPassword= (password,salt)=>{
  // Use the SHA-256 algorithm to generate a hash of the password
  const hash = crypto.createHash('sha256');

  // Add the salt to the password before hashing it
  hash.update(password + salt);
  return hash.digest('hex');
}

router.post("/", validateWith(schema), async(req, res) => {
  const { name, email, password } = req.body;
  if (await usersStore.getUserByEmail(email))
    return res
      .status(400)
      .send({ error: "A user with the given email already exists." });

  const salt = crypto.randomBytes(16).toString('hex');
  const user = { name, email, password: hashPassword(password, salt), salt};
  const newuser=  await usersStore.addUser(user);

  res.status(201).send(newuser);
});

router.get("/", async(req, res) => {
  const users= await usersStore.getUsers();
  const response= users.map(userMapper)
  res.send(response);
});

module.exports = router;
