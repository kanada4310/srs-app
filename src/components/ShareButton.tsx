import { Button } from "@mantine/core";
import { useState } from "react";

export default function ShareButton({ deck }: { deck: any }) {
  const [loading, setLoading] = useState(false);

  async function share() {
    if (!deck) return;
    setLoading(true);
    const res = await fetch("/.netlify/functions/share-post", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ deck })
    });
    const { key } = await res.json();
    const url = `${location.origin}/#k=${key}`;
    await navigator.clipboard.writeText(url);
    alert(`共有リンクをコピーしました:\n${url}`);
    setLoading(false);
  }

  return (
    <Button onClick={share} loading={loading} variant="light" size="xs">
      共有リンクをコピー
    </Button>
  );
}
