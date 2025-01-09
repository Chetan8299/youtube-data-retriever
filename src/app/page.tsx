"use client";
import { signIn, signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

const Home = () => {
    const router = useRouter();
    const { data: session } = useSession();
    const handleGoogleSignIn = async () => {
        try {
            await signIn("google",{ callbackUrl: "/home" });
            if (session) {
                router.push("/home");
            }
        } catch (error) {
            console.error("Error during sign-in:", error);
        }
    };
   
    const handleSignOut = async () => {
      try {
          await signOut({ callbackUrl: "/home" });
      } catch (error) {
          console.error("Error during sign-out:", error);
      }
  };


    return session ? (
        <div>
            <button onClick={handleSignOut}>Log Out</button>
        </div>
    ) : (
        <div>
            <h1>Welcome to the App</h1>
            <button onClick={handleGoogleSignIn}>Sign in with Google</button>
        </div>
    );
};

export default Home;
