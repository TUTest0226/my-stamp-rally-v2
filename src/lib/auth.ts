import { getServerSession, NextAuthOptions } from "next-auth";
import CognitoProvider from "next-auth/providers/cognito";

export const authOptions: NextAuthOptions = {
  debug: true,
  providers: [
    CognitoProvider({
      clientId: process.env.COGNITO_CLIENT_ID!,
      // clientSecret: process.env.COGNITO_CLIENT_SECRET!, // 生成していないので実際には使われない
      clientSecret: "",
      issuer: process.env.COGNITO_ISSUER,

      authorization: {
        params: {
          scope: "openid email profile",
        },
      },

      checks: ["pkce", "state"],
    }),
  ],
  // App Routerでは、JWTコールバックで `profile` を使ってカスタム情報を渡す
  callbacks: {
    async jwt({ token, profile }) {
      if (profile) {
        // Cognitoからの `sub` (一意なユーザーID) をトークンに含める
        token.sub = profile.sub;
      }
      return token;
    },
    async session({ session, token }) {
      // セッショントークンにユーザーIDを持たせる
      if (session.user) {
        session.user.id = token.sub!;
      }
      return session;
    },
  },
};

// サーバーサイドコンポーネントでセッション情報を取得するためのヘルパー関数
export const getAuthSession = () => getServerSession(authOptions);