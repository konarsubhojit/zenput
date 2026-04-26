import React, { forwardRef } from 'react';
import { classNames } from '../../utils';
import { Slot } from '../../utils/slot';
import type { PolymorphicProps, PolymorphicRef } from '../../types/polymorphic';
import styles from './Typography.module.css';

export interface LinkOwnProps {
  /** Open the link in a new tab (adds `rel="noopener noreferrer"`). */
  external?: boolean;
  className?: string;
}

type LinkComponent = <C extends React.ElementType = 'a'>(
  props: PolymorphicProps<C, LinkOwnProps> & { ref?: PolymorphicRef<C> }
) => React.ReactElement | null;

/**
 * Styled anchor primitive. Use for navigation and inline links. For
 * button-like actions prefer `<Button>`. Polymorphic via `as`/`asChild`.
 */
export const Link = forwardRef(function Link(
  {
    as,
    asChild,
    external,
    className,
    children,
    target,
    rel,
    ...rest
  }: PolymorphicProps<React.ElementType, LinkOwnProps> & {
    target?: string;
    rel?: string;
  },
  ref: React.ForwardedRef<Element>
) {
  const Component: React.ElementType = asChild ? Slot : (as ?? 'a');
  const resolvedTarget = external ? '_blank' : target;
  const resolvedRel =
    resolvedTarget === '_blank' ? [rel, 'noopener', 'noreferrer'].filter(Boolean).join(' ') : rel;
  return (
    <Component
      ref={ref}
      className={classNames(styles.link, className)}
      target={resolvedTarget}
      rel={resolvedRel}
      {...rest}
    >
      {children}
    </Component>
  );
}) as unknown as LinkComponent & { displayName?: string };

(Link as { displayName?: string }).displayName = 'Link';

/** @deprecated Use `LinkOwnProps` or the component's inferred props instead. */
export type LinkProps = PolymorphicProps<'a', LinkOwnProps>;
