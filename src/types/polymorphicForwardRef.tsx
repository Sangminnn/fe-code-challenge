import {
  forwardRef,
  Fragment,
  type ComponentProps,
  type ComponentPropsWithRef,
  type ElementType,
  type ForwardRefExoticComponent,
  type ForwardRefRenderFunction,
  type ReactElement,
} from "react";

type DistributiveOmit<T, K extends PropertyKey> = T extends any
  ? Omit<T, K>
  : never;

type Merge<A, B> = Omit<A, keyof B> & B;

type DistributiveMerge<A, B> = DistributiveOmit<A, keyof B> & B;

export type AsProps<
  Component extends ElementType,
  PermanentProps extends Record<string, any>,
  ComponentProps extends Record<string, any>,
> = DistributiveMerge<ComponentProps, PermanentProps & { as?: Component }>;

export type PolymorphicWithRef<
  Default extends OnlyAs,
  Props extends Record<string, any>,
  OnlyAs extends ElementType = ElementType,
> = <T extends OnlyAs = Default>(
  props: AsProps<
    T,
    Props,
    T extends ElementType
      ? ComponentPropsWithRef<T>
      : ComponentProps<typeof Fragment>
  >
) => ReactElement | null;

export type PolyForwardComponent<
  Default extends OnlyAs,
  Props extends Record<string, any>,
  OnlyAs extends ElementType = ElementType,
> = Merge<
  ForwardRefExoticComponent<
    Merge<
      Default extends ElementType
        ? ComponentPropsWithRef<Default>
        : ComponentProps<typeof Fragment>,
      Props & { as?: Default }
    >
  >,
  PolymorphicWithRef<Default, Props, OnlyAs>
>;

export type PolyRefFunction = <
  Default extends OnlyAs,
  Props extends Record<string, any>,
  OnlyAs extends ElementType = ElementType,
>(
  Component: ForwardRefRenderFunction<any, Props & { as?: OnlyAs }>
) => PolyForwardComponent<Default, Props, OnlyAs>;
export const polymorphicForwardRef = forwardRef as PolyRefFunction;
