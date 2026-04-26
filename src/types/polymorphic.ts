import React from 'react';

/** Shared size vocabulary across the library. */
export type Size = 'sm' | 'md' | 'lg';

/** Shared semantic tone used by alerts, badges, buttons, etc. */
export type Tone = 'neutral' | 'brand' | 'success' | 'warning' | 'danger' | 'info';

/**
 * Polymorphic-component helpers.
 *
 * Components using these can accept an `as` prop and forward-ref to the
 * underlying rendered element while still exposing the correct props
 * for that element type.
 */
export type AsProp<C extends React.ElementType> = {
  /** Element type to render. */
  as?: C;
};

/** Enables the Radix-style `asChild` pattern (clones and merges props onto a single child). */
export type AsChildProp = {
  /**
   * When `true`, merges the component's props onto its single child element
   * instead of rendering an extra DOM node. Useful for routing integrations:
   * ```tsx
   * <Button asChild><NextLink href="/x">Go</NextLink></Button>
   * ```
   */
  asChild?: boolean;
};

type PropsToOmit<C extends React.ElementType, P> = keyof (AsProp<C> & P);

export type PolymorphicProps<C extends React.ElementType, Props = object> = React.PropsWithChildren<
  Props & AsProp<C> & AsChildProp
> &
  Omit<React.ComponentPropsWithoutRef<C>, PropsToOmit<C, Props>>;

export type PolymorphicRef<C extends React.ElementType> = React.ComponentPropsWithRef<C>['ref'];

export type PolymorphicPropsWithRef<C extends React.ElementType, Props = object> = PolymorphicProps<
  C,
  Props
> & { ref?: PolymorphicRef<C> };

