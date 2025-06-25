import { DynamoDBClient, DynamoDBClientConfig } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

const config: DynamoDBClientConfig = {
  region: process.env.MY_AWS_REGION,
  credentials: {
    accessKeyId: process.env.MY_AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.MY_AWS_SECRET_ACCESS_KEY!,
  },
};

// // 本番環境(Amplify)以外、つまりローカル環境の場合のみアクセスキーを使う
// if (process.env.NODE_ENV !== 'production') {
//   config.credentials = {
//     accessKeyId: process.env.MY_AWS_ACCESS_KEY_ID!,
//     secretAccessKey: process.env.MY_AWS_SECRET_ACCESS_KEY!,
//   };
// }

const client = new DynamoDBClient(config);
export const docClient = DynamoDBDocumentClient.from(client);