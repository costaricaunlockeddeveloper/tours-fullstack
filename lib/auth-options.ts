import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import { comparePassword } from "@/lib/auth"; // We will keep the password utils in lib/auth.ts

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Invalid credentials");
        }

        await dbConnect();
        const user = await User.findOne({ email: credentials.email }).select("+password");

        if (!user || !user.password) {
          throw new Error("Invalid credentials");
        }

        const isValid = await comparePassword(credentials.password, user.password);

        if (!isValid) {
          throw new Error("Invalid credentials");
        }

        return {
          id: user._id.toString(),
          email: user.email,
          name: user.displayName,
          image: user.photoURL,
          role: user.role,
        };
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === "google") {
        await dbConnect();
        const existingUser = await User.findOne({ email: user.email });

        if (existingUser) {
           // Update existing user info if needed, or just proceed
           return true; 
        } else {
            // Create new user
            await User.create({
                email: user.email,
                displayName: user.name,
                photoURL: user.image,
                role: "client",
                provider: "google",
                // uid field might be redundant relative to _id, but keeping it if other parts depend on it
                uid: user.id // using google profile id as uid fallback?
            });
            return true;
        }
      }
      return true;
    },
    async jwt({ token, user, trigger, session }) {
        if (user) {
            token.role = (user as any).role;
            token.id = user.id;
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
