import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, Dimensions, Pressable, FlatList, ViewToken } from 'react-native';
import { Stack, router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Animated, { FadeInUp, FadeInDown } from 'react-native-reanimated';
import { Globe, AlertTriangle, BarChart3, ChevronRight } from 'lucide-react-native';
import Colors from '@/constants/colors';

const { width, height } = Dimensions.get('window');

const ONBOARDING_KEY = 'hasSeenOnboarding';

interface OnboardingItem {
  id: string;
  icon: React.ReactNode;
  title: string;
  description: string;
}

const onboardingData: OnboardingItem[] = [
  {
    id: '1',
    icon: <Globe size={80} color={Colors.text.white} strokeWidth={1.5} />,
    title: 'Giám sát thời gian thực',
    description:
      'Theo dõi chất lượng không khí và thời tiết mọi lúc, mọi nơi với dữ liệu cập nhật liên tục',
  },
  {
    id: '2',
    icon: <AlertTriangle size={80} color={Colors.text.white} strokeWidth={1.5} />,
    title: 'Cảnh báo thông minh',
    description:
      'Nhận thông báo ngay lập tức khi có các mối nguy về môi trường trong khu vực của bạn',
  },
  {
    id: '3',
    icon: <BarChart3 size={80} color={Colors.text.white} strokeWidth={1.5} />,
    title: 'Phân tích chi tiết',
    description: 'Xem dữ liệu môi trường chi tiết, biểu đồ trực quan và xu hướng lịch sử',
  },
];

export default function OnboardingScreen() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  const handleNext = async () => {
    if (currentIndex < onboardingData.length - 1) {
      flatListRef.current?.scrollToIndex({ index: currentIndex + 1 });
    } else {
      await completeOnboarding();
    }
  };

  const handleSkip = async () => {
    await completeOnboarding();
  };

  const completeOnboarding = async () => {
    try {
      await AsyncStorage.setItem(ONBOARDING_KEY, 'true');
      router.replace('/login');
    } catch (error) {
      console.error('Error saving onboarding status:', error);
      router.replace('/login');
    }
  };

  const onViewableItemsChanged = useRef(({ viewableItems }: { viewableItems: ViewToken[] }) => {
    if (viewableItems.length > 0 && viewableItems[0].index !== null) {
      setCurrentIndex(viewableItems[0].index);
    }
  }).current;

  const viewabilityConfig = useRef({ viewAreaCoveragePercentThreshold: 50 }).current;

  const renderItem = ({ item, index }: { item: OnboardingItem; index: number }) => (
    <View style={styles.slide}>
      <Animated.View entering={FadeInDown.delay(200).springify()} style={styles.iconContainer}>
        {item.icon}
      </Animated.View>
      <Animated.Text entering={FadeInUp.delay(400).springify()} style={styles.title}>
        {item.title}
      </Animated.Text>
      <Animated.Text entering={FadeInUp.delay(600).springify()} style={styles.description}>
        {item.description}
      </Animated.Text>
    </View>
  );

  const isLastSlide = currentIndex === onboardingData.length - 1;

  return (
    <LinearGradient
      colors={[Colors.gradient.start, Colors.gradient.end]}
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <Stack.Screen options={{ headerShown: false }} />

      {/* Skip Button */}
      <Pressable style={styles.skipButton} onPress={handleSkip}>
        <Text style={styles.skipText}>Bỏ qua</Text>
      </Pressable>

      {/* Slides */}
      <FlatList
        ref={flatListRef}
        data={onboardingData}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        bounces={false}
      />

      {/* Bottom Section */}
      <View style={styles.bottomSection}>
        {/* Pagination Dots */}
        <View style={styles.pagination}>
          {onboardingData.map((_, index) => (
            <View key={index} style={[styles.dot, index === currentIndex && styles.dotActive]} />
          ))}
        </View>

        {/* Next/Get Started Button */}
        <Pressable style={styles.nextButton} onPress={handleNext}>
          <Text style={styles.nextButtonText}>{isLastSlide ? 'Bắt đầu' : 'Tiếp tục'}</Text>
          <ChevronRight size={20} color={Colors.primary.blue} />
        </Pressable>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  skipButton: {
    position: 'absolute',
    top: 60,
    right: 24,
    zIndex: 10,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  skipText: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    fontWeight: '500',
  },
  slide: {
    width,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
    paddingBottom: 100,
  },
  iconContainer: {
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: Colors.text.white,
    textAlign: 'center',
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.85)',
    textAlign: 'center',
    lineHeight: 24,
  },
  bottomSection: {
    position: 'absolute',
    bottom: 60,
    left: 0,
    right: 0,
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  pagination: {
    flexDirection: 'row',
    marginBottom: 32,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    marginHorizontal: 4,
  },
  dotActive: {
    width: 24,
    backgroundColor: Colors.text.white,
  },
  nextButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.text.white,
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 30,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 5,
  },
  nextButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.primary.blue,
    marginRight: 8,
  },
});
