"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface Props {
  spotId: string;
  spotName: string;
  isCollected: boolean; // すでに取得済みかどうかのフラグ
}

export default function StampButton({ spotId, spotName, isCollected }: Props) {
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleCollect = () => {
    setIsLoading(true);
    setMessage("位置情報を取得中...");

    // 1. ブラウザで現在位置を取得
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        setMessage("スタンプをサーバーに送信中...");

        // 2. スタンプ取得APIを叩く
        try {
          const res = await fetch("/api/collect-stamp", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ spotId, latitude, longitude }),
          });

          const data = await res.json();

          if (res.ok) {
            setMessage(`「${data.spotName}」のスタンプをゲットしました！🎉`);
            router.refresh(); // サーバーから最新の情報を再取得して画面を更新
          } else {
            setMessage(`エラー: ${data.error}`);
          }
        } catch (error) {
          setMessage("通信エラーが発生しました。");
        } finally {
          setIsLoading(false);
        }
      },
      (error) => {
        // 位置情報取得失敗時の処理
        setMessage(`位置情報の取得に失敗しました: ${error.message}`);
        setIsLoading(false);
      }
    );
  };

  return (
    <div>
      {isCollected ? (
        <p className="collected">取得済み</p>
      ) : (
        <button onClick={handleCollect} disabled={isLoading}>
          {isLoading ? "処理中..." : "スタンプをゲット"}
        </button>
      )}
      {message && <p className="message">{message}</p>}
      <style jsx>{`
        .collected { color: green; font-weight: bold; }
        .message { font-size: 0.9rem; margin-top: 0.5rem; }
      `}</style>
    </div>
  );
}