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
  Check,
  FileText,
  Lock,
  Mail,
  MapPin,
  Phone,
  User,
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
  crimsonLight: '#FFB4AB',
  success: '#1F9D55',
  errorBackground: '#93000A',
}

const SEX_OPTIONS = ['Femme', 'Homme', 'Autre']
const BIRTHPLACE_OPTIONS = ['France', 'Étranger']
const CONSENT_LABEL =
  "Je donne mon consentement au droit à l'image et au traitement des données personnelles pour moi-même et mes enfants mineurs."

const Text = ({ style, ...props }) => (
  <NativeText {...props} style={[{ fontFamily: 'Chivo-Regular' }, style]} />
)

function RegisterScreen({ onLoginPress, onRegistrationSuccess }) {
  const [form, setForm] = useState({
    email: '',
    password: '',
    firstName: '',
    birthName: '',
    usageName: '',
    sex: '',
    birthDate: '',
    nationality: '',
    birthplace: '',
    birthDepartment: '',
    birthCommune: '',
    mobile: '',
    address: '',
  })
  const [focusedField, setFocusedField] = useState(null)
  const [hasConsent, setHasConsent] = useState(false)
  const [hasCertificate, setHasCertificate] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState([])
  const timer = useRef(null)

  useEffect(() => () => clearTimeout(timer.current), [])

  function updateField(field, value) {
    setForm((current) => ({ ...current, [field]: value }))
    setErrors([])
  }

  function validateForm() {
    const requiredFields = [
      ['email', 'Adresse e-mail'],
      ['password', 'Mot de passe'],
      ['firstName', 'Prénom'],
      ['birthName', 'Nom de naissance'],
      ['sex', 'Sexe'],
      ['birthDate', 'Date de naissance'],
      ['nationality', 'Nationalité'],
      ['birthplace', 'Lieu de naissance'],
      ['mobile', 'Mobile'],
      ['address', 'Adresse postale complète'],
    ]
    const validationErrors = requiredFields
      .filter(([field]) => !form[field].trim())
      .map(([, label]) => `${label} : champ obligatoire`)

    if (form.birthplace === 'France') {
      if (!form.birthDepartment.trim()) {
        validationErrors.push('Département de naissance : champ obligatoire')
      }
      if (!form.birthCommune.trim()) {
        validationErrors.push('Commune de naissance : champ obligatoire')
      }
    }

    if (form.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      validationErrors.push('Adresse e-mail invalide')
    }

    if (form.birthDate.trim()) {
      const match = form.birthDate.match(/^(\d{2})\/(\d{2})\/(\d{4})$/)
      const date = match
        ? new Date(Number(match[3]), Number(match[2]) - 1, Number(match[1]))
        : null
      const isValidDate =
        date &&
        date.getFullYear() === Number(match[3]) &&
        date.getMonth() === Number(match[2]) - 1 &&
        date.getDate() === Number(match[1])
      if (!isValidDate) {
        validationErrors.push('Date de naissance invalide (format JJ/MM/AAAA)')
      }
    }

    if (form.mobile && form.mobile.replace(/\D/g, '').length !== 10) {
      validationErrors.push('Le mobile doit contenir 10 chiffres')
    }

    if (!hasCertificate) validationErrors.push('Certificat médical obligatoire')
    if (!hasConsent) validationErrors.push('Consentement obligatoire')

    return validationErrors
  }

  function handleSubmit() {
    if (isLoading) return

    const validationErrors = validateForm()
    if (validationErrors.length > 0) {
      setErrors(validationErrors)
      return
    }

    setErrors([])
    setIsLoading(true)
    timer.current = setTimeout(() => {
      setIsLoading(false)
      Alert.alert(
        'Inscription réussie',
        'Votre demande d’inscription a bien été enregistrée.',
        [{ text: 'Continuer', onPress: () => onRegistrationSuccess?.() }],
      )
    }, 900)
  }

  function renderInput({
    field,
    label,
    icon: Icon,
    placeholder,
    required = false,
    keyboardType = 'default',
    autoCapitalize = 'words',
    secureTextEntry = false,
    maxLength,
    inputMode,
    returnKeyType = 'next',
  }) {
    const isFocused = focusedField === field

    return (
      <View style={styles.field} key={field}>
        <Text style={styles.label}>
          {label}
          {required ? <Text style={styles.required}> *</Text> : null}
          {!required ? <Text style={styles.optional}>  OPTIONNEL</Text> : null}
        </Text>
        <View style={[styles.inputWrap, isFocused && styles.inputWrapFocused]}>
          <Icon color={isFocused ? COLORS.secondary : COLORS.muted} size={17} />
          <TextInput
            accessibilityLabel={label}
            autoCapitalize={autoCapitalize}
            autoComplete={field === 'email' ? 'email' : 'off'}
            autoCorrect={false}
            inputMode={inputMode}
            keyboardType={keyboardType}
            maxLength={maxLength}
            onBlur={() => setFocusedField(null)}
            onChangeText={(value) => updateField(field, value)}
            onFocus={() => setFocusedField(field)}
            onSubmitEditing={returnKeyType === 'done' ? handleSubmit : undefined}
            placeholder={placeholder}
            placeholderTextColor={COLORS.secondary}
            returnKeyType={returnKeyType}
            secureTextEntry={secureTextEntry}
            selectionColor={COLORS.crimson}
            style={styles.input}
            value={form[field]}
          />
        </View>
      </View>
    )
  }

  function renderChips(options, selected, onSelect, accessibilityLabel) {
    return (
      <View accessibilityLabel={accessibilityLabel} style={styles.chipRow}>
        {options.map((option) => {
          const isSelected = selected === option
          return (
            <Pressable
              accessibilityRole="radio"
              accessibilityState={{ checked: isSelected }}
              key={option}
              onPress={() => {
                onSelect(option)
                setErrors([])
              }}
              style={[styles.chip, isSelected && styles.chipSelected]}
            >
              <Text style={[styles.chipText, isSelected && styles.chipTextSelected]}>
                {option.toUpperCase()}
              </Text>
            </Pressable>
          )
        })}
      </View>
    )
  }

  return (
    <SafeAreaView edges={['top', 'bottom']} style={styles.safeArea}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.flex}
        >
          <ScrollView
            contentContainerStyle={[
              styles.content,
            ]}
            keyboardShouldPersistTaps="handled"
          >
            <View style={styles.brand}>
              <Text accessibilityRole="header" style={styles.brandTitle}>TATAMI</Text>
              <View style={styles.brandRule} />
            </View>

            <View style={styles.hero}>
              <Text style={styles.eyebrow}>MEMBER REGISTRATION / 02</Text>
              <Text accessibilityRole="header" style={styles.title}>
                CRÉER UN COMPTE
              </Text>
              <Text style={styles.subtitle}>
                Renseignez vos informations pour finaliser votre inscription.
              </Text>
              <Text style={styles.requiredHint}>
                <Text style={styles.required}>*</Text> CHAMPS OBLIGATOIRES
              </Text>
            </View>

            {errors.length > 0 && (
              <View
                accessibilityLiveRegion="polite"
                accessibilityRole="alert"
                style={styles.errorBox}
              >
                <Text style={styles.errorTitle}>INSCRIPTION INCOMPLÈTE</Text>
                {errors.map((error) => (
                  <Text key={error} style={styles.errorText}>
                    {`— ${error}`}
                  </Text>
                ))}
              </View>
            )}

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>01 / IDENTITÉ & PROFIL</Text>
              {renderInput({
                field: 'email',
                label: 'Adresse e-mail',
                icon: Mail,
                placeholder: 'vous@exemple.fr',
                required: true,
                keyboardType: 'email-address',
                autoCapitalize: 'none',
                inputMode: 'email',
              })}
              {renderInput({
                field: 'password',
                label: 'Mot de passe',
                icon: Lock,
                placeholder: 'Créer un mot de passe',
                required: true,
                autoCapitalize: 'none',
                secureTextEntry: true,
              })}
              {renderInput({
                field: 'firstName',
                label: 'Prénom (1er uniquement)',
                icon: User,
                placeholder: 'Votre prénom',
                required: true,
              })}
              {renderInput({
                field: 'birthName',
                label: 'Nom de naissance',
                icon: User,
                placeholder: 'Votre nom de naissance',
                required: true,
              })}
              {renderInput({
                field: 'usageName',
                label: 'Nom d’usage',
                icon: User,
                placeholder: 'Votre nom d’usage',
              })}

              <View style={styles.field}>
                <Text style={styles.label}>
                  Sexe<Text style={styles.required}> *</Text>
                </Text>
                {renderChips(
                  SEX_OPTIONS,
                  form.sex,
                  (value) => updateField('sex', value),
                  'Sélection du sexe',
                )}
              </View>

              {renderInput({
                field: 'birthDate',
                label: 'Date de naissance',
                icon: FileText,
                placeholder: 'JJ/MM/AAAA',
                required: true,
                keyboardType: 'number-pad',
                autoCapitalize: 'none',
                maxLength: 10,
              })}
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>02 / CONTACT & LOCALISATION</Text>
              {renderInput({
                field: 'nationality',
                label: 'Nationalité',
                icon: MapPin,
                placeholder: 'Ex. Française',
                required: true,
              })}

              <View style={styles.field}>
                <Text style={styles.label}>
                  Lieu de naissance<Text style={styles.required}> *</Text>
                </Text>
                {renderChips(
                  BIRTHPLACE_OPTIONS,
                  form.birthplace,
                  (value) => {
                    setForm((current) => ({
                      ...current,
                      birthplace: value,
                      ...(value === 'France'
                        ? {}
                        : { birthDepartment: '', birthCommune: '' }),
                    }))
                  },
                  'Lieu de naissance',
                )}
              </View>

              {form.birthplace === 'France' && (
                <>
                  {renderInput({
                    field: 'birthDepartment',
                    label: 'Département de naissance',
                    icon: MapPin,
                    placeholder: 'Ex. 75',
                    required: true,
                    autoCapitalize: 'characters',
                  })}
                  {renderInput({
                    field: 'birthCommune',
                    label: 'Commune de naissance',
                    icon: MapPin,
                    placeholder: 'Votre commune de naissance',
                    required: true,
                  })}
                </>
              )}

              {renderInput({
                field: 'mobile',
                label: 'Téléphone mobile',
                icon: Phone,
                placeholder: '0600000000',
                required: true,
                keyboardType: 'phone-pad',
                autoCapitalize: 'none',
                maxLength: 10,
              })}
              {renderInput({
                field: 'address',
                label: 'Adresse postale complète',
                icon: MapPin,
                placeholder: 'Numéro, rue, code postal, ville',
                required: true,
                returnKeyType: 'done',
              })}
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>03 / DOCUMENTS & CONSENTEMENT</Text>
              <View style={styles.field}>
                <Text style={styles.label}>
                  Certificat médical<Text style={styles.required}> *</Text>
                </Text>
                <Pressable
                  accessibilityRole="button"
                  onPress={() => {
                    setHasCertificate(true)
                    setErrors([])
                  }}
                  style={({ pressed }) => [
                    styles.uploadButton,
                    pressed && styles.pressed,
                  ]}
                >
                  <FileText color={COLORS.secondary} size={18} />
                  <Text style={styles.uploadText}>
                    {hasCertificate ? 'AJOUTER UN AUTRE DOCUMENT' : 'AJOUTER UN SCAN/PHOTO'}
                  </Text>
                </Pressable>
                {hasCertificate && (
                  <View style={styles.fileBadge}>
                    <Check color={COLORS.primary} size={16} strokeWidth={2.5} />
                    <Text style={styles.fileName}>certificat_medical.pdf</Text>
                    <Text style={styles.fileStatus}>VALIDÉ</Text>
                  </View>
                )}
              </View>

              <Pressable
                accessibilityRole="checkbox"
                accessibilityState={{ checked: hasConsent }}
                onPress={() => {
                  setHasConsent((checked) => !checked)
                  setErrors([])
                }}
                style={styles.consentRow}
              >
                <View style={[styles.checkbox, hasConsent && styles.checkboxChecked]}>
                  {hasConsent && (
                    <Check color={COLORS.primary} size={16} strokeWidth={3} />
                  )}
                </View>
                <Text style={styles.consentText}>{CONSENT_LABEL}</Text>
              </Pressable>
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
                <Text style={styles.submitText}>FINALISER L’INSCRIPTION</Text>
              )}
            </Pressable>

            <View style={styles.footer}>
              <Text style={styles.footerText}>DÉJÀ UN COMPTE ?</Text>
              <Pressable
                accessibilityRole="button"
                onPress={onLoginPress}
                style={styles.loginButton}
              >
                <Text style={styles.loginLink}>SE CONNECTER</Text>
              </Pressable>
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
  content: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 24,
  },
  brand: {
    alignItems: 'center',
    marginBottom: 24,
  },
  brandTitle: {
    color: COLORS.primary,
    fontFamily: 'Anybody-BlackItalic',
    fontSize: 40,
    includeFontPadding: false,
    letterSpacing: 3,
  },
  brandRule: {
    backgroundColor: COLORS.border,
    height: 1,
    marginTop: 19,
    width: '100%',
  },
  hero: {
    marginBottom: 24,
  },
  eyebrow: {
    color: COLORS.crimsonLight,
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 1.6,
    marginBottom: 8,
  },
  title: {
    color: COLORS.primary,
    fontFamily: 'Anybody-BlackItalic',
    fontSize: 27,
    includeFontPadding: false,
    letterSpacing: 0.8,
  },
  subtitle: {
    color: COLORS.secondary,
    fontSize: 12,
    lineHeight: 18,
    marginTop: 8,
  },
  requiredHint: {
    color: COLORS.secondary,
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 1,
    marginTop: 12,
  },
  required: {
    color: COLORS.crimsonLight,
    fontWeight: '900',
  },
  optional: {
    color: COLORS.secondary,
    fontSize: 8,
    fontWeight: '700',
    letterSpacing: 0.6,
  },
  errorBox: {
    backgroundColor: COLORS.errorBackground,
    borderColor: COLORS.errorBackground,
    borderRadius: 4,
    borderWidth: 1,
    marginBottom: 20,
    padding: 13,
  },
  errorTitle: {
    color: COLORS.primary,
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 1,
    marginBottom: 7,
  },
  errorText: {
    color: COLORS.crimsonLight,
    fontSize: 11,
    lineHeight: 17,
  },
  section: {
    borderTopColor: COLORS.border,
    borderTopWidth: 1,
    marginBottom: 24,
    paddingTop: 17,
  },
  sectionTitle: {
    color: COLORS.primary,
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 1.2,
    marginBottom: 17,
  },
  field: {
    marginBottom: 16,
  },
  label: {
    color: COLORS.primary,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.8,
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  inputWrap: {
    alignItems: 'center',
    backgroundColor: COLORS.input,
    borderColor: COLORS.border,
    borderRadius: 4,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 11,
    height: 52,
    paddingHorizontal: 13,
  },
  inputWrapFocused: {
    borderColor: COLORS.crimsonBright,
  },
  input: {
    color: COLORS.primary,
    flex: 1,
    fontFamily: 'Chivo-Regular',
    fontSize: 13,
    height: '100%',
    paddingVertical: 0,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    alignItems: 'center',
    backgroundColor: COLORS.input,
    borderColor: COLORS.border,
    borderRadius: 4,
    borderWidth: 1,
    justifyContent: 'center',
    minHeight: 42,
    minWidth: 82,
    paddingHorizontal: 15,
  },
  chipSelected: {
    backgroundColor: COLORS.crimson,
    borderColor: COLORS.crimson,
  },
  chipText: {
    color: COLORS.secondary,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  chipTextSelected: {
    color: COLORS.primary,
  },
  uploadButton: {
    alignItems: 'center',
    backgroundColor: COLORS.container,
    borderColor: COLORS.border,
    borderRadius: 4,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 10,
    height: 52,
    justifyContent: 'center',
  },
  uploadText: {
    color: COLORS.primary,
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 0.9,
  },
  fileBadge: {
    alignItems: 'center',
    backgroundColor: COLORS.success,
    borderRadius: 4,
    flexDirection: 'row',
    gap: 8,
    marginTop: 9,
    minHeight: 40,
    paddingHorizontal: 11,
  },
  fileName: {
    color: COLORS.primary,
    flex: 1,
    fontSize: 11,
    fontWeight: '700',
  },
  fileStatus: {
    color: COLORS.primary,
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 0.8,
  },
  consentRow: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    gap: 11,
    marginTop: 3,
  },
  checkbox: {
    alignItems: 'center',
    backgroundColor: COLORS.input,
    borderColor: COLORS.border,
    borderRadius: 3,
    borderWidth: 1,
    height: 24,
    justifyContent: 'center',
    marginTop: 1,
    width: 24,
  },
  checkboxChecked: {
    backgroundColor: COLORS.crimson,
    borderColor: COLORS.crimson,
  },
  consentText: {
    color: COLORS.secondary,
    flex: 1,
    fontSize: 11,
    lineHeight: 17,
  },
  submitButton: {
    alignItems: 'center',
    backgroundColor: COLORS.crimson,
    borderRadius: 4,
    height: 54,
    justifyContent: 'center',
    marginTop: 2,
  },
  submitPressed: {
    backgroundColor: COLORS.crimsonDark,
  },
  submitDisabled: {
    opacity: 0.7,
  },
  submitContents: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 10,
  },
  submitText: {
    color: COLORS.primary,
    fontFamily: 'Anybody-Bold',
    fontSize: 11,
    letterSpacing: 1.2,
  },
  footer: {
    alignItems: 'center',
    borderTopColor: COLORS.border,
    borderTopWidth: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 23,
    paddingTop: 17,
  },
  footerText: {
    color: COLORS.secondary,
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.9,
  },
  loginButton: {
    marginLeft: 7,
    minHeight: 32,
    justifyContent: 'center',
  },
  loginLink: {
    color: COLORS.primary,
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1.1,
    textDecorationColor: COLORS.crimson,
    textDecorationLine: 'underline',
  },
  pressed: {
    opacity: 0.78,
  },
})

export default RegisterScreen
