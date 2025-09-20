import { useEffect, useRef } from "react";

interface UseKeyDownOptions {
  keys?: string[];
  when?: boolean;
}

export function useKeyDown(
  onKeyDown: (event: KeyboardEvent) => void,
  options: UseKeyDownOptions = {}
) {
  const { keys, when = true } = options;
  const callbackRef = useRef(onKeyDown);
  callbackRef.current = onKeyDown;

  useEffect(() => {
    if (!when) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (keys && keys.length > 0) {
        if (keys.includes(event.key)) {
          callbackRef.current(event);
        }
        return;
      }
      callbackRef.current(event);
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [when, keys?.join("|")]);
}
