// Utility function to convert deprecated shadow props to boxShadow
export const createBoxShadow = (
  shadowColor: string = '#000',
  shadowOffset: { width: number; height: number } = { width: 0, height: 0 },
  shadowOpacity: number = 0.25,
  shadowRadius: number = 0
) => {
  const { width, height } = shadowOffset;
  return {
    boxShadow: `${width}px ${height}px ${shadowRadius}px ${shadowColor}${Math.round(shadowOpacity * 255).toString(16).padStart(2, '0')}`,
  };
};

// Alternative for React Native - keep elevation for Android and use shadow props for iOS
export const createShadow = (
  shadowColor: string = '#000',
  shadowOffset: { width: number; height: number } = { width: 0, height: 0 },
  shadowOpacity: number = 0.25,
  shadowRadius: number = 0,
  elevation: number = 0
) => {
  return {
    shadowColor,
    shadowOffset,
    shadowOpacity,
    shadowRadius,
    elevation: elevation || shadowRadius,
  };
}; 