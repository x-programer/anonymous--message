//using ServerSession we can get data from the session which is stored by me previously..
//but this serverSession wants a authOptions ..
//dbConnect and userModel aslo wants ..

import { getServerSession } from "next-auth";
import UserModel from "@/model/User";
import dbConnect from "@/lib/dbConnect";
//now we will import user form the nextAuth..
import { User } from 'next-auth'
import { authOptions } from "../auth/[...nextauth]/options";

//now we will make a post method because logeed in user because he want to turn off or turn on the message accepting toggle or of the message accepthig toggel..
export async function POST(request: Request) {
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

    //now we will get userId form user(session) ..
    const userId = user._id;
    //now we will have user's message from the request..
    const { acceptMessages } = await request.json();

    try {
        // now we will find the user anď then update..
        const updatedUser = await UserModel.findByIdAndUpdate(
            { userId },
            { isAcceptingMessage: acceptMessages },
            { new: true }
        )

        //if we don't have updatedUser..
        if (!updatedUser) {
            return Response.json(
                {
                    success: false,
                    message: "Falied to update user status to accept message.."
                }, { status: 401 }
            )
        }

        //but if user has updated successfully so we will send this response ..
        return Response.json(
            {
                success: true,
                message: "Message acceptence status updated successfully.."
            }, { status: 200 }
        )

    } catch (error) {
        console.log("Falied to update user status to accept message..");
        return Response.json(
            {
                success: false,
                message: "Falied to update user status to accept message.."
            }, { status: 500 }
        )
    }

}

// for get request..
export async function GET(request: Request) {
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

    //now we will get userId form user(session) ..
    const userId = user._id;

    try {
        const fondUser = await UserModel.findById({ userId });

        //if user not founded..
        if (!fondUser) {
            return Response.json(
                {
                    success: false,
                    message: "User not found.."
                }, { status: 404 }
            )
        }

        // and if user has founded..
        return Response.json(
            {
                success: true,
                isAcceptingMessages: fondUser.isAcceptingMessage,
            }, { status: 200 }
        )
    } catch (error) {
        console.log("Falied to update user status to accept message..");
        return Response.json(
            {
                success: false,
                message: "Error is getting message acceptence status.."
            }, { status: 500 }
        )
    }

}