import { NextResponse } from "next/server";
import { ScanCommand } from "@aws-sdk/lib-dynamodb";
import { docClient } from "@/lib/dynamodb";

// キャッシュを無効化（常に最新のデータを取得するため）
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const command = new ScanCommand({
      TableName: process.env.DYNAMODB_TABLE_SPOTS!,
    });
    const { Items } = await docClient.send(command);
    return NextResponse.json(Items);
  } catch (error) {
    console.error("Error fetching spots:", error);
    return NextResponse.json(
      { error: "Failed to fetch spots" },
      { status: 500 }
    );
  }
}