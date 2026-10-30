import { useState } from 'react'
import { useFonts } from 'expo-font'
import { StatusBar } from 'expo-status-bar'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import Anybody_700Bold from '@expo-google-fonts/anybody/700Bold/Anybody_700Bold.ttf'
import Anybody_900Black_Italic from '@expo-google-fonts/anybody/900Black_Italic/Anybody_900Black_Italic.ttf'
import Chivo_400Regular from '@expo-google-fonts/chivo/400Regular/Chivo_400Regular.ttf'
import LoginScreen from './src/screens/LoginScreen.js'
import RegisterScreen from './src/screens/RegisterScreen.js'
import ForgotPasswordScreen from './src/screens/ForgotPasswordScreen.js'
import MainTabNavigation from './src/screens/MainTabNavigation.js'

export default function App() {
  const [activeScreen, setActiveScreen] = useState('login')
  const isRegisterScreen = activeScreen === 'register'
  const isForgotPasswordScreen = activeScreen === 'forgotPassword'
  const isMainApp = activeScreen === 'main'
  const [fontsLoaded] = useFonts({
    'Anybody-BlackItalic': Anybody_900Black_Italic,
    'Anybody-Bold': Anybody_700Bold,
    'Chivo-Regular': Chivo_400Regular,
  })

  if (!fontsLoaded) return null

  return (
    <SafeAreaProvider>
      <StatusBar style="light" />
      {isMainApp ? (
        <MainTabNavigation onLogout={() => setActiveScreen('login')} />
      ) : isRegisterScreen ? (
        <RegisterScreen
          onLoginPress={() => setActiveScreen('login')}
          onRegistrationSuccess={() => setActiveScreen('login')}
        />
      ) : isForgotPasswordScreen ? (
        <ForgotPasswordScreen onBackToLogin={() => setActiveScreen('login')} />
      ) : (
        <LoginScreen
          onCreateAccount={() => setActiveScreen('register')}
          onForgotPassword={() => setActiveScreen('forgotPassword')}
          onLoginSuccess={() => setActiveScreen('main')}
        />
      )}
    </SafeAreaProvider>
  )
}
