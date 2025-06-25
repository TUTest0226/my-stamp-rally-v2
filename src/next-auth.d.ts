import { DefaultSession } from "next-auth";

// next-authモジュールの型定義を拡張
declare module "next-auth" {
  /**
   * `session`コールバックから返されるセッションオブジェクトの型。
   * デフォルトの型にプロパティを追加します。
   */
  interface Session {
    user: {
      /** ユーザーの一意なID */
      id: string;
    } & DefaultSession["user"]; // 元のプロパティ(name, email, image)も継承
  }
}