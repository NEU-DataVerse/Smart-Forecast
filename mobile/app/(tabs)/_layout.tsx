import { Tabs, useRouter, usePathname } from 'expo-router';
import { Home, Map, FileText, Bell, User } from 'lucide-react-native';
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import Colors from '@/constants/colors';
import { useAppStore } from '@/store/appStore';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

function ReportButton() {
  const router = useRouter();
  const pathname = usePathname();
  const isActive = pathname === '/report';
  return (
    <TouchableOpacity
      style={styles.reportButton}
      onPress={() => router.push('/report')}
      activeOpacity={0.7}
    >
      <View style={[styles.reportButtonInner, isActive && styles.reportButtonActive]}>
        <FileText color={Colors.background.card} size={28} strokeWidth={2.5} />
      </View>
    </TouchableOpacity>
  );
}

export default function TabLayout() {
  const alerts = useAppStore((state) => state.alerts);
  const unreadCount = alerts.filter((a) => !a.read).length;
  const insets = useSafeAreaInsets();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
      }}
      tabBar={(props) => {
        const { state, descriptors, navigation } = props;

        return (
          <View style={styles.tabBarContainer}>
            <View
              style={[
                styles.tabBar,
                {
                  paddingBottom: 12 + insets.bottom,
                  height: 72 + insets.bottom,
                },
              ]}
            >
              <View style={styles.tabGroup}>
                {state.routes.map((route, index) => {
                  if (!['index', 'map'].includes(route.name)) return null;

                  const { options } = descriptors[route.key];
                  const isFocused = state.index === index;

                  const onPress = () => {
                    const event = navigation.emit({
                      type: 'tabPress',
                      target: route.key,
                      canPreventDefault: true,
                    });

                    if (!isFocused && !event.defaultPrevented) {
                      navigation.navigate(route.name);
                    }
                  };

                  const IconComponent = options.tabBarIcon as any;
                  const color = isFocused ? Colors.primary.blue : Colors.text.light;

                  return (
                    <TouchableOpacity
                      key={route.key}
                      accessibilityRole="button"
                      accessibilityState={isFocused ? { selected: true } : {}}
                      accessibilityLabel={options.tabBarAccessibilityLabel}
                      onPress={onPress}
                      style={styles.tabItem}
                    >
                      {IconComponent && <IconComponent color={color} size={24} />}
                    </TouchableOpacity>
                  );
                })}
              </View>

              <View style={styles.centerSpacer} />

              <View style={styles.tabGroup}>
                {state.routes.map((route, index) => {
                  if (!['alerts', 'profile'].includes(route.name)) return null;

                  const { options } = descriptors[route.key];
                  const isFocused = state.index === index;

                  const onPress = () => {
                    const event = navigation.emit({
                      type: 'tabPress',
                      target: route.key,
                      canPreventDefault: true,
                    });

                    if (!isFocused && !event.defaultPrevented) {
                      navigation.navigate(route.name);
                    }
                  };

                  const IconComponent = options.tabBarIcon as any;
                  const color = isFocused ? Colors.primary.blue : Colors.text.light;
                  const showBadge = route.name === 'alerts' && unreadCount > 0;

                  return (
                    <TouchableOpacity
                      key={route.key}
                      accessibilityRole="button"
                      accessibilityState={isFocused ? { selected: true } : {}}
                      accessibilityLabel={options.tabBarAccessibilityLabel}
                      onPress={onPress}
                      style={styles.tabItem}
                    >
                      <View>
                        {IconComponent && <IconComponent color={color} size={24} />}
                        {showBadge && (
                          <View style={styles.tabBadge}>
                            <Text style={styles.tabBadgeText}>
                              {unreadCount > 99 ? '99+' : unreadCount}
                            </Text>
                          </View>
                        )}
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
            <ReportButton />
          </View>
        );
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => <Home color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="map"
        options={{
          title: 'Map',
          tabBarIcon: ({ color, size }) => <Map color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="report"
        options={{
          title: 'Report',
          tabBarIcon: ({ color, size }) => <FileText color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="alerts"
        options={{
          title: 'Alerts',
          tabBarIcon: ({ color, size }) => <Bell color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size }) => <User color={color} size={size} />,
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBarContainer: {
    position: 'relative',
    zIndex: 100,
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: Colors.background.card,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    paddingTop: 12,
    paddingBottom: 12,
    paddingHorizontal: 8,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    alignItems: 'center',
  },
  tabGroup: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  centerSpacer: {
    flex: 1,
  },
  tabItem: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  reportButton: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? -28 : -24,
    left: '50%',
    marginLeft: -32,
    width: 64,
    height: 64,
    zIndex: 10,
  },
  reportButtonInner: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: Colors.primary.blue,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 8,
    shadowColor: Colors.primary.blue,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    borderWidth: 4,
    borderColor: Colors.background.card,
  },
  reportButtonActive: {
    backgroundColor: Colors.primary.darkBlue,
    transform: [{ scale: 0.95 }],
  },
  tabBadge: {
    position: 'absolute',
    top: -6,
    right: -10,
    backgroundColor: Colors.status.unhealthy,
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
    borderWidth: 2,
    borderColor: Colors.background.card,
  },
  tabBadgeText: {
    fontSize: 10,
    fontWeight: '700' as const,
    color: Colors.text.white,
  },
});
