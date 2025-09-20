import React, { useRef, useEffect, useCallback } from "react";

export function useOutsidePointerDown<T extends HTMLElement>(
  callback: (targetElement: T) => void,
  options?: { excludeRefs: React.RefObject<HTMLElement>[] }
): { ref: React.RefObject<T> } {
  const { excludeRefs } = options ?? {};
  const targetRef = useRef<T>(null);

  const handleOutsidePointerDown = useCallback((event: MouseEvent | TouchEvent) => {
    if (!targetRef.current) return;
    
    const target = event.target as Node | null;
    if (!target) return;
    
    const targetElement = targetRef.current;

    const isInExcluded = excludeRefs?.some(
      (excludeRef) => excludeRef.current?.contains(target)
    );

    if (!targetElement.contains(target) && !isInExcluded) {
      callback(targetElement);
    }
  }, [callback, excludeRefs]);

  useEffect(() => {
    document.addEventListener("mousedown", handleOutsidePointerDown);
    document.addEventListener("touchstart", handleOutsidePointerDown);

    return () => {
      document.removeEventListener("mousedown", handleOutsidePointerDown);
      document.removeEventListener("touchstart", handleOutsidePointerDown);
    };
  }, [handleOutsidePointerDown]);

  return { ref: targetRef };
}
