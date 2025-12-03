import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  Pressable,
  Alert,
  Image,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { Stack } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import * as FileSystem from 'expo-file-system';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Camera, MapPin, X, RefreshCw, WifiOff } from 'lucide-react-native';
import Colors from '@/constants/colors';
import { useAppStore } from '@/store/appStore';
import { useAuth } from '@/context/AuthContext';
import { getBackendUrl } from '@/services/api';

const API_URL = getBackendUrl();

// Offline queue constants
const PENDING_INCIDENTS_KEY = 'pending_incidents';
const MAX_RETRIES = 3;

// Pending incident interface for offline storage
interface PendingIncident {
  id: string;
  type: string;
  description: string;
  imageUris: string[];
  location: { latitude: number; longitude: number };
  timestamp: number;
  retryCount: number;
}

// Helper: Check if error is a network error
const isNetworkError = (error: unknown): boolean => {
  if (error instanceof TypeError) {
    return error.message.toLowerCase().includes('network');
  }
  return false;
};

// Helper: Get user-friendly error message based on error type
const getErrorMessage = (error: unknown, status?: number): string => {
  if (isNetworkError(error)) {
    return 'Không có kết nối mạng. Báo cáo sẽ được lưu và gửi khi có mạng.';
  }
  if (status === 401 || status === 403) {
    return 'Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.';
  }
  if (status === 400) {
    return 'Dữ liệu không hợp lệ. Vui lòng kiểm tra lại thông tin.';
  }
  if (status && status >= 500) {
    return 'Lỗi máy chủ. Vui lòng thử lại sau.';
  }
  if (error instanceof Error) {
    return error.message;
  }
  return 'Không thể gửi báo cáo sự cố. Vui lòng thử lại.';
};

// Helper: Get exponential backoff delay (1s, 2s, 4s)
const getRetryDelay = (attempt: number): number => Math.pow(2, attempt) * 1000;

// Helper: Check if image URI still exists on device
const checkImageExists = async (uri: string): Promise<boolean> => {
  try {
    const info = await FileSystem.getInfoAsync(uri);
    return info.exists;
  } catch {
    return false;
  }
};

// Helper: Save pending incident to AsyncStorage
const savePendingIncident = async (incident: PendingIncident): Promise<void> => {
  try {
    const existing = await AsyncStorage.getItem(PENDING_INCIDENTS_KEY);
    const pendingList: PendingIncident[] = existing ? JSON.parse(existing) : [];
    pendingList.push(incident);
    await AsyncStorage.setItem(PENDING_INCIDENTS_KEY, JSON.stringify(pendingList));
  } catch (error) {
    console.error('Error saving pending incident:', error);
  }
};

// Helper: Get all pending incidents from AsyncStorage
const getPendingIncidents = async (): Promise<PendingIncident[]> => {
  try {
    const data = await AsyncStorage.getItem(PENDING_INCIDENTS_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error getting pending incidents:', error);
    return [];
  }
};

// Helper: Remove a pending incident by id
const removePendingIncident = async (id: string): Promise<void> => {
  try {
    const pendingList = await getPendingIncidents();
    const filtered = pendingList.filter((item) => item.id !== id);
    await AsyncStorage.setItem(PENDING_INCIDENTS_KEY, JSON.stringify(filtered));
  } catch (error) {
    console.error('Error removing pending incident:', error);
  }
};

// Helper: Update retry count for a pending incident
const updatePendingIncidentRetry = async (id: string, retryCount: number): Promise<void> => {
  try {
    const pendingList = await getPendingIncidents();
    const updated = pendingList.map((item) => (item.id === id ? { ...item, retryCount } : item));
    await AsyncStorage.setItem(PENDING_INCIDENTS_KEY, JSON.stringify(updated));
  } catch (error) {
    console.error('Error updating pending incident:', error);
  }
};

// Map to backend IncidentType enum
const INCIDENT_TYPES = [
  { value: 'FLOODING', label: 'Lũ lụt', color: '#3B82F6' },
  { value: 'LANDSLIDE', label: 'Sạt lở đất', color: '#8B4513' },
  { value: 'AIR_POLLUTION', label: 'Ô nhiễm', color: '#EF4444' },
  { value: 'OTHER', label: 'Khác', color: '#F59E0B' },
] as const;

export default function ReportScreen() {
  const { location } = useAppStore();
  const { token: authToken } = useAuth();
  // Use mock token for testing, fallback to auth token
  const token = authToken;
  const [selectedType, setSelectedType] = useState<(typeof INCIDENT_TYPES)[number]['value'] | null>(
    null,
  );
  const [description, setDescription] = useState('');
  const [imageUris, setImageUris] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [pendingCount, setPendingCount] = useState(0);
  const [isSyncing, setIsSyncing] = useState(false);
  const maxImages = 5;

  // Sync a single incident with retry and exponential backoff
  const syncSingleIncident = useCallback(
    async (incident: PendingIncident): Promise<boolean> => {
      if (!token) return false;

      // Filter out expired/deleted images
      const validImageUris: string[] = [];
      for (const uri of incident.imageUris) {
        const exists = await checkImageExists(uri);
        if (exists) {
          validImageUris.push(uri);
        }
      }

      // Create FormData
      const formData = new FormData();
      formData.append('type', incident.type);
      formData.append('description', incident.description);
      formData.append('longitude', incident.location.longitude.toString());
      formData.append('latitude', incident.location.latitude.toString());

      // Append valid images
      for (let i = 0; i < validImageUris.length; i++) {
        const uri = validImageUris[i];
        const filename = uri.split('/').pop() || `image_${i}.jpg`;
        const match = /\.(\w+)$/.exec(filename);
        const type = match ? `image/${match[1]}` : 'image/jpeg';

        formData.append('images', {
          uri: Platform.OS === 'ios' ? uri.replace('file://', '') : uri,
          name: filename,
          type,
        } as any);
      }

      // Retry with exponential backoff
      for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
        try {
          if (attempt > 0) {
            // Wait before retry with exponential backoff
            await new Promise((resolve) => setTimeout(resolve, getRetryDelay(attempt - 1)));
          }

          const response = await fetch(`${API_URL}/incident`, {
            method: 'POST',
            headers: {
              Accept: 'application/json',
              Authorization: `Bearer ${token}`,
            },
            body: formData,
          });

          if (response.ok) {
            // Success - remove from pending
            await removePendingIncident(incident.id);
            return true;
          }

          // Don't retry on auth errors
          if (response.status === 401 || response.status === 403) {
            console.warn('Auth error syncing incident, keeping in queue');
            return false;
          }

          // Don't retry on validation errors
          if (response.status === 400) {
            console.warn('Validation error, removing from queue');
            await removePendingIncident(incident.id);
            return false;
          }
        } catch (error) {
          if (!isNetworkError(error) && attempt === MAX_RETRIES) {
            console.error('Max retries reached for incident:', incident.id);
            await updatePendingIncidentRetry(incident.id, incident.retryCount + 1);
            return false;
          }
        }
      }

      // Update retry count after all attempts
      await updatePendingIncidentRetry(incident.id, incident.retryCount + 1);
      return false;
    },
    [token],
  );

  // Sync all pending incidents
  const syncPendingIncidents = useCallback(async () => {
    if (isSyncing || !token) return;

    setIsSyncing(true);
    try {
      const pendingList = await getPendingIncidents();
      if (pendingList.length === 0) {
        setPendingCount(0);
        return;
      }

      let successCount = 0;
      for (const incident of pendingList) {
        const success = await syncSingleIncident(incident);
        if (success) successCount++;
      }

      // Update pending count
      const remaining = await getPendingIncidents();
      setPendingCount(remaining.length);

      if (successCount > 0) {
        Alert.alert(
          'Đồng bộ thành công',
          `Đã gửi ${successCount} báo cáo đang chờ.${remaining.length > 0 ? ` Còn ${remaining.length} báo cáo chưa gửi được.` : ''}`,
        );
      }
    } catch (error) {
      console.error('Error syncing pending incidents:', error);
    } finally {
      setIsSyncing(false);
    }
  }, [isSyncing, token, syncSingleIncident]);

  // Load pending count on mount and auto-sync
  useEffect(() => {
    const loadAndSync = async () => {
      const pending = await getPendingIncidents();
      setPendingCount(pending.length);

      // Auto-sync if there are pending items and we have a token
      if (pending.length > 0 && token) {
        // Delay sync slightly to let the app initialize
        setTimeout(() => {
          syncPendingIncidents();
        }, 2000);
      }
    };

    loadAndSync();
  }, [token]); // eslint-disable-line react-hooks/exhaustive-deps

  const pickImage = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Cần cấp quyền', 'Vui lòng cấp quyền truy cập thư viện ảnh');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: 'images' as any,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled) {
        const newUri = result.assets[0].uri;
        if (imageUris.length < maxImages) {
          setImageUris([...imageUris, newUri]);
        } else {
          Alert.alert('Giới hạn ảnh', `Tối đa ${maxImages} ảnh được phép`);
        }
      }
    } catch (error) {
      console.error('Image picker error:', error);
      Alert.alert('Lỗi', 'Không thể chọn ảnh. Vui lòng thử lại.');
    }
  };

  const takePhoto = async () => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Cần cấp quyền', 'Vui lòng cấp quyền truy cập camera');
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled) {
        const newUri = result.assets[0].uri;
        if (imageUris.length < maxImages) {
          setImageUris([...imageUris, newUri]);
        } else {
          Alert.alert('Giới hạn ảnh', `Tối đa ${maxImages} ảnh được phép`);
        }
      }
    } catch (error) {
      console.error('Camera error:', error);
      // Fallback to image library if camera fails
      Alert.alert('Lỗi Camera', 'Không thể mở camera. Bạn có muốn chọn ảnh từ thư viện không?', [
        { text: 'Hủy', style: 'cancel' },
        { text: 'Chọn từ thư viện', onPress: pickImage },
      ]);
    }
  };

  const handleSubmit = async () => {
    if (!selectedType) {
      Alert.alert('Lỗi', 'Vui lòng chọn loại sự cố');
      return;
    }

    if (!description.trim()) {
      Alert.alert('Lỗi', 'Vui lòng cung cấp mô tả chi tiết về sự cố');
      return;
    }

    if (!token) {
      Alert.alert('Lỗi', 'Vui lòng đăng nhập để gửi báo cáo');
      return;
    }

    setIsSubmitting(true);

    let currentLocation = location;

    try {
      if (!currentLocation) {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status === 'granted') {
          const loc = await Location.getCurrentPositionAsync({});
          currentLocation = {
            latitude: loc.coords.latitude,
            longitude: loc.coords.longitude,
          };
        } else {
          currentLocation = { latitude: 10.8231, longitude: 106.6297 };
        }
      }

      // Create FormData for multipart/form-data request
      const formData = new FormData();
      formData.append('type', selectedType);
      formData.append('description', description.trim());
      formData.append('longitude', currentLocation.longitude.toString());
      formData.append('latitude', currentLocation.latitude.toString());

      // Append images
      for (let i = 0; i < imageUris.length; i++) {
        const uri = imageUris[i];
        const filename = uri.split('/').pop() || `image_${i}.jpg`;
        const match = /\.(\w+)$/.exec(filename);
        const type = match ? `image/${match[1]}` : 'image/jpeg';

        formData.append('images', {
          uri: Platform.OS === 'ios' ? uri.replace('file://', '') : uri,
          name: filename,
          type,
        } as any);
      }

      // Send to backend API
      const response = await fetch(`${API_URL}/incident`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const status = response.status;

        // Handle specific error statuses
        if (status === 401 || status === 403) {
          Alert.alert('Lỗi xác thực', getErrorMessage(null, status));
          return;
        }

        if (status === 400) {
          Alert.alert('Lỗi dữ liệu', errorData.message || getErrorMessage(null, status));
          return;
        }

        // Server error - save to pending queue for retry
        if (status >= 500) {
          throw new Error(`SERVER_ERROR:${status}`);
        }

        throw new Error(errorData.message || `HTTP error! status: ${status}`);
      }

      // Response parsed successfully - incident uploaded
      await response.json();

      Alert.alert('Thành công', 'Báo cáo sự cố của bạn đã được gửi thành công!', [
        {
          text: 'OK',
          onPress: () => {
            setSelectedType(null);
            setDescription('');
            setImageUris([]);
          },
        },
      ]);
    } catch (error) {
      console.error('Error submitting incident:', error);

      // Check if network error or server error - save to pending queue
      const shouldSavePending =
        isNetworkError(error) ||
        (error instanceof Error && error.message.startsWith('SERVER_ERROR'));

      if (shouldSavePending && currentLocation) {
        // Save to pending queue for later sync
        const pendingIncident: PendingIncident = {
          id: Date.now().toString(),
          type: selectedType,
          description: description.trim(),
          imageUris: [...imageUris],
          location: currentLocation,
          timestamp: Date.now(),
          retryCount: 0,
        };

        await savePendingIncident(pendingIncident);
        setPendingCount((prev) => prev + 1);

        Alert.alert(
          'Đã lưu offline',
          'Không có kết nối mạng. Báo cáo đã được lưu và sẽ tự động gửi khi có mạng.',
          [
            {
              text: 'OK',
              onPress: () => {
                setSelectedType(null);
                setDescription('');
                setImageUris([]);
              },
            },
          ],
        );
      } else {
        // Show error message for other errors
        Alert.alert('Lỗi', getErrorMessage(error));
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: 'Báo cáo sự cố',
          headerStyle: {
            backgroundColor: Colors.primary.blue,
          },
          headerTintColor: Colors.text.white,
        }}
      />

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {/* Pending Banner */}
        {pendingCount > 0 && (
          <View style={styles.pendingBanner}>
            <View style={styles.pendingBannerContent}>
              <WifiOff size={20} color="#F59E0B" />
              <View style={styles.pendingBannerText}>
                <Text style={styles.pendingBannerTitle}>{pendingCount} báo cáo đang chờ gửi</Text>
                <Text style={styles.pendingBannerSubtitle}>Sẽ tự động gửi khi có kết nối mạng</Text>
              </View>
            </View>
            <Pressable
              style={[styles.syncButton, isSyncing && styles.syncButtonDisabled]}
              onPress={syncPendingIncidents}
              disabled={isSyncing}
            >
              {isSyncing ? (
                <ActivityIndicator size="small" color={Colors.primary.blue} />
              ) : (
                <>
                  <RefreshCw size={16} color={Colors.primary.blue} />
                  <Text style={styles.syncButtonText}>Thử lại</Text>
                </>
              )}
            </Pressable>
          </View>
        )}

        <Text style={styles.sectionTitle}>Loại sự cố</Text>
        <View style={styles.typeGrid}>
          {INCIDENT_TYPES.map((type) => (
            <Pressable
              key={type.value}
              style={[
                styles.typeCard,
                selectedType === type.value && styles.typeCardSelected,
                { borderColor: type.color },
              ]}
              onPress={() => setSelectedType(type.value)}
            >
              <View
                style={[
                  styles.typeIndicator,
                  { backgroundColor: type.color },
                  selectedType === type.value && styles.typeIndicatorSelected,
                ]}
              />
              <Text
                style={[styles.typeLabel, selectedType === type.value && styles.typeLabelSelected]}
              >
                {type.label}
              </Text>
            </Pressable>
          ))}
        </View>

        <Text style={styles.sectionTitle}>Mô tả</Text>
        <TextInput
          style={styles.textArea}
          placeholder="Mô tả chi tiết về sự cố..."
          placeholderTextColor={Colors.text.light}
          multiline
          numberOfLines={5}
          value={description}
          onChangeText={setDescription}
          textAlignVertical="top"
        />

        <Text style={styles.sectionTitle}>Ảnh minh chứng (Tùy chọn)</Text>

        {imageUris.length > 0 ? (
          <View style={styles.imageGrid}>
            {imageUris.map((uri, index) => (
              <View key={index} style={styles.imageGridItem}>
                <View style={styles.imageContainer}>
                  <Image source={{ uri }} style={styles.image} />
                  <Pressable
                    style={styles.removeImageButton}
                    onPress={() => setImageUris(imageUris.filter((_, i) => i !== index))}
                  >
                    <X size={20} color={Colors.text.white} />
                  </Pressable>
                </View>
              </View>
            ))}
          </View>
        ) : null}

        {imageUris.length < maxImages && (
          <View style={styles.imageButtons}>
            {Platform.OS !== 'web' && (
              <Pressable style={styles.imageButton} onPress={takePhoto}>
                <Camera size={24} color={Colors.primary.blue} />
                <Text style={styles.imageButtonText}>Chụp ảnh</Text>
              </Pressable>
            )}
          </View>
        )}

        {imageUris.length > 0 && (
          <Text style={styles.imageCountText}>
            {imageUris.length}/{maxImages} ảnh
          </Text>
        )}

        <View style={styles.locationInfo}>
          <MapPin size={16} color={Colors.text.secondary} />
          <Text style={styles.locationText}>Vị trí sẽ được tự động đính kèm</Text>
        </View>

        <Pressable
          style={[styles.submitButton, isSubmitting && styles.submitButtonDisabled]}
          onPress={handleSubmit}
          disabled={isSubmitting}
        >
          <Text style={styles.submitButtonText}>
            {isSubmitting ? 'Đang gửi...' : 'Gửi báo cáo'}
          </Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.primary,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: Colors.text.primary,
    marginBottom: 12,
    marginTop: 8,
  },
  typeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -6,
    marginBottom: 20,
  },
  typeCard: {
    width: '50%',
    paddingHorizontal: 6,
    marginBottom: 12,
  },
  typeCardInner: {
    backgroundColor: Colors.background.card,
    borderRadius: 12,
    padding: 16,
    borderWidth: 2,
    borderColor: 'transparent',
    flexDirection: 'row',
    alignItems: 'center',
  },
  typeCardSelected: {
    borderWidth: 2,
  },
  typeIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  typeIndicatorSelected: {
    width: 16,
    height: 16,
    borderRadius: 8,
  },
  typeLabel: {
    fontSize: 14,
    color: Colors.text.secondary,
    fontWeight: '500' as const,
  },
  typeLabelSelected: {
    color: Colors.text.primary,
    fontWeight: '600' as const,
  },
  textArea: {
    backgroundColor: Colors.background.card,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: Colors.text.primary,
    minHeight: 120,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 20,
  },
  imageButtons: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  imageButton: {
    flex: 1,
    backgroundColor: Colors.background.card,
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  imageButtonText: {
    fontSize: 14,
    color: Colors.primary.blue,
    marginTop: 8,
    fontWeight: '500' as const,
  },
  imageContainer: {
    position: 'relative',
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 12,
  },
  imageGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -6,
    marginBottom: 20,
  },
  imageGridItem: {
    width: '50%',
    paddingHorizontal: 6,
    marginBottom: 12,
  },
  image: {
    width: '100%',
    height: 150,
    borderRadius: 12,
  },
  removeImageButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderRadius: 20,
    padding: 8,
  },
  imageCountText: {
    fontSize: 12,
    color: Colors.text.secondary,
    marginTop: -16,
    marginBottom: 20,
  },
  locationInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  locationText: {
    fontSize: 14,
    color: Colors.text.secondary,
    marginLeft: 8,
  },
  submitButton: {
    backgroundColor: Colors.primary.blue,
    borderRadius: 12,
    padding: 18,
    alignItems: 'center',
    marginBottom: 40,
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: Colors.text.white,
  },
  // Pending banner styles
  pendingBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FEF3C7',
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#F59E0B',
  },
  pendingBannerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  pendingBannerText: {
    marginLeft: 12,
    flex: 1,
  },
  pendingBannerTitle: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: '#92400E',
  },
  pendingBannerSubtitle: {
    fontSize: 12,
    color: '#B45309',
    marginTop: 2,
  },
  syncButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background.card,
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    gap: 4,
  },
  syncButtonDisabled: {
    opacity: 0.6,
  },
  syncButtonText: {
    fontSize: 12,
    fontWeight: '600' as const,
    color: Colors.primary.blue,
  },
});
