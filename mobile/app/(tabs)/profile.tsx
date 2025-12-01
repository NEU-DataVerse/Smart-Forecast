import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  Pressable,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Stack } from 'expo-router';
import { User, MapPin, Clock, FileText, LogOut } from 'lucide-react-native';
import Colors from '@/constants/colors';
import { useAppStore } from '@/store/appStore';
import { useAuth } from '@/context/AuthContext';

export default function ProfileScreen() {
  const { incidents } = useAppStore();
  const { user, signOut } = useAuth();
  const [isSigningOut, setIsSigningOut] = React.useState(false);

  const handleSignOut = async () => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', onPress: () => {} },
      {
        text: 'Sign Out',
        onPress: async () => {
          try {
            setIsSigningOut(true);
            await signOut();
          } catch (error) {
            Alert.alert('Error', 'Failed to sign out');
            console.error(error);
          } finally {
            setIsSigningOut(false);
          }
        },
        style: 'destructive',
      },
    ]);
  };

  const getIncidentColor = (type: string) => {
    const colors: Record<string, string> = {
      flood: '#3B82F6',
      landslide: '#8B4513',
      pollution: '#EF4444',
      accident: '#F59E0B',
    };
    return colors[type] || Colors.primary.blue;
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: Colors.status.moderate,
      verified: Colors.status.good,
      resolved: Colors.text.light,
    };
    return colors[status] || Colors.text.secondary;
  };

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: 'Profile',
          headerStyle: {
            backgroundColor: Colors.primary.blue,
          },
          headerTintColor: Colors.text.white,
        }}
      />

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <View style={styles.profileCard}>
          <View style={styles.avatarContainer}>
            <User size={40} color={Colors.text.white} />
          </View>
          <Text style={styles.profileName}>{user?.fullName || 'User'}</Text>
          <Text style={styles.profileEmail}>{user?.email || 'email@example.com'}</Text>
        </View>

        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{incidents.length}</Text>
            <Text style={styles.statLabel}>Báo cáo</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>
              {incidents.filter((i) => i.status === 'verified').length}
            </Text>
            <Text style={styles.statLabel}>Đã xác minh</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>
              {incidents.filter((i) => i.status === 'resolved').length}
            </Text>
            <Text style={styles.statLabel}>Đã giải quyết</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Báo cáo sự cố của tôi</Text>

          {incidents.length === 0 ? (
            <View style={styles.emptyState}>
              <FileText size={48} color={Colors.text.light} />
              <Text style={styles.emptyText}>Chưa có báo cáo nào</Text>
              <Text style={styles.emptySubtext}>
                Hãy gửi báo cáo sự cố đầu tiên của bạn từ tab Báo cáo để giúp cải thiện môi trường
                xung quanh!
              </Text>
            </View>
          ) : (
            <>
              {incidents.map((incident) => (
                <Pressable key={incident.id} style={styles.incidentCard}>
                  <View
                    style={[
                      styles.incidentIndicator,
                      { backgroundColor: getIncidentColor(incident.type) },
                    ]}
                  />

                  {incident.imageUri && (
                    <Image source={{ uri: incident.imageUri }} style={styles.incidentImage} />
                  )}

                  <View style={styles.incidentContent}>
                    <View style={styles.incidentHeader}>
                      <Text style={styles.incidentType}>
                        {incident.type.charAt(0).toUpperCase() + incident.type.slice(1)}
                      </Text>
                      <View
                        style={[
                          styles.statusBadge,
                          { backgroundColor: getStatusColor(incident.status) },
                        ]}
                      >
                        <Text style={styles.statusText}>{incident.status.toUpperCase()}</Text>
                      </View>
                    </View>

                    <Text style={styles.incidentDescription} numberOfLines={2}>
                      {incident.description}
                    </Text>

                    <View style={styles.incidentFooter}>
                      <View style={styles.footerItem}>
                        <MapPin size={14} color={Colors.text.light} />
                        <Text style={styles.footerText}>
                          {incident.locationName || 'Vị trí được theo dõi'}
                        </Text>
                      </View>
                      <View style={styles.footerItem}>
                        <Clock size={14} color={Colors.text.light} />
                        <Text style={styles.footerText}>{formatDate(incident.timestamp)}</Text>
                      </View>
                    </View>
                  </View>
                </Pressable>
              ))}
            </>
          )}
        </View>

        <View style={styles.section}>
          <Pressable
            style={[styles.signOutButton, isSigningOut && styles.signOutButtonDisabled]}
            onPress={handleSignOut}
            disabled={isSigningOut}
          >
            {isSigningOut ? (
              <ActivityIndicator size="small" color="#FFF" />
            ) : (
              <>
                <LogOut size={20} color="#FFF" />
                <Text style={styles.signOutText}>Sign Out</Text>
              </>
            )}
          </Pressable>
        </View>
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
    paddingBottom: 40,
  },
  profileCard: {
    backgroundColor: Colors.background.card,
    padding: 30,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.primary.blue,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  profileName: {
    fontSize: 22,
    fontWeight: '700' as const,
    color: Colors.text.primary,
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 14,
    color: Colors.text.secondary,
  },
  statsContainer: {
    backgroundColor: Colors.background.card,
    flexDirection: 'row',
    paddingVertical: 20,
    marginBottom: 16,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 28,
    fontWeight: '700' as const,
    color: Colors.primary.blue,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: Colors.text.secondary,
    textTransform: 'uppercase' as const,
  },
  statDivider: {
    width: 1,
    backgroundColor: Colors.border,
  },
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600' as const,
    color: Colors.text.primary,
    marginBottom: 16,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: Colors.text.primary,
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: Colors.text.secondary,
    textAlign: 'center',
  },
  incidentCard: {
    backgroundColor: Colors.background.card,
    borderRadius: 12,
    marginBottom: 12,
    overflow: 'hidden',
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  incidentIndicator: {
    height: 4,
  },
  incidentImage: {
    width: '100%',
    height: 150,
  },
  incidentContent: {
    padding: 16,
  },
  incidentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  incidentType: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: Colors.text.primary,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '600' as const,
    color: Colors.text.white,
  },
  incidentDescription: {
    fontSize: 14,
    color: Colors.text.secondary,
    lineHeight: 20,
    marginBottom: 12,
  },
  incidentFooter: {
    gap: 8,
  },
  footerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  footerText: {
    fontSize: 12,
    color: Colors.text.light,
  },
  signOutButton: {
    backgroundColor: '#EF4444',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  signOutButtonDisabled: {
    opacity: 0.6,
  },
  signOutText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600' as const,
  },
});
