
const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  fromUserId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  toUserId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  content: String,
  listingId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Listing'
  },
  dateTime: { type: Date, default: Date.now }

})

const Message = mongoose.model('Message', messageSchema)
// const messages = [
//   {
//     fromUserId: "63a1f980bcfb6ba76932946c",
//     toUserId: "63a1f90021cac25f96222901",
//     listingId: "63a22117e579e846c5c6fbb9",
//     content: "Is this still available?",
//   },
//   {
//     fromUserId: "63a1f980bcfb6ba76932946c",
//     toUserId: "63a1f90021cac25f96222901",
//     listingId: "63a22117e579e846c5c6fbb9",
//     content: "I'm interested in this item. Do you provide free delivery?",
//   },
//   {
//     fromUserId: "63a1f980bcfb6ba76932946c",
//     toUserId: "63a1f90021cac25f96222901",
//     listingId: "63a22117e579e846c5c6fbb9",
//     content: "Please give me a call and we'll arrange this for you.",
//   }
// ];

// async function createMessages() {
//   // Create the documents
//   const result = await Message.create(messages);

//   // Print the created documents
//   console.log(result);
// }

// createMessages();

const getMessagesForUser = async (toUserId) => {
  const messages = await Message.find({ toUserId: toUserId })
    .lean()
    .sort({ dateTime: -1 })
  // messages.filter(message => message.toUserId === toUserId);
  if (!messages) return
  return messages
}
const getMessagesForUserandPopulate = async (toUserId) => {
  const messages = await Message.find({ toUserId: toUserId })
    .lean()
    .populate('toUserId', "_id name image")
    .populate('fromUserId', "_id name image")
    .sort({ dateTime: -1 })


  if (!messages) return
  return messages
}

const getMessageByIdandPopulate = async (id) => {

  const message = await Message.findById(id)
    .lean()
    .populate('fromUserId', "_id name expoPushToken")
  if (!message) return
  return message
  // listings.find((listing) => listing.id === id);
}

// getMessageByIdandPopulate("63a264a8a4e3bfdae0b9a9b6")
const add = async (message) => {
  const newMessage = new Message(message)

  const result = newMessage.save()
  // message.id = messages.length + 1;
  // message.dateTime = Date.now();
  // messages.push(message);
};


const removeMessage = async (id) => {
  const message = await Message.findByIdAndRemove(id)
  if (!message) return null

  return message
}

// removeMessage("63aa9f3b40ad442914077c81")

module.exports = {
  add,
  getMessagesForUser,
  getMessageByIdandPopulate,
  getMessagesForUserandPopulate,
  removeMessage,

};
