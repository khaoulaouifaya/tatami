import { useState } from 'react'
import {
  Bell,
  CalendarDays,
  Check,
  ChevronRight,
  Shield,
  UserRound,
  Users,
} from 'lucide-react-native'
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text as NativeText,
  View,
} from 'react-native'

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

const ROLE_OPTIONS = [
  { id: 'adult', label: 'ADULTE', badge: '🔴 ESPACE COMBATTANT ADULTE' },
  { id: 'parent', label: 'PARENT', badge: '👥 ESPACE PARENT' },
  { id: 'staff', label: 'STAFF', badge: '🔸 ACCRÉDITATION STAFF' },
]

const WEEK_DAYS = [
  { short: 'LUN', date: '24', id: 'monday' },
  { short: 'MAR', date: '25', id: 'tuesday' },
  { short: 'MER', date: '26', id: 'wednesday' },
  { short: 'JEU', date: '27', id: 'thursday' },
  { short: 'VEN', date: '28', id: 'friday' },
  { short: 'SAM', date: '29', id: 'saturday' },
  { short: 'DIM', date: '30', id: 'sunday' },
]

const Text = ({ style, ...props }) => (
  <NativeText {...props} style={[{ fontFamily: 'Chivo-Regular' }, style]} />
)

function PlanningScreen({ role = 'adult', onRoleChange, onOpenSession }) {
  const [selectedDay, setSelectedDay] = useState('tuesday')
  const [reservedClasses, setReservedClasses] = useState([])
  const [presenceReported, setPresenceReported] = useState(false)

  const roleOption = ROLE_OPTIONS.find((option) => option.id === role) ?? ROLE_OPTIONS[0]
  const isStaff = role === 'staff'
  const isParentSunday = role === 'parent' && selectedDay === 'sunday'

  function toggleReservation(classId, className) {
    const alreadyReserved = reservedClasses.includes(classId)
    setReservedClasses((current) =>
      alreadyReserved
        ? current.filter((id) => id !== classId)
        : [...current, classId],
    )
    Alert.alert(
      alreadyReserved ? 'Réservation annulée' : 'Réservation confirmée',
      alreadyReserved
        ? `Votre place pour ${className} a été libérée.`
        : `Votre place pour ${className} est réservée.`,
    )
  }

  function reportPresence() {
    setPresenceReported(true)
    Alert.alert('Présence signalée', 'Votre présence à la prochaine session est confirmée.')
  }

  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <View style={styles.brandRow}>
          <View style={styles.brandGroup}>
            <Text style={styles.brand}>TATAMI</Text>
            <View style={styles.clubBadge}><Text style={styles.clubBadgeText}>CDL</Text></View>
          </View>
          <View style={styles.headerActions}>
            <Pressable
              accessibilityLabel="Notifications"
              accessibilityRole="button"
              onPress={() => Alert.alert('Notifications', 'Aucune nouvelle notification.')}
              style={styles.iconButton}
            >
              <Bell color={COLORS.primary} size={19} />
              <View style={styles.notificationDot} />
            </Pressable>
            <View accessibilityLabel="Profil" style={styles.profileButton}>
              <UserRound color={COLORS.canvas} size={17} />
            </View>
          </View>
        </View>
        <View style={styles.roleRow}>
          <Text style={styles.spaceBadge}>{roleOption.badge}</Text>
          <View style={styles.roleOptions}>
            {ROLE_OPTIONS.map((option) => {
              const selected = role === option.id
              return (
                <Pressable
                  accessibilityRole="button"
                  accessibilityState={{ selected }}
                  key={option.id}
                  onPress={() => onRoleChange?.(option.id)}
                  style={[styles.roleOption, selected && styles.roleOptionSelected]}
                >
                  <Text style={[styles.roleOptionText, selected && styles.roleOptionTextSelected]}>
                    {option.label}
                  </Text>
                </Pressable>
              )
            })}
          </View>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {isStaff ? (
          <StaffSessions onTakeAttendance={() => Alert.alert(
            'Liste d’appel',
            'Ouverture de la liste des 24 athlètes inscrits.',
          )} />
        ) : (
          <MemberSchedule
            role={role}
            selectedDay={selectedDay}
            setSelectedDay={setSelectedDay}
            isParentSunday={isParentSunday}
            reservedClasses={reservedClasses}
            onReserve={toggleReservation}
            presenceReported={presenceReported}
            onReportPresence={reportPresence}
            onOpenSession={onOpenSession}
          />
        )}
        <View style={styles.protocol}>
          <Shield color={COLORS.secondary} size={15} />
          <Text style={styles.protocolText}>
            {isStaff
              ? 'Désinfection & pesée officielle après 19h.'
              : 'Protocole Tatami : arrivée requise 10 min avant le salut.'}
          </Text>
        </View>
      </ScrollView>
    </View>
  )
}

function MemberSchedule({
  role,
  selectedDay,
  setSelectedDay,
  isParentSunday,
  reservedClasses,
  onReserve,
  presenceReported,
  onReportPresence,
  onOpenSession,
}) {
  const isParent = role === 'parent'

  return (
    <>
      <View style={styles.heading}>
        <Text style={styles.eyebrow}>08 . PLANNING DU DOJO</Text>
        <Text accessibilityRole="header" style={styles.title}>PLANNING</Text>
      </View>

      <ScrollView
        horizontal
        contentContainerStyle={styles.dayList}
        showsHorizontalScrollIndicator={false}
      >
        {WEEK_DAYS.map((day) => {
          const selected = selectedDay === day.id
          return (
            <Pressable
              accessibilityRole="button"
              accessibilityState={{ selected }}
              key={day.id}
              onPress={() => setSelectedDay(day.id)}
              style={[styles.dayButton, selected && styles.dayButtonSelected]}
            >
              <Text style={[styles.dayName, selected && styles.dayTextSelected]}>
                {day.short}
              </Text>
              <Text style={[styles.dayDate, selected && styles.dayTextSelected]}>
                {day.date}
              </Text>
            </Pressable>
          )
        })}
      </ScrollView>

      {isParentSunday ? (
        <ParentSunday
          onGoToMonday={() => setSelectedDay('monday')}
          onOpenSession={onOpenSession}
        />
      ) : (
        <>
          {!isParent && (
            <View style={styles.nextSessionCard}>
              <View style={styles.nextSessionTop}>
                <Text style={styles.cardEyebrow}>TA PROCHAINE SESSION</Text>
                <View style={styles.reservedBadge}>
                  <Text style={styles.reservedBadgeText}>RÉSERVÉ</Text>
                </View>
              </View>
              <Pressable onPress={() => onOpenSession?.({ title: 'JJB GI AVANCÉ' })}>
                <Text style={styles.sessionName}>JJB GI AVANCÉ</Text>
              </Pressable>
              <Text style={styles.sessionMeta}>19:00 — 20:30  //  TATAMI CENTRAL</Text>
              <Text style={styles.sessionMeta}>INSTRUCTEUR : THOMAS R.</Text>
              <Pressable
                accessibilityRole="button"
                onPress={onReportPresence}
                style={({ pressed }) => [styles.primaryButton, pressed && styles.pressed]}
              >
                <Check color={COLORS.primary} size={17} />
                <Text style={styles.primaryButtonText}>
                  {presenceReported ? 'PRÉSENCE SIGNALÉE' : 'SIGNALER MA PRÉSENCE'}
                </Text>
              </Pressable>
            </View>
          )}

          <View style={styles.sectionHeading}>
            <Text style={styles.sectionTitle}>
              {isParent ? 'CRÉNEAUX RECOMMANDÉS DE LA SEMAINE' : 'CRÉNEAUX DISPONIBLES'}
            </Text>
            <Text style={styles.sectionMeta}>CAMP DES LOUPS · PARIS 11</Text>
          </View>
          {(isParent ? PARENT_CLASSES : ADULT_CLASSES).map((classItem) => (
            <ClassCard
              classItem={classItem}
              key={classItem.id}
              parent={isParent}
              reserved={reservedClasses.includes(classItem.id)}
              onPress={() => onReserve(classItem.id, classItem.title)}
              onOpenDetail={() => onOpenSession?.(classItem)}
            />
          ))}
        </>
      )}
    </>
  )
}

const ADULT_CLASSES = [
  {
    id: 'nogi-open-mat',
    title: 'NO-GI OPEN MAT',
    time: 'MERCREDI · 20:30 — 22:00',
    coach: 'COACH : SARAH M.',
    availability: '18 PLACES DISPOS',
  },
  {
    id: 'grappling-comp',
    title: 'GRAPPLING COMPÉTITION',
    time: 'JEUDI · 19:00 — 20:30',
    coach: 'COACH : THOMAS R.',
    availability: '8 PLACES RESTANTES',
  },
]

const PARENT_CLASSES = [
  {
    id: 'kids-louveteaux',
    title: 'JJB LOUVETEAUX',
    time: 'MERCREDI · 14:00 — 15:00',
    coach: 'COACH : SARAH M.',
    availability: 'ENFANTS 8-11',
  },
  {
    id: 'baby-jjb',
    title: 'BABY JJB',
    time: 'SAMEDI · 10:00 — 10:45',
    coach: 'COACH : THOMAS R.',
    availability: 'ENFANTS 4-7',
  },
]

function ClassCard({ classItem, parent, reserved, onPress, onOpenDetail }) {
  return (
    <View style={styles.classCard}>
      <Pressable
        accessibilityLabel={`Voir le détail de ${classItem.title}`}
        accessibilityRole="button"
        onPress={onOpenDetail}
        style={styles.classDetails}
      >
        <Text style={styles.classTitle}>{classItem.title}</Text>
        <Text style={styles.classTime}>{classItem.time}</Text>
        <Text style={styles.classCoach}>{classItem.coach}</Text>
        <View style={[styles.availabilityBadge, parent && styles.ageBadge]}>
          <Text style={[styles.availabilityText, parent && styles.ageBadgeText]}>
            {classItem.availability}
          </Text>
        </View>
      </Pressable>
      <Pressable
        accessibilityRole="button"
        onPress={onPress}
        style={({ pressed }) => [
          styles.reserveButton,
          reserved && styles.reserveButtonActive,
          pressed && styles.pressed,
        ]}
      >
        <Text style={[styles.reserveButtonText, reserved && styles.reserveButtonTextActive]}>
          {reserved ? 'ANNULER' : 'RÉSERVER'}{parent ? ' ›' : ''}
        </Text>
      </Pressable>
    </View>
  )
}

function ParentSunday({ onGoToMonday, onOpenSession }) {
  return (
    <>
      <View style={styles.closedCard}>
        <CalendarDays color={COLORS.muted} size={34} strokeWidth={1.5} />
        <Text style={styles.closedTitle}>AUCUNE SÉANCE CE JOUR-LÀ</Text>
        <Text style={styles.closedCopy}>
          Le dojo est fermé aux cours collectifs le dimanche. Retrouvez les séances disponibles
          dès lundi.
        </Text>
      </View>
      <Pressable
        accessibilityRole="button"
        onPress={onGoToMonday}
        style={({ pressed }) => [styles.primaryButton, pressed && styles.pressed]}
      >
        <Text style={styles.primaryButtonText}>VOIR LE PROCHAIN JOUR DE COURS (LUNDI)</Text>
      </Pressable>
      <View style={styles.sectionHeading}>
        <Text style={styles.sectionTitle}>CRÉNEAUX RECOMMANDÉS DE LA SEMAINE</Text>
        <Text style={styles.sectionMeta}>POUR VOS ENFANTS</Text>
      </View>
      {PARENT_CLASSES.slice(0, 1).map((classItem) => (
        <ClassCard
          classItem={classItem}
          key={classItem.id}
          parent
          reserved={false}
          onPress={() => Alert.alert('Réservation', `Séance ${classItem.title} sélectionnée.`)}
          onOpenDetail={() => onOpenSession?.(classItem)}
        />
      ))}
    </>
  )
}

function StaffSessions({ onTakeAttendance }) {
  const [expandedSession, setExpandedSession] = useState(null)
  return (
    <>
      <View style={styles.heading}>
        <Text style={styles.eyebrow}>AUJOURD’HUI</Text>
        <Text accessibilityRole="header" style={styles.title}>MES SÉANCES ENCADRÉES</Text>
        <Text style={styles.sectionMeta}>MARDI 25 OCTOBRE 2026</Text>
      </View>

      <View style={styles.liveCard}>
        <View style={styles.liveHeading}>
          <View style={styles.livePip} />
          <Text style={styles.liveText}>EN DIRECT</Text>
          <Text style={styles.countdown}>DÉBUT DANS 14 MIN</Text>
        </View>
        <Text style={styles.liveTime}>19:00</Text>
        <Text style={styles.liveSessionName}>JJB GI AVANCÉ & COMPÉTITION</Text>
        <Text style={styles.sessionMeta}>TATAMI CENTRAL</Text>
        <View style={styles.occupancyRow}>
          <Text style={styles.occupancyLabel}>24 / 28 INSCRITS</Text>
          <Text style={styles.occupancyPercentage}>86%</Text>
        </View>
        <View style={styles.staffProgressTrack}>
          <View style={styles.staffProgressFill} />
        </View>
        <Pressable
          accessibilityRole="button"
          onPress={onTakeAttendance}
          style={({ pressed }) => [styles.primaryButton, pressed && styles.pressed]}
        >
          <Users color={COLORS.primary} size={17} />
          <Text style={styles.primaryButtonText}>FAIRE L’APPEL DU COURS (24 ATHLÈTES)</Text>
        </Pressable>
      </View>

      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>CAPACITÉ TATAMIS</Text>
          <Text style={styles.statValue}>86%</Text>
          <View style={styles.statTrack}><View style={styles.statFill} /></View>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>VÉRIFICATIONS</Text>
          <Text style={styles.statValue}>03 DOSSIERS</Text>
          <Text style={styles.statDetail}>Pointages manuels en attente</Text>
        </View>
      </View>

      <View style={styles.sectionHeading}>
        <Text style={styles.sectionTitle}>PROCHAINES SÉANCES ASSIGNÉES</Text>
        <Text style={styles.sectionMeta}>DEMAIN · MERCREDI 26</Text>
      </View>
      {[
        { title: 'NO-GI OPEN MAT COACHÉ', time: '20:30 — 22:00 · TATAMI CENTRAL' },
        { title: 'JJB KIDS / TECHNIQUE', time: '14:00 — 15:00 · TATAMI 2' },
      ].map((session) => {
        const expanded = expandedSession === session.title
        return (
          <Pressable
            accessibilityRole="button"
            key={session.title}
            onPress={() => setExpandedSession(expanded ? null : session.title)}
            style={({ pressed }) => [styles.assignedCard, pressed && styles.pressed]}
          >
            <View style={styles.assignedCopy}>
              <Text style={styles.classTitle}>{session.title}</Text>
              <Text style={styles.classTime}>{session.time}</Text>
              {expanded && <Text style={styles.classCoach}>COACH ASSIGNÉ · CONFIRMÉ</Text>}
            </View>
            <ChevronRight color={COLORS.secondary} size={19} />
          </Pressable>
        )
      })}
    </>
  )
}

const styles = StyleSheet.create({
  screen: {
    backgroundColor: COLORS.canvas,
    flex: 1,
  },
  header: {
    borderBottomColor: COLORS.border,
    borderBottomWidth: 1,
    paddingHorizontal: 18,
    paddingTop: 10,
    paddingBottom: 11,
  },
  brandRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  brandGroup: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 7,
  },
  brand: {
    color: COLORS.primary,
    fontFamily: 'Anybody-BlackItalic',
    fontSize: 22,
    letterSpacing: 1.4,
  },
  clubBadge: {
    alignItems: 'center',
    backgroundColor: COLORS.crimson,
    height: 22,
    justifyContent: 'center',
    width: 28,
  },
  clubBadgeText: {
    color: COLORS.primary,
    fontFamily: 'Anybody-Bold',
    fontSize: 8,
  },
  headerActions: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 13,
  },
  iconButton: {
    alignItems: 'center',
    height: 34,
    justifyContent: 'center',
    width: 34,
  },
  notificationDot: {
    backgroundColor: COLORS.crimson,
    borderColor: COLORS.canvas,
    borderRadius: 4,
    borderWidth: 1,
    height: 7,
    position: 'absolute',
    right: 6,
    top: 5,
    width: 7,
  },
  profileButton: {
    alignItems: 'center',
    backgroundColor: COLORS.crimsonLight,
    borderRadius: 18,
    height: 34,
    justifyContent: 'center',
    width: 34,
  },
  roleRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  spaceBadge: {
    backgroundColor: COLORS.surface,
    borderColor: COLORS.border,
    borderRadius: 4,
    borderWidth: 1,
    color: COLORS.secondary,
    fontFamily: 'Anybody-Bold',
    fontSize: 7,
    letterSpacing: 0.3,
    overflow: 'hidden',
    paddingHorizontal: 7,
    paddingVertical: 6,
  },
  roleOptions: {
    flexDirection: 'row',
    gap: 4,
  },
  roleOption: {
    alignItems: 'center',
    borderColor: COLORS.border,
    borderRadius: 4,
    borderWidth: 1,
    justifyContent: 'center',
    minHeight: 27,
    paddingHorizontal: 6,
  },
  roleOptionSelected: {
    backgroundColor: COLORS.surface,
    borderColor: COLORS.secondary,
  },
  roleOptionText: {
    color: COLORS.secondary,
    fontFamily: 'Anybody-Bold',
    fontSize: 7,
  },
  roleOptionTextSelected: {
    color: COLORS.primary,
  },
  content: {
    paddingHorizontal: 18,
    paddingTop: 18,
    paddingBottom: 20,
  },
  heading: {
    marginBottom: 17,
  },
  eyebrow: {
    color: COLORS.crimsonLight,
    fontFamily: 'Anybody-Bold',
    fontSize: 9,
    letterSpacing: 1.4,
    marginBottom: 6,
  },
  title: {
    color: COLORS.primary,
    fontFamily: 'Anybody-BlackItalic',
    fontSize: 28,
    letterSpacing: -0.5,
  },
  sectionMeta: {
    color: COLORS.secondary,
    fontSize: 8,
    letterSpacing: 0.6,
    marginTop: 5,
  },
  dayList: {
    gap: 7,
    paddingBottom: 15,
  },
  dayButton: {
    alignItems: 'center',
    backgroundColor: COLORS.input,
    borderColor: COLORS.border,
    borderRadius: 4,
    borderWidth: 1,
    height: 56,
    justifyContent: 'center',
    width: 48,
  },
  dayButtonSelected: {
    backgroundColor: COLORS.crimson,
    borderColor: COLORS.crimson,
  },
  dayName: {
    color: COLORS.secondary,
    fontFamily: 'Anybody-Bold',
    fontSize: 8,
    letterSpacing: 0.4,
  },
  dayDate: {
    color: COLORS.secondary,
    fontFamily: 'Anybody-Bold',
    fontSize: 13,
    marginTop: 3,
  },
  dayTextSelected: {
    color: COLORS.primary,
  },
  nextSessionCard: {
    backgroundColor: COLORS.surface,
    borderColor: COLORS.border,
    borderLeftColor: COLORS.crimson,
    borderLeftWidth: 3,
    borderRadius: 4,
    borderWidth: 1,
    marginBottom: 21,
    padding: 14,
  },
  nextSessionTop: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cardEyebrow: {
    color: COLORS.secondary,
    fontFamily: 'Anybody-Bold',
    fontSize: 8,
    letterSpacing: 1,
  },
  reservedBadge: {
    backgroundColor: COLORS.success,
    borderRadius: 4,
    paddingHorizontal: 7,
    paddingVertical: 4,
  },
  reservedBadgeText: {
    color: COLORS.primary,
    fontFamily: 'Anybody-Bold',
    fontSize: 7,
  },
  sessionName: {
    color: COLORS.primary,
    fontFamily: 'Anybody-BlackItalic',
    fontSize: 20,
    marginTop: 12,
  },
  sessionMeta: {
    color: COLORS.secondary,
    fontSize: 9,
    letterSpacing: 0.3,
    marginTop: 5,
  },
  primaryButton: {
    alignItems: 'center',
    backgroundColor: COLORS.crimson,
    borderRadius: 4,
    flexDirection: 'row',
    gap: 8,
    height: 54,
    justifyContent: 'center',
    marginTop: 14,
    paddingHorizontal: 10,
  },
  primaryButtonText: {
    color: COLORS.primary,
    fontFamily: 'Anybody-Bold',
    fontSize: 9,
    letterSpacing: 0.35,
    textAlign: 'center',
  },
  sectionHeading: {
    marginBottom: 10,
    marginTop: 4,
  },
  sectionTitle: {
    color: COLORS.primary,
    fontFamily: 'Anybody-Bold',
    fontSize: 11,
    letterSpacing: 0.5,
  },
  classCard: {
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderColor: COLORS.border,
    borderRadius: 4,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 8,
    marginBottom: 9,
    padding: 12,
  },
  classDetails: {
    flex: 1,
  },
  classTitle: {
    color: COLORS.primary,
    fontFamily: 'Anybody-Bold',
    fontSize: 10,
    letterSpacing: 0.3,
  },
  classTime: {
    color: COLORS.secondary,
    fontSize: 8,
    marginTop: 5,
  },
  classCoach: {
    color: COLORS.muted,
    fontSize: 8,
    marginTop: 4,
  },
  availabilityBadge: {
    alignSelf: 'flex-start',
    backgroundColor: COLORS.crimson,
    borderRadius: 4,
    marginTop: 7,
    paddingHorizontal: 6,
    paddingVertical: 4,
  },
  availabilityText: {
    color: COLORS.primary,
    fontFamily: 'Anybody-Bold',
    fontSize: 7,
    letterSpacing: 0.3,
  },
  ageBadge: {
    backgroundColor: '#4B2021',
  },
  ageBadgeText: {
    color: COLORS.crimsonLight,
  },
  reserveButton: {
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderColor: COLORS.border,
    borderRadius: 4,
    borderWidth: 1,
    justifyContent: 'center',
    minHeight: 40,
    paddingHorizontal: 9,
  },
  reserveButtonActive: {
    backgroundColor: COLORS.crimson,
    borderColor: COLORS.crimson,
  },
  reserveButtonText: {
    color: COLORS.primary,
    fontFamily: 'Anybody-Bold',
    fontSize: 7,
    letterSpacing: 0.2,
  },
  reserveButtonTextActive: {
    color: COLORS.primary,
  },
  closedCard: {
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderColor: COLORS.border,
    borderRadius: 4,
    borderWidth: 1,
    marginBottom: 11,
    paddingHorizontal: 20,
    paddingVertical: 26,
  },
  closedTitle: {
    color: COLORS.primary,
    fontFamily: 'Anybody-Bold',
    fontSize: 11,
    letterSpacing: 0.45,
    marginTop: 16,
    textAlign: 'center',
  },
  closedCopy: {
    color: COLORS.secondary,
    fontSize: 11,
    lineHeight: 17,
    marginTop: 9,
    textAlign: 'center',
  },
  liveCard: {
    backgroundColor: COLORS.surface,
    borderColor: COLORS.border,
    borderRadius: 4,
    borderWidth: 1,
    marginBottom: 12,
    padding: 14,
  },
  liveHeading: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 7,
  },
  livePip: {
    backgroundColor: COLORS.crimson,
    height: 7,
    width: 7,
  },
  liveText: {
    color: COLORS.crimson,
    flex: 1,
    fontFamily: 'Anybody-Bold',
    fontSize: 9,
    letterSpacing: 0.8,
  },
  countdown: {
    color: COLORS.secondary,
    fontFamily: 'Anybody-Bold',
    fontSize: 7,
    letterSpacing: 0.4,
  },
  liveTime: {
    color: COLORS.primary,
    fontFamily: 'Anybody-BlackItalic',
    fontSize: 32,
    marginTop: 12,
  },
  liveSessionName: {
    color: COLORS.primary,
    fontFamily: 'Anybody-Bold',
    fontSize: 13,
    letterSpacing: 0.2,
    marginTop: 3,
  },
  occupancyRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 15,
  },
  occupancyLabel: {
    color: COLORS.secondary,
    fontFamily: 'Anybody-Bold',
    fontSize: 8,
    letterSpacing: 0.6,
  },
  occupancyPercentage: {
    color: COLORS.primary,
    fontFamily: 'Anybody-Bold',
    fontSize: 9,
  },
  staffProgressTrack: {
    backgroundColor: COLORS.border,
    height: 6,
    marginTop: 7,
    overflow: 'hidden',
  },
  staffProgressFill: {
    backgroundColor: COLORS.crimson,
    height: '100%',
    width: '86%',
  },
  statsRow: {
    flexDirection: 'row',
    gap: 9,
    marginBottom: 18,
  },
  statCard: {
    backgroundColor: COLORS.surface,
    borderColor: COLORS.border,
    borderRadius: 4,
    borderWidth: 1,
    flex: 1,
    minHeight: 112,
    padding: 11,
  },
  statLabel: {
    color: COLORS.secondary,
    fontFamily: 'Anybody-Bold',
    fontSize: 7,
    letterSpacing: 0.4,
  },
  statValue: {
    color: COLORS.primary,
    fontFamily: 'Anybody-BlackItalic',
    fontSize: 20,
    marginTop: 10,
  },
  statTrack: {
    backgroundColor: COLORS.border,
    height: 4,
    marginTop: 9,
    overflow: 'hidden',
  },
  statFill: {
    backgroundColor: COLORS.crimson,
    height: '100%',
    width: '86%',
  },
  statDetail: {
    color: COLORS.secondary,
    fontSize: 8,
    lineHeight: 12,
    marginTop: 5,
  },
  assignedCard: {
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderColor: COLORS.border,
    borderRadius: 4,
    borderWidth: 1,
    flexDirection: 'row',
    marginBottom: 8,
    padding: 12,
  },
  assignedCopy: {
    flex: 1,
  },
  protocol: {
    alignItems: 'center',
    borderTopColor: COLORS.border,
    borderTopWidth: 1,
    flexDirection: 'row',
    gap: 8,
    marginTop: 14,
    paddingTop: 12,
  },
  protocolText: {
    color: COLORS.secondary,
    flex: 1,
    fontSize: 9,
    lineHeight: 14,
  },
  pressed: {
    opacity: 0.78,
  },
})

export default PlanningScreen
