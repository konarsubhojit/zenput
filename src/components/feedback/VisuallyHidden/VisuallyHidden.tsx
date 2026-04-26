import React from 'react';

const style: React.CSSProperties = {
  position: 'absolute',
  width: '1px',
  height: '1px',
  padding: 0,
  margin: '-1px',
  overflow: 'hidden',
  clip: 'rect(0, 0, 0, 0)',
  whiteSpace: 'nowrap',
  border: 0,
};

/**
 * Visually hides content while keeping it accessible to screen readers.
 */
export function VisuallyHidden({
  children,
  as: Tag = 'span',
  ...rest
}: {
  children: React.ReactNode;
  as?: React.ElementType;
} & React.HTMLAttributes<HTMLElement>): React.ReactElement {
  return (
    <Tag style={style} {...rest}>
      {children}
    </Tag>
  );
}
