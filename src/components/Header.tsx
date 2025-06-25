"use client"; // Client Componentであることを明示

import { useSession, signIn, signOut } from "next-auth/react";
import Link from "next/link";
import styles from "@/styles/Header.module.css";

export default function Header() {
  const { data: session, status } = useSession();
  const isLoading = status === "loading";

  return (
    <header className={styles.header}>
      <Link href="/">
        <h1>スタンプラリー</h1>
      </Link>
      <nav>
        {isLoading ? (
          <div>Loading...</div>
        ) : session ? (
          <>
            <span>{session.user?.email}</span>
            <Link href="/mypage">マイページ</Link>
            <button onClick={() => signOut()}>ログアウト</button>
          </>
        ) : (
          <button onClick={() => signIn("cognito")}>ログイン</button>
        )}
      </nav>
    </header>
  );
}