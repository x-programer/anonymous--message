import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";

export async function POST(request: Request) {
    await dbConnect();

    try {

        const { username, code } = await request.json();
        const decodedUsername = decodeURIComponent(username);
        const user = await UserModel.findOne({ username: decodedUsername });

        // if there is no user..
        if (!user) {
            return Response.json({
                sucess: false,
                message: "User not found.."
            }, { status: 500 })
        }

        //Here we are checking user's otp and otp's validity..
        const isCodeValid = user.verifyCode === code;
        const isCodeNotExpiry = new Date(user.verifyCodeExpiry) > new Date();

        //if usser's validity and expiary is okay now 
        if (isCodeValid && isCodeNotExpiry) {

            user.isVerified = true;
            user.save();

            return Response.json({
                sucess: true,
                message: "Account verified successfully.."
            }, { status: 200 })

            // when code has expaired..
        } else if (!isCodeNotExpiry) {
            return Response.json({
                sucess: false,
                message: "Verification code has expied plwase signUp again for get a new code.."
            }, { status: 400 })

            // wehn code is incorrect..
        } else {

            return Response.json({
                sucess: true,
                message: "Incorrect verification code.."
            }, { status: 400 })
        }


    } catch (error) {
        console.error("Verifying user" + error);
        return Response.json({
            sucess: false,
            message: "Error while verifying user.."
        }, { status: 500 })
    }
}