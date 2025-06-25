import { NextResponse } from "next/server";
import { QueryCommand } from "@aws-sdk/lib-dynamodb";
import { docClient } from "@/lib/dynamodb";
import { getAuthSession } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  const session = await getAuthSession();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const command = new QueryCommand({
      TableName: process.env.DYNAMODB_TABLE_STAMPS!,
      KeyConditionExpression: "userId = :userId",
      ExpressionAttributeValues: {
        ":userId": session.user.id,
      },
    });
    const { Items } = await docClient.send(command);
    return NextResponse.json(Items);
  } catch (error) {
    console.error("Error fetching my stamps:", error);
    return NextResponse.json(
      { error: "Failed to fetch my stamps" },
      { status: 500 }
    );
  }
}