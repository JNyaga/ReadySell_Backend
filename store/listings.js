const mongoose= require("mongoose");

const listingSchema= new mongoose.Schema({
  title:String,
  images:[{fileName:String}],
  price: Number,
  categoryId: Number,
  userId:{
    type:mongoose.Schema.Types.ObjectId,
    ref:'User'
  },
  location: {
    latitude: Number,
    longitude: Number
  },
  dateTime:{ type: Date, default: Date.now }

})

const Listing= mongoose.model('Listing', listingSchema)

// const listings = [
//   {

//     title: "Red jacket",
//     images: [{ fileName: "jacket1" }],
//     price: 100,
//     categoryId: 5,
//     userId: "63a1f90021cac25f96222901",
//     location: {
//       latitude: 37.78825,
//       longitude: -122.4324,
//     },
//   },
//   {
//     title: "Gray couch in a great condition",
//     images: [{ fileName: "couch2" }],
//     categoryId: 1,
//     price: 1200,
//     userId: "63a1f980bcfb6ba76932946c",
//     location: {
//       latitude: 37.78825,
//       longitude: -122.4324,
//     },
//   },
//   {
//     title: "Room & Board couch (great condition) - delivery included",
//     description:
//       "I'm selling my furniture at a discount price. Pick up at Venice. DM me asap.",
//     images: [
//       { fileName: "couch1" },
//       { fileName: "couch2" },
//       { fileName: "couch3" },
//     ],
//     price: 1000,
//     categoryId: 1,
//     userId: "63a1f90021cac25f96222901",
//     location: {
//       latitude: 37.78825,
//       longitude: -122.4324,
//     },
//   },
//   {
//     title: "Designer wear shoes",
//     images: [{ fileName: "shoes1" }],
//     categoryId: 5,
//     price: 100,
//     userId: "63a1f980bcfb6ba76932946c",
//     location: {
//       latitude: 37.78825,
//       longitude: -122.4324,
//     },
//   },
//   {

//     title: "Canon 400D (Great Condition)",
//     images: [{ fileName: "camera1" }],
//     price: 300,
//     categoryId: 3,
//     userId: "63a1f90021cac25f96222901",
//     location: {
//       latitude: 37.78825,
//       longitude: -122.4324,
//     },
//   },
//   {

//     title: "Nikon D850 for sale",
//     images: [{ fileName: "camera2" }],
//     price: 350,
//     categoryId: 3,
//     userId: "63a1f90021cac25f96222901",
//     location: {
//       latitude: 37.78825,
//       longitude: -122.4324,
//     },
//   },
//   {
//     title: "Sectional couch - Delivery available",
//     description: "No rips no stains no odors",
//     images: [{ fileName: "couch3" }],
//     categoryId: 1,
//     price: 950,
//     userId: "63a1f980bcfb6ba76932946c",
//     location: {
//       latitude: 37.78825,
//       longitude: -122.4324,
//     },
//   },
//   {
//     title: "Brown leather shoes",
//     images: [{ fileName: "shoes2" }],
//     categoryId: 5,
//     price: 50,
//     userId: "63a1f980bcfb6ba76932946c",
//     location: {
//       latitude: 37.78825,
//       longitude: -122.4324,
//     },
//   },
// ];


// async function createItems() {
//   // Create the documents
//   const result = await Listing.create(listings);

//   // Print the created documents
//   console.log(result);
// }
// createItems()


const addListing = async (listing) => {
 const newListing= new Listing(listing)
  const result= await newListing.save()
  return result
};

const getListings = async () => {
  return await Listing.find()
  .lean()
  .populate("userId", "_id name expoPushToken image")
  .sort({dateTime:-1})
};

const getListing = async(id) => {

  const listing= await Listing.findById(id).lean()
  if(!listing) return
  return listing
  // listings.find((listing) => listing.id === id);
}


const filterListings = async (filterObject) =>{
  const listings= await Listing.find(filterObject)
  .lean()
  .populate("userId", "_id name expoPushToken image")
  .sort({dateTime:-1})
  return listings
}

module.exports = {
  addListing,
  getListings,
  getListing,
  filterListings,
  // createItems

};
