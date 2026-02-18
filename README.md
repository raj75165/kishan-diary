# Kishan Diary

Mobile app for tracking farm work and implements.

## Features

### 📱 Tab Navigation
The app uses bottom tab navigation with four main sections:

1. **Home** - Dashboard with overview and quick actions
2. **Implements** - Manage farm equipment and machinery
3. **Work Log** - Track daily farm activities
4. **Profile** - User settings and statistics

## Technology Stack

- **React Native** - Cross-platform mobile development
- **Expo** - Development and build toolchain
- **React Navigation** - Tab and screen navigation
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

### Development

The app follows a modular structure:
- `App.js` - Main navigation configuration
- `screens/` - Individual screen components
  - `HomeScreen.js` - Dashboard and overview
  - `ImplementsScreen.js` - Equipment management
  - `WorkLogScreen.js` - Activity logging
  - `ProfileScreen.js` - User profile and settings

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
- Empty states with clear call-to-actions
- Information cards explaining features
- Responsive design for different screen sizes
- Proper spacing and visual hierarchy

## Future Enhancements

### Suggested Improvements:
1. **Data Persistence** - Add local storage (AsyncStorage) or backend integration
2. **Add/Edit Forms** - Implement forms to add implements and work logs
3. **Calendar Integration** - View work logs in calendar format
4. **Reports & Analytics** - Generate reports on farm activities
5. **Photo Attachments** - Add images to work logs and implements
6. **Notifications** - Maintenance reminders for implements
7. **Export Data** - Export logs to CSV/PDF
8. **Multi-language Support** - Support for regional languages
9. **Offline Mode** - Work without internet connection
10. **Dark Mode** - Theme toggle for better visibility

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is open source and available under the MIT License.

