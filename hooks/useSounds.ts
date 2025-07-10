// Simplified sound hook that does nothing
export function useSounds() {
  return {
    playButtonSound: () => {},
    playSuccessSound: () => {},
    playErrorSound: () => {},
    playDeleteSound: () => {},
    playStartupSound: () => {},
    playBackgroundMusic: () => {},
    stopBackgroundMusic: () => {},
  };
}