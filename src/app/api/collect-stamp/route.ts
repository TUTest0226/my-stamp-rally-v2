import { NextResponse } from "next/server";
import { GetCommand, PutCommand } from "@aws-sdk/lib-dynamodb";
import { docClient } from "@/lib/dynamodb";
import { getAuthSession } from "@/lib/auth";
import haversine from "haversine-distance";

export async function POST(request: Request) {
  // 1. 認証チェック
  const session = await getAuthSession();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const userId = session.user.id;

  try {
    const body = await request.json();
    const { spotId, latitude, longitude } = body;

    if (!spotId || !latitude || !longitude) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // 2. 観光地情報をDynamoDBから取得
    const getSpotCommand = new GetCommand({
      TableName: process.env.DYNAMODB_TABLE_SPOTS!,
      Key: { id: spotId },
    });
    const { Item: spot } = await docClient.send(getSpotCommand);

    if (!spot) {
      return NextResponse.json({ error: "Spot not found" }, { status: 404 });
    }

    // 3. ユーザーの現在地と観光地の距離を計算
    const userLocation = { latitude, longitude };
    const spotLocation = { latitude: spot.latitude, longitude: spot.longitude };
    const distance = haversine(userLocation, spotLocation); // 距離（メートル）

    // 4. 距離が100m以内でなければエラー
    if (distance > 100) {
      return NextResponse.json(
        {
          error: `遠すぎます。観光地から${Math.round(
            distance
          )}m離れています。100m以内に近づいてください。`,
        },
        { status: 400 }
      );
    }

    // 5. スタンプ情報をDynamoDBに保存
    const putStampCommand = new PutCommand({
      TableName: process.env.DYNAMODB_TABLE_STAMPS!,
      Item: {
        userId: userId,
        spotId: spotId,
        collectedAt: new Date().toISOString(),
        spotName: spot.name, // 後で使いやすいように名前も保存
      },
    });
    await docClient.send(putStampCommand);

    return NextResponse.json({ success: true, spotName: spot.name });
  } catch (error) {
    console.error("Error collecting stamp:", error);
    return NextResponse.json(
      { error: "Failed to collect stamp" },
      { status: 500 }
    );
  }
}