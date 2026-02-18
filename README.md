# Kishan Diary

Mobile app for tracking farm work and implements.

## Features

### 🔐 User Authentication
Professional user registration and login system:
- **Welcome Screen** - App introduction with feature highlights
- **User Registration** - Comprehensive signup with:
  - Full name
  - Email address
  - Phone number
  - Farm name (optional)
  - Farm size (optional)
  - Location (optional)
  - Secure password
- **Login System** - Email and password authentication
- **User Profile** - Display user information and farm details
- **Logout** - Secure session management

### 📱 Tab Navigation
The app uses bottom tab navigation with four main sections:

1. **Home** - Dashboard with overview and quick actions
2. **Implements** - Manage farm equipment and machinery
3. **Work Log** - Track daily farm activities
4. **Profile** - User settings, statistics, and logout

## Technology Stack

- **React Native** - Cross-platform mobile development
- **Expo** - Development and build toolchain
- **React Navigation** - Stack and tab navigation
- **AsyncStorage** - Local data persistence
- **Expo Vector Icons** - Icon library (Ionicons)

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- Expo Go app on your mobile device (for testing)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/raj75165/kishan-diary.git
cd kishan-diary
```

2. Install dependencies:
```bash
npm install
```

### Running the App

Start the development server:
```bash
npm start
```

Run on specific platforms:
```bash
npm run android  # Run on Android emulator or device
npm run ios      # Run on iOS simulator (macOS only)
npm run web      # Run in web browser
```

### Building APK for Testing

To generate an APK file for testing on Android devices:

```bash
# Install EAS CLI (first time only)
npm install -g eas-cli

# Login to Expo (first time only)
eas login

# Build APK for testing
npm run build:apk

# Check build status
npm run build:status
```

The build process takes 10-20 minutes. Once complete, you'll receive a download link for the APK file.

📱 **For detailed instructions**, see [APK_BUILD_GUIDE.md](APK_BUILD_GUIDE.md)

### Development

The app follows a modular structure:
- `App.js` - Main navigation configuration with authentication flow
- `context/` - Application context providers
  - `AuthContext.js` - User authentication state management
- `screens/` - Individual screen components
  - `auth/` - Authentication screens
    - `WelcomeScreen.js` - Landing page
    - `LoginScreen.js` - User login
    - `RegisterScreen.js` - User registration
  - `HomeScreen.js` - Dashboard and overview
  - `ImplementsScreen.js` - Equipment management
  - `WorkLogScreen.js` - Activity logging
  - `ProfileScreen.js` - User profile and settings

## User Flow

1. **First Time Users:**
   - See Welcome screen
   - Click "Get Started" to register
   - Fill in registration form
   - Automatically logged in after registration

2. **Returning Users:**
   - Click "I have an account" on Welcome screen
   - Enter email and password
   - Access main app tabs

3. **Logged In Users:**
   - Access all app features via tabs
   - View personal profile with farm details
   - Logout from Profile screen

## Design Considerations

### Color Scheme
- Primary: `#2d5016` (Dark green - represents agriculture)
- Accent colors for different sections
- Clean, minimal design with good contrast

### Navigation
- Bottom tab navigation for easy access
- Icons change when tabs are active/inactive
- Consistent header styling across all screens

### UX Features
- Professional authentication flow
- Form validation with error messages
- Password visibility toggle
- Loading states for async operations
- Empty states with clear call-to-actions
- Information cards explaining features
- Responsive design for different screen sizes
- Proper spacing and visual hierarchy
- Logout confirmation dialog

## Security Note

⚠️ **Important:** The current implementation uses local-only authentication with AsyncStorage for demonstration purposes. This is **NOT suitable for production** use. 

For production deployment:
- Implement backend authentication API
- Use proper password hashing (bcrypt, argon2)
- Implement JWT or similar token system
- Use HTTPS for all communications
- Follow security best practices

See [SECURITY.md](SECURITY.md) for detailed security considerations and production requirements.

## Future Enhancements

### Suggested Improvements:
1. ✅ **User Authentication** - ✓ Implemented (local-only, needs backend for production)
2. **Backend Integration** - Connect to secure authentication API
3. **Add/Edit Forms** - Implement forms to add implements and work logs
4. **Calendar Integration** - View work logs in calendar format
5. **Reports & Analytics** - Generate reports on farm activities
6. **Photo Attachments** - Add images to work logs and implements
7. **Notifications** - Maintenance reminders for implements
8. **Export Data** - Export logs to CSV/PDF
9. **Multi-language Support** - Support for regional languages
10. **Offline Mode** - Work without internet connection
11. **Dark Mode** - Theme toggle for better visibility
12. **Social Features** - Share tips with other farmers

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is open source and available under the MIT License.

