import { useEffect, useRef, useState } from 'react'
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text as NativeText,
  TextInput,
  View,
} from 'react-native'
import {
  ArrowLeft,
  Award,
  CalendarDays,
  Check,
  ChevronLeft,
  ChevronRight,
  Play,
  Shield,
  Upload,
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
  success: '#1F9D55',
}

const EMPTY_CHILD = {
  firstName: '',
  lastName: '',
  sex: '',
  birthDate: '',
  nationality: '',
  birthPlace: '',
  certificateValid: false,
  grade: 'BLANCHE // DÉBUTANT',
  gradeColor: '#EEECE7',
  monthlyAttendance: { count: 0, goal: 8 },
  attendanceHistory: [],
  media: [],
}

const Text = ({ style, ...props }) => (
  <NativeText {...props} style={[{ fontFamily: 'Chivo-Regular' }, style]} />
)

function ChildProfileScreen({ child, onBack, onSave }) {
  const [form, setForm] = useState(() => ({ ...EMPTY_CHILD, ...child }))
  const [isSaving, setIsSaving] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [validationMessage, setValidationMessage] = useState('')
  const [monthIndex, setMonthIndex] = useState(0)
  const saveTimer = useRef(null)
  const returnTimer = useRef(null)

  useEffect(
    () => () => {
      clearTimeout(saveTimer.current)
      clearTimeout(returnTimer.current)
    },
    [],
  )

  function updateField(field, value) {
    setForm((current) => ({ ...current, [field]: value }))
    setValidationMessage('')
  }

  function handleSave() {
    if (isSaving) return

    const requiredValues = [
      form.firstName,
      form.lastName,
      form.sex,
      form.birthDate,
      form.nationality,
      form.birthPlace,
    ]
    if (requiredValues.some((value) => !value.trim())) {
      setValidationMessage('Complète tous les champs obligatoires avant l’enregistrement.')
      return
    }
    if (!/^\d{2}\/\d{2}\/\d{4}$/.test(form.birthDate.trim())) {
      setValidationMessage('Saisis la date au format JJ/MM/AAAA.')
      return
    }

    setValidationMessage('')
    setIsSaving(true)
    saveTimer.current = setTimeout(() => {
      setIsSaving(false)
      setShowSuccess(true)
      returnTimer.current = setTimeout(() => onSave?.(form), 900)
    }, 1000)
  }

  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        {validationMessage ? (
          <Text accessibilityRole="alert" style={styles.validationText}>
            {validationMessage}
          </Text>
        ) : null}
        <Pressable
          accessibilityLabel="Retour à la liste des enfants"
          accessibilityRole="button"
          onPress={onBack}
          style={({ pressed }) => [styles.backButton, pressed && styles.pressed]}
        >
          <ArrowLeft color={COLORS.primary} size={20} />
        </Pressable>
        <Text style={styles.brand}>TATAMI</Text>
        <View style={styles.headerSpacer} />
      </View>

      {showSuccess && (
        <View accessibilityLiveRegion="polite" style={styles.successBanner}>
          <Check color={COLORS.primary} size={17} strokeWidth={2.5} />
          <Text style={styles.successText}>Fiche enfant enregistrée.</Text>
        </View>
      )}

      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.heading}>
          <Text style={styles.eyebrow}>07 . PROFIL MINEUR</Text>
          <Text accessibilityRole="header" style={styles.title}>FICHE ENFANT</Text>
          <Text style={styles.subtitle}>INFORMATIONS DE L’ENFANT</Text>
        </View>

        <View style={styles.gradeCard}>
          <View style={styles.sectionTitleRow}>
            <Award color={COLORS.secondary} size={17} />
            <Text style={styles.sectionTitle}>GRADE</Text>
          </View>
          <View style={styles.gradeRow}>
            <View style={[styles.beltMark, { backgroundColor: form.gradeColor }]} />
            <Text style={styles.gradeText}>{form.grade}</Text>
          </View>
        </View>

        <View style={styles.attendanceCard}>
          <View style={styles.attendanceHeading}>
            <Text style={styles.sectionTitle}>PRÉSENCE MENSUELLE</Text>
            <CalendarDays color={COLORS.secondary} size={17} />
          </View>
          <Text style={styles.attendanceCount}>
            {form.monthlyAttendance?.count ?? 0} SÉANCES
          </Text>
          <View style={styles.progressTrack}>
            <View
              style={[
                styles.progressFill,
                {
                  width: `${Math.min(
                    100,
                    Math.round(
                      ((form.monthlyAttendance?.count ?? 0) /
                        Math.max(1, form.monthlyAttendance?.goal ?? 8)) *
                        100,
                    ),
                  )}%`,
                },
              ]}
            />
          </View>
          <Text style={styles.attendanceGoal}>
            Objectif {form.monthlyAttendance?.goal ?? 8} séances
            {form.monthlyAttendance?.goal
              ? ` (${Math.min(
                  100,
                  Math.round(
                    ((form.monthlyAttendance?.count ?? 0) / form.monthlyAttendance.goal) *
                      100,
                  ),
                )}%)`
              : ''}
          </Text>
        </View>

        <View style={styles.mediaSection}>
          <View style={styles.mediaHeading}>
            <Text style={styles.sectionTitle}>MES PHOTOS ET VIDÉOS</Text>
            <Text style={styles.mediaCount}>
              {String(form.media?.length ?? 0).padStart(2, '0')} MÉDIAS
            </Text>
          </View>
          {form.media?.length ? (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.mediaList}
            >
              {form.media.map((item, index) => (
                <View key={`${item.title}-${index}`} style={styles.mediaTile}>
                  <View
                    style={[
                      styles.mediaArtwork,
                      item.variant === 'blue' && styles.mediaArtworkBlue,
                    ]}
                  >
                    <View style={styles.artworkStripe} />
                    <View style={styles.playButton}>
                      <Play color={COLORS.crimson} fill={COLORS.crimson} size={16} />
                    </View>
                    <Text style={styles.artworkTag}>TATAMI / SESSION</Text>
                  </View>
                  <Text numberOfLines={1} style={styles.mediaTitle}>{item.title}</Text>
                  <Text style={styles.mediaSubtitle}>{item.subtitle}</Text>
                </View>
              ))}
            </ScrollView>
          ) : (
            <Text style={styles.emptyText}>Aucune photo ou vidéo disponible pour le moment.</Text>
          )}
        </View>

        <View style={styles.card}>
          <View style={styles.historyHeader}>
            <View>
              <Text style={styles.sectionTitle}>HISTORIQUE DE PRÉSENCE</Text>
              <Text style={styles.historyCount}>
                {form.attendanceHistory?.[monthIndex]?.count ?? 0} SÉANCES CE MOIS-CI
              </Text>
            </View>
          </View>
          <View style={styles.monthSelector}>
            <Pressable
              accessibilityLabel="Mois précédent"
              accessibilityRole="button"
              disabled={monthIndex === 0}
              onPress={() => setMonthIndex((index) => Math.max(0, index - 1))}
              style={styles.monthArrow}
            >
              <ChevronLeft
                color={monthIndex === 0 ? COLORS.muted : COLORS.primary}
                size={18}
              />
            </Pressable>
            <Text style={styles.monthLabel}>
              {form.attendanceHistory?.[monthIndex]?.label ?? 'AUCUN HISTORIQUE'}
            </Text>
            <Pressable
              accessibilityLabel="Mois suivant"
              accessibilityRole="button"
              disabled={monthIndex >= (form.attendanceHistory?.length ?? 0) - 1}
              onPress={() =>
                setMonthIndex((index) =>
                  Math.min((form.attendanceHistory?.length ?? 1) - 1, index + 1),
                )
              }
              style={styles.monthArrow}
            >
              <ChevronRight
                color={
                  monthIndex >= (form.attendanceHistory?.length ?? 0) - 1
                    ? COLORS.muted
                    : COLORS.primary
                }
                size={18}
              />
            </Pressable>
          </View>
          {form.attendanceHistory?.[monthIndex]?.sessions?.length ? (
            form.attendanceHistory[monthIndex].sessions.map((session, index) => {
              const isPresent = session.status !== 'missed'
              return (
                <View key={`${session.date}-${index}`} style={styles.historyRow}>
                  <View style={styles.historyDate}>
                    <Text style={styles.historyDateText}>{session.date}</Text>
                  </View>
                  <View style={styles.historyDetails}>
                    <Text numberOfLines={1} style={styles.sessionTitle}>
                      {session.title}
                    </Text>
                    <Text style={styles.coachName}>{session.coach}</Text>
                  </View>
                  <View
                    style={[
                      styles.presenceBadge,
                      isPresent ? styles.presentBadge : styles.missedBadge,
                    ]}
                  >
                    <Text style={styles.presenceBadgeText}>
                      {isPresent ? 'PRÉSENT' : 'MANQUÉ'}
                    </Text>
                  </View>
                </View>
              )
            })
          ) : (
            <Text style={styles.emptyText}>Aucune séance enregistrée pour ce mois.</Text>
          )}
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>IDENTITÉ</Text>
          <FormField
            label="PRÉNOM"
            value={form.firstName}
            onChangeText={(value) => updateField('firstName', value)}
            placeholder="Prénom"
            autoCapitalize="words"
          />
          <FormField
            label="NOM DE NAISSANCE"
            value={form.lastName}
            onChangeText={(value) => updateField('lastName', value)}
            placeholder="Nom"
            autoCapitalize="words"
          />

          <Text style={styles.fieldLabel}>SEXE</Text>
          <View accessibilityRole="radiogroup" style={styles.sexOptions}>
            {['H', 'F'].map((sex) => {
              const selected = form.sex === sex
              return (
                <Pressable
                  accessibilityRole="radio"
                  accessibilityState={{ checked: selected }}
                  key={sex}
                  onPress={() => updateField('sex', sex)}
                  style={[styles.sexOption, selected && styles.sexOptionSelected]}
                >
                  <Text style={[styles.sexOptionText, selected && styles.sexOptionTextSelected]}>
                    {sex === 'H' ? 'HOMME' : 'FEMME'}
                  </Text>
                </Pressable>
              )
            })}
          </View>

          <FormField
            label="DATE DE NAISSANCE"
            value={form.birthDate}
            onChangeText={(value) => updateField('birthDate', value)}
            placeholder="JJ/MM/AAAA"
            keyboardType="numbers-and-punctuation"
          />
          <FormField
            label="NATIONALITÉ"
            value={form.nationality}
            onChangeText={(value) => updateField('nationality', value)}
            placeholder="Nationalité"
            autoCapitalize="words"
          />
          <FormField
            label="LIEU DE NAISSANCE"
            value={form.birthPlace}
            onChangeText={(value) => updateField('birthPlace', value)}
            placeholder="Ville et pays"
            autoCapitalize="words"
          />
        </View>

        <View style={styles.contactNote}>
          <Text style={styles.noteLabel}>LIAISON DE CONTACT</Text>
          <Text style={styles.noteText}>
            Coordonnées et contact : Identiques au compte parent associé.
          </Text>
        </View>

        <View style={styles.card}>
          <View style={styles.sectionTitleRow}>
            <Shield color={COLORS.secondary} size={17} />
            <Text style={styles.sectionTitle}>SANTÉ — CERTIFICAT MÉDICAL</Text>
          </View>
          <View
            style={[
              styles.statusRow,
              form.certificateValid ? styles.statusValid : styles.statusMissing,
            ]}
          >
            {form.certificateValid ? (
              <Check color={COLORS.primary} size={15} />
            ) : (
              <Shield color={COLORS.primary} size={15} />
            )}
            <Text style={styles.statusText}>
              {form.certificateValid ? 'CERTIFICAT AJOUTÉ' : 'CERTIFICAT MANQUANT'}
            </Text>
          </View>
          <Pressable
            accessibilityRole="button"
            onPress={() => updateField('certificateValid', !form.certificateValid)}
            style={({ pressed }) => [styles.uploadButton, pressed && styles.pressed]}
          >
            <Upload color={COLORS.primary} size={15} />
            <Text style={styles.uploadText}>AJOUTER UN SCAN / PHOTO DU CERTIFICAT</Text>
          </Pressable>
          <Text style={styles.demoHint}>DÉMO : APPUYER À NOUVEAU POUR RETIRER LE CERTIFICAT</Text>
        </View>

        <View style={styles.privacyNote}>
          <Text style={styles.noteLabel}>DROIT À L’IMAGE & CONSENTEMENT</Text>
          <Text style={styles.noteText}>
            Le consentement pour le droit à l'image et le traitement des données de ce mineur est
            automatiquement lié aux autorisations accordées lors de l'inscription de l'adulte
            titulaire du compte parent.
          </Text>
        </View>

        <Pressable
          accessibilityRole="button"
          accessibilityState={{ disabled: isSaving }}
          disabled={isSaving}
          onPress={handleSave}
          style={({ pressed }) => [
            styles.saveButton,
            pressed && styles.pressed,
            isSaving && styles.saveButtonDisabled,
          ]}
        >
          {isSaving ? (
            <ActivityIndicator color={COLORS.primary} />
          ) : (
            <Text style={styles.saveButtonText}>ENREGISTRER LA FICHE ENFANT</Text>
          )}
        </Pressable>
      </ScrollView>
    </View>
  )
}

function FormField({ label, ...inputProps }) {
  return (
    <View style={styles.field}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <TextInput
        accessibilityLabel={label}
        placeholderTextColor={COLORS.muted}
        selectionColor={COLORS.crimson}
        style={styles.input}
        {...inputProps}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  screen: {
    backgroundColor: COLORS.canvas,
    flex: 1,
  },
  header: {
    alignItems: 'center',
    borderBottomColor: COLORS.border,
    borderBottomWidth: 1,
    flexDirection: 'row',
    height: 54,
    justifyContent: 'space-between',
    paddingHorizontal: 18,
  },
  backButton: {
    alignItems: 'center',
    height: 38,
    justifyContent: 'center',
    width: 38,
  },
  brand: {
    color: COLORS.primary,
    fontFamily: 'Anybody-BlackItalic',
    fontSize: 19,
    letterSpacing: 1.2,
  },
  headerSpacer: {
    height: 38,
    width: 38,
  },
  successBanner: {
    alignItems: 'center',
    backgroundColor: COLORS.success,
    flexDirection: 'row',
    gap: 9,
    marginHorizontal: 18,
    marginTop: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  successText: {
    color: COLORS.primary,
    fontSize: 12,
  },
  content: {
    paddingBottom: 26,
    paddingHorizontal: 18,
    paddingTop: 18,
  },
  heading: {
    marginBottom: 17,
  },
  eyebrow: {
    color: COLORS.crimsonLight,
    fontSize: 9,
    letterSpacing: 1.5,
    marginBottom: 6,
  },
  title: {
    color: COLORS.primary,
    fontFamily: 'Anybody-BlackItalic',
    fontSize: 32,
    letterSpacing: -0.5,
  },
  subtitle: {
    color: COLORS.secondary,
    fontSize: 9,
    letterSpacing: 0.8,
    marginTop: 6,
  },
  card: {
    backgroundColor: COLORS.surface,
    borderColor: COLORS.border,
    borderRadius: 4,
    borderWidth: 1,
    marginBottom: 12,
    padding: 13,
  },
  gradeCard: {
    backgroundColor: COLORS.surface,
    borderColor: COLORS.border,
    borderRadius: 4,
    borderWidth: 1,
    marginBottom: 12,
    padding: 13,
  },
  gradeRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 10,
  },
  beltMark: {
    borderColor: COLORS.primary,
    borderWidth: 1,
    height: 13,
    width: 36,
  },
  gradeText: {
    color: COLORS.primary,
    fontFamily: 'Anybody-Bold',
    fontSize: 10,
    letterSpacing: 0.45,
  },
  attendanceCard: {
    backgroundColor: COLORS.surface,
    borderColor: COLORS.border,
    borderRadius: 4,
    borderWidth: 1,
    marginBottom: 12,
    padding: 13,
  },
  attendanceHeading: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  attendanceCount: {
    color: COLORS.primary,
    fontFamily: 'Anybody-BlackItalic',
    fontSize: 34,
    marginTop: 6,
  },
  progressTrack: {
    backgroundColor: COLORS.border,
    height: 4,
    marginTop: 8,
    overflow: 'hidden',
  },
  progressFill: {
    backgroundColor: COLORS.crimson,
    height: '100%',
  },
  attendanceGoal: {
    color: COLORS.secondary,
    fontSize: 9,
    marginTop: 7,
  },
  mediaSection: {
    marginBottom: 12,
  },
  mediaHeading: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
    marginBottom: 8,
  },
  mediaCount: {
    color: COLORS.muted,
    fontSize: 8,
    letterSpacing: 0.5,
  },
  mediaList: {
    gap: 10,
  },
  mediaTile: {
    width: 210,
  },
  mediaArtwork: {
    alignItems: 'center',
    backgroundColor: '#292020',
    borderColor: COLORS.border,
    borderRadius: 4,
    borderWidth: 1,
    height: 112,
    justifyContent: 'center',
    overflow: 'hidden',
  },
  mediaArtworkBlue: {
    backgroundColor: '#1B2631',
  },
  artworkStripe: {
    backgroundColor: 'rgba(255,255,255,0.06)',
    height: 180,
    position: 'absolute',
    transform: [{ rotate: '28deg' }],
    width: 34,
  },
  playButton: {
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    borderRadius: 16,
    height: 32,
    justifyContent: 'center',
    paddingLeft: 2,
    width: 32,
  },
  artworkTag: {
    bottom: 8,
    color: COLORS.secondary,
    fontSize: 7,
    left: 9,
    letterSpacing: 0.8,
    position: 'absolute',
  },
  mediaTitle: {
    color: COLORS.primary,
    fontFamily: 'Anybody-Bold',
    fontSize: 9,
    marginTop: 7,
  },
  mediaSubtitle: {
    color: COLORS.secondary,
    fontSize: 8,
    marginTop: 3,
  },
  historyHeader: {
    flexDirection: 'row',
  },
  historyCount: {
    color: COLORS.secondary,
    fontSize: 9,
    letterSpacing: 0.4,
    marginTop: 3,
  },
  monthSelector: {
    alignItems: 'center',
    borderBottomColor: COLORS.border,
    borderTopColor: COLORS.border,
    borderBottomWidth: 1,
    borderTopWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 2,
    marginTop: 10,
  },
  monthArrow: {
    alignItems: 'center',
    height: 38,
    justifyContent: 'center',
    width: 38,
  },
  monthLabel: {
    color: COLORS.primary,
    fontFamily: 'Anybody-Bold',
    fontSize: 10,
    letterSpacing: 0.5,
  },
  historyRow: {
    alignItems: 'center',
    borderBottomColor: COLORS.border,
    borderBottomWidth: 1,
    flexDirection: 'row',
    gap: 8,
    minHeight: 60,
    paddingVertical: 8,
  },
  historyDate: {
    alignItems: 'center',
    backgroundColor: COLORS.input,
    borderColor: COLORS.border,
    borderRadius: 4,
    borderWidth: 1,
    justifyContent: 'center',
    minHeight: 34,
    paddingHorizontal: 5,
    width: 53,
  },
  historyDateText: {
    color: COLORS.secondary,
    fontSize: 7,
    textAlign: 'center',
  },
  historyDetails: {
    flex: 1,
  },
  sessionTitle: {
    color: COLORS.primary,
    fontFamily: 'Anybody-Bold',
    fontSize: 8,
  },
  coachName: {
    color: COLORS.secondary,
    fontSize: 8,
    marginTop: 4,
  },
  presenceBadge: {
    borderRadius: 4,
    minWidth: 56,
    paddingHorizontal: 5,
    paddingVertical: 6,
  },
  presentBadge: {
    backgroundColor: COLORS.success,
  },
  missedBadge: {
    backgroundColor: '#93000A',
  },
  presenceBadgeText: {
    color: COLORS.primary,
    fontFamily: 'Anybody-Bold',
    fontSize: 7,
    textAlign: 'center',
  },
  emptyText: {
    color: COLORS.secondary,
    fontSize: 11,
    lineHeight: 16,
    paddingVertical: 13,
    textAlign: 'center',
  },
  sectionTitle: {
    color: COLORS.primary,
    flex: 1,
    fontFamily: 'Anybody-BlackItalic',
    fontSize: 12,
    letterSpacing: 0.35,
    marginBottom: 12,
  },
  sectionTitleRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  field: {
    marginBottom: 11,
  },
  fieldLabel: {
    color: COLORS.secondary,
    fontFamily: 'Anybody-Bold',
    fontSize: 9,
    letterSpacing: 0.7,
    marginBottom: 6,
  },
  input: {
    backgroundColor: COLORS.input,
    borderColor: COLORS.border,
    borderRadius: 4,
    borderWidth: 1,
    color: COLORS.primary,
    fontFamily: 'Chivo-Regular',
    fontSize: 13,
    height: 52,
    paddingHorizontal: 11,
  },
  sexOptions: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  sexOption: {
    alignItems: 'center',
    backgroundColor: COLORS.input,
    borderColor: COLORS.border,
    borderRadius: 4,
    borderWidth: 1,
    flex: 1,
    height: 44,
    justifyContent: 'center',
  },
  sexOptionSelected: {
    backgroundColor: COLORS.crimson,
    borderColor: COLORS.crimson,
  },
  sexOptionText: {
    color: COLORS.secondary,
    fontFamily: 'Anybody-Bold',
    fontSize: 10,
    letterSpacing: 0.7,
  },
  sexOptionTextSelected: {
    color: COLORS.primary,
  },
  contactNote: {
    backgroundColor: COLORS.surface,
    borderColor: COLORS.border,
    borderRadius: 4,
    borderWidth: 1,
    marginBottom: 12,
    padding: 13,
  },
  noteLabel: {
    color: COLORS.crimsonLight,
    fontFamily: 'Anybody-Bold',
    fontSize: 9,
    letterSpacing: 0.7,
    marginBottom: 7,
  },
  noteText: {
    color: COLORS.secondary,
    fontSize: 11,
    lineHeight: 17,
  },
  statusRow: {
    alignItems: 'center',
    borderRadius: 4,
    flexDirection: 'row',
    gap: 8,
    marginBottom: 10,
    paddingHorizontal: 10,
    paddingVertical: 9,
  },
  statusValid: {
    backgroundColor: COLORS.success,
  },
  statusMissing: {
    backgroundColor: COLORS.crimson,
  },
  statusText: {
    color: COLORS.primary,
    fontFamily: 'Anybody-Bold',
    fontSize: 9,
    letterSpacing: 0.55,
  },
  uploadButton: {
    alignItems: 'center',
    backgroundColor: COLORS.input,
    borderColor: COLORS.border,
    borderRadius: 4,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'center',
    minHeight: 48,
    paddingHorizontal: 9,
  },
  uploadText: {
    color: COLORS.primary,
    fontFamily: 'Anybody-Bold',
    fontSize: 8,
    letterSpacing: 0.25,
    textAlign: 'center',
  },
  demoHint: {
    color: COLORS.muted,
    fontSize: 7,
    letterSpacing: 0.35,
    marginTop: 8,
  },
  privacyNote: {
    borderLeftColor: COLORS.crimson,
    borderLeftWidth: 2,
    marginBottom: 14,
    paddingHorizontal: 12,
    paddingVertical: 5,
  },
  saveButton: {
    alignItems: 'center',
    backgroundColor: COLORS.crimson,
    borderRadius: 4,
    justifyContent: 'center',
    minHeight: 54,
    paddingHorizontal: 12,
  },
  saveButtonDisabled: {
    opacity: 0.75,
  },
  validationText: {
    color: COLORS.crimsonLight,
    fontSize: 11,
    lineHeight: 16,
    marginBottom: 10,
  },
  saveButtonText: {
    color: COLORS.primary,
    fontFamily: 'Anybody-Bold',
    fontSize: 10,
    letterSpacing: 0.45,
    textAlign: 'center',
  },
  pressed: {
    opacity: 0.78,
  },
})

export { EMPTY_CHILD }
export default ChildProfileScreen
