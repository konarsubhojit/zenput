import React, { forwardRef } from 'react';
import { classNames } from '../../../utils';
import type {
  PolymorphicProps,
  PolymorphicRef,
} from '../../../types/polymorphic';
import type { SpacingValue } from '../Box/Box';
import styles from './Stack.module.css';

export type StackDirection = 'row' | 'column';
export type StackAlign = 'start' | 'center' | 'end' | 'stretch' | 'baseline';
export type StackJustify =
  | 'start'
  | 'center'
  | 'end'
  | 'between'
  | 'around'
  | 'evenly';

const alignMap: Record<StackAlign, React.CSSProperties['alignItems']> = {
  start: 'flex-start',
  center: 'center',
  end: 'flex-end',
  stretch: 'stretch',
  baseline: 'baseline',
};

const justifyMap: Record<StackJustify, React.CSSProperties['justifyContent']> = {
  start: 'flex-start',
  center: 'center',
  end: 'flex-end',
  between: 'space-between',
  around: 'space-around',
  evenly: 'space-evenly',
};

export interface StackOwnProps {
  /** Flex direction. Default: `'column'`. */
  direction?: StackDirection;
  /** Gap between children (spacing token). Default: `'2'`. */
  gap?: SpacingValue;
  /** align-items. */
  align?: StackAlign;
  /** justify-content. */
  justify?: StackJustify;
  /** Allow items to wrap. */
  wrap?: boolean;
  /** Width: 100%. */
  fullWidth?: boolean;
  style?: React.CSSProperties;
  className?: string;
}

type StackComponent = <C extends React.ElementType = 'div'>(
  props: PolymorphicProps<C, StackOwnProps> & { ref?: PolymorphicRef<C> }
) => React.ReactElement | null;

/**
 * Flex container with a `gap`. Use `HStack` / `VStack` as convenient
 * aliases. Polymorphic via `as`.
 */
export const Stack = forwardRef(function Stack(
  {
    as,
    direction = 'column',
    gap = '2',
    align,
    justify,
    wrap,
    fullWidth,
    style,
    className,
    children,
    ...rest
  }: PolymorphicProps<React.ElementType, StackOwnProps>,
  ref: React.ForwardedRef<Element>
) {
  const Component = (as ?? 'div') as React.ElementType;
  const resolvedStyle: React.CSSProperties = {
    flexDirection: direction,
    gap: `var(--zp-space-${gap})`,
    alignItems: align ? alignMap[align] : undefined,
    justifyContent: justify ? justifyMap[justify] : undefined,
    ...style,
  };
  return (
    <Component
      ref={ref}
      className={classNames(
        styles.stack,
        wrap ? styles.wrap : undefined,
        fullWidth ? styles.fullWidth : undefined,
        className
      )}
      style={resolvedStyle}
      {...rest}
    >
      {children}
    </Component>
  );
}) as unknown as StackComponent & { displayName?: string };

(Stack as { displayName?: string }).displayName = 'Stack';

/** Horizontal stack — `Stack` with `direction="row"`. */
export const HStack = forwardRef(function HStack(
  props: PolymorphicProps<React.ElementType, StackOwnProps>,
  ref: React.ForwardedRef<Element>
) {
  return <Stack direction="row" ref={ref} {...props} />;
}) as unknown as StackComponent & { displayName?: string };

(HStack as { displayName?: string }).displayName = 'HStack';

/** Vertical stack — `Stack` with `direction="column"` (the default). */
export const VStack = forwardRef(function VStack(
  props: PolymorphicProps<React.ElementType, StackOwnProps>,
  ref: React.ForwardedRef<Element>
) {
  return <Stack direction="column" ref={ref} {...props} />;
}) as unknown as StackComponent & { displayName?: string };

(VStack as { displayName?: string }).displayName = 'VStack';
