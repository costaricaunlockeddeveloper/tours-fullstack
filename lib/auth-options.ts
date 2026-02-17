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
        try {
          await dbConnect();
          const existingUser = await User.findOne({ email: user.email });

          if (existingUser) {
            return true;
          } else {
            try {
              await User.create({
                email: user.email,
                displayName: user.name,
                photoURL: user.image,
                role: "client",
                provider: "google",
                uid: user.id
              });
              return true;
            } catch (createError: any) {
              // Handle race condition: if user was created between findOne and create
              if (createError.code === 11000) {
                return true;
              }
              console.error("Error creating user in signIn:", createError);
              return false;
            }
          }
        } catch (error) {
          console.error("Error in signIn callback:", error);
          return false;
        }
      }
      return true;
    },
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id;

        try {
          await dbConnect();
          const dbUser = await User.findOne({ email: user.email });
          if (dbUser) {
            token.role = dbUser.role;
            token.id = dbUser._id.toString();
          }
        } catch (error) {
          console.error("Error in JWT callback:", error);
        }
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
