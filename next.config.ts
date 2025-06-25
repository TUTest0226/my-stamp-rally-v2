import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  eslint: {
    // 警告: これにより、ESLintエラーがあっても本番ビルドが成功するようになります。
    ignoreDuringBuilds: true,
  },
  env: {
    // NextAuth.js用
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
    COGNITO_CLIENT_ID: process.env.COGNITO_CLIENT_ID,
    COGNITO_CLIENT_SECRET: process.env.COGNITO_CLIENT_SECRET,
    COGNITO_ISSUER: process.env.COGNITO_ISSUER,

    // AWS SDK (DynamoDB)用
    MY_AWS_REGION: process.env.MY_AWS_REGION,
    MY_AWS_ACCESS_KEY_ID: process.env.MY_AWS_ACCESS_KEY_ID,
    MY_AWS_SECRET_ACCESS_KEY: process.env.MY_AWS_SECRET_ACCESS_KEY,

    // アプリケーション用
    DYNAMODB_TABLE_SPOTS: process.env.DYNAMODB_TABLE_SPOTS,
    DYNAMODB_TABLE_STAMPS: process.env.DYNAMODB_TABLE_STAMPS,
  },
};

export default nextConfig;
