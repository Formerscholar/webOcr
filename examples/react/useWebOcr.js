/**
 * React Hook
 *
 * npm i webocr
 * vite.config → plugins: [webocr()]
 */
import { useEffect, useRef, useState } from "react";
import { createWebOcr } from "webocr";

export function useWebOcr() {
  const ocrRef = useRef(null);
  const [ready, setReady] = useState(false);
  const [provider, setProvider] = useState("");
  const [progress, setProgress] = useState(null);
  const [error, setError] = useState(null);

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

  async function recognize(input) {
    if (!ocrRef.current) throw new Error("OCR 未就绪");
    return ocrRef.current.recognize(input);
  }

  return { ready, provider, progress, error, recognize };
}
