import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import { prisma } from '@/lib/prisma';

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
    async signIn({ user, account, profile }) {
      console.log("hello ji")
      await prisma.user.upsert({
        where: {
          email: profile.email,
        },
        create: {
          email: profile.email,
          name: profile.givenName + " " + profile.familyName,
          accessToken: account.access_token
        },
        update: {
          name: profile.givenName + " " + profile.familyName,
          accessToken: account.access_token
        },
      })
      console.log("hello ji")
      return true;
    },
      async jwt({ token, account }) {
      return token;
    },
    async session({ session, token }) {
      console.log("session", token)
      session.accessToken = token.accessToken;
      return session;
    },
  },
  pages: {
    signIn: '/login',
  }
})


export { handler as GET, handler as POST };