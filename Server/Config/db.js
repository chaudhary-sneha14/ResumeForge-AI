import mongoose from "mongoose";

const connectDB=async(req,res)=>{
try {
    mongoose.connection.on('connected',()=> console.log("DB Connected"))
    await mongoose.connect(`${process.env.MONGO_URI}/resume`)
} catch (error) {
    console.log(error);
}
}

export default connectDB