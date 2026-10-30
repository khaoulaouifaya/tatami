import { useEffect, useRef, useState } from 'react'
import {
  ActivityIndicator,
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
import { ArrowLeft, Check, Mail } from 'lucide-react-native'

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
  crimsonLight: '#FFB4AB',
  errorBackground: '#93000A',
}

const Text = ({ style, ...props }) => (
  <NativeText {...props} style={[{ fontFamily: 'Chivo-Regular' }, style]} />
)

function ForgotPasswordScreen({ onBackToLogin }) {
  const [email, setEmail] = useState('')
  const [isFocused, setIsFocused] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isSent, setIsSent] = useState(false)
  const [hasError, setHasError] = useState(false)
  const timer = useRef(null)

  useEffect(() => () => clearTimeout(timer.current), [])

  function handleSubmit() {
    if (isLoading) return

    const normalizedEmail = email.trim()
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
      setHasError(true)
      return
    }

    setHasError(false)
    setIsLoading(true)
    timer.current = setTimeout(() => {
      setIsLoading(false)
      setIsSent(true)
    }, 1500)
  }

  return (
    <SafeAreaView edges={['top', 'bottom']} style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.flex}
      >
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.topline}>
            <Text style={styles.toplineLabel}>TATAMI / ACCOUNT RECOVERY</Text>
            <View style={styles.toplineRule} />
          </View>

          <View style={styles.main}>
            <View style={styles.heading}>
              <Text style={styles.eyebrow}>03 . RÉINITIALISATION</Text>
              <Text accessibilityRole="header" style={styles.title}>
                OUBLIÉ ?
              </Text>
              <Text style={styles.description}>
                Saisis ton adresse e-mail ci-dessous pour recevoir un lien de
                réinitialisation de ton mot de passe.
              </Text>
            </View>

            {isSent ? (
              <View
                accessibilityLiveRegion="polite"
                accessibilityRole="alert"
                style={styles.confirmation}
              >
                <View style={styles.confirmationIcon}>
                  <Check color={COLORS.crimsonLight} size={21} strokeWidth={2.5} />
                </View>
                <Text style={styles.confirmationText}>
                  Lien envoyé avec succès. Vérifie ta boîte de réception.
                </Text>
              </View>
            ) : (
              <View style={styles.form}>
                <View style={styles.field}>
                  <Text style={styles.label}>ADRESSE E-MAIL</Text>
                  <View
                    style={[
                      styles.inputWrap,
                      isFocused && styles.inputWrapFocused,
                      hasError && styles.inputWrapError,
                    ]}
                  >
                    <Mail color={COLORS.muted} size={18} strokeWidth={1.8} />
                    <TextInput
                      accessibilityLabel="Adresse e-mail"
                      autoCapitalize="none"
                      autoComplete="email"
                      autoCorrect={false}
                      keyboardType="email-address"
                      onBlur={() => setIsFocused(false)}
                      onChangeText={(value) => {
                        setEmail(value)
                        setHasError(false)
                      }}
                      onFocus={() => setIsFocused(true)}
                      onSubmitEditing={handleSubmit}
                      placeholder="vous@exemple.fr"
                      placeholderTextColor={COLORS.secondary}
                      returnKeyType="send"
                      selectionColor={COLORS.primary}
                      style={styles.input}
                      textContentType="emailAddress"
                      value={email}
                    />
                  </View>
                  {hasError && (
                    <Text accessibilityRole="alert" style={styles.errorText}>
                      Saisis une adresse e-mail valide.
                    </Text>
                  )}
                </View>

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
                      <Text style={styles.submitText}>ENVOI EN COURS…</Text>
                    </View>
                  ) : (
                    <Text style={styles.submitText}>ENVOYER LE LIEN</Text>
                  )}
                </Pressable>
              </View>
            )}
          </View>

          <Pressable
            accessibilityRole="button"
            onPress={onBackToLogin}
            style={styles.backButton}
          >
            <ArrowLeft color={COLORS.secondary} size={17} />
            <Text style={styles.backText}>RETOUR À LA CONNEXION</Text>
          </Pressable>
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
  content: {
    flexGrow: 1,
    justifyContent: 'space-between',
    paddingHorizontal: 26,
    paddingBottom: 24,
  },
  topline: {
    minHeight: 49,
    justifyContent: 'center',
  },
  toplineLabel: {
    color: COLORS.muted,
    fontSize: 9,
    letterSpacing: 1.4,
  },
  toplineRule: {
    backgroundColor: COLORS.border,
    height: 1,
    marginTop: 14,
  },
  main: {
    flex: 1,
    justifyContent: 'center',
    paddingVertical: 36,
  },
  heading: {
    marginBottom: 32,
  },
  eyebrow: {
    color: COLORS.crimsonLight,
    fontSize: 10,
    letterSpacing: 1.5,
    marginBottom: 12,
  },
  title: {
    color: COLORS.primary,
    fontFamily: 'Anybody-BlackItalic',
    fontSize: 36,
    includeFontPadding: false,
    letterSpacing: -1,
  },
  description: {
    color: COLORS.secondary,
    fontSize: 14,
    lineHeight: 22,
    marginTop: 14,
    maxWidth: 330,
  },
  form: {
    gap: 20,
  },
  field: {
    gap: 9,
  },
  label: {
    color: COLORS.primary,
    fontSize: 10,
    letterSpacing: 1.2,
  },
  inputWrap: {
    alignItems: 'center',
    backgroundColor: COLORS.input,
    borderColor: COLORS.border,
    borderRadius: 4,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 12,
    height: 52,
    paddingHorizontal: 14,
  },
  inputWrapFocused: {
    borderColor: COLORS.crimsonBright,
  },
  inputWrapError: {
    borderColor: COLORS.errorBackground,
  },
  input: {
    color: COLORS.primary,
    flex: 1,
    fontFamily: 'Chivo-Regular',
    fontSize: 14,
    height: '100%',
    paddingVertical: 0,
  },
  errorText: {
    color: COLORS.crimsonLight,
    fontSize: 12,
    marginTop: 1,
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
    letterSpacing: 1.4,
  },
  confirmation: {
    alignItems: 'flex-start',
    backgroundColor: COLORS.container,
    borderColor: COLORS.border,
    borderRadius: 4,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 14,
    padding: 18,
  },
  confirmationIcon: {
    alignItems: 'center',
    borderColor: COLORS.border,
    borderRadius: 4,
    borderWidth: 1,
    height: 38,
    justifyContent: 'center',
    width: 38,
  },
  confirmationText: {
    color: COLORS.primary,
    flex: 1,
    fontSize: 14,
    lineHeight: 21,
    paddingTop: 1,
  },
  backButton: {
    alignItems: 'center',
    alignSelf: 'center',
    flexDirection: 'row',
    gap: 9,
    justifyContent: 'center',
    minHeight: 44,
  },
  backText: {
    color: COLORS.secondary,
    fontSize: 10,
    letterSpacing: 1.1,
  },
})

export default ForgotPasswordScreen
