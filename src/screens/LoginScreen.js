import { useEffect, useRef, useState } from 'react'
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text as NativeText,
  TextInput,
  View,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import {
  ArrowUpRight,
  Eye,
  EyeOff,
  Lock,
  Mail,
} from 'lucide-react-native'

const COLORS = {
  canvas: '#0B0B0B',
  container: '#1A1A1C',
  input: '#131313',
  border: '#28282C',
  primary: '#FFFFFF',
  secondary: '#9A9A9A',
  muted: '#555558',
  crimson: '#E5322D',
  crimsonDark: '#BD0E15',
  crimsonBright: '#FF5449',
}

const Text = ({ style, ...props }) => (
  <NativeText {...props} style={[{ fontFamily: 'Chivo-Regular' }, style]} />
)

function LoginScreen({ onCreateAccount, onForgotPassword, onLoginSuccess, onOfflineDemo }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [focusedField, setFocusedField] = useState(null)
  const [isPasswordVisible, setIsPasswordVisible] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const timer = useRef(null)

  useEffect(() => () => clearTimeout(timer.current), [])

  function handleSubmit() {
    if (isLoading) return

    setIsLoading(true)
    timer.current = setTimeout(() => {
      setIsLoading(false)
      onLoginSuccess()
    }, 1500)
  }

  function handleUnavailableAction(action, callback) {
    if (callback) {
      callback()
      return
    }

    Alert.alert(action, 'Cette fonctionnalité sera disponible prochainement.')
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.flex}
      >
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
          >
            <View style={styles.topline}>
              <View style={styles.liveStatus}>
                <View style={styles.liveDot} />
                <Text style={styles.liveText}>OPEN MAT</Text>
              </View>
            </View>

            <View style={styles.hero}>
              <Text accessibilityRole="header" style={styles.title}>
                TATAMI
              </Text>
              <View style={styles.titleRule} />
              <Text style={styles.intro}>ACCÈS MEMBRE</Text>
            </View>

            <View style={styles.form}>
            <View style={styles.field}>
              <Text style={styles.label}>ADRESSE E-MAIL</Text>
              <View
                style={[
                  styles.inputWrap,
                  focusedField === 'email' && styles.inputWrapFocused,
                ]}
              >
                <Mail color={COLORS.muted} size={18} strokeWidth={1.8} />
                <TextInput
                  accessibilityLabel="Adresse e-mail"
                  autoCapitalize="none"
                  autoComplete="email"
                  autoCorrect={false}
                  keyboardType="email-address"
                  onChangeText={(value) => {
                    setEmail(value)
                  }}
                  onBlur={() => setFocusedField(null)}
                  onFocus={() => setFocusedField('email')}
                  placeholder="vous@exemple.fr"
                  placeholderTextColor={COLORS.secondary}
                  returnKeyType="next"
                  selectionColor={COLORS.primary}
                  style={styles.input}
                  textContentType="emailAddress"
                  value={email}
                />
              </View>
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>MOT DE PASSE</Text>
              <View
                style={[
                  styles.inputWrap,
                  focusedField === 'password' && styles.inputWrapFocused,
                ]}
              >
                <Lock color={COLORS.muted} size={18} strokeWidth={1.8} />
                <TextInput
                  accessibilityLabel="Mot de passe"
                  autoCapitalize="none"
                  autoComplete="current-password"
                  onChangeText={(value) => {
                    setPassword(value)
                  }}
                  onBlur={() => setFocusedField(null)}
                  onFocus={() => setFocusedField('password')}
                  onSubmitEditing={handleSubmit}
                  placeholder="Votre mot de passe"
                  placeholderTextColor={COLORS.secondary}
                  returnKeyType="go"
                  secureTextEntry={!isPasswordVisible}
                  selectionColor={COLORS.primary}
                  style={styles.input}
                  textContentType="password"
                  value={password}
                />
                <Pressable
                  accessibilityLabel={
                    isPasswordVisible ? 'Masquer le mot de passe' : 'Afficher le mot de passe'
                  }
                  accessibilityRole="button"
                  hitSlop={10}
                  onPress={() => setIsPasswordVisible((visible) => !visible)}
                  style={styles.visibilityButton}
                >
                  {isPasswordVisible ? (
                    <EyeOff color={COLORS.secondary} size={18} strokeWidth={1.8} />
                  ) : (
                    <Eye color={COLORS.secondary} size={18} strokeWidth={1.8} />
                  )}
                </Pressable>
              </View>
            </View>

            <Pressable
              accessibilityRole="button"
              onPress={() => handleUnavailableAction('Mot de passe oublié ?', onForgotPassword)}
              style={styles.forgotButton}
            >
              <Text style={styles.forgotText}>MOT DE PASSE OUBLIÉ ?</Text>
              <ArrowUpRight color={COLORS.muted} size={14} />
            </Pressable>

            <Pressable
              accessibilityRole="button"
              disabled={isLoading}
              onPress={handleSubmit}
              style={({ pressed }) => [
                styles.submitButton,
                pressed && !isLoading && styles.submitPressed,
                isLoading && styles.submitDisabled,
              ]}
            >
              {isLoading ? (
                <View style={styles.submitContents}>
                  <ActivityIndicator color={COLORS.primary} size="small" />
                  <Text style={styles.submitText}>VÉRIFICATION…</Text>
                </View>
              ) : (
                <Text style={styles.submitText}>SE CONNECTER</Text>
              )}
            </Pressable>
            </View>

            <View style={styles.footer}>
              <View style={styles.footerRule} />
              <Text style={styles.footerPrompt}>PAS ENCORE MEMBRE ?</Text>
              <Pressable
                accessibilityRole="button"
                onPress={() => handleUnavailableAction('Créer un compte', onCreateAccount)}
                style={styles.createAccountButton}
              >
                <Text style={styles.createAccountText}>CRÉER UN COMPTE</Text>
                <ArrowUpRight color={COLORS.primary} size={15} />
              </Pressable>
              {__DEV__ && (
                <Pressable
                  accessibilityRole="button"
                  onPress={onOfflineDemo}
                  style={styles.offlineDemoButton}
                >
                  <Text style={styles.offlineDemoText}>TESTER L’ÉCRAN HORS CONNEXION</Text>
                </Pressable>
              )}
            </View>
          </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: COLORS.canvas,
    flex: 1,
  },
  flex: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'space-between',
    paddingHorizontal: 26,
    paddingBottom: 24,
  },
  topline: {
    alignItems: 'center',
    borderBottomColor: COLORS.border,
    borderBottomWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    minHeight: 48,
  },
  liveStatus: {
    alignItems: 'center',
    alignSelf: 'flex-end',
    flexDirection: 'row',
    gap: 7,
  },
  liveDot: {
    backgroundColor: COLORS.crimson,
    height: 6,
    width: 6,
  },
  liveText: {
    color: COLORS.crimson,
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 1.3,
  },
  hero: {
    alignItems: 'center',
    marginTop: 56,
  },
  title: {
    color: COLORS.primary,
    fontSize: 54,
    fontFamily: 'Anybody-BlackItalic',
    includeFontPadding: false,
    letterSpacing: 3,
    lineHeight: 60,
  },
  titleRule: {
    backgroundColor: COLORS.border,
    height: 1,
    marginTop: 16,
    width: '100%',
  },
  intro: {
    color: COLORS.secondary,
    fontSize: 14,
    lineHeight: 21,
    marginTop: 14,
    maxWidth: 310,
    textAlign: 'center',
  },
  form: {
    marginTop: 36,
  },
  field: {
    marginBottom: 19,
  },
  label: {
    color: COLORS.secondary,
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 1.4,
    marginBottom: 9,
  },
  inputWrap: {
    alignItems: 'center',
    backgroundColor: COLORS.input,
    borderColor: COLORS.border,
    borderRadius: 4,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 13,
    height: 52,
    paddingHorizontal: 15,
  },
  inputWrapFocused: {
    borderColor: COLORS.crimsonBright,
  },
  input: {
    color: COLORS.primary,
    flex: 1,
    fontFamily: 'Chivo-Regular',
    fontSize: 14,
    height: '100%',
    paddingVertical: 0,
  },
  visibilityButton: {
    alignItems: 'center',
    height: 38,
    justifyContent: 'center',
    width: 30,
  },
  forgotButton: {
    alignItems: 'center',
    alignSelf: 'flex-end',
    flexDirection: 'row',
    gap: 4,
    marginBottom: 22,
    marginTop: -7,
    minHeight: 30,
  },
  forgotText: {
    color: COLORS.muted,
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 1,
  },
  submitButton: {
    alignItems: 'center',
    backgroundColor: COLORS.crimson,
    borderRadius: 4,
    height: 54,
    justifyContent: 'center',
  },
  submitPressed: {
    backgroundColor: COLORS.crimsonDark,
  },
  submitDisabled: {
    opacity: 0.72,
  },
  submitContents: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 10,
  },
  submitText: {
    color: COLORS.primary,
    fontFamily: 'Anybody-Bold',
    fontSize: 12,
    letterSpacing: 1.8,
  },
  footer: {
    marginTop: 38,
  },
  footerRule: {
    backgroundColor: COLORS.border,
    height: 1,
    marginBottom: 19,
    width: '100%',
  },
  footerPrompt: {
    color: COLORS.muted,
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 1.4,
    marginBottom: 11,
  },
  createAccountButton: {
    alignItems: 'center',
    alignSelf: 'flex-start',
    flexDirection: 'row',
    gap: 6,
    minHeight: 34,
  },
  createAccountText: {
    color: COLORS.primary,
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 1.4,
  },
  offlineDemoButton: {
    alignSelf: 'flex-start',
    borderColor: COLORS.border,
    borderRadius: 4,
    borderWidth: 1,
    marginTop: 10,
    paddingHorizontal: 9,
    paddingVertical: 7,
  },
  offlineDemoText: {
    color: COLORS.secondary,
    fontFamily: 'Anybody-Bold',
    fontSize: 7,
    letterSpacing: 0.4,
  },
})

export default LoginScreen
