// TODO: this file is for defining new data types..
// It's a special type declare file for decliring new data types..
import 'next-auth';
import { DefaultSession } from 'next-auth';
import { boolean } from 'zod';

declare module 'next-auth' {
    interface User {
        _id?: string;
        isVerified?: boolean;
        isAcceptingMessage?: boolean;
        username?: string
    }

    interface Session {
        user: {
            _id?: string;
            isVerified?: boolean;
            isAcceptingMessage?: boolean;
            username?: string
        } & DefaultSession['user']
    }

}

declare module 'next-auth/jwt' {
    interface JWT {
        _id?: string;
        isVerified?: boolean;
        isAcceptingMessage?: boolean;
        username?: string
    }
}