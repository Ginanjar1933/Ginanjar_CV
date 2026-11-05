import Animated, { FadeInDown } from 'react-native-reanimated';

export default function Reveal({ children, index = 0 }) {
  return (
    <Animated.View
      entering={FadeInDown.delay(index * 120).springify().damping(14)}
    >
      {children}
    </Animated.View>
  );
}