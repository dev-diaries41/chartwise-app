
const TOP_CENTER = 'top-4 left-1/2 -translate-x-1/2';

export const positions = {
  TOP_CENTER: TOP_CENTER,
  TOP_RIGHT: `sm:top-4 sm:right-4 sm:left-auto sm:-translate-x-0 ${TOP_CENTER}`,
  BOTTOM_RIGHT: `sm:bottom-4 sm:right-4 sm:top-auto sm:left-auto sm:-translate-x-0 ${TOP_CENTER}`,
  CENTER: `sm:top-1/2 sm:left-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 ${TOP_CENTER}`,
};