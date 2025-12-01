import { Pressable, PressableProps } from 'react-native';
import * as Haptics from 'expo-haptics';

export function HapticTab(
  props: PressableProps & { onPressIn?: (ev: any) => void; children?: React.ReactNode },
) {
  return (
    <Pressable
      {...props}
      onPressIn={(ev) => {
        if (process.env.EXPO_OS === 'ios') {
          // Add a soft haptic feedback when pressing down on the tabs.
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }
        props.onPressIn?.(ev);
      }}
    >
      {props.children}
    </Pressable>
  );
}
