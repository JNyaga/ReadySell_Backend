const express = require("express");
const router = express.Router();
const Joi = require("joi");
const { Expo } = require("expo-server-sdk");

const usersStore = require("../store/users");
const listingsStore = require("../store/listings");
const messagesStore = require("../store/messages");
const sendPushNotification = require("../utilities/pushNotifications");
const auth = require("../middleware/auth");
const validateWith = require("../middleware/validation");
const messageMapper = require("../mappers/messages");


const schema = {
  listingId: Joi.string().required(),
  message: Joi.string().required(),
};

const schema2 = {
  oldMessageId: Joi.string().required(),
  message: Joi.string().required(),
};

router.get("/", auth, async (req, res) => {
  const messages = await messagesStore.getMessagesForUserandPopulate(req.user.userId);

  const response= messages.map(messageMapper)

  // const mapUser =async (userId) => {
  //   const user = await usersStore.getUserById(userId);
  //   return { id: user._id, name: user.name };
  // };

  // const resources = messages.map((message) => ({
  //   id: message._id,
  //   listingId: message.listingId,
  //   dateTime: message.dateTime,
  //   content: message.content,
  //   fromUser: mapUser(message.fromUserId),
  //   toUser: mapUser(message.toUserId),
  // }));

  res.send(response);
});

router.post("/", [auth, validateWith(schema)], async (req, res) => {
  const { listingId, message } = req.body;

  const listing = await listingsStore.getListing(listingId);
  if (!listing) return res.status(400).send({ error: "Invalid listingId." });

  const targetUser = await usersStore.getUserById(listing.userId);
  if (!targetUser) return res.status(400).send({ error: "Invalid userId." });

  messagesStore.add({
    fromUserId: req.user.userId,
    toUserId: listing.userId,
    listingId,
    content: message,
  });

  const { expoPushToken } = targetUser;
  console.log(targetUser)

  if (Expo.isExpoPushToken(expoPushToken))
    await sendPushNotification(expoPushToken, message);

  res.status(201).send();
});



router.post("/reply", [auth, validateWith(schema2)], async (req, res) => {
  const { oldMessageId, message } = req.body;

  const oldMessageObj = await messagesStore.getMessageByIdandPopulate(oldMessageId);
  if (!oldMessageObj) return res.status(400).send({ error: "Invalid messageId." });

  const targetUserExpoToken = oldMessageObj.fromUserId.expoPushToken
  if (!targetUserExpoToken) return res.status(400).send({ error: "Invalid userId." });

  messagesStore.add({
    fromUserId: req.user.userId,
    toUserId: oldMessageObj.fromUserId._id,
    listingId:oldMessageObj.listingId,
    content: message,
  });

  // const { expoPushToken } = targetUser;
  // console.log(targetUser)

  if (Expo.isExpoPushToken(targetUserExpoToken))
    await sendPushNotification(targetUserExpoToken, message);

  res.status(201).send();
});


router.delete('/:id', async(req,res)=>{
  const {id}= req.params
  console.log(req.params)
  const message= await messagesStore.removeMessage(id)
  if(!message) return res.status(404).send('The Message with the given ID was not found.');

  res.send(message);
})



module.exports = router;
