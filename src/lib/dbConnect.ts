import mongoose from "mongoose";

type ConnectionObject = {
    isConnected?: number
}

const connection: ConnectionObject = {}

async function dbConnect(): Promise<void> {
    //this will check database is connected or not ..
    if(connection.isConnected){
        console.log("Already connected to the database"); 
        return
    }

    //if databse is not connected so make a new connection of databse..
    try {

        const db = await mongoose.connect(process.env.MONGODB_URI || '')
        connection.isConnected = db.connections[0].readyState

        console.log("DB connected Successfully");

    } catch (error) {
        console.log("Databse connection failed" , error);
        process.exit(1);
    }
}

export default dbConnect;