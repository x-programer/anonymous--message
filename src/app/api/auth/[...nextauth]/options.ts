import CredentialsProvider from "next-auth/providers/credentials";
import { NextAuthOptions } from "next-auth";
import UserModel from "@/model/User";
import bcrypt from 'bcryptjs'
import dbConnect from "@/lib/dbConnect";

export const authOptions: NextAuthOptions = {
    // Provider is a simple array ..
    providers: [
        CredentialsProvider({
            id: "credentials",
            name: "Credentials",
            credentials: {
                emial: { label: "Email", type: "text" },
                password: { label: "Password", type: "password" }
            },

            async authorize(credentials: any): Promise<any> {
                // databse connection..
                await dbConnect();
                try {
                    // now we'l check for signIN..
                    const user = await UserModel.findOne({
                        // this will check user by their username and email as well..
                        //using this mongoose or operator ..
                        $or: [
                            { email: credentials.identifier },
                            { username: credentials.identifier }
                        ]
                    })

                    if (!user)
                        throw new Error("No user found with this emial..");
                    if (!user.isVerified)
                        throw new Error("Verified first from option.js");

                    //Now if every thik is okay we will check user's password first using bcryptsjs..
                    const isPasswordCorrecct = await bcrypt.compare(credentials.password, user.password);
                    if (isPasswordCorrecct) {
                        return user;
                    }
                    else {
                        throw new Error("Password is inCorrect..");
                    }

                } catch (err: any) {
                    throw new Error(err);
                }
            }
        })
    ],

    callbacks: {
        async jwt({ token, user }) {
            // Ading new feilds on JWT token ..
          token._id = user._id;
          token.isAcceptingMessage = user.isAcceptingMessage;
          token.isVerified = user.isVerified;
          token.username = user.username;

          return token
        },

        async session({ session, user, token }) {
            // Now we will adding new feilds here as well ..
            if(token){
                session.user._id = token._id;
                session.user.isAcceptingMessage = token.isAcceptingMessage;
                session.user.isVerified = token.isVerified;
                session.user.username = token.username
            }

          return session
        }
    },

    pages: {
        signIn: '/sign-in'
    },
    session: {
        strategy: 'jwt'
    },
    //now we will pass secret key here ..
    secret: process.env.NEXTAUTH_SECRETKEY,
}