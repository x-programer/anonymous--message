//using ServerSession we can get data from the session which is stored by me previously..
//but this serverSession wants a authOptions ..
//dbConnect and userModel aslo wants ..

import { getServerSession } from "next-auth";
import UserModel from "@/model/User";
import dbConnect from "@/lib/dbConnect";
//now we will import user form the nextAuth..
import { User } from 'next-auth'
import { authOptions } from "../auth/[...nextauth]/options";
import mongoose from "mongoose";

export async function GET(request: Request) {
    //firstly we'll check database is connected or not ?
    await dbConnect();

    //now we will get user from the session..
    const session = await getServerSession(authOptions);
    const user: User = session?.user as User;

    //now if session has never acitivied so we will chouse if conditon and sening response..
    if (!session || !session.user) {
        return Response.json(
            {
                success: false,
                message: "Not Authenticated.."
            }, { status: 401 }
        )
    }

    //now this id is mongoose id which is use full for aggerigation pipeline ..
    const userId = new mongoose.Types.ObjectId(user._id);

    try {
        // this is aggeration pipeline method ..
        const user = await UserModel.aggregate([
            //in first pipeline we will match user..
            { $match: { id: userId } },
            //now we apply unwind here which is applicable on Array..
            { $unwind: '$messages' },
            //now we will sort the message based on createdAt..
            { $sort: { 'messages.createdAt': -1 } },
            //now here we make group where only have one id and multiple messages..
            { $group: { _id: '_$id', message: { $push: '$messages' } } }
        ])

        if (!user) {
            return Response.json(
                {
                    success: false,
                    message: "User now found.."
                }, { status: 401 }
            )
        }

        //if everything is Okay so we will simple send messages..
        return Response.json({
            success: true,
            messages: user[0].messages
        })
    } catch (error) {
        console.log("An unexpected error occured for geting the message" + error);
        return Response.json(
            {
                success: false,
                message: "Not Authenticated.."
            }, { status: 500 }
        )
    }
}
//aggeration pipeline has done..