//in this page we will write api in next js ..
// databse connect will be use in every route because next js run on edge's so that's why..
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
//bcrypt js for encoding passwords ..
import bcrypt from 'bcryptjs'

import { sendVerificationEmail } from "@/lib/resend";

//API in next js ..
export async function POST(request: Request) {
    //for making AND checking databse connection ..
    await dbConnect();

    try {

        const { username, email, password } = await request.json();
        const existingUserVerifyedByUsername = await UserModel.findOne({
            username,
            isVerified: true
        })

        if (existingUserVerifyedByUsername) {
            return Response.json({
                success: false,
                message: "Username is already taken"
            }, { status: 400 })
        }

        const existingUserVerifyedByEmail = await UserModel.findOne({ email });
        const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();

        if (existingUserVerifyedByEmail) {
            if(existingUserVerifyedByEmail.isVerified){
                return Response.json(
                    {
                        success: false,
                        message: "User already exist with this email.."
                    },
                    {
                        status: 400
                    }
                )
            } else{
                const hashedPassword = await bcrypt.hash(password, 10);
                existingUserVerifyedByEmail.password = hashedPassword;
                existingUserVerifyedByEmail.verifyCode = verifyCode;
                existingUserVerifyedByEmail.verifyCodeExpiry = new Date(Date.now()+3600000);
                await existingUserVerifyedByEmail.save();
            }

        } else {
            // user's email does'nt exist so register the user but firstly encrypt the password ..
            const hashedPassword = await bcrypt.hash(password, 10);
            const expiryDate = new Date();
            expiryDate.setHours(expiryDate.getHours() + 1);

            //User's object..
            const newUser = new UserModel({
                username,
                email,
                password: hashedPassword,
                verifyCode: verifyCode,
                verifyCodeExpiry: expiryDate,
                isVerified: false,
                isAcceptingMessage: true,
                messages: []

            })

            //
            await newUser.save();
        }

        //sending verifcation emial..
        const emailResponse = await sendVerificationEmail(email, username, verifyCode)

        // this response will sent if the email dose'nt sent ..
        if (!emailResponse.success) {
            return Response.json(
                {
                    success: false,
                    message: emailResponse.message
                },
                {
                    status: 500
                }
            )
        }

        //this will send response if the user has registered..
        return Response.json(
            {
                success: true,
                message: "User register successfully. Please verify your email"
            },
            {
                status: 201
            }
        )


    } catch (error) {
        console.error("Error registring user arc>api>sign-up>router.ts ", error)
        return Response.json(
            {
                success: false,
                message: "Error registring user arc>api>sign-up>router.ts "
            },
            {
                status: 500
            }
        )
    }
} 