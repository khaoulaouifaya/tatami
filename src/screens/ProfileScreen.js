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
  ArrowLeft,
  Check,
  FileText,
  Mail,
  MapPin,
  Phone,
  Shield,
  User,
} from 'lucide-react-native'

const COLORS = {
  canvas: '#0B0B0B',
  surface: '#1A1A1C',
  input: '#131313',
  border: '#28282C',
  primary: '#FFFFFF',
  secondary: '#9A9A9A',
  muted: '#555558',
  crimson: '#E5322D',
  crimsonLight: '#FFB4AB',
  errorBackground: '#93000A',
  success: '#1F9D55',
}

const DEFAULT_PROFILE = {
  email: 'alexandre.martin@example.com',
  firstName: 'Alexandre',
  birthName: 'Martin',
  usageName: 'Martin',
  sex: 'H',
  birthDate: '14/06/1992',
  nationality: 'Française',
  birthplace: 'France',
  birthDepartment: '75',
  birthCommune: 'Paris',
  mobile: '0612345678',
  landline: '0144556677',
  street: '12 rue des Arts',
  postalCode: '75011',
  city: 'Paris',
  country: 'France',
}

const Text = ({ style, ...props }) => (
  <NativeText {...props} style={[{ fontFamily: 'Chivo-Regular' }, style]} />
)

function ProfileScreen({
  onBack,
  onLogout,
  initialProfile = DEFAULT_PROFILE,
  role = 'adult',
  embedded = false,
}) {
  const [profile, setProfile] = useState(() => ({ ...DEFAULT_PROFILE, ...initialProfile }))
  const [focusedField, setFocusedField] = useState(null)
  const [certificateIsValid, setCertificateIsValid] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const timer = useRef(null)

  useEffect(() => () => clearTimeout(timer.current), [])

  function updateField(field, value) {
    setProfile((current) => ({ ...current, [field]: value }))
  }

  function handleSave() {
    if (isSaving) return

    setShowSuccess(false)
    setIsSaving(true)
    timer.current = setTimeout(() => {
      setIsSaving(false)
      setShowSuccess(true)
      timer.current = setTimeout(() => setShowSuccess(false), 3000)
    }, 1000)
  }

  function handleBack() {
    if (onBack) {
      onBack()
      return
    }

    Alert.alert('Navigation', 'Aucun écran précédent n’est défini.')
  }

  function renderField({
    field,
    label,
    icon: Icon,
    editable = true,
    keyboardType = 'default',
    maxLength,
  }) {
    const isFocused = focusedField === field

    return (
      <View key={field} style={styles.field}>
        <Text style={styles.label}>{label}</Text>
        <View
          style={[
            styles.inputWrap,
            isFocused && editable && styles.inputWrapFocused,
            !editable && styles.inputWrapDisabled,
          ]}
        >
          {Icon ? <Icon color={editable ? COLORS.muted : COLORS.secondary} size={16} /> : null}
          <TextInput
            accessibilityLabel={label}
            autoCapitalize={field === 'email' ? 'none' : 'words'}
            autoComplete="off"
            autoCorrect={false}
            editable={editable}
            keyboardType={keyboardType}
            maxLength={maxLength}
            onBlur={() => setFocusedField(null)}
            onChangeText={(value) => updateField(field, value)}
            onFocus={() => setFocusedField(field)}
            placeholder={label}
            placeholderTextColor={COLORS.secondary}
            selectionColor={COLORS.crimson}
            style={styles.input}
            value={profile[field]}
          />
        </View>
        {!editable && <Text style={styles.fieldNote}>ADRESSE E-MAIL NON MODIFIABLE</Text>}
      </View>
    )
  }

  function renderOptions({ label, field, options, optionLabels = options }) {
    return (
      <View style={styles.field}>
        <Text style={styles.label}>{label}</Text>
        <View style={styles.optionsRow}>
          {options.map((option, index) => {
            const selected = profile[field] === option
            return (
              <Pressable
                accessibilityRole="radio"
                accessibilityState={{ checked: selected }}
                key={option}
                onPress={() => updateField(field, option)}
                style={[styles.option, selected && styles.optionSelected]}
              >
                <Text style={[styles.optionText, selected && styles.optionTextSelected]}>
                  {optionLabels[index]}
                </Text>
              </Pressable>
            )
          })}
        </View>
      </View>
    )
  }

  const roleLabel = role.toUpperCase()

  return (
    <SafeAreaView edges={embedded ? [] : ['top', 'bottom']} style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.flex}
      >
        <View style={styles.header}>
          <Pressable
            accessibilityLabel="Retour"
            accessibilityRole="button"
            hitSlop={10}
            onPress={handleBack}
            style={styles.backButton}
          >
            <ArrowLeft color={COLORS.secondary} size={20} />
          </Pressable>
          <Text accessibilityRole="header" style={styles.brand}>
            TATAMI
          </Text>
          <View style={styles.headerSpacer} />
        </View>

        {showSuccess && (
          <View
            accessibilityLiveRegion="polite"
            accessibilityRole="alert"
            style={styles.successBanner}
          >
            <Check color={COLORS.primary} size={17} strokeWidth={2.5} />
            <Text style={styles.successText}>Profil mis à jour avec succès.</Text>
          </View>
        )}

        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.titleBlock}>
            <Text style={styles.eyebrow}>05 . GESTION ATHLÈTE</Text>
            <Text accessibilityRole="header" style={styles.title}>
              MON PROFIL
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>01 / IDENTITÉ</Text>
            {renderField({
              field: 'email',
              label: 'ADRESSE E-MAIL',
              icon: Mail,
              editable: false,
              keyboardType: 'email-address',
            })}
            {renderField({ field: 'firstName', label: 'PRÉNOM (1ER UNIQUEMENT)', icon: User })}
            {renderField({ field: 'birthName', label: 'NOM DE NAISSANCE', icon: User })}
            {renderField({ field: 'usageName', label: 'NOM D’USAGE (OPTIONNEL)', icon: User })}
            {renderOptions({
              label: 'SEXE',
              field: 'sex',
              options: ['H', 'F'],
              optionLabels: ['HOMME', 'FEMME'],
            })}
            {renderField({
              field: 'birthDate',
              label: 'DATE DE NAISSANCE (JJ/MM/AAAA)',
              icon: FileText,
              keyboardType: 'numbers-and-punctuation',
              maxLength: 10,
            })}
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>02 / ORIGINE</Text>
            {renderField({ field: 'nationality', label: 'NATIONALITÉ', icon: User })}
            {renderOptions({
              label: 'LIEU DE NAISSANCE',
              field: 'birthplace',
              options: ['France', 'Étranger'],
              optionLabels: ['FRANCE', 'ÉTRANGER'],
            })}
            {profile.birthplace === 'France' && (
              <>
                {renderField({
                  field: 'birthDepartment',
                  label: 'DÉPARTEMENT DE NAISSANCE',
                  icon: MapPin,
                  maxLength: 3,
                })}
                {renderField({
                  field: 'birthCommune',
                  label: 'COMMUNE DE NAISSANCE',
                  icon: MapPin,
                })}
              </>
            )}
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>03 / CONTACT</Text>
            {renderField({
              field: 'mobile',
              label: 'TÉLÉPHONE MOBILE (10 CHIFFRES)',
              icon: Phone,
              keyboardType: 'phone-pad',
              maxLength: 10,
            })}
            {renderField({
              field: 'landline',
              label: 'TÉLÉPHONE FIXE (OPTIONNEL)',
              icon: Phone,
              keyboardType: 'phone-pad',
              maxLength: 10,
            })}
            {renderField({ field: 'street', label: 'VOIE', icon: MapPin })}
            {renderField({
              field: 'postalCode',
              label: 'CODE POSTAL (5 CHIFFRES)',
              icon: MapPin,
              keyboardType: 'number-pad',
              maxLength: 5,
            })}
            {renderField({ field: 'city', label: 'COMMUNE', icon: MapPin })}
            {renderField({ field: 'country', label: 'PAYS', icon: MapPin })}
          </View>

          <View style={styles.roleBadge}>
            <Text style={styles.roleText}>RÔLE : {roleLabel}</Text>
          </View>

          <View style={styles.certificateCard}>
            <View style={styles.sectionHeading}>
              <Shield color={COLORS.crimsonLight} size={17} />
              <Text style={styles.sectionTitle}>CERTIFICAT MÉDICAL</Text>
            </View>
            <Text style={styles.privacyNote}>
              DONNÉE DE SANTÉ CRYPTÉE — RÉSERVÉE À L’ADMINISTRATEUR
            </Text>

            {certificateIsValid ? (
              <View style={styles.validBadge}>
                <Check color={COLORS.primary} size={17} strokeWidth={2.5} />
                <Text style={styles.validText}>
                  certificat_valide.pdf - Validé par le staff
                </Text>
              </View>
            ) : (
              <View style={styles.missingBanner}>
                <Text style={styles.missingText}>
                  Certificat médical manquant ou expiré.
                </Text>
              </View>
            )}

            <Pressable
              accessibilityRole="button"
              onPress={() => setCertificateIsValid((valid) => !valid)}
              style={({ pressed }) => [styles.uploadButton, pressed && styles.pressed]}
            >
              <FileText color={COLORS.primary} size={17} />
              <Text style={styles.uploadText}>METTRE À JOUR LE SCAN / PHOTO</Text>
            </Pressable>
            <Pressable
              accessibilityRole="switch"
              accessibilityState={{ checked: certificateIsValid }}
              onPress={() => setCertificateIsValid((valid) => !valid)}
              style={styles.testToggle}
            >
              <View
                style={[
                  styles.toggleTrack,
                  certificateIsValid && styles.toggleTrackActive,
                ]}
              >
                <View
                  style={[
                    styles.toggleThumb,
                    certificateIsValid && styles.toggleThumbActive,
                  ]}
                />
              </View>
              <Text style={styles.testToggleText}>TEST LOCAL : ÉTAT DU CERTIFICAT</Text>
            </Pressable>
          </View>

          <Pressable
            accessibilityRole="button"
            disabled={isSaving}
            onPress={handleSave}
            style={({ pressed }) => [
              styles.saveButton,
              pressed && !isSaving && styles.saveButtonPressed,
              isSaving && styles.saveButtonDisabled,
            ]}
          >
            {isSaving ? (
              <View style={styles.saveContents}>
                <ActivityIndicator color={COLORS.primary} size="small" />
                <Text style={styles.saveText}>ENREGISTREMENT…</Text>
              </View>
            ) : (
              <Text style={styles.saveText}>ENREGISTRER LES MODIFICATIONS</Text>
            )}
          </Pressable>

          <Pressable
            accessibilityRole="button"
            onPress={onLogout}
            style={({ pressed }) => [styles.logoutButton, pressed && styles.pressed]}
          >
            <Text style={styles.logoutText}>SE DÉCONNECTER</Text>
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
  header: {
    alignItems: 'center',
    borderBottomColor: COLORS.border,
    borderBottomWidth: 1,
    flexDirection: 'row',
    height: 54,
    justifyContent: 'space-between',
    paddingHorizontal: 22,
  },
  backButton: {
    alignItems: 'flex-start',
    height: 40,
    justifyContent: 'center',
    width: 40,
  },
  brand: {
    color: COLORS.primary,
    fontFamily: 'Anybody-BlackItalic',
    fontSize: 18,
    letterSpacing: 1.4,
    position: 'absolute',
    textAlign: 'center',
    width: '100%',
  },
  headerSpacer: {
    width: 40,
  },
  successBanner: {
    alignItems: 'center',
    backgroundColor: COLORS.success,
    flexDirection: 'row',
    gap: 10,
    marginHorizontal: 20,
    marginTop: 12,
    paddingHorizontal: 13,
    paddingVertical: 11,
  },
  successText: {
    color: COLORS.primary,
    fontSize: 12,
  },
  content: {
    flexGrow: 1,
    paddingHorizontal: 22,
    paddingTop: 25,
    paddingBottom: 28,
  },
  titleBlock: {
    marginBottom: 24,
  },
  eyebrow: {
    color: COLORS.crimsonLight,
    fontFamily: 'Chivo-Regular',
    fontSize: 10,
    letterSpacing: 1.4,
    marginBottom: 8,
  },
  title: {
    color: COLORS.primary,
    fontFamily: 'Anybody-BlackItalic',
    fontSize: 32,
    includeFontPadding: false,
    letterSpacing: -0.5,
  },
  section: {
    backgroundColor: COLORS.surface,
    borderColor: COLORS.border,
    borderRadius: 4,
    borderWidth: 1,
    marginBottom: 18,
    padding: 15,
  },
  sectionTitle: {
    color: COLORS.primary,
    fontFamily: 'Anybody-BlackItalic',
    fontSize: 12,
    letterSpacing: 0.7,
  },
  field: {
    marginBottom: 14,
  },
  label: {
    color: COLORS.primary,
    fontFamily: 'Anybody-Bold',
    fontSize: 9,
    letterSpacing: 0.7,
    marginBottom: 7,
  },
  inputWrap: {
    alignItems: 'center',
    backgroundColor: COLORS.input,
    borderColor: COLORS.border,
    borderRadius: 4,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 10,
    height: 52,
    paddingHorizontal: 12,
  },
  inputWrapFocused: {
    borderColor: COLORS.crimson,
  },
  inputWrapDisabled: {
    opacity: 0.68,
  },
  input: {
    color: COLORS.primary,
    flex: 1,
    fontFamily: 'Chivo-Regular',
    fontSize: 13,
    height: '100%',
    paddingVertical: 0,
  },
  fieldNote: {
    color: COLORS.muted,
    fontFamily: 'Chivo-Regular',
    fontSize: 8,
    letterSpacing: 0.7,
    marginTop: 6,
  },
  optionsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  option: {
    alignItems: 'center',
    backgroundColor: COLORS.input,
    borderColor: COLORS.border,
    borderRadius: 4,
    borderWidth: 1,
    justifyContent: 'center',
    minHeight: 40,
    minWidth: 82,
    paddingHorizontal: 14,
  },
  optionSelected: {
    backgroundColor: COLORS.crimson,
    borderColor: COLORS.crimson,
  },
  optionText: {
    color: COLORS.secondary,
    fontFamily: 'Anybody-Bold',
    fontSize: 9,
    letterSpacing: 0.6,
  },
  optionTextSelected: {
    color: COLORS.primary,
  },
  roleBadge: {
    alignSelf: 'flex-start',
    backgroundColor: COLORS.surface,
    borderColor: COLORS.border,
    borderRadius: 4,
    borderWidth: 1,
    marginBottom: 18,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  roleText: {
    color: COLORS.secondary,
    fontFamily: 'Anybody-Bold',
    fontSize: 9,
    letterSpacing: 0.8,
  },
  certificateCard: {
    backgroundColor: COLORS.surface,
    borderColor: COLORS.border,
    borderRadius: 4,
    borderWidth: 1,
    marginBottom: 20,
    padding: 15,
  },
  sectionHeading: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 9,
    marginBottom: 14,
  },
  privacyNote: {
    color: COLORS.secondary,
    fontFamily: 'Chivo-Regular',
    fontSize: 8,
    letterSpacing: 0.5,
    lineHeight: 14,
    marginBottom: 14,
  },
  missingBanner: {
    backgroundColor: COLORS.errorBackground,
    borderRadius: 4,
    marginBottom: 12,
    paddingHorizontal: 11,
    paddingVertical: 12,
  },
  missingText: {
    color: COLORS.crimsonLight,
    fontFamily: 'Chivo-Regular',
    fontSize: 11,
    lineHeight: 16,
  },
  validBadge: {
    alignItems: 'center',
    backgroundColor: COLORS.success,
    borderRadius: 4,
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
    minHeight: 42,
    paddingHorizontal: 11,
  },
  validText: {
    color: COLORS.primary,
    flex: 1,
    fontFamily: 'Chivo-Regular',
    fontSize: 11,
    lineHeight: 16,
  },
  uploadButton: {
    alignItems: 'center',
    backgroundColor: COLORS.input,
    borderColor: COLORS.border,
    borderRadius: 4,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 9,
    height: 48,
    justifyContent: 'center',
    paddingHorizontal: 8,
  },
  uploadText: {
    color: COLORS.primary,
    fontFamily: 'Anybody-Bold',
    fontSize: 9,
    letterSpacing: 0.35,
  },
  testToggle: {
    alignItems: 'center',
    alignSelf: 'flex-start',
    flexDirection: 'row',
    gap: 8,
    marginTop: 12,
    minHeight: 30,
  },
  toggleTrack: {
    borderColor: COLORS.border,
    borderRadius: 8,
    borderWidth: 1,
    height: 16,
    justifyContent: 'center',
    paddingHorizontal: 2,
    width: 28,
  },
  toggleTrackActive: {
    backgroundColor: COLORS.success,
    borderColor: COLORS.success,
  },
  toggleThumb: {
    backgroundColor: COLORS.secondary,
    borderRadius: 5,
    height: 10,
    width: 10,
  },
  toggleThumbActive: {
    alignSelf: 'flex-end',
    backgroundColor: COLORS.primary,
  },
  testToggleText: {
    color: COLORS.muted,
    fontFamily: 'Chivo-Regular',
    fontSize: 8,
    letterSpacing: 0.4,
  },
  saveButton: {
    alignItems: 'center',
    backgroundColor: COLORS.crimson,
    borderRadius: 4,
    height: 54,
    justifyContent: 'center',
    marginTop: 2,
  },
  saveButtonPressed: {
    backgroundColor: '#BD0E15',
  },
  saveButtonDisabled: {
    opacity: 0.72,
  },
  saveContents: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 9,
  },
  saveText: {
    color: COLORS.primary,
    fontFamily: 'Anybody-Bold',
    fontSize: 10,
    letterSpacing: 0.8,
  },
  logoutButton: {
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderColor: COLORS.border,
    borderRadius: 4,
    borderWidth: 1,
    height: 48,
    justifyContent: 'center',
    marginTop: 12,
  },
  logoutText: {
    color: COLORS.crimsonLight,
    fontFamily: 'Anybody-Bold',
    fontSize: 10,
    letterSpacing: 1.2,
  },
  pressed: {
    opacity: 0.8,
  },
})

export default ProfileScreen
