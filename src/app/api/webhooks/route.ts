import { NextApiRequest, NextApiResponse } from "next";
import {
  createUserFromClerk,
  deleteUserFromClerk,
} from "@/server/db/userQueries";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const clerkData = await req.json();

  console.log(
    JSON.stringify({
      level: "info",
      message: "Webhook received",
      body: clerkData,
    })
  );

  if (clerkData.type === "user.deleted") {
    try {
      await deleteUserFromClerk(clerkData.data.id);
      console.log(`User deleted successfully: ${clerkData.data.id}`);
      return NextResponse.json({
        success: true,
        message: "User deleted successfully",
      });
    } catch (error) {
      console.error(`Error in deleting user: ${error}`);
      return NextResponse.json({
        success: false,
        message: "Error in deleting user",
      });
    }
  }

  if (!clerkData.data || !Array.isArray(clerkData.data.email_addresses)) {
    console.error(
      JSON.stringify({
        level: "error",
        message: "Invalid clerk data",
        clerkData: clerkData,
      })
    );
    return NextResponse.json({ error: "Invalid clerk data" });
  }

  const primaryEmailObj = clerkData.data.email_addresses.find(
    (emailObj: { id: string }) =>
      emailObj.id === clerkData.data.primary_email_address_id
  );

  if (!primaryEmailObj) {
    console.error(
      JSON.stringify({
        level: "error",
        message: "Primary email object not found in clerk data",
        clerkData: clerkData,
      })
    );
    return NextResponse.json({ error: "Primary email object not found" });
  }

  const userData = {
    email: primaryEmailObj.email_address,
    name: clerkData.data.username || "Default Name",
    clerkUserId: clerkData.data.id,
  };

  console.log("User data to be inserted:", userData);

  try {
    const newUser = await createUserFromClerk(userData);
    console.log(
      JSON.stringify({
        level: "info",
        message: "User created successfully",
        userId: newUser.id,
      })
    );
    return NextResponse.json({
      success: true,
      message: "User created successfully",
    });
  } catch (error: any) {
    console.error(
      JSON.stringify({
        level: "error",
        message: "Error in processing webhook",
        error: {
          message: error.message,
          stack: error.stack,
        },
        clerkUserId: userData.clerkUserId,
      })
    );
    return NextResponse.json({ success: false, message: error.message });
  }
}
