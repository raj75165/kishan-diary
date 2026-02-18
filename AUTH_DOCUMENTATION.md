# Authentication Flow Documentation

## User Registration & Authentication Screens

### 1. Welcome Screen (Entry Point)
**Path:** `screens/auth/WelcomeScreen.js`

**Visual Elements:**
- 🌾 Large wheat emoji as app logo
- "Kishan Diary" app name in bold green
- "Your Farm Management Companion" tagline
- Three feature icons in a row:
  - 🔧 Track Implements
  - 📝 Log Activities
  - 📊 View Analytics
- Two action buttons:
  - Green "Get Started" button (primary) → Goes to Registration
  - White "I have an account" button (secondary) → Goes to Login
- Footer text: "Manage your farm operations efficiently"

**User Actions:**
- New users click "Get Started"
- Existing users click "I have an account"

---

### 2. Registration Screen
**Path:** `screens/auth/RegisterScreen.js`

**Visual Elements:**
- 🌾 Wheat emoji at top
- "Create Account" title
- "Join Kishan Diary today" subtitle
- White card with form fields:

**Form Fields (with icons):**
1. **Full Name*** - 👤 Person icon
2. **Email*** - ✉️ Mail icon
3. **Phone Number*** - 📞 Call icon (10 digits)
4. **Farm Name** - 🏠 Home icon (optional)
5. **Farm Size** - 📏 Resize icon (optional, e.g., "10 acres")
6. **Location** - 📍 Location icon (optional, e.g., "City, State")
7. **Password*** - 🔒 Lock icon (min 6 characters, with eye toggle)
8. **Confirm Password*** - 🔒 Lock icon (with eye toggle)

**Features:**
- Required fields marked with asterisk (*)
- Icon for each input field
- Password visibility toggle (eye icon)
- Green "Register" button
- "Already have an account? Sign in" link at bottom

**Validation:**
- All required fields must be filled
- Email format validation
- Phone must be 10 digits
- Password minimum 6 characters
- Passwords must match
- Shows error alerts for invalid inputs

---

### 3. Login Screen
**Path:** `screens/auth/LoginScreen.js`

**Visual Elements:**
- 🌾 Wheat emoji at top
- "Welcome Back!" title
- "Sign in to continue" subtitle
- White card with form fields:

**Form Fields (with icons):**
1. **Email** - ✉️ Mail icon
2. **Password** - 🔒 Lock icon (with eye toggle)

**Features:**
- Icon for each input field
- Password visibility toggle (eye icon)
- Green "Sign In" button
- "Don't have an account? Register here" link at bottom
- Loading state shows "Signing in..." text

**Validation:**
- Both fields required
- Email format validation
- Shows error alerts for:
  - Empty fields
  - Invalid email
  - Wrong credentials
  - No account found

---

### 4. Updated Profile Screen
**Path:** `screens/ProfileScreen.js`

**Visual Elements:**
- Header card with:
  - 👨‍🌾 Farmer emoji avatar
  - User's full name (from registration)
  - User's email
  - Farm name badge (if provided)
  
- Contact information card (if provided):
  - 📞 Phone number
  - 📍 Location
  - 📏 Farm size

- Statistics section (unchanged)
- Settings section (unchanged)
- About section (unchanged)

**New Feature:**
- Red "Logout" button at bottom
  - Shows confirmation dialog: "Are you sure you want to logout?"
  - Options: Cancel or Logout

---

## Authentication Flow

### First Time User Journey:
```
Welcome Screen
    ↓ (Click "Get Started")
Registration Screen
    ↓ (Fill form & submit)
[Account Created]
    ↓ (Auto login)
Main App (Tab Navigation)
    - Home
    - Implements
    - Work Log
    - Profile
```

### Returning User Journey:
```
Welcome Screen
    ↓ (Click "I have an account")
Login Screen
    ↓ (Enter credentials & submit)
[Authentication Check]
    ↓ (Success)
Main App (Tab Navigation)
    - Home
    - Implements
    - Work Log
    - Profile
```

### Logout Journey:
```
Profile Screen (while logged in)
    ↓ (Click "Logout" button)
[Confirmation Dialog]
    ↓ (Click "Logout")
[Session Cleared]
    ↓
Welcome Screen
```

---

## Data Storage

### User Data Structure (stored in AsyncStorage):
```json
{
  "id": "1234567890123",
  "fullName": "John Farmer",
  "email": "john@example.com",
  "phone": "9876543210",
  "farmName": "Green Valley Farm",
  "farmSize": "25 acres",
  "location": "Punjab, India",
  "password": "******",
  "createdAt": "2026-02-18T07:52:00.000Z"
}
```

### Storage Key:
- Key: `"user"`
- Value: JSON stringified user object

---

## Design Consistency

### Colors:
- **Primary Green:** `#2d5016` (buttons, headers, active elements)
- **Background:** `#f5f5f5` (light gray)
- **Cards:** `#ffffff` (white)
- **Text Primary:** `#333333` (dark gray)
- **Text Secondary:** `#666666` (medium gray)
- **Error/Logout:** `#d32f2f` (red)

### Typography:
- **Titles:** 28px, bold
- **Subtitles:** 16px, regular
- **Labels:** 14px, semi-bold
- **Input Text:** 16px, regular
- **Buttons:** 18px, bold

### Spacing:
- Screen padding: 24px
- Card padding: 24px
- Input margin: 16-20px
- Border radius: 10-12px

### Icons:
- Input icons: 20px
- Tab icons: 24-32px
- All icons from Ionicons library

---

## User Experience Features

### Form Validation:
- Real-time email format checking
- Phone number length validation
- Password strength requirement
- Password match verification
- Clear error messages via Alert dialogs

### Visual Feedback:
- Loading indicators during async operations
- Button text changes ("Register" → "Creating Account...")
- Disabled button state while loading
- Password visibility toggle

### Navigation:
- Seamless transition between auth screens
- Auto-login after registration
- Persistent login (remains logged in after app restart)
- Easy navigation between Login and Register screens

### Accessibility:
- Clear labels for all inputs
- Icon indicators for input types
- High contrast text
- Large touch targets for buttons
- Keyboard handling (auto-dismiss)

---

## Security Considerations

⚠️ **Current Implementation:**
- Local-only authentication
- Plain text password storage (AsyncStorage)
- Client-side validation only
- Suitable for demo/development only

✅ **Production Requirements:**
- Secure backend API
- Password hashing (bcrypt/argon2)
- Token-based authentication (JWT)
- HTTPS communications
- Server-side validation
- Rate limiting
- 2FA optional

See [SECURITY.md](SECURITY.md) for complete production requirements.

---

## Testing the Authentication

### Manual Testing Steps:

1. **Registration Test:**
   - Open app → Welcome screen appears
   - Click "Get Started"
   - Fill all required fields
   - Try invalid email → Should show error
   - Try short password → Should show error
   - Try mismatched passwords → Should show error
   - Fill correctly → Should register and login

2. **Login Test:**
   - Logout from Profile screen
   - Welcome screen appears
   - Click "I have an account"
   - Try wrong email → Should show error
   - Try wrong password → Should show error
   - Enter correct credentials → Should login

3. **Persistence Test:**
   - Login to app
   - Close app completely
   - Reopen app
   - Should remain logged in (Main tabs appear)

4. **Logout Test:**
   - From Profile screen, click "Logout"
   - Confirmation dialog appears
   - Click "Logout" → Returns to Welcome screen
   - Click "Cancel" → Stays on Profile screen

---

## Code Quality

### Components:
- ✅ Modular, reusable components
- ✅ Consistent styling
- ✅ Proper state management
- ✅ Error handling
- ✅ Loading states

### Context:
- ✅ Centralized authentication logic
- ✅ AsyncStorage integration
- ✅ Clean API for auth operations
- ✅ Proper error handling

### Navigation:
- ✅ Conditional rendering based on auth state
- ✅ Smooth transitions
- ✅ Proper screen organization
- ✅ Stack and tab navigation integration

---

## Build Status

✅ **Build Successful**
- Web export: ✓ Passed
- Bundle size: 1.33 MB
- Dependencies: ✓ No vulnerabilities
- CodeQL: ✓ 0 alerts
- Code Review: ✓ Addressed with documentation
