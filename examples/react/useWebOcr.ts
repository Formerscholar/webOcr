/**
 * React Hook 示例
 *
 * npm i webocr
 * vite.config.js / vite.config.ts → import { webocr } from 'webocr/vite'; plugins: [webocr()]
 * 模型 / 字典 / wasm 已打在包内，默认走 /webocr/
 */
import { useEffect, useRef, useState } from "react";
import { createWebOcr, type OcrProgress, type OcrResult, type WebOcr } from "webocr";

export function useWebOcr() {
  const ocrRef = useRef<WebOcr | null>(null);
  const [ready, setReady] = useState(false);
  const [provider, setProvider] = useState("");
  const [progress, setProgress] = useState<OcrProgress | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const ocr = await createWebOcr({
          onProgress: (p) => {
            if (!cancelled) setProgress(p);
          },
        });
        if (cancelled) {
          ocr.dispose();
          return;
        }
        ocrRef.current = ocr;
        setProvider(ocr.executionProvider);
        setReady(true);
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : String(err));
        }
      }
    })();

    return () => {
      cancelled = true;
      ocrRef.current?.dispose();
      ocrRef.current = null;
    };
  }, []);

  async function recognize(input: File | Blob): Promise<OcrResult> {
    if (!ocrRef.current) throw new Error("OCR 未就绪");
    return ocrRef.current.recognize(input);
  }

  return { ready, provider, progress, error, recognize };
}
