import { useEffect, useRef } from "react";

interface UseFocusTrapOptions {
  /**
   * 포커스 트랩이 활성화될 조건
   */
  enabled: boolean;
  /**
   * 모달이 열릴 때 포커스할 요소의 ref
   */
  initialFocusRef?: React.RefObject<HTMLElement | null>;
  /**
   * 포커스 트랩을 적용할 컨테이너 요소의 ref
   */
  containerRef: React.RefObject<HTMLElement | null>;
  /**
   * 스크롤 잠금 여부 (기본값: true)
   */
  lockScroll?: boolean;
  /**
   * 초기 포커스 지연 시간 (ms, 기본값: 100)
   */
  initialFocusDelay?: number;
}

/**
 * 모달이나 다이얼로그에서 포커스를 트랩하는 훅
 * Tab/Shift+Tab 키로 포커스가 컨테이너 내부에서만 순환하도록 함
 */
export function useFocusTrap({
  enabled,
  initialFocusRef,
  containerRef,
  lockScroll = true,
  initialFocusDelay = 100,
}: UseFocusTrapOptions) {
  const focusableElementsQuery = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Tab 키가 아니거나 비활성화되었거나 컨테이너가 없으면 무시
      if (event.key !== "Tab" || !enabled || !containerRef.current) {
        return;
      }

      const focusableElements = containerRef.current.querySelectorAll(focusableElementsQuery);
      const firstElement = focusableElements[0] as HTMLElement;
      const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

      if (event.shiftKey) {
        // Shift + Tab (역방향)
        if (document.activeElement === firstElement) {
          lastElement?.focus();
          event.preventDefault();
        }
      } else {
        // Tab (순방향)
        if (document.activeElement === lastElement) {
          firstElement?.focus();
          event.preventDefault();
        }
      }
    };

    if (enabled) {
      document.addEventListener("keydown", handleKeyDown);
      
      // 스크롤 잠금
      if (lockScroll) {
        document.body.style.overflow = "hidden";
      }

      // 초기 포커스 설정
      if (initialFocusRef?.current) {
        const timer = setTimeout(() => {
          initialFocusRef.current?.focus();
        }, initialFocusDelay);
        
        return () => {
          clearTimeout(timer);
          document.removeEventListener("keydown", handleKeyDown);
          if (lockScroll) {
            document.body.style.overflow = "auto";
          }
        };
      }
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      if (lockScroll) {
        document.body.style.overflow = "auto";
      }
    };
  }, [enabled, initialFocusRef, containerRef, lockScroll, initialFocusDelay]);
}