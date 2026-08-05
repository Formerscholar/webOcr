import { useState } from "react";
import { useWebOcr } from "./useWebOcr";

export function OcrDemo() {
  const { ready, provider, progress, error, recognize } = useWebOcr();
  const [text, setText] = useState("");
  const [busy, setBusy] = useState(false);

  return (
    <div>
      <p>
        {error
          ? `错误：${error}`
          : ready
            ? `就绪 · ${provider}`
            : progress
              ? `${progress.message} (${progress.percent}%)`
              : "加载中…"}
      </p>
      <input
        type="file"
        accept="image/*"
        disabled={!ready || busy}
        onChange={async (e) => {
          const file = e.target.files?.[0];
          if (!file) return;
          setBusy(true);
          try {
            const result = await recognize(file);
            setText(result.lines.map((l) => l.text).join("\n"));
          } finally {
            setBusy(false);
          }
        }}
      />
      <pre>{text}</pre>
    </div>
  );
}
