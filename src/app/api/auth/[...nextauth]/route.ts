import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import { prisma } from '@/lib/prisma';

interface GoogleProfile extends Record<string, unknown> {
  given_name?: string;
  family_name?: string;
}

const handler = NextAuth({
  session: {
    strategy: 'jwt',
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    }),
  ],
  callbacks: {
    async signIn({ account, profile }) {
      console.log("hello ji")
      const googleProfile = profile as GoogleProfile;

      if (!profile?.email || !account?.access_token) {
        console.error('Missing profile email or account access token');
        return false;
      }
      await prisma.user.upsert({
        where: {
          email: profile!.email,
        },
        create: {
          email: profile!.email!,
          name: `${googleProfile.given_name || ''} ${googleProfile.family_name || ''}`.trim(),
          accessToken: account!.access_token
        },
        update: {
          name: `${googleProfile.given_name || ''} ${googleProfile.family_name || ''}`.trim(),
          accessToken: account!.access_token
        },
      })
      console.log("hello ji")
      return true;
    },
      async jwt({ token }) {
      return token;
    },
    async session({ session, token }) {
      if (token.accessToken) {
        session.accessToken = token.accessToken as string;
      }
      return session;
    },
  },
  pages: {
    signIn: '/login',
  },
  secret: process.env.NEXTAUTH_SECRET,
})


export { handler as GET, handler as POST };