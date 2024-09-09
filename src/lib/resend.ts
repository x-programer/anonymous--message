import { Resend } from "resend";

export const resend = new Resend(process.env.RESEND_API_KEY);

//sendVerificationEmAIL ..
import VerificationEmail from "../../emials/VerificationEmail";
import { ApiResponse } from "@/types/ApiResponse";

export async function sendVerificationEmail(email:string , username:string , verifyCode: string): Promise<ApiResponse>{
    try {

        const { data, error } = await resend.emails.send({
            from: 'Acme <onboarding@resend.dev>',
            to: email,
            subject: 'Shravana || Verification Code',
            //because it's a prop not a simple method's parameter..
            react: VerificationEmail({ username:username , otp:verifyCode }),
          });

        return {success: true, message: "Email sent successfully.."}

    } catch (error) {
        console.error("Error sending verification email from lib>resend.ts "+error);
        return {success: false , message: "Failed to send verification emial"}
        
    }
}
