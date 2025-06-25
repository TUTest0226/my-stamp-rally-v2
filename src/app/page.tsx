// console.log("--- STARTING SERVER COMPONENT RENDER CHECK (page.tsx) ---");
// console.log("Render-time - NEXTAUTH_SECRET is set:", !!process.env.NEXTAUTH_SECRET);
// console.log("--- FINISHED SERVER COMPONENT RENDER CHECK ---");

import StampButton from "@/components/StampButton";
import { getAuthSession } from "@/lib/auth";
import styles from "@/styles/Home.module.css";
import { docClient } from "@/lib/dynamodb";
import { ScanCommand, QueryCommand } from "@aws-sdk/lib-dynamodb";

// SpotとStampの型を定義
interface Spot {
  id: string;
  name: string;
  description: string;
}
interface Stamp {
  spotId: string;
}

// データを取得する関数
async function getSpotsAndStamps() {
  const session = await getAuthSession();
  
  // 観光地一覧を取得
  const spotsCommand = new ScanCommand({
    TableName: process.env.DYNAMODB_TABLE_SPOTS!,
  });
  const { Items: spots = [] } = await docClient.send(spotsCommand);

  let collectedSpotIds = new Set<string>();
  if (session?.user?.id) {
    // ログインしている場合、取得済みスタンプ一覧を取得
    const stampsCommand = new QueryCommand({
      TableName: process.env.DYNAMODB_TABLE_STAMPS!,
      KeyConditionExpression: "userId = :userId",
      ExpressionAttributeValues: { ":userId": session.user.id },
    });
    const { Items: stamps = [] } = await docClient.send(stampsCommand);
    collectedSpotIds = new Set(stamps.map(stamp => stamp.spotId));
  }
  
  return { spots: spots as Spot[], collectedSpotIds };
}

export default async function HomePage() {
  const { spots, collectedSpotIds } = await getSpotsAndStamps();

  return (
    <div className={styles.container}>
      <h2>観光地一覧</h2>
      <div className={styles.spotList}>
        {spots.map((spot) => (
          <div key={spot.id} className={styles.spotCard}>
            <h3>{spot.name}</h3>
            <p>{spot.description}</p>
            <StampButton
              spotId={spot.id}
              spotName={spot.name}
              isCollected={collectedSpotIds.has(spot.id)}
            />
          </div>
        ))}
      </div>
    </div>
  );
}