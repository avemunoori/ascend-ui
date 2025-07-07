# 🧗‍♀️ Ascend - Climbing Session Tracker

A modern, sleek React Native app for tracking climbing sessions with detailed analytics and progress insights. Built for the 18-25 demographic with contemporary design and intuitive UX.

## ✨ Features

- **Modern UI/UX**: Sleek design with gradients, glassmorphism effects, and contemporary styling
- **Session Tracking**: Log climbing sessions with discipline, grade, date, and notes
- **Multiple Disciplines**: Support for Boulder, Lead, and Top Rope climbing
- **Grade Systems**: V-scale for bouldering, YDS for sport climbing
- **Progress Analytics**: Detailed statistics and progress tracking
- **Authentication**: Secure JWT-based authentication
- **Real-time Sync**: Connect to your Spring Boot backend

## 🎨 Design System

- **Color Palette**: Modern indigo primary with vibrant accent colors
- **Typography**: Clean, readable fonts with proper hierarchy
- **Gradients**: Beautiful gradient backgrounds and cards
- **Animations**: Smooth transitions and micro-interactions
- **Icons**: Emoji-based icons for a friendly, approachable feel

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Expo CLI
- iOS Simulator or Android Emulator (optional)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd AscendApp
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

4. **Run on your preferred platform**
   ```bash
   # iOS
   npm run ios
   
   # Android
   npm run android
   
   # Web
   npm run web
   ```

## 🔧 Configuration

### Environment Setup

1. **Copy the example environment file**
   ```bash
   cp .env.example .env
   ```

2. **Configure your environment variables**
   ```bash
   # Weather API Configuration
   WEATHER_API_KEY=your_weather_api_key_here
   WEATHER_API_BASE_URL=http://api.weatherapi.com/v1
   
   # Backend API Configuration
   BACKEND_API_URL=your_backend_url_here
   ```

3. **Get API Keys**
   - **WeatherAPI.com**: Sign up at [weatherapi.com](https://www.weatherapi.com/) for a free API key (1,000,000 calls/month)
   - **Backend**: Use your deployed backend URL

### Backend Connection

The app automatically uses the `BACKEND_API_URL` from your `.env` file. Update it to point to your backend:

```typescript
// This is now handled by environment variables
BACKEND_API_URL=https://ascend-api-production.up.railway.app
```

### Network Configuration

For different environments:
- **iOS Simulator**: Use `https://ascend-api-production.up.railway.app`
- **Android Emulator**: Use `10.0.2.2:8080`
- **Physical Device**: Use your computer's IP address

## 📱 App Structure

```
src/
├── components/          # Reusable UI components
├── contexts/           # React contexts (Auth)
├── navigation/         # Navigation configuration
├── screens/           # App screens
│   ├── LoginScreen.tsx
│   ├── SessionsScreen.tsx
│   ├── AddSessionScreen.tsx
│   ├── AnalyticsScreen.tsx
│   └── ProfileScreen.tsx
├── services/          # API services
├── theme/            # Design system
│   └── colors.ts
└── types/            # TypeScript interfaces
```

## 🎯 Key Screens

### Login Screen
- Beautiful gradient background
- Smooth authentication flow
- Registration and login in one screen
- Modern form design

### Sessions Screen
- Card-based session display
- Gradient cards for each discipline
- Search and filtering capabilities
- Pull-to-refresh functionality

### Add Session Screen
- Intuitive grade selection
- Discipline-specific color coding
- Modern form inputs
- Real-time validation

### Analytics Screen
- Comprehensive progress tracking
- Visual data representation
- Discipline breakdown
- Achievement highlights

## 🛠 Tech Stack

- **Framework**: React Native with Expo
- **Language**: TypeScript
- **UI Library**: React Native Paper
- **Navigation**: React Navigation
- **State Management**: React Context
- **Storage**: AsyncStorage
- **Styling**: StyleSheet with custom design system
- **Gradients**: Expo Linear Gradient

## 🎨 Design Principles

### Target Audience: 18-25 Year Olds
- **Bold Colors**: Vibrant, energetic color palette
- **Modern Typography**: Clean, readable fonts
- **Intuitive Navigation**: Easy-to-use interface
- **Visual Feedback**: Immediate response to user actions
- **Social Elements**: Achievement sharing and progress celebration

### Visual Hierarchy
- Clear information architecture
- Consistent spacing and alignment
- Proper contrast ratios
- Meaningful use of color

## 🔐 Authentication Flow

1. **Login/Register**: Email and password authentication
2. **Token Storage**: Secure JWT token storage
3. **Auto-login**: Persistent session management
4. **Logout**: Secure token removal

## 📊 Data Management

- **Real-time Sync**: Immediate backend communication
- **Offline Support**: Local data caching
- **Error Handling**: Graceful error management
- **Loading States**: Smooth loading experiences

## 🚀 Deployment

### Building for Production

1. **Configure environment**
   ```bash
   # Update API URLs for production
   # Configure app icons and splash screens
   ```

2. **Build the app**
   ```bash
   expo build:android  # For Android
   expo build:ios      # For iOS
   ```

3. **Submit to stores**
   - Follow platform-specific guidelines
   - Test thoroughly before submission

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Check the documentation
- Review the API documentation

---

**Built with ❤️ for the climbing community** 