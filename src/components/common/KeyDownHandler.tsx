import { type ReactNode } from "react";
import { useKeyDown } from "../../hooks/useKeyDown";
import { polymorphicForwardRef } from "../../types/polymorphicForwardRef";
import { Slot } from "./Slot";

interface KeyDownHandlerProps {
  children: ReactNode;
  onKeyDown: (event: KeyboardEvent) => void;
  keys?: string[];
  when?: boolean;
  asChild?: boolean;
}

export const KeyDownHandler = polymorphicForwardRef<"div", KeyDownHandlerProps>(
  (
    {
      children,
      as = "div",
      asChild = false,
      onKeyDown,
      keys,
      when = true,
      ...props
    },
    ref
  ) => {
    useKeyDown(onKeyDown, { keys, when });

    const Wrapper = asChild ? Slot : as;
    return (
      <Wrapper ref={ref} {...props}>
        {children}
      </Wrapper>
    );
  }
);
