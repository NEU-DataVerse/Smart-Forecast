# Google OAuth Setup Guide

## 📱 Mobile App (Android/iOS) OAuth Configuration

### 1. Google Cloud Console Setup

#### Tạo OAuth 2.0 Client ID cho Android:

1. Truy cập [Google Cloud Console](https://console.cloud.google.com/)
2. Chọn project: `smart-forecast-c72bf`
3. Vào **APIs & Services** → **Credentials**
4. Click **+ CREATE CREDENTIALS** → **OAuth 2.0 Client ID**
5. Chọn **Application type**: `Android`
6. Điền thông tin:
   - **Name**: `Smart Forecast Android`
   - **Package name**: `com.smartforecast.mobile` (hoặc package name trong app.json)
   - **SHA-1 certificate fingerprint**:

     ```bash
     # Debug keystore (development)
     keytool -list -v -keystore ~/.android/debug.keystore -alias androiddebugkey -storepass android -keypass android

     # Release keystore (production)
     keytool -list -v -keystore /path/to/your-release-key.keystore -alias your-key-alias
     ```

7. Click **CREATE**
8. Copy `Client ID`: `867552827752-ro1hcaqr6q6ev475qnhraq9b31b6jvap.apps.googleusercontent.com`

#### Tạo OAuth 2.0 Client ID cho iOS (nếu cần):

- Chọn **Application type**: `iOS`
- Điền **Bundle ID** từ `app.json`

**⚠️ Lưu ý**: Android/iOS OAuth clients **KHÔNG có** `client_secret` (public clients)

---

### 2. Backend Configuration

#### Cập nhật `.env`:

```env
GOOGLE_CLIENT_ID=867552827752-ro1hcaqr6q6ev475qnhraq9b31b6jvap.apps.googleusercontent.com
```

**Không cần** `GOOGLE_CLIENT_SECRET` và `GOOGLE_CALLBACK_URL` cho mobile flow.

---

### 3. Mobile App Integration (React Native Expo)

#### 3.1. Cài đặt packages:

```bash
cd mobile
npx expo install @react-native-google-signin/google-signin
```

#### 3.2. Cấu hình `app.json`:

```json
{
  "expo": {
    "android": {
      "googleServicesFile": "./google-services.json",
      "config": {
        "googleSignIn": {
          "apiKey": "YOUR_ANDROID_API_KEY",
          "certificateHash": "YOUR_SHA1_FINGERPRINT"
        }
      }
    },
    "ios": {
      "googleServicesFile": "./GoogleService-Info.plist",
      "bundleIdentifier": "com.smartforecast.mobile"
    }
  }
}
```

#### 3.3. Download `google-services.json`:

1. Vào **Firebase Console** → **Project Settings** → **General**
2. Scroll xuống **Your apps** → Click Android icon
3. Download `google-services.json` vào thư mục `mobile/`

#### 3.4. Implement Google Sign-In:

```typescript
// mobile/services/googleAuth.ts
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import axios from 'axios';

GoogleSignin.configure({
  webClientId: '867552827752-ro1hcaqr6q6ev475qnhraq9b31b6jvap.apps.googleusercontent.com',
  offlineAccess: false,
});

export async function signInWithGoogle() {
  try {
    // 1. Check if device supports Google Play Services
    await GoogleSignin.hasPlayServices();

    // 2. Sign in with Google
    const userInfo = await GoogleSignin.signIn();

    // 3. Get ID Token
    const { idToken } = userInfo;

    if (!idToken) {
      throw new Error('No ID token received from Google');
    }

    // 4. Send idToken to backend
    const response = await axios.post('http://localhost:8000/api/v1/auth/google', {
      idToken: idToken,
    });

    // 5. Save JWT token from backend
    const { access_token, user, isNewUser } = response.data;

    return { access_token, user, isNewUser };
  } catch (error) {
    console.error('Google Sign-In Error:', error);
    throw error;
  }
}
```

#### 3.5. UI Component:

```tsx
// mobile/components/GoogleSignInButton.tsx
import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator } from 'react-native';
import { signInWithGoogle } from '../services/googleAuth';

export function GoogleSignInButton() {
  const [loading, setLoading] = React.useState(false);

  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      const { access_token, user, isNewUser } = await signInWithGoogle();

      // Store token in AsyncStorage
      await AsyncStorage.setItem('auth_token', access_token);

      // Navigate to home screen
      navigation.navigate('Home');

      if (isNewUser) {
        // Show welcome message for new users
        Alert.alert('Welcome!', `Account created for ${user.email}`);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to sign in with Google');
    } finally {
      setLoading(false);
    }
  };

  return (
    <TouchableOpacity onPress={handleGoogleSignIn} disabled={loading} style={styles.button}>
      {loading ? (
        <ActivityIndicator color="#fff" />
      ) : (
        <>
          <GoogleIcon />
          <Text style={styles.text}>Sign in with Google</Text>
        </>
      )}
    </TouchableOpacity>
  );
}
```

---

### 4. Testing Flow

#### 4.1. Test với Swagger (Backend verification):

1. Mở Postman/cURL để lấy test idToken từ Google:

   ```bash
   # Lấy idToken từ Google OAuth Playground
   # https://developers.google.com/oauthplayground/
   ```

2. Test endpoint `POST /api/v1/auth/google`:

   ```json
   {
     "idToken": "eyJhbGciOiJSUzI1NiIsImtpZCI6..."
   }
   ```

3. Response:
   ```json
   {
     "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
     "user": {
       "id": "uuid",
       "email": "user@gmail.com",
       "fullName": "John Doe",
       "role": "USER",
       "avatarUrl": null
     },
     "isNewUser": true
   }
   ```

#### 4.2. Test với Mobile App:

1. Run Expo development build:

   ```bash
   cd mobile
   npx expo run:android  # hoặc npx expo run:ios
   ```

2. Click "Sign in with Google"
3. Chọn Google account
4. Check backend logs để verify token
5. User được tạo tự động với role: `USER`

---

### 5. Database Verification

```sql
-- Check users created via Google OAuth
SELECT
  id,
  email,
  full_name,
  provider,
  google_id,
  email_verified,
  role
FROM users
WHERE provider = 'google';
```

---

### 6. Troubleshooting

#### Error: "Invalid Google token"

- Check `GOOGLE_CLIENT_ID` trong `.env` khớp với Google Console
- Verify `idToken` chưa expired (Google tokens expire sau 1 hour)

#### Error: "hasPlayServices"

- Device/Emulator chưa cài Google Play Services
- Test trên physical device hoặc emulator với Google Play

#### Error: "No ID token received"

- Check `webClientId` trong `GoogleSignin.configure()`
- Verify SHA-1 fingerprint đã add vào Google Console

#### User không được tạo:

- Check backend logs: `await this.googleClient.verifyIdToken()`
- Verify `audience` parameter khớp với `clientId`

---

### 7. Security Notes

✅ **Best Practices:**

- idToken có expiration time ngắn (1 hour)
- Backend verify token với Google servers
- JWT token từ backend có expiration (7 days)
- Không lưu idToken, chỉ lưu JWT token

⚠️ **Don't:**

- Không hardcode `client_id` trong source code public
- Không share SHA-1 certificates publicly
- Không skip token verification trong production

---

## 📚 References

- [Google Sign-In for React Native](https://github.com/react-native-google-signin/google-signin)
- [Google OAuth 2.0 Documentation](https://developers.google.com/identity/protocols/oauth2)
- [Expo Google Sign-In](https://docs.expo.dev/guides/google-authentication/)
