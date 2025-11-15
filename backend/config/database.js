import mongoose from "mongoose";

export const dbConnection = ()=>{
    mongoose.connect(process.env.MONGO_URI,{
        dbName: "PG"
    }).then(()=>{
        console.log("Connected to MongoDB");
    }).catch(err=>{
        console.log(`some error occured while connecting to database: ${err}`);
    });
};