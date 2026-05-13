// Fallback for using MaterialIcons on Android and web.

import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { SymbolWeight, SymbolViewProps } from 'expo-symbols';
import { ComponentProps } from 'react';
import { OpaqueColorValue, type StyleProp, type TextStyle } from 'react-native';

type IconMapping = Record<string, ComponentProps<typeof MaterialIcons>['name']>;

type IconSymbolName = keyof typeof MAPPING;

/**
 * Add your SF Symbols to Material Icons mappings here.
 * - see Material Icons in the [Icons Directory](https://icons.expo.fyi).
 * - see SF Symbols in the [SF Symbols](https://developer.apple.com/sf-symbols/) app.
 */
const MAPPING = {
  'house.fill': 'home',
  'paperplane.fill': 'send',
  'chevron.left.forwardslash.chevron.right': 'code',
  'chevron.right': 'chevron-right',
  'chevron.left': 'chevron-left',
  'heart.fill': 'favorite',
  'heart': 'favorite-border',
  'calendar.fill': 'event',
  'person.fill': 'person',
  'magnifyingglass': 'search',
  'lock.fill': 'lock',
  'apple.logo': 'smartphone',
  'google.logo': 'mail',
  'beach-access': 'beach-access',
  'terrain': 'terrain',
  'location-city': 'location-city',
  'park': 'park',
  'wb-sunny': 'wb-sunny',
  'notifications': 'notifications',
  'tune': 'tune',
  'location-on': 'location-on',
  'star': 'star',
  'calendar-today': 'calendar-today',
  'edit': 'edit',
  'person': 'person',
  'person-outline': 'person-outline',
  'security': 'security',
  'notifications-none': 'notifications-none',
  'dark-mode': 'dark-mode',
  'help-outline': 'help-outline',
  'logout': 'logout',
  'history': 'history',
  'clock': 'access-time',
  'payments': 'payments',
} satisfies Record<string, ComponentProps<typeof MaterialIcons>['name']>;







/**
 * An icon component that uses native SF Symbols on iOS, and Material Icons on Android and web.
 * This ensures a consistent look across platforms, and optimal resource usage.
 * Icon `name`s are based on SF Symbols and require manual mapping to Material Icons.
 */
export function IconSymbol({
  name,
  size = 24,
  color,
  style,
}: {
  name: IconSymbolName;
  size?: number;
  color: string | OpaqueColorValue;
  style?: StyleProp<TextStyle>;
  weight?: SymbolWeight;
}) {
  return <MaterialIcons color={color} size={size} name={MAPPING[name]} style={style} />;
}
