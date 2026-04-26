/**
 * Shared floating-element position computation used by Popover, Tooltip, Menu,
 * and the imperative PopoverProvider. Calculates absolute `top`/`left`
 * coordinates (in viewport / fixed-position space) for a floating element
 * anchored to a trigger rect.
 */

export type OverlaySide = 'top' | 'bottom' | 'left' | 'right';
export type OverlayAlign = 'start' | 'center' | 'end';

/**
 * Compute absolute `top`/`left` from the trigger rect, content rect, side,
 * and alignment. Returns viewport-space coordinates suitable for
 * `position: fixed` elements.
 *
 * @param trigger   - Bounding rect of the anchor / trigger element.
 * @param content   - Bounding rect of the floating content element.
 * @param side      - Preferred side relative to the trigger.
 * @param align     - Alignment along the perpendicular axis.
 * @param sideOffset  - Gap (px) between trigger and content along the main axis.
 * @param alignOffset - Offset (px) along the alignment axis. Default: `0`.
 */
export function computePosition(
  trigger: DOMRect,
  content: DOMRect,
  side: OverlaySide,
  align: OverlayAlign,
  sideOffset: number,
  alignOffset = 0
): { top: number; left: number } {
  let top = 0;
  let left = 0;

  if (side === 'top' || side === 'bottom') {
    top = side === 'top' ? trigger.top - content.height - sideOffset : trigger.bottom + sideOffset;
    if (align === 'start') left = trigger.left + alignOffset;
    else if (align === 'end') left = trigger.right - content.width - alignOffset;
    else left = trigger.left + trigger.width / 2 - content.width / 2 + alignOffset;
  } else {
    left = side === 'left' ? trigger.left - content.width - sideOffset : trigger.right + sideOffset;
    if (align === 'start') top = trigger.top + alignOffset;
    else if (align === 'end') top = trigger.bottom - content.height - alignOffset;
    else top = trigger.top + trigger.height / 2 - content.height / 2 + alignOffset;
  }

  // Clamp to viewport to avoid overflow.
  const vw = typeof window !== 'undefined' ? window.innerWidth : 0;
  const vh = typeof window !== 'undefined' ? window.innerHeight : 0;
  left = Math.max(4, Math.min(left, vw - content.width - 4));
  top = Math.max(4, Math.min(top, vh - content.height - 4));

  return { top, left };
}
