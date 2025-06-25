import { getAuthSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { QueryCommand } from "@aws-sdk/lib-dynamodb";
import { docClient } from "@/lib/dynamodb";
import styles from "@/styles/MyPage.module.css";

interface Stamp {
  spotId: string;
  spotName: string;
  collectedAt: string;
}

async function getMyStamps(userId: string) {
  const command = new QueryCommand({
    TableName: process.env.DYNAMODB_TABLE_STAMPS!,
    KeyConditionExpression: "userId = :userId",
    ExpressionAttributeValues: { ":userId": userId },
  });
  const { Items } = await docClient.send(command);
  // 日付の新しい順にソート
  return (Items as Stamp[]).sort((a, b) => new Date(b.collectedAt).getTime() - new Date(a.collectedAt).getTime());
}

export default async function MyPage() {
  const session = await getAuthSession();

  // ログインしていなければホームページにリダイレクト
  if (!session?.user?.id) {
    redirect("/");
  }

  const myStamps = await getMyStamps(session.user.id);

  return (
    <div className={styles.container}>
      <h2>マイページ</h2>
      <p>{session.user.email} さんのスタンプ取得状況</p>
      
      {myStamps.length === 0 ? (
        <p>まだスタンプはありません。観光地を巡ってスタンプを集めよう！</p>
      ) : (
        <ul className={styles.stampList}>
          {myStamps.map((stamp) => (
            <li key={stamp.spotId} className={styles.stampItem}>
              <h3>{stamp.spotName}</h3>
              <p>取得日: {new Date(stamp.collectedAt).toLocaleString('ja-JP')}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}