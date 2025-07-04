import { Button } from "@mantine/core";
import { useState } from "react";

export default function ShareButton({ deck }: { deck: any }) {
  const [loading, setLoading] = useState(false);

  async function share() {
    if (!deck) return;
    setLoading(true);
    try {
      const res = await fetch("/.netlify/functions/share-post", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ deck }),
      });

      if (!res.ok) {
        const errorData = await res.text();
        throw new Error(
          `Server error: ${res.status} ${res.statusText} - ${errorData}`
        );
      }

      const { key } = await res.json();
      const url = `${location.origin}/k/${key}`; // ← # を外し /k/ に
      await navigator.clipboard.writeText(url);
      alert(`共有リンクをコピーしました:\n${url}`);
    } catch (error: any) {
      console.error("Error sharing deck:", error);
      alert(`共有に失敗しました: ${error.message || "不明なエラー"}`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Button onClick={share} loading={loading} variant="light" size="xs">
      共有リンクをコピー
    </Button>
  );
}
