const mongoose= require("mongoose");

const userSchema= new mongoose.Schema({
  name:String,
  email:String,
  password: String,
  salt:String,
  image:{fileName:{ 
    type:String,
  default:'profile'
  }
  }
})

const User= mongoose.model('User', userSchema)

// const users = [
//   {
//     id: 1,
//     name: "Mosh",
//     email: "mosh@domain.com",
//     password: "12345",
//   },
//   {
//     id: 2,
//     name: "John",
//     email: "john@domain.com",
//     password: "12345",
//   },
// ];






const getUsers =  async() => {
  try{
    return await User.find().sort('name').lean()
  }
  catch(err){
    console.log(err)
  }
  }

  

const getUserById = async (id) => {
  const user= await User.findById(id).lean()
  if(!user) return
  return user
}

const getUserByEmail = async (email) => {
  try{
  const user = await User.findOne({email:email}).lean()
 return user

  }
  catch(err){
    console.log(err)
  }
  
}

const addUser = async(user) => {
  const newuser= new User(user)
  const result= await newuser.save()
  return result
  // user.id = users.length + 1;
  // users.push(user);
};

const updateUserById= async(id,value)=>{
  const user= await User.findByIdAndUpdate(id, {
$set:{
  expoPushToken:value
}
}, {new:true, strict:false})

  return user
  
}

const updateUserImage= async(id,value)=>{
  const user = await User.findByIdAndUpdate(id,{
    $set:{
      image:{
        fileName:value
      }
    }
  })

  return user
}

// async function updateAllDocuments() {
//   try {
//     const result = await User.updateMany({}, { $set: { image: {fileName: "profile"}} });
//     return result;
//   } catch (error) {
//     console.error(error);
//   }
// }
// updateAllDocuments()


module.exports = {
  getUsers,
  getUserByEmail,
  getUserById,
  addUser,
  updateUserById,
  updateUserImage,
};
