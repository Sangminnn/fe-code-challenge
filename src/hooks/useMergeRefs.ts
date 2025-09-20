import React, { useCallback } from "react";

const isFunction = (value: unknown): value is Function => typeof value === "function";
const isNil = (value: unknown): value is null | undefined => value == null;

export const mergeRefs = <T = unknown>(...refs: React.Ref<T>[]) => {
  return (node: T) =>
    refs.forEach((ref) => {
      if (isFunction(ref)) {
        ref(node);
      } else if (!isNil(ref)) {
        const refToUse = ref as React.MutableRefObject<T>;
        refToUse.current = node;
      }
    });
};

export function useMergeRefs<T = unknown>(
  ...refs: React.Ref<T>[]
): React.RefCallback<T> {
  // eslint-disable-next-line
  return useCallback(mergeRefs(...refs), refs);
}
