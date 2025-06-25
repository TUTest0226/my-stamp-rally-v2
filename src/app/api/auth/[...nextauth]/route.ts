import NextAuth from "next-auth";
import { authOptions } from "../../../../lib/auth"; // 先ほど作成した設定ファイルをインポート

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };