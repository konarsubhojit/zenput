/**
 * Color-mode constants shared between the Vite config (which injects the
 * anti-flash `getColorModeScript` into `index.html`) and the running app
 * (which persists the color mode of the selected theme preset).
 *
 * The `storageKey` must be identical in both places, per the
 * `getColorModeScript` contract.
 */
export const COLOR_MODE_STORAGE_KEY = 'zenput-demo-color-mode';
