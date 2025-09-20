import React, { type ReactNode } from "react";

import { useMergeRefs } from "../../hooks/useMergeRefs";
import { useOutsidePointerDown } from "../../hooks/useOutsidePointerDown";
import { polymorphicForwardRef } from "../../types/polymorphicForwardRef";
import { Slot } from "./Slot";

interface OutsidePointerDownHandlerProps {
  children: ReactNode;
  onPointerDown: (targetElement: HTMLElement) => void;
  excludeRefs?: React.RefObject<HTMLElement>[];
  asChild?: boolean;
}

const OUTSIDE_POINTER_DOWN_HANDLER_ERROR_MESSAGE =
  "OutsidePointerDownHandler는 asChild가 true일 경우 children으로 유효한 React 요소만을 허용합니다. 또한, 단일 요소만 허용합니다.";

export const OutsidePointerDownHandler = polymorphicForwardRef<
  "div",
  OutsidePointerDownHandlerProps
>(
  (
    {
      children,
      as = "div",
      asChild = false,
      onPointerDown,
      excludeRefs = [],
      ...props
    },
    ref
  ) => {
    const { ref: targetRef } = useOutsidePointerDown<HTMLElement>(
      onPointerDown,
      {
        excludeRefs,
      }
    );

    const Wrapper = asChild ? Slot : as;

    if (asChild && !React.isValidElement(children)) {
      throw new Error(OUTSIDE_POINTER_DOWN_HANDLER_ERROR_MESSAGE);
    }

    return (
      <Wrapper ref={useMergeRefs(targetRef, ref)} {...props}>
        {children}
      </Wrapper>
    );
  }
);
