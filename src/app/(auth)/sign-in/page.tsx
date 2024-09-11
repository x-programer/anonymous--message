'use client';

import { useSession, signIn, signOut } from "next-auth/react";

export default function Component() {
  const { data: session } = useSession();
  if (session) {
    return (
      <>
        Signed in as {session.user.email} <br />
        <button onClick={() => signOut()}>Sign out</button>
      </>
    );
  }
  return (
    <>
      Not signed in <br />
      <button className="bg-transparent hover:bg-black text-white font-semibold hover:text-white py-2 px-4 border border-white hover:border-transparent rounded-lg" onClick={() => signIn()}>Sign in</button>
    </>
  );
}
