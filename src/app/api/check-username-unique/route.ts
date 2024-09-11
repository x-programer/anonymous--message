import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { z } from 'zod';

import { usernameValidation } from '@/schemas/signUpSchema'


const UsernameQuerySchema = z.object({
    //username should be full fill usernameValidation schema..
    username: usernameValidation
})

export async function GET(request: Request) {
    await dbConnect();

    try {
        //getting url from request in next js ..
        const { searchParams } = new URL(request.url);

        // searchParams is a whole data which is coming from url so we only get username..
        const queryParams = { username: searchParams.get('username') }

        //Now we will validate with zod..
        const result = UsernameQuerySchema.safeParse(queryParams);

        if (!result.success) {
            const usernameErrors = result.error.format().username?._errors || []
            return Response.json(
                {
                    success: 'false',
                    message: 'Invalid Parameters'
                }, { status: 400 }
            )
        }

        //now if there is no problem so we will get result.data and check form the databse...
        const { username } = result.data;
        //here we are simple checking ..
        const existingVerifiedUser = await UserModel.findOne({ username, isVerified: true });

        //this if will execute if username exist in databse ..
        if (existingVerifiedUser) {

            return Response.json(
                {
                    success: 'false',
                    message: 'Username is already taken..'
                }, { status: 400 }
            )
        }

        //but if user is not exist in databse so we will simple return this response ..
        return Response.json(
            {
                success: 'true',
                message: 'username is unique'
            }, { status: 200 }
        )


    } catch (error) {
        console.error("Error checkimg username" + error);
        return Response.json({
            sucess: false,
            message: "Error while checking username.."
        }, { status: 500 })
    }
}