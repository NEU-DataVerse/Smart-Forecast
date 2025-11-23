/**
 * Test file to verify shared package exports
 * Run: npx ts-node test.ts
 */

// Test importing all constants
import {
  UserRole,
  SystemRole,
  IncidentType,
  IncidentStatus,
  AlertLevel,
  AlertType,
  ApiStatus,
  IncidentTypeLabels,
  IncidentStatusLabels,
  AlertLevelLabels,
  AlertLevelColors,
} from './src/constants';

// Test importing all types
import {
  IUser,
  IUserProfile,
  ILoginRequest,
  ILoginResponse,
  IRegisterRequest,
  IJwtPayload,
  IAlert,
  ICreateAlertRequest,
  IActiveAlert,
  IIncident,
  ICreateIncidentRequest,
  IIncidentDetail,
  IActiveIncident,
  IAirQualityObserved,
  IWeatherObserved,
  GeoPoint,
  GeoPolygon,
  IApiResponse,
  IPaginatedResponse,
  IOverviewStats,
} from './src/types';

console.log('✅ All imports successful!\n');

// Test enum values
console.log('📋 Testing Enums:');
console.log('UserRole.ADMIN:', UserRole.ADMIN);
console.log('IncidentType.FLOODING:', IncidentType.FLOODING);
console.log('AlertLevel.CRITICAL:', AlertLevel.CRITICAL);
console.log('IncidentStatus.VERIFIED:', IncidentStatus.VERIFIED);
console.log('');

// Test labels
console.log('🏷️  Testing Labels:');
console.log('Flooding label:', IncidentTypeLabels[IncidentType.FLOODING]);
console.log('Verified label:', IncidentStatusLabels[IncidentStatus.VERIFIED]);
console.log('Critical level label:', AlertLevelLabels[AlertLevel.CRITICAL]);
console.log('Critical level color:', AlertLevelColors[AlertLevel.CRITICAL]);
console.log('');

// Test type usage
const testUser: IUser = {
  id: 'user-123',
  email: 'test@example.com',
  fullName: 'Nguyễn Văn A',
  role: UserRole.CITIZEN,
  createdAt: new Date(),
  updatedAt: new Date(),
};

const testIncident: IIncident = {
  id: 'incident-123',
  type: IncidentType.FLOODING,
  description: 'Ngập nặng khu vực đường X',
  location: {
    type: 'Point',
    coordinates: [105.8342, 21.0278], // Hanoi
  },
  imageUrls: ['https://minio.example.com/image1.jpg'],
  status: IncidentStatus.PENDING,
  reportedBy: 'user-123',
  createdAt: new Date(),
  updatedAt: new Date(),
};

const testAlert: IAlert = {
  id: 'alert-123',
  level: AlertLevel.HIGH,
  type: AlertType.DISASTER,
  title: 'Cảnh báo ngập lụt',
  message: 'Mưa lớn dự kiến gây ngập sâu',
  sentAt: new Date(),
  createdBy: 'admin-123',
  createdAt: new Date(),
  updatedAt: new Date(),
};

console.log('✅ Type usage successful!\n');
console.log('Test User:', JSON.stringify(testUser, null, 2));
console.log('\nTest Incident:', JSON.stringify(testIncident, null, 2));
console.log('\nTest Alert:', JSON.stringify(testAlert, null, 2));

console.log('\n✨ All tests passed! Shared package is working correctly.');
