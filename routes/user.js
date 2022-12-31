const express = require("express");
const router = express.Router();
const multer = require("multer");

const usersStore = require("../store/users");
const listingsStore = require("../store/listings");
const auth = require("../middleware/auth");
const userMapper = require("../mappers/users");
const userImageResize = require("../middleware/userImageResize");



const upload = multer({
  dest: "/tmp/",
  limits: { fieldSize: 25 * 1024 * 1024 },
});

router.get("/:id", auth, async (req, res) => {
  const userId = req.params.id
  const response = await usersStore.getUserById(userId);
  if (!response) return res.status(404).send();
  // const  {expoPushToken}  = user
  // console.log(expoPushToken)
  const user = userMapper(response);
  const listings = await listingsStore.filterListings({ userId: userId });

  res.send({
    id: user._id,
    name: user.name,
    email: user.email,
    image: user.image,
    listings: listings.length
  });
});


router.put("/image",
  [
    auth,
    upload.single("image"),
    userImageResize,
  ],
  async (req, res) => {
    const user = await usersStore.updateUserImage(
      req.user.userId, req.image)
    if (!user) return res.status(400).send({ error: "Failed to update" })

    res.status(201).send("Image changed");

  }
);

module.exports = router;
