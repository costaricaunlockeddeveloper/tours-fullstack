import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import { signToken } from "@/lib/auth";
import { cookies } from "next/headers";

export async function POST(request: Request) {
  try {
    const { uid, email, displayName, photoURL } = await request.json();

    if (!uid || !email) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    await dbConnect();

    // Upsert logic:
    // If found by UID or Email: updates their info.
    // If not found: creates a new user with default role "client".
    const user = await User.findOneAndUpdate(
      { $or: [{ uid }, { email }] },
      {
        $set: {
          uid,
          email,
          displayName,
          photoURL,
        },
        $setOnInsert: {
          role: "client",
        },
      },
      { upsert: true, returnDocument: 'after', setDefaultsOnInsert: true, runValidators: true }
    );

    // Create a session cookie (same pattern as email/password login)
    // This allows the middleware to verify authentication and role server-side.
    const payload = {
      uid: user._id.toString(),
      firebaseUid: uid,
      email: user.email,
      role: user.role,
      displayName: user.displayName,
    };
    const token = signToken(payload);

    const cookieStore = await cookies();
    cookieStore.set('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/'
    });

    return NextResponse.json(user);
  } catch (error) {
    console.error("Error syncing user:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
