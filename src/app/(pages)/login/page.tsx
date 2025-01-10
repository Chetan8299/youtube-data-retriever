"use client";
import Image from "next/image";
import { signIn, signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

const Home = () => {
    const router = useRouter();
    const { data: session } = useSession();

    const handleGoogleSignIn = async () => {
        try {
            await signIn("google", { callbackUrl: "/home" });
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

    if (session) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-8">
                    <div className="text-center mb-6">
                        <h1 className="text-2xl font-bold text-gray-900 mb-2">
                            Welcome, {session.user?.name}!
                        </h1>
                    </div>
                    <button
                        onClick={handleSignOut}
                        className="w-full py-2.5 px-4 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors duration-200 font-medium flex items-center justify-center gap-2"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 001 1h12a1 1 0 001-1V4a1 1 0 00-1-1H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 6.707 6.293a1 1 0 00-1.414 1.414L8.586 11l-3.293 3.293a1 1 0 101.414 1.414L10 12.414l3.293 3.293a1 1 0 001.414-1.414L11.414 11l3.293-3.293z" clipRule="evenodd" />
                        </svg>
                        Sign Out
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-8">
                <div className="text-center mb-8">
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">
                        Welcome to the App
                    </h1>
                    <p className="text-gray-500">
                        Sign in to access your account
                    </p>
                </div>
                <button
                    onClick={handleGoogleSignIn}
                    className="w-full py-2.5 px-4 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors duration-200 font-medium flex items-center justify-center gap-2"
                >
                    <Image 
                        height={20}
                        width={20}
                        src="https://cdn4.iconfinder.com/data/icons/logos-brands-7/512/google_logo-google_icongoogle-512.png"
                        alt="Google"
                        className="w-5 h-5"
                    />
                    Sign in with Google
                </button>
            </div>
        </div>
    );
};

export default Home;