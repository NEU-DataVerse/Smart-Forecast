import React, { useState } from 'react';
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
} from 'react-native';
import { Stack } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import { Camera, MapPin, X } from 'lucide-react-native';
import Colors from '@/constants/colors';
import { useAppStore } from '@/store/appStore';
import { useAuth } from '@/context/AuthContext';
import { Incident } from '@/types';

const API_URL = process.env.EXPO_PUBLIC_API_URL;

// Map to backend IncidentType enum
const INCIDENT_TYPES = [
  { value: 'FLOODING', label: 'Lũ lụt', color: '#3B82F6' },
  { value: 'LANDSLIDE', label: 'Sạt lở đất', color: '#8B4513' },
  { value: 'AIR_POLLUTION', label: 'Ô nhiễm', color: '#EF4444' },
  { value: 'OTHER', label: 'Khác', color: '#F59E0B' },
] as const;

export default function ReportScreen() {
  const { addIncident, location } = useAppStore();
  const { token: authToken } = useAuth();
  // Use mock token for testing, fallback to auth token
  const token = authToken;
  const [selectedType, setSelectedType] = useState<(typeof INCIDENT_TYPES)[number]['value'] | null>(
    null,
  );
  const [description, setDescription] = useState('');
  const [imageUris, setImageUris] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const maxImages = 5;

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

    try {
      let currentLocation = location;

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
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      // Also save locally for offline access
      const incident: Incident = {
        id: result.id || Date.now().toString(),
        type: selectedType.toLowerCase() as any,
        description: description.trim(),
        imageUri: imageUris.length > 0 ? imageUris[0] : undefined,
        location: currentLocation,
        timestamp: Date.now(),
        status: 'pending',
      };

      addIncident(incident);

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
      Alert.alert(
        'Lỗi',
        error instanceof Error ? error.message : 'Không thể gửi báo cáo sự cố. Vui lòng thử lại.',
      );
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
});
