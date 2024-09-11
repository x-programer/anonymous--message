import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";

import { Message } from "@/model/User";

export async function POST(request: Request) {
    await dbConnect();

    const { username, content } = await request.json();

    try {
        //now we will find the user using username because username is unique for everyone..
        const user = await UserModel.findOne({ username });
        if (!user) {
            return Response.json(
                {
                    success: false,
                    message: "User not found.."
                }, { status: 404 }
            )
        }

        //now if we found the user so firstly we will check isUseraccepting message or not ..
        if (!user.isAcceptingMessage) {
            return Response.json(
                {
                    success: false,
                    message: "User not accepting the message.."
                }, { status: 403 }
            )
        }

        // now if everythimg is okay that means user is accepting the message ..
        const newMessage = { content, createdAt: new Date() };
        user.messages.push(newMessage as Message);
        await user.save();

        return Response.json(
            {
                success: true,
                message: "Message sent successfully.."
            }, { status: 201 }
        )

    } catch (error) {
        console.log("An unexpected error occured for sending messages" + error);
        return Response.json(
            {
                success: false,
                message: "Internal server error.."
            }, { status: 500 }
        )
    }
}