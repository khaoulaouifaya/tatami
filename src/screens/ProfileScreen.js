import { useEffect, useRef, useState } from 'react'
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text as NativeText,
  TextInput,
  View,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import {
  Award,
  Bell,
  CalendarDays,
  Check,
  ChevronLeft,
  ChevronRight,
  Pen,
  Play,
  Shield,
  UserRound,
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
  beltBlue: '#3678D4',
}

const DEFAULT_PROFILE = {
  firstName: 'Alexandre',
  lastName: 'Dupont',
  email: 'alexandre.dupont@example.com',
  birthDate: '14/06/1992',
  sex: 'Masculin',
  category: 'Master 1 (-77 kg)',
  nationality: 'Française',
  mobile: '06 12 34 56 78',
  address: '12 rue des Arts, 75011 Paris, France',
}

const HISTORY_MONTHS = [
  {
    label: 'AOÛT 2026',
    count: 10,
    sessions: [
      { date: '27 AOÛT', title: 'JJB GI AVANCÉ & SPARRING', coach: 'COACH : THOMAS R.' },
      { date: '24 AOÛT', title: 'NO-GI / TECHNIQUE', coach: 'COACH : SARAH M.' },
      { date: '20 AOÛT', title: 'JJB GI AVANCÉ', coach: 'COACH : THOMAS R.' },
    ],
  },
  {
    label: 'SEPTEMBRE 2026',
    count: 12,
    sessions: [
      { date: '29 SEPT.', title: 'JJB GI AVANCÉ & SPARRING', coach: 'COACH : THOMAS R.' },
      { date: '24 SEPT.', title: 'NO-GI / TECHNIQUE', coach: 'COACH : SARAH M.' },
      { date: '17 SEPT.', title: 'JJB GI AVANCÉ', coach: 'COACH : THOMAS R.' },
    ],
  },
  {
    label: 'OCTOBRE 2026',
    count: 8,
    sessions: [
      { date: '29 OCT.', title: 'JJB GI AVANCÉ & SPARRING', coach: 'COACH : THOMAS R.', status: 'present' },
      { date: '26 OCT.', title: 'JJB GI AVANCÉ', coach: 'COACH : SARAH M.', status: 'present' },
      { date: '22 OCT.', title: 'NO-GI / TECHNIQUE', coach: 'COACH : THOMAS R.', status: 'present' },
      { date: '19 OCT.', title: 'JJB GI AVANCÉ & SPARRING', coach: 'COACH : SARAH M.', status: 'missed' },
    ],
  },
  {
    label: 'NOVEMBRE 2026',
    count: 0,
    sessions: [],
  },
]

const ADULT_NOTIFICATIONS = [
  { id: 'session', label: 'Rappel de séance', detail: '1h avant' },
  { id: 'booking', label: 'Rappel de réservation', detail: '4h avant' },
  { id: 'waitlist', label: 'Alerte liste d’attente', detail: 'Place disponible' },
]

const STAFF_NOTIFICATIONS = [
  { id: 'coaching', label: 'Rappel de séance à encadrer', detail: '' },
  { id: 'attendance', label: 'Rappel de pointage', detail: 'Appel des élèves' },
]

const Text = ({ style, ...props }) => (
  <NativeText {...props} style={[{ fontFamily: 'Chivo-Regular' }, style]} />
)

function calculateAge(dateString) {
  const [day, month, year] = dateString.split('/').map(Number)
  if (!day || !month || !year) return null

  const today = new Date()
  let age = today.getFullYear() - year
  const birthdayHasPassed =
    today.getMonth() + 1 > month ||
    (today.getMonth() + 1 === month && today.getDate() >= day)
  if (!birthdayHasPassed) age -= 1
  return age
}

function ProfileScreen({
  onOpenCompensation,
  onLogout,
  initialProfile = DEFAULT_PROFILE,
  role = 'adult',
  embedded = false,
}) {
  const [profile, setProfile] = useState(() => ({ ...DEFAULT_PROFILE, ...initialProfile }))
  const [draftProfile, setDraftProfile] = useState(() => ({
    ...DEFAULT_PROFILE,
    ...initialProfile,
  }))
  const [isEditingProfile, setIsEditingProfile] = useState(false)
  const [isSavingProfile, setIsSavingProfile] = useState(false)
  const [certificateIsValid, setCertificateIsValid] = useState(false)
  const [activeRole, setActiveRole] = useState(role.toLowerCase())
  const [monthIndex, setMonthIndex] = useState(2)
  const [notificationPreferences, setNotificationPreferences] = useState({
    session: true,
    booking: true,
    waitlist: false,
    coaching: true,
    attendance: true,
  })
  const [showSuccess, setShowSuccess] = useState(false)
  const timer = useRef(null)
  const saveTimer = useRef(null)

  useEffect(
    () => () => {
      clearTimeout(timer.current)
      clearTimeout(saveTimer.current)
    },
    [],
  )

  function showTemporarySuccess() {
    setShowSuccess(true)
    timer.current = setTimeout(() => setShowSuccess(false), 3000)
  }

  function handleEditProfile() {
    setDraftProfile({ ...profile })
    setIsEditingProfile(true)
  }

  function handleCancelProfileEdit() {
    setDraftProfile({ ...profile })
    setIsEditingProfile(false)
  }

  function handleSaveProfile() {
    if (isSavingProfile) return

    setIsSavingProfile(true)
    saveTimer.current = setTimeout(() => {
      setProfile({ ...draftProfile })
      setIsEditingProfile(false)
      setIsSavingProfile(false)
      showTemporarySuccess()
    }, 1000)
  }

  function updateDraftField(field, value) {
    setDraftProfile((current) => ({ ...current, [field]: value }))
  }

  function handleLogout() {
    if (onLogout) {
      onLogout()
      return
    }

    Alert.alert('Déconnexion', 'Aucune action de déconnexion n’a été configurée.')
  }

  function shiftMonth(direction) {
    setMonthIndex((index) => Math.max(0, Math.min(HISTORY_MONTHS.length - 1, index + direction)))
  }

  const month = HISTORY_MONTHS[monthIndex]
  const notificationOptions =
    activeRole === 'staff' ? STAFF_NOTIFICATIONS : ADULT_NOTIFICATIONS
  const age = calculateAge(profile.birthDate)

  return (
    <SafeAreaView edges={embedded ? [] : ['top', 'bottom']} style={styles.safeArea}>
      <View style={styles.flex}>
        <View style={styles.header}>
          <Text accessibilityRole="header" style={styles.brand}>TATAMI</Text>
          <View style={styles.headerActions}>
            <Pressable
              accessibilityLabel="Notifications"
              accessibilityRole="button"
              onPress={() => Alert.alert('Notifications', 'Centre de notifications sécurisé.')}
              style={styles.headerIconButton}
            >
              <Bell color={COLORS.primary} size={19} />
              <View style={styles.notificationDot} />
            </Pressable>
            <View accessibilityLabel="Profil Alexandre Dupont" style={styles.avatar}>
              <Text style={styles.avatarInitials}>AD</Text>
            </View>
          </View>
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
          <View style={styles.sectionHeading}>
            <Text style={styles.eyebrow}>05 . ESPACE ATHLÈTE</Text>
            <Text accessibilityRole="header" style={styles.pageTitle}>MON PROFIL</Text>
          </View>

          <View style={styles.passportCard}>
            <View style={styles.passportTop}>
              <View style={styles.athletePortrait}>
                <UserRound color={COLORS.secondary} size={32} strokeWidth={1.4} />
              </View>
              <View style={styles.passportIdentity}>
                <Text style={styles.passportEyebrow}>PASSEPORT ATHLÈTE CDL</Text>
                <Text style={styles.athleteName}>
                  {`${profile.firstName} ${profile.lastName}`.toUpperCase()}
                </Text>
                <Text style={styles.clubName}>CAMP DES LOUPS (PARIS 11)</Text>
              </View>
              <View style={styles.activeBadge}>
                <Text style={styles.activeBadgeText}>ACTIF</Text>
              </View>
            </View>
            <View style={styles.passportDivider} />
            <View style={styles.gradeRow}>
              <Award color={COLORS.secondary} size={16} />
              <Text style={styles.gradeLabel}>GRADE</Text>
              <View style={styles.beltMark} />
              <Text style={styles.gradeValue}>BLEU // 2 BARETTES</Text>
            </View>
          </View>

          <View style={styles.attendanceCard}>
            <View style={styles.statHeading}>
              <Text style={styles.cardEyebrow}>PRÉSENCE MENSUELLE</Text>
              <CalendarDays color={COLORS.secondary} size={17} />
            </View>
            <Text style={styles.monthlyCount}>18 SÉANCES</Text>
            <View style={styles.progressTrack}>
              <View style={styles.progressFill} />
            </View>
            <Text style={styles.goalText}>Objectif 22 séances (82%)</Text>
          </View>

          <View style={styles.card}>
            <View style={styles.sectionTitleRow}>
              <Shield color={COLORS.secondary} size={17} />
              <Text style={styles.cardTitle}>CERTIFICAT MÉDICAL</Text>
              <Text style={styles.seasonLabel}>SAISON 26/27</Text>
            </View>
            <View style={styles.certificateLine}>
              <View style={styles.certificateCopy}>
                <Text style={styles.certificateName}>JJB & GRAPPLING</Text>
                <Text style={styles.certificateMeta}>Valide jusqu’au 15/05/2027</Text>
              </View>
              <View style={styles.addedBadge}>
                <Text style={styles.addedBadgeText}>AJOUTÉ</Text>
              </View>
            </View>
            <View style={styles.certificateLine}>
              <View style={styles.certificateCopy}>
                <Text style={styles.certificateName}>MENTION COMPÉTITION</Text>
              </View>
              <View style={styles.missingBadge}>
                <Text style={styles.statusBadgeText}>MANQUANT</Text>
              </View>
            </View>
            <Pressable
              accessibilityRole="button"
              onPress={() => {
                setCertificateIsValid(true)
                showTemporarySuccess()
              }}
              style={({ pressed }) => [styles.uploadButton, pressed && styles.pressed]}
            >
              <Text style={styles.uploadButtonText}>AJOUTER UNE PHOTO OU UN SCAN</Text>
            </Pressable>
            <Pressable
              accessibilityRole="switch"
              accessibilityState={{ checked: certificateIsValid }}
              onPress={() => setCertificateIsValid((valid) => !valid)}
              style={styles.certificateTestSwitch}
            >
              <View style={[styles.switchTrack, certificateIsValid && styles.switchTrackOn]}>
                <View style={[styles.switchThumb, certificateIsValid && styles.switchThumbOn]} />
              </View>
              <Text style={styles.testLabel}>TEST LOCAL : CERTIFICAT PRÉSENT</Text>
            </Pressable>
            {certificateIsValid && (
              <View style={styles.certificateSuccess}>
                <Check color={COLORS.primary} size={15} />
                <Text style={styles.certificateSuccessText}>CERTIFICAT VALIDÉ</Text>
              </View>
            )}
          </View>

          <View style={styles.card}>
            <View style={styles.sectionTitleRow}>
              <UserRound color={COLORS.secondary} size={17} />
              <Text style={styles.cardTitle}>INFORMATIONS PERSONNELLES</Text>
            </View>
            {isEditingProfile ? (
              <>
                <ProfileEditField
                  label="PRÉNOM"
                  value={draftProfile.firstName}
                  onChangeText={(value) => updateDraftField('firstName', value)}
                  autoCapitalize="words"
                />
                <ProfileEditField
                  label="NOM"
                  value={draftProfile.lastName}
                  onChangeText={(value) => updateDraftField('lastName', value)}
                  autoCapitalize="words"
                />
                <ProfileEditField
                  label="DATE DE NAISSANCE"
                  value={draftProfile.birthDate}
                  onChangeText={(value) => updateDraftField('birthDate', value)}
                  placeholder="JJ/MM/AAAA"
                />
                <ProfileEditField
                  label="SEXE"
                  value={draftProfile.sex}
                  onChangeText={(value) => updateDraftField('sex', value)}
                />
                <ProfileEditField
                  label="CATÉGORIE"
                  value={draftProfile.category}
                  onChangeText={(value) => updateDraftField('category', value)}
                />
                <ProfileEditField
                  label="NATIONALITÉ"
                  value={draftProfile.nationality}
                  onChangeText={(value) => updateDraftField('nationality', value)}
                />
                <ProfileEditField label="E-MAIL · NON MODIFIABLE" value={profile.email} editable={false} />
                <ProfileEditField
                  label="TÉLÉPHONE"
                  value={draftProfile.mobile}
                  onChangeText={(value) => updateDraftField('mobile', value)}
                  keyboardType="phone-pad"
                />
                <ProfileEditField
                  label="ADRESSE POSTALE"
                  value={draftProfile.address}
                  onChangeText={(value) => updateDraftField('address', value)}
                  autoCapitalize="sentences"
                  multiline
                />
                <Pressable
                  accessibilityRole="button"
                  accessibilityState={{ disabled: isSavingProfile }}
                  disabled={isSavingProfile}
                  onPress={handleSaveProfile}
                  style={({ pressed }) => [
                    styles.saveProfileButton,
                    pressed && styles.pressed,
                    isSavingProfile && styles.saveProfileButtonDisabled,
                  ]}
                >
                  {isSavingProfile ? (
                    <ActivityIndicator color={COLORS.primary} />
                  ) : (
                    <Text style={styles.saveProfileText}>ENREGISTRER LES MODIFICATIONS</Text>
                  )}
                </Pressable>
                <Pressable
                  accessibilityRole="button"
                  accessibilityState={{ disabled: isSavingProfile }}
                  disabled={isSavingProfile}
                  onPress={handleCancelProfileEdit}
                  style={({ pressed }) => [styles.cancelEditButton, pressed && styles.pressed]}
                >
                  <Text style={styles.cancelEditText}>ANNULER</Text>
                </Pressable>
              </>
            ) : (
              <>
                <ProfileInfo label="PRÉNOM & NOM" value={`${profile.firstName} ${profile.lastName}`} />
                <ProfileInfo
                  label="DATE DE NAISSANCE"
                  value={`${profile.birthDate}${age === null ? '' : `  //  ${age} ANS`}`}
                />
                <ProfileInfo
                  label="SEXE & CATÉGORIE"
                  value={`${profile.sex}  //  ${profile.category}`}
                />
                <ProfileInfo label="NATIONALITÉ" value={profile.nationality} />
                <ProfileInfo label="E-MAIL" value={profile.email} />
                <ProfileInfo label="TÉLÉPHONE" value={profile.mobile} />
                <ProfileInfo label="ADRESSE POSTALE" value={profile.address} last />
                <Pressable
                  accessibilityRole="button"
                  onPress={handleEditProfile}
                  style={({ pressed }) => [styles.editButton, pressed && styles.pressed]}
                >
                  <Pen color={COLORS.secondary} size={14} />
                  <Text style={styles.editText}>MODIFIER</Text>
                </Pressable>
              </>
            )}
          </View>

          <View style={styles.mediaSection}>
            <View style={styles.mediaTitleRow}>
              <Text style={styles.cardTitle}>MES PHOTOS ET VIDÉOS</Text>
              <Text style={styles.mediaCount}>02 MÉDIAS</Text>
            </View>
            <Text style={styles.mediaNote}>
              Les médias de vos enfants sont consultables directement dans la fiche de chaque enfant.
            </Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.mediaList}
            >
              <MediaTile title="JJB GI AVANCÉ" subtitle="MERCREDI 26 OCTOBRE" variant="red" />
              <MediaTile title="TECHNIQUE & SPARRING" subtitle="LUNDI 19 OCTOBRE" variant="blue" />
            </ScrollView>
          </View>

          <View style={styles.card}>
            <View style={styles.historyHeader}>
              <View>
                <Text style={styles.cardTitle}>HISTORIQUE DE PRÉSENCE</Text>
                <Text style={styles.historyCount}>{month.count} SÉANCES CE MOIS-CI</Text>
              </View>
            </View>
            <View style={styles.monthSelector}>
              <Pressable
                accessibilityLabel="Mois précédent"
                accessibilityRole="button"
                disabled={monthIndex === 0}
                onPress={() => shiftMonth(-1)}
                style={styles.monthArrow}
              >
                <ChevronLeft color={monthIndex === 0 ? COLORS.muted : COLORS.primary} size={18} />
              </Pressable>
              <Text style={styles.monthLabel}>{month.label}</Text>
              <Pressable
                accessibilityLabel="Mois suivant"
                accessibilityRole="button"
                disabled={monthIndex === HISTORY_MONTHS.length - 1}
                onPress={() => shiftMonth(1)}
                style={styles.monthArrow}
              >
                <ChevronRight
                  color={monthIndex === HISTORY_MONTHS.length - 1 ? COLORS.muted : COLORS.primary}
                  size={18}
                />
              </Pressable>
            </View>
            {month.sessions.length === 0 ? (
              <Text style={styles.emptyHistory}>Aucune séance enregistrée pour ce mois.</Text>
            ) : (
              month.sessions.map((session, index) => {
                const isPresent = session.status !== 'missed'
                return (
                  <View
                    key={`${session.date}-${session.title}-${index}`}
                    style={styles.historyRow}
                  >
                    <View style={styles.historyDate}>
                      <Text style={styles.historyDateText}>{session.date}</Text>
                    </View>
                    <View style={styles.historyDetails}>
                      <Text numberOfLines={1} style={styles.sessionTitle}>{session.title}</Text>
                      <Text style={styles.coachName}>{session.coach}</Text>
                    </View>
                    <View style={[styles.presenceBadge, isPresent ? styles.presentBadge : styles.missedBadge]}>
                      <Text style={styles.presenceBadgeText}>
                        {isPresent ? 'PRÉSENT' : 'MANQUÉ'}
                      </Text>
                    </View>
                  </View>
                )
              })
            )}
          </View>

          <View style={styles.card}>
            <View style={styles.sectionTitleRow}>
              <Bell color={COLORS.secondary} size={17} />
              <Text style={styles.cardTitle}>CENTRE DE NOTIFICATIONS</Text>
            </View>
            <Text style={styles.secureNote}>PRÉFÉRENCES SÉCURISÉES</Text>

            <View style={styles.roleSelector}>
              {[
                { id: 'adult', label: 'ADULTE' },
                { id: 'parent', label: 'PARENT' },
                { id: 'staff', label: 'STAFF' },
              ].map((item) => {
                const selected = activeRole === item.id
                return (
                  <Pressable
                    accessibilityRole="button"
                    accessibilityState={{ selected }}
                    key={item.id}
                    onPress={() => setActiveRole(item.id)}
                    style={[styles.roleOption, selected && styles.roleOptionSelected]}
                  >
                    <Text style={[styles.roleOptionText, selected && styles.roleOptionTextSelected]}>
                      {item.label}
                    </Text>
                  </Pressable>
                )
              })}
            </View>

            {notificationOptions.map((option) => (
              <View key={option.id} style={styles.notificationRow}>
                <View style={styles.notificationCopy}>
                  <Text style={styles.notificationTitle}>{option.label}</Text>
                  {option.detail ? (
                    <Text style={styles.notificationDetail}>{option.detail}</Text>
                  ) : null}
                </View>
                <Switch
                  accessibilityLabel={`${option.label}${option.detail ? ` — ${option.detail}` : ''}`}
                  onValueChange={(value) =>
                    setNotificationPreferences((current) => ({
                      ...current,
                      [option.id]: value,
                    }))
                  }
                  thumbColor={COLORS.primary}
                  trackColor={{ false: COLORS.border, true: COLORS.crimson }}
                  value={notificationPreferences[option.id]}
                />
              </View>
            ))}
          </View>

          {role === 'staff' && (
            <Pressable
              accessibilityRole="button"
              onPress={onOpenCompensation}
              style={styles.compensationLink}
            >
              <Award color={COLORS.crimson} size={22} />
              <Text style={styles.compensationLabel}>MON DÉFRAIEMENT</Text>
              <ChevronRight color={COLORS.primary} size={20} />
            </Pressable>
          )}

          <Pressable
            accessibilityRole="button"
            onPress={handleLogout}
            style={({ pressed }) => [styles.logoutButton, pressed && styles.pressed]}
          >
            <Text style={styles.logoutText}>SE DÉCONNECTER</Text>
          </Pressable>
        </ScrollView>
      </View>
    </SafeAreaView>
  )
}

function ProfileInfo({ label, value, last = false }) {
  return (
    <View style={[styles.infoRow, last && styles.infoRowLast]}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  )
}

function ProfileEditField({
  label,
  value,
  onChangeText,
  editable = true,
  ...inputProps
}) {
  return (
    <View style={styles.editField}>
      <Text style={styles.infoLabel}>{label}</Text>
      <TextInput
        accessibilityLabel={label}
        editable={editable}
        onChangeText={onChangeText}
        placeholderTextColor={COLORS.muted}
        selectionColor={COLORS.crimson}
        style={[styles.profileInput, !editable && styles.profileInputDisabled]}
        value={value}
        {...inputProps}
      />
    </View>
  )
}

function MediaTile({ title, subtitle, variant }) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${title}, ${subtitle}`}
      onPress={() => Alert.alert('Média', 'La lecture du média sera disponible prochainement.')}
      style={styles.mediaTile}
    >
      <View style={[styles.mediaArtwork, variant === 'blue' && styles.mediaArtworkBlue]}>
        <View style={styles.artworkStripe} />
        <View style={styles.playButton}>
          <Play color={COLORS.crimson} fill={COLORS.crimson} size={17} />
        </View>
        <Text style={styles.artworkTag}>TATAMI / SESSION</Text>
      </View>
      <Text numberOfLines={1} style={styles.mediaTileTitle}>{title}</Text>
      <Text style={styles.mediaTileSubtitle}>{subtitle}</Text>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  compensationLink: { minHeight: 58, flexDirection: 'row', alignItems: 'center', gap: 12, padding: 16, backgroundColor: COLORS.surface, borderWidth: 1, borderColor: COLORS.border, borderRadius: 4, marginBottom: 16 },
  compensationLabel: { flex: 1, color: COLORS.primary, fontFamily: 'Anybody-Bold', fontSize: 13 },
  safeArea: {
    backgroundColor: COLORS.canvas,
    flex: 1,
  },
  flex: {
    flex: 1,
  },
  header: {
    alignItems: 'center',
    backgroundColor: COLORS.canvas,
    borderBottomColor: COLORS.border,
    borderBottomWidth: 1,
    flexDirection: 'row',
    height: 54,
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  brand: {
    color: COLORS.primary,
    fontFamily: 'Anybody-BlackItalic',
    fontSize: 21,
    letterSpacing: 1.4,
  },
  headerActions: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 16,
  },
  headerIconButton: {
    alignItems: 'center',
    height: 36,
    justifyContent: 'center',
    width: 36,
  },
  notificationDot: {
    backgroundColor: COLORS.crimson,
    borderColor: COLORS.canvas,
    borderRadius: 4,
    borderWidth: 1,
    height: 7,
    position: 'absolute',
    right: 7,
    top: 6,
    width: 7,
  },
  avatar: {
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderColor: COLORS.border,
    borderRadius: 4,
    borderWidth: 1,
    height: 34,
    justifyContent: 'center',
    width: 34,
  },
  avatarInitials: {
    color: COLORS.primary,
    fontFamily: 'Anybody-Bold',
    fontSize: 10,
  },
  successBanner: {
    alignItems: 'center',
    backgroundColor: COLORS.success,
    flexDirection: 'row',
    gap: 10,
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
    paddingHorizontal: 18,
    paddingTop: 20,
    paddingBottom: 30,
  },
  sectionHeading: {
    marginBottom: 17,
  },
  eyebrow: {
    color: COLORS.crimsonLight,
    fontSize: 9,
    letterSpacing: 1.5,
    marginBottom: 6,
  },
  pageTitle: {
    color: COLORS.primary,
    fontFamily: 'Anybody-BlackItalic',
    fontSize: 30,
    letterSpacing: -0.5,
  },
  passportCard: {
    backgroundColor: COLORS.surface,
    borderColor: COLORS.border,
    borderRadius: 4,
    borderWidth: 1,
    marginBottom: 12,
    padding: 14,
  },
  passportTop: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  athletePortrait: {
    alignItems: 'center',
    backgroundColor: COLORS.input,
    borderColor: COLORS.border,
    borderRadius: 4,
    borderWidth: 1,
    height: 62,
    justifyContent: 'center',
    marginRight: 12,
    width: 62,
  },
  passportIdentity: {
    flex: 1,
  },
  passportEyebrow: {
    color: COLORS.secondary,
    fontSize: 8,
    letterSpacing: 0.9,
    marginBottom: 4,
  },
  athleteName: {
    color: COLORS.primary,
    fontFamily: 'Anybody-BlackItalic',
    fontSize: 14,
    letterSpacing: 0.1,
  },
  clubName: {
    color: COLORS.secondary,
    fontSize: 8,
    letterSpacing: 0.35,
    marginTop: 4,
  },
  activeBadge: {
    backgroundColor: COLORS.crimson,
    borderRadius: 4,
    marginLeft: 5,
    paddingHorizontal: 8,
    paddingVertical: 5,
  },
  activeBadgeText: {
    color: COLORS.primary,
    fontFamily: 'Anybody-Bold',
    fontSize: 8,
    letterSpacing: 0.5,
  },
  passportDivider: {
    backgroundColor: COLORS.border,
    height: 1,
    marginVertical: 12,
  },
  gradeRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  gradeLabel: {
    color: COLORS.secondary,
    fontSize: 8,
    letterSpacing: 0.8,
  },
  beltMark: {
    backgroundColor: COLORS.beltBlue,
    borderColor: COLORS.primary,
    borderWidth: 1,
    height: 12,
    marginLeft: 4,
    width: 28,
  },
  gradeValue: {
    color: COLORS.primary,
    fontFamily: 'Anybody-Bold',
    fontSize: 9,
    letterSpacing: 0.45,
  },
  attendanceCard: {
    backgroundColor: COLORS.surface,
    borderColor: COLORS.border,
    borderRadius: 4,
    borderWidth: 1,
    marginBottom: 12,
    padding: 14,
  },
  statHeading: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cardEyebrow: {
    color: COLORS.secondary,
    fontSize: 9,
    letterSpacing: 1.1,
  },
  monthlyCount: {
    color: COLORS.primary,
    fontFamily: 'Anybody-BlackItalic',
    fontSize: 37,
    letterSpacing: 0.2,
    marginTop: 8,
  },
  progressTrack: {
    backgroundColor: COLORS.border,
    height: 4,
    marginTop: 11,
    overflow: 'hidden',
  },
  progressFill: {
    backgroundColor: COLORS.crimson,
    height: '100%',
    width: '82%',
  },
  goalText: {
    color: COLORS.secondary,
    fontSize: 10,
    marginTop: 8,
  },
  card: {
    backgroundColor: COLORS.surface,
    borderColor: COLORS.border,
    borderRadius: 4,
    borderWidth: 1,
    marginBottom: 12,
    padding: 14,
  },
  sectionTitleRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
    marginBottom: 14,
  },
  cardTitle: {
    color: COLORS.primary,
    flex: 1,
    fontFamily: 'Anybody-BlackItalic',
    fontSize: 12,
    letterSpacing: 0.35,
  },
  seasonLabel: {
    color: COLORS.secondary,
    fontSize: 8,
    letterSpacing: 0.5,
  },
  certificateLine: {
    alignItems: 'center',
    borderTopColor: COLORS.border,
    borderTopWidth: 1,
    flexDirection: 'row',
    minHeight: 52,
    paddingVertical: 8,
  },
  certificateCopy: {
    flex: 1,
  },
  certificateName: {
    color: COLORS.primary,
    fontSize: 10,
  },
  certificateMeta: {
    color: COLORS.secondary,
    fontSize: 9,
    marginTop: 4,
  },
  addedBadge: {
    backgroundColor: COLORS.border,
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 5,
  },
  addedBadgeText: {
    color: COLORS.secondary,
    fontFamily: 'Anybody-Bold',
    fontSize: 8,
    letterSpacing: 0.5,
  },
  missingBadge: {
    backgroundColor: COLORS.crimson,
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 5,
  },
  statusBadgeText: {
    color: COLORS.primary,
    fontFamily: 'Anybody-Bold',
    fontSize: 8,
    letterSpacing: 0.5,
  },
  uploadButton: {
    alignItems: 'center',
    backgroundColor: COLORS.input,
    borderColor: COLORS.border,
    borderRadius: 4,
    borderWidth: 1,
    height: 44,
    justifyContent: 'center',
    marginTop: 10,
  },
  uploadButtonText: {
    color: COLORS.primary,
    fontFamily: 'Anybody-Bold',
    fontSize: 9,
    letterSpacing: 0.35,
  },
  certificateTestSwitch: {
    alignItems: 'center',
    alignSelf: 'flex-start',
    flexDirection: 'row',
    gap: 8,
    marginTop: 9,
    minHeight: 25,
  },
  switchTrack: {
    borderColor: COLORS.border,
    borderRadius: 8,
    borderWidth: 1,
    height: 14,
    justifyContent: 'center',
    paddingHorizontal: 2,
    width: 26,
  },
  switchTrackOn: {
    backgroundColor: COLORS.success,
    borderColor: COLORS.success,
  },
  switchThumb: {
    backgroundColor: COLORS.secondary,
    borderRadius: 5,
    height: 8,
    width: 8,
  },
  switchThumbOn: {
    alignSelf: 'flex-end',
    backgroundColor: COLORS.primary,
  },
  testLabel: {
    color: COLORS.muted,
    fontSize: 8,
    letterSpacing: 0.4,
  },
  certificateSuccess: {
    alignItems: 'center',
    backgroundColor: COLORS.success,
    flexDirection: 'row',
    gap: 7,
    marginTop: 8,
    padding: 8,
  },
  certificateSuccessText: {
    color: COLORS.primary,
    fontSize: 9,
  },
  infoRow: {
    borderBottomColor: COLORS.border,
    borderBottomWidth: 1,
    paddingVertical: 10,
  },
  infoRowLast: {
    borderBottomWidth: 0,
  },
  infoLabel: {
    color: COLORS.secondary,
    fontSize: 8,
    letterSpacing: 0.8,
  },
  infoValue: {
    color: COLORS.primary,
    fontSize: 12,
    marginTop: 4,
  },
  editField: {
    borderBottomColor: COLORS.border,
    borderBottomWidth: 1,
    paddingVertical: 9,
  },
  profileInput: {
    backgroundColor: COLORS.input,
    borderColor: COLORS.border,
    borderRadius: 4,
    borderWidth: 1,
    color: COLORS.primary,
    fontFamily: 'Chivo-Regular',
    fontSize: 12,
    marginTop: 6,
    minHeight: 44,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  profileInputDisabled: {
    color: COLORS.secondary,
  },
  saveProfileButton: {
    alignItems: 'center',
    backgroundColor: COLORS.crimson,
    borderRadius: 4,
    justifyContent: 'center',
    marginTop: 14,
    minHeight: 50,
    paddingHorizontal: 12,
  },
  saveProfileButtonDisabled: {
    opacity: 0.75,
  },
  saveProfileText: {
    color: COLORS.primary,
    fontFamily: 'Anybody-Bold',
    fontSize: 9,
    letterSpacing: 0.45,
    textAlign: 'center',
  },
  cancelEditButton: {
    alignItems: 'center',
    alignSelf: 'center',
    justifyContent: 'center',
    marginTop: 8,
    minHeight: 38,
    paddingHorizontal: 14,
  },
  cancelEditText: {
    color: COLORS.secondary,
    fontFamily: 'Anybody-Bold',
    fontSize: 9,
    letterSpacing: 0.7,
  },
  editButton: {
    alignItems: 'center',
    alignSelf: 'flex-start',
    borderColor: COLORS.border,
    borderRadius: 4,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 7,
    marginTop: 10,
    minHeight: 34,
    paddingHorizontal: 10,
  },
  editText: {
    color: COLORS.secondary,
    fontFamily: 'Anybody-Bold',
    fontSize: 9,
    letterSpacing: 0.6,
  },
  mediaSection: {
    marginBottom: 12,
  },
  mediaTitleRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
    marginBottom: 7,
  },
  mediaCount: {
    color: COLORS.muted,
    fontSize: 8,
    letterSpacing: 0.6,
  },
  mediaNote: {
    color: COLORS.secondary,
    fontSize: 10,
    lineHeight: 15,
    marginBottom: 12,
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
  mediaTileTitle: {
    color: COLORS.primary,
    fontFamily: 'Anybody-Bold',
    fontSize: 9,
    letterSpacing: 0.2,
    marginTop: 7,
  },
  mediaTileSubtitle: {
    color: COLORS.secondary,
    fontSize: 8,
    marginTop: 3,
  },
  historyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  historyCount: {
    color: COLORS.secondary,
    fontSize: 9,
    letterSpacing: 0.4,
    marginTop: 5,
  },
  monthSelector: {
    alignItems: 'center',
    borderBottomColor: COLORS.border,
    borderTopColor: COLORS.border,
    borderBottomWidth: 1,
    borderTopWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 13,
    marginBottom: 2,
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
    letterSpacing: 0.6,
  },
  historyRow: {
    alignItems: 'center',
    borderBottomColor: COLORS.border,
    borderBottomWidth: 1,
    flexDirection: 'row',
    gap: 9,
    minHeight: 62,
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
    paddingHorizontal: 6,
    width: 54,
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
    letterSpacing: 0.1,
  },
  coachName: {
    color: COLORS.secondary,
    fontSize: 8,
    marginTop: 4,
  },
  presenceBadge: {
    borderRadius: 4,
    minWidth: 58,
    paddingHorizontal: 6,
    paddingVertical: 6,
  },
  presentBadge: {
    backgroundColor: COLORS.success,
  },
  missedBadge: {
    backgroundColor: COLORS.errorBackground,
  },
  presenceBadgeText: {
    color: COLORS.primary,
    fontFamily: 'Anybody-Bold',
    fontSize: 7,
    textAlign: 'center',
  },
  emptyHistory: {
    color: COLORS.secondary,
    fontSize: 11,
    paddingVertical: 18,
  },
  secureNote: {
    color: COLORS.muted,
    fontSize: 8,
    letterSpacing: 0.6,
    marginTop: -7,
    marginBottom: 13,
  },
  roleSelector: {
    flexDirection: 'row',
    gap: 6,
    marginBottom: 12,
  },
  roleOption: {
    alignItems: 'center',
    backgroundColor: COLORS.input,
    borderColor: COLORS.border,
    borderRadius: 4,
    borderWidth: 1,
    justifyContent: 'center',
    minHeight: 31,
    minWidth: 67,
    paddingHorizontal: 10,
  },
  roleOptionSelected: {
    backgroundColor: COLORS.crimson,
    borderColor: COLORS.crimson,
  },
  roleOptionText: {
    color: COLORS.secondary,
    fontFamily: 'Anybody-Bold',
    fontSize: 8,
    letterSpacing: 0.5,
  },
  roleOptionTextSelected: {
    color: COLORS.primary,
  },
  notificationRow: {
    alignItems: 'center',
    borderTopColor: COLORS.border,
    borderTopWidth: 1,
    flexDirection: 'row',
    minHeight: 55,
    paddingVertical: 5,
  },
  notificationCopy: {
    flex: 1,
  },
  notificationTitle: {
    color: COLORS.primary,
    fontSize: 11,
  },
  notificationDetail: {
    color: COLORS.secondary,
    fontSize: 9,
    marginTop: 3,
  },
  logoutButton: {
    alignItems: 'center',
    alignSelf: 'center',
    backgroundColor: 'transparent',
    borderColor: COLORS.border,
    borderRadius: 4,
    borderWidth: 1,
    justifyContent: 'center',
    marginTop: 7,
    minHeight: 46,
    paddingHorizontal: 24,
    width: '100%',
  },
  logoutText: {
    color: COLORS.crimson,
    fontFamily: 'Anybody-Bold',
    fontSize: 10,
    letterSpacing: 1.2,
  },
  pressed: {
    opacity: 0.78,
  },
})

export default ProfileScreen
