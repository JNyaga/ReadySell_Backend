const express = require("express");
const router = express.Router();
const Joi = require("joi");
const jwt = require("jsonwebtoken");
const crypto = require('crypto');


const usersStore = require("../store/users");
const validateWith = require("../middleware/validation");
const userMapper = require("../mappers/users");


const schema = {
  email: Joi.string().email().required(),
  password: Joi.string().required().min(5),
};


const hashPassword=(password, salt)=> {
  const hash = crypto.createHash('sha256');

  hash.update(password + salt);
  return hash.digest('hex');
}


const verifyPassword=(password,hashedPassword,salt)=>{
  // Hash the password that the user has entered
  const enteredHash = hashPassword(password, salt);

  // Compare the entered hash to the stored hash
  return enteredHash === hashedPassword;

}

router.post("/", validateWith(schema), async (req, res) => {
  const { email, password } = req.body;
  const userResponse = await usersStore.getUserByEmail(email);
  if (!userResponse || !verifyPassword(password,userResponse.password,userResponse.salt))
    return res.status(400).send({ error: "Invalid email or password." });

  const user= userMapper(userResponse)
  const token = jwt.sign(
    { userId: user._id, name: user.name, email, image: user.image },
    "jwtPrivateKey"
  );
  res.send(token);
});

module.exports = router;
