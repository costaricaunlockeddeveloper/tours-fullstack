import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === "google") {
        await dbConnect();
        const existingUser = await User.findOne({ email: user.email });

        if (existingUser) {
           // Attach the role from the DB to the user object so jwt callback can read it
           (user as any).role = existingUser.role;
           (user as any).id = existingUser._id.toString();
           return true; 
        } else {
            const newUser = await User.create({
                email: user.email,
                displayName: user.name,
                photoURL: user.image,
                role: "client",
                provider: "google",
                uid: user.id
            });
            (user as any).role = "client";
            (user as any).id = newUser._id.toString();
            return true;
        }
      }
      return true;
    },
    async jwt({ token, user }) {
        if (user) {
            token.role = (user as any).role;
            token.id = (user as any).id;
        }
        return token;
    },
    async session({ session, token }) {
        if (session.user) {
            (session.user as any).role = token.role;
            (session.user as any).id = token.id;
        }
        return session;
    }
  },
  pages: {
    signIn: "/sign-in",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
};
