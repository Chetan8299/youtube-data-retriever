"use client";
import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

const Login = () => {
  const router = useRouter();
  const { data: session } = useSession();
  const handleGoogleSignIn = async () => {
    try {
      await signIn('google'); 
      if(session) {
        router.push("/home");
      }
    } catch (error) {
      console.error('Error during sign-in:', error);
    }
  };

  return (
    <div>
      <h1>Welcome to the App</h1>
      <button onClick={handleGoogleSignIn}>Sign in with Google</button>
    </div>
  );
};

export default Login;
