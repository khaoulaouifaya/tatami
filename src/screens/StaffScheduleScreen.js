import { useState } from 'react'
import {
  AlertTriangle,
  ArrowRight,
  Bell,
  CalendarDays,
  Check,
  ChevronLeft,
  ChevronRight,
  ClipboardCheck,
  Clock3,
  Info,
  MapPin,
  UserRound,
} from 'lucide-react-native'
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text as NativeText,
  View,
} from 'react-native'

const C = {
  bg: '#0B0B0B',
  surface: '#1A1A1C',
  input: '#131313',
  border: '#28282C',
  white: '#FFFFFF',
  gray: '#9A9A9A',
  muted: '#555558',
  red: '#E5322D',
  redLight: '#FFB4AB',
}

const DAYS = [
  { day: 'LUN', date: '21' },
  { day: 'MAR', date: '22' },
  { day: 'MER', date: '23' },
  { day: 'JEU', date: '24' },
  { day: 'VEN', date: '25' },
  { day: 'SAM', date: '26' },
  { day: 'DIM', date: '27' },
]

const Text = ({ style, ...props }) => (
  <NativeText {...props} style={[{ fontFamily: 'Chivo-Regular' }, style]} />
)

function StaffScheduleScreen({ onOpenAttendance, onOpenPlanning }) {
  const [view, setView] = useState('active')
  const [selectedDate, setSelectedDate] = useState('23')
  const [weekOffset, setWeekOffset] = useState(0)
  const notify = (message) => Alert.alert('Séances staff', message)

  return (
    <View style={s.screen}>
      <View style={s.header}>
        <View style={s.brandRow}>
          <View style={s.brandGroup}>
            <Text style={s.brand}>TATAMI</Text>
            <View style={s.clubBadge}><Text style={s.clubBadgeText}>CDL</Text></View>
          </View>
          <View style={s.headerActions}>
            <Pressable
              accessibilityLabel="Notifications"
              onPress={() => notify('Aucune nouvelle notification.')}
              style={s.iconButton}
            >
              <Bell color={C.white} size={18} />
              <View style={s.notificationDot} />
            </Pressable>
            <View style={s.avatar}>
              <UserRound color={C.bg} size={16} />
              <View style={s.staffBadge}><Text style={s.staffBadgeText}>STAFF</Text></View>
            </View>
          </View>
        </View>
      </View>

      <ScrollView contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>
        <View style={s.demoRow}>
          <Text style={s.demoCaption}>APERÇU STAFF</Text>
          {[
            { id: 'active', label: 'MERCREDI ACTIF' },
            { id: 'empty', label: 'SEMAINE RELÂCHE' },
          ].map((item) => {
            const active = view === item.id
            return (
              <Pressable
                accessibilityRole="button"
                accessibilityState={{ selected: active }}
                key={item.id}
                onPress={() => setView(item.id)}
                style={[s.demoButton, active && s.demoButtonActive]}
              >
                <Text style={[s.demoText, active && s.demoTextActive]}>{item.label}</Text>
              </Pressable>
            )
          })}
        </View>

        <View style={s.metaRow}>
          <Text style={s.spaceBadge}>🔴 ESPACE ENCADREMENT & STAFF</Text>
          <Text style={s.coachName}>COACH MEHDI BENALI</Text>
        </View>
        <Text accessibilityRole="header" style={s.pageTitle}>MES SÉANCES</Text>

        {view === 'active' ? (
          <ActiveWeek
            selectedDate={selectedDate}
            onSelectDate={setSelectedDate}
            onOpenAttendance={onOpenAttendance}
            onAction={notify}
          />
        ) : (
          <EmptyWeek
            weekOffset={weekOffset}
            onShiftWeek={setWeekOffset}
            onOpenPlanning={onOpenPlanning}
            onAction={notify}
          />
        )}
      </ScrollView>
    </View>
  )
}

function ActiveWeek({ selectedDate, onSelectDate, onOpenAttendance, onAction }) {
  return (
    <>
      <View style={s.alertCard}>
        <AlertTriangle color={C.red} size={18} />
        <View style={s.alertCopy}>
          <Text style={s.alertTitle}>1 SÉANCE EN ATTENTE DE PROGRAMME</Text>
          <Text style={s.bodySmall}>
            Validation requise pour coordonner les coachs et préparer la séance.
          </Text>
        </View>
        <ChevronRight color={C.gray} size={17} />
      </View>

      <ScrollView horizontal contentContainerStyle={s.days} showsHorizontalScrollIndicator={false}>
        {DAYS.map((item) => {
          const active = selectedDate === item.date
          return (
            <Pressable
              accessibilityRole="button"
              accessibilityState={{ selected: active }}
              key={item.date}
              onPress={() => onSelectDate(item.date)}
              style={[s.day, active && s.dayActive]}
            >
              <Text style={[s.dayName, active && s.dayTextActive]}>{item.day}</Text>
              <Text style={[s.dayDate, active && s.dayTextActive]}>{item.date}</Text>
              {active && <View style={s.dayDot} />}
            </Pressable>
          )
        })}
      </ScrollView>

      <View style={s.weekTheme}>
        <View style={s.themeMeta}>
          <Text style={s.themeEyebrow}>THÉMATIQUE HEBDOMADAIRE</Text>
          <Text style={s.themeWeek}>BLOC SEMAINE 4</Text>
        </View>
        <Text style={s.themeTitle}>
          PASSAGE DE GARDE TORREANDO & CONTRÔLE LATÉRAL
        </Text>
      </View>

      {selectedDate === '23' ? (
        <>
          <KidsCourse onAction={onAction} />
          <AdultCourse onOpenAttendance={onOpenAttendance} />
          <View style={s.nextSection}>
            <Text style={s.sectionTitle}>PROCHAINE AFFECTATION // VENDREDI</Text>
            <UpcomingCourse onAction={onAction} />
          </View>
        </>
      ) : (
        <View style={s.emptyDay}>
          <CalendarDays color={C.muted} size={25} />
          <Text style={s.emptyDayTitle}>AUCUN CRÉNEAU AFFICHÉ</Text>
          <Text style={s.bodySmall}>
            Aucune séance staff n’est listée pour ce jour. Sélectionnez MER 23 pour voir les cours
            de démonstration.
          </Text>
        </View>
      )}
    </>
  )
}

function CourseHeader({ category }) {
  return (
    <View style={s.courseHeader}>
      <View style={s.categoryBadge}>
        <Text style={s.categoryText}>{category}</Text>
      </View>
      <Text style={s.headCoach}>🛑 HEAD COACH</Text>
    </View>
  )
}

function CourseMeta({ time, mat }) {
  return (
    <View style={s.courseMeta}>
      <Clock3 color={C.gray} size={14} />
      <Text style={s.metaText}>{time}</Text>
      <MapPin color={C.gray} size={14} />
      <Text style={s.metaText}>{mat}</Text>
    </View>
  )
}

function KidsCourse({ onAction }) {
  return (
    <View style={s.courseCard}>
      <CourseHeader category="JJB KIDS (6-11 ANS) // MINI-LOUPS" />
      <Text style={s.courseTitle}>JJB KIDS // FONDAMENTAUX & JEUX</Text>
      <CourseMeta time="15:15 — 16:30" mat="TAPIS 1" />
      <View style={s.urgentCard}>
        <View style={s.urgentHeading}>
          <AlertTriangle color={C.red} size={15} />
          <Text style={s.urgentTitle}>THÉMATIQUE NON RENSEIGNÉE // ACTION REQUISE</Text>
        </View>
        <Text style={s.bodySmall}>
          Le plan d’entraînement technique n’a pas encore été défini pour cette séance. Ajoutez
          le contenu pour que toute l’équipe puisse le consulter.
        </Text>
        <Pressable
          accessibilityRole="button"
          onPress={() => onAction('Éditeur de thématique indisponible en mode démonstration.')}
          style={({ pressed }) => [s.defineButton, pressed && s.pressed]}
        >
          <Text style={s.defineText}>+ DÉFINIR LA THÉMATIQUE</Text>
        </Pressable>
      </View>
      <View style={s.attendanceLine}>
        <Text style={s.attendanceText}>18 / 20 INSCRITS</Text>
        <Text style={s.remainingText}>2 PLACES RESTANTES</Text>
      </View>
      <View style={s.actionRow}>
        <Pressable
          accessibilityRole="button"
          onPress={() => onAction('Modification de séance en mode démonstration.')}
          style={({ pressed }) => [s.actionButton, pressed && s.pressed]}
        >
          <Text style={s.actionButtonText}>🎛️ MODIFIER</Text>
        </Pressable>
        <Pressable
          accessibilityRole="button"
          onPress={() => onAction('Ouverture de l’appel de la séance enfants.')}
          style={({ pressed }) => [s.actionButton, pressed && s.pressed]}
        >
          <Text style={s.actionButtonText}>📋 FAIRE L’APPEL</Text>
        </Pressable>
      </View>
    </View>
  )
}

function AdultCourse({ onOpenAttendance }) {
  return (
    <View style={s.courseCard}>
      <CourseHeader category="JJB ADULTE GI // TOUS NIVEAUX" />
      <Text style={s.courseTitle}>JJB ADULTE GI // FONDAMENTAUX</Text>
      <CourseMeta time="18:30 — 20:00" mat="GRAND TAPIS" />
      <View style={s.programCard}>
        <View style={s.programHeading}>
          <Check color={C.red} size={15} />
          <Text style={s.programTitle}>PROGRAMME PÉDAGOGIQUE VALIDE</Text>
        </View>
        <Text style={s.programWeek}>BLOC SEMAINE 4</Text>
        <Text style={s.bullet}>• Torreando pass & pression stabilisée</Text>
        <Text style={s.bullet}>• Double grip bas de pantalon</Text>
        <Text style={s.bullet}>• Transition sous-aisselle et contrôle latéral</Text>
      </View>
      <Text style={s.fullText}>24 / 24 INSCRITS (COMPLET) // +3 LISTE D’ATTENTE</Text>
      <Pressable
        accessibilityRole="button"
        onPress={onOpenAttendance}
        style={({ pressed }) => [s.primaryButton, pressed && s.pressed]}
      >
        <ClipboardCheck color={C.white} size={16} />
        <Text style={s.primaryText}>📋 FAIRE L’APPEL (24 ÉLÈVES)</Text>
      </Pressable>
    </View>
  )
}

function UpcomingCourse({ onAction }) {
  return (
    <View style={s.upcomingCard}>
      <View style={s.upcomingArtwork}>
        <View style={s.artworkStripe} />
        <Text style={s.artworkText}>CDL / COACHING</Text>
      </View>
      <View style={s.upcomingCopy}>
        <Text style={s.upcomingTitle}>GRAPPLING COMPÉTITION // SPARRING & SUBMISSION</Text>
        <Text style={s.bodySmall}>VENDREDI · 19:00 — 20:30 · TATAMI CENTRAL</Text>
        <Pressable
          accessibilityRole="button"
          onPress={() => onAction('Préparation de l’appel en mode démonstration.')}
          style={({ pressed }) => [s.prepareButton, pressed && s.pressed]}
        >
          <CalendarDays color={C.white} size={14} />
          <Text style={s.prepareText}>PRÉPARER L’APPEL</Text>
        </Pressable>
      </View>
    </View>
  )
}

function EmptyWeek({ weekOffset, onShiftWeek, onOpenPlanning, onAction }) {
  return (
    <>
      <View style={s.weekSelector}>
        <Pressable
          accessibilityLabel="Semaine précédente"
          onPress={() => onShiftWeek((offset) => offset - 1)}
          style={s.weekArrow}
        >
          <ChevronLeft color={C.white} size={18} />
        </Pressable>
        <View style={s.weekSelectorCopy}>
          <Text style={s.weekSelectorTitle}>SEMAINE {44 + weekOffset} [RELÂCHE]</Text>
          <Text style={s.weekSelectorSubtitle}>Toussaint • Dojo Principal</Text>
        </View>
        <Pressable
          accessibilityLabel="Semaine suivante"
          onPress={() => onShiftWeek((offset) => offset + 1)}
          style={s.weekArrow}
        >
          <ChevronRight color={C.white} size={18} />
        </Pressable>
      </View>

      <View style={s.quotaLine}>
        <Text style={s.quotaLabel}>QUOTA STAFF AFFECTÉ</Text>
        <Text style={s.quotaValue}>0 SÉANCE</Text>
      </View>
      <View style={s.restCard}>
        <View style={s.restArtwork}>
          <View style={s.restStripeOne} />
          <View style={s.restStripeTwo} />
          <View style={s.restOverlay} />
          <Text style={s.restArtworkLabel}>TATAMI EN REPOS</Text>
        </View>
        <Text style={s.restTitle}>AUCUNE SÉANCE CETTE SEMAINE</Text>
        <Text style={s.restText}>
          Vous n’avez aucun cours ni créneau d’entraînement assigné pour cette semaine de
          relâche. Les plannings staff sont actualisés chaque dimanche soir à 20h00.
        </Text>
        <Pressable
          accessibilityRole="button"
          onPress={onOpenPlanning ?? (() => onAction('Planning général non connecté en démo.'))}
          style={({ pressed }) => [s.primaryButton, pressed && s.pressed]}
        >
          <Text style={s.primaryText}>CONSULTER LE PLANNING GÉNÉRAL</Text>
          <ArrowRight color={C.white} size={16} />
        </Pressable>
        <Pressable
          accessibilityRole="button"
          onPress={() => onAction('Disponibilité transmise à la direction en mode démonstration.')}
          style={({ pressed }) => [s.secondaryWide, pressed && s.pressed]}
        >
          <Text style={s.actionButtonText}>SIGNALER UNE DISPONIBILITÉ / REMPLACEMENT</Text>
        </Pressable>
      </View>

      <View style={s.reminderCard}>
        <Info color={C.red} size={17} />
        <View style={s.reminderCopy}>
          <Text style={s.reminderTitle}>RAPPEL PERMANENCE CDL</Text>
          <Text style={s.bodySmall}>
            Le dojo reste accessible sur les horaires de permanence communiqués par
            l’administration. Consultez les messages du club avant tout déplacement.
          </Text>
        </View>
      </View>

      <View style={s.returnCard}>
        <CalendarDays color={C.redLight} size={17} />
        <View style={s.returnCopy}>
          <Text style={s.returnEyebrow}>REPRISE · SEMAINE SUIVANTE</Text>
          <Text style={s.returnTitle}>LUN 04 // 18H30</Text>
          <Text style={s.returnDetail}>JJB ADULTES AVANCÉ</Text>
        </View>
        <ChevronRight color={C.gray} size={18} />
      </View>
    </>
  )
}

const s = StyleSheet.create({
  screen: { backgroundColor: C.bg, flex: 1 },
  header: {
    alignItems: 'center',
    borderBottomColor: C.border,
    borderBottomWidth: 1,
    flexDirection: 'row',
    height: 54,
    justifyContent: 'space-between',
    paddingHorizontal: 18,
  },
  brandRow: { alignItems: 'center', flex: 1, flexDirection: 'row', justifyContent: 'space-between' },
  brandGroup: { alignItems: 'center', flexDirection: 'row', gap: 7 },
  brand: { color: C.white, fontFamily: 'Anybody-BlackItalic', fontSize: 22, letterSpacing: 1.4 },
  clubBadge: { alignItems: 'center', backgroundColor: C.red, height: 21, justifyContent: 'center', width: 27 },
  clubBadgeText: { color: C.white, fontFamily: 'Anybody-Bold', fontSize: 8 },
  headerActions: { alignItems: 'center', flexDirection: 'row', gap: 12 },
  iconButton: { alignItems: 'center', height: 35, justifyContent: 'center', width: 35 },
  notificationDot: { backgroundColor: C.red, borderColor: C.bg, borderRadius: 4, borderWidth: 1, height: 7, position: 'absolute', right: 6, top: 5, width: 7 },
  avatar: { alignItems: 'center', backgroundColor: C.redLight, borderRadius: 18, height: 34, justifyContent: 'center', width: 34 },
  staffBadge: { backgroundColor: C.red, borderColor: C.bg, borderRadius: 3, borderWidth: 1, bottom: -3, paddingHorizontal: 3, position: 'absolute', right: -5 },
  staffBadgeText: { color: C.white, fontFamily: 'Anybody-Bold', fontSize: 5 },
  content: { paddingBottom: 22, paddingHorizontal: 17, paddingTop: 13 },
  demoRow: { alignItems: 'center', flexDirection: 'row', gap: 5, justifyContent: 'flex-end', marginBottom: 13 },
  demoCaption: { color: C.muted, flex: 1, fontFamily: 'Anybody-Bold', fontSize: 7, letterSpacing: 0.6 },
  demoButton: { alignItems: 'center', backgroundColor: C.surface, borderColor: C.border, borderRadius: 4, borderWidth: 1, justifyContent: 'center', minHeight: 28, paddingHorizontal: 7 },
  demoButtonActive: { borderColor: C.red },
  demoText: { color: C.gray, fontFamily: 'Anybody-Bold', fontSize: 7 },
  demoTextActive: { color: C.redLight },
  metaRow: { alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  spaceBadge: { backgroundColor: C.surface, borderColor: C.border, borderRadius: 4, borderWidth: 1, color: C.gray, fontFamily: 'Anybody-Bold', fontSize: 7, overflow: 'hidden', paddingHorizontal: 7, paddingVertical: 5 },
  coachName: { color: C.gray, fontFamily: 'Anybody-Bold', fontSize: 7 },
  pageTitle: { color: C.white, fontFamily: 'Anybody-BlackItalic', fontSize: 32, letterSpacing: -0.5, marginBottom: 14 },
  alertCard: { alignItems: 'center', backgroundColor: C.surface, borderColor: C.border, borderRadius: 4, borderWidth: 1, flexDirection: 'row', gap: 9, marginBottom: 12, padding: 10 },
  alertCopy: { flex: 1 },
  alertTitle: { color: C.redLight, fontFamily: 'Anybody-Bold', fontSize: 8 },
  bodySmall: { color: C.gray, fontSize: 9, lineHeight: 14, marginTop: 4 },
  days: { gap: 6, paddingBottom: 12 },
  day: { alignItems: 'center', backgroundColor: C.input, borderColor: C.border, borderRadius: 4, borderWidth: 1, height: 52, justifyContent: 'center', width: 43 },
  dayActive: { backgroundColor: C.red, borderColor: C.red },
  dayName: { color: C.gray, fontFamily: 'Anybody-Bold', fontSize: 7 },
  dayDate: { color: C.gray, fontFamily: 'Anybody-Bold', fontSize: 12, marginTop: 3 },
  dayTextActive: { color: C.white },
  dayDot: { backgroundColor: C.white, borderRadius: 3, height: 4, marginTop: 2, width: 4 },
  weekTheme: { backgroundColor: C.surface, borderColor: C.border, borderRadius: 4, borderWidth: 1, marginBottom: 12, padding: 10 },
  themeMeta: { alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5 },
  themeEyebrow: { color: C.gray, fontFamily: 'Anybody-Bold', fontSize: 7 },
  themeWeek: { color: C.redLight, fontFamily: 'Anybody-Bold', fontSize: 7 },
  themeTitle: { color: C.white, fontFamily: 'Anybody-Bold', fontSize: 10, lineHeight: 15 },
  courseCard: { backgroundColor: C.surface, borderColor: C.border, borderRadius: 4, borderWidth: 1, marginBottom: 10, padding: 11 },
  courseHeader: { alignItems: 'center', flexDirection: 'row', gap: 5, justifyContent: 'space-between', marginBottom: 8 },
  categoryBadge: { backgroundColor: C.input, borderColor: C.border, borderRadius: 4, borderWidth: 1, flex: 1, paddingHorizontal: 6, paddingVertical: 5 },
  categoryText: { color: C.gray, fontFamily: 'Anybody-Bold', fontSize: 6 },
  headCoach: { color: C.redLight, fontFamily: 'Anybody-Bold', fontSize: 7 },
  courseTitle: { color: C.white, fontFamily: 'Anybody-BlackItalic', fontSize: 17, lineHeight: 21 },
  courseMeta: { alignItems: 'center', flexDirection: 'row', flexWrap: 'wrap', gap: 5, marginTop: 7 },
  metaText: { color: C.gray, fontSize: 8, marginRight: 7 },
  urgentCard: { backgroundColor: '#24191A', borderColor: '#682629', borderRadius: 4, borderWidth: 1, marginTop: 10, padding: 9 },
  urgentHeading: { alignItems: 'center', flexDirection: 'row', gap: 6 },
  urgentTitle: { color: C.redLight, flex: 1, fontFamily: 'Anybody-Bold', fontSize: 7 },
  defineButton: { alignItems: 'center', alignSelf: 'flex-start', backgroundColor: C.red, borderRadius: 4, justifyContent: 'center', marginTop: 8, minHeight: 34, paddingHorizontal: 9 },
  defineText: { color: C.white, fontFamily: 'Anybody-Bold', fontSize: 7 },
  attendanceLine: { alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 },
  attendanceText: { color: C.white, fontFamily: 'Anybody-Bold', fontSize: 8 },
  remainingText: { color: C.gray, fontFamily: 'Anybody-Bold', fontSize: 7 },
  actionRow: { flexDirection: 'row', gap: 7, marginTop: 8 },
  actionButton: { alignItems: 'center', backgroundColor: C.surface, borderColor: C.border, borderRadius: 4, borderWidth: 1, flex: 1, justifyContent: 'center', minHeight: 40, paddingHorizontal: 6 },
  actionButtonText: { color: C.white, fontFamily: 'Anybody-Bold', fontSize: 7, textAlign: 'center' },
  programCard: { backgroundColor: C.input, borderColor: C.border, borderRadius: 4, borderWidth: 1, marginTop: 10, padding: 9 },
  programHeading: { alignItems: 'center', flexDirection: 'row', gap: 6 },
  programTitle: { color: C.white, flex: 1, fontFamily: 'Anybody-Bold', fontSize: 7 },
  programWeek: { color: C.redLight, fontFamily: 'Anybody-Bold', fontSize: 7, marginLeft: 21, marginTop: 4 },
  bullet: { color: C.gray, fontSize: 9, lineHeight: 15, marginLeft: 9, marginTop: 3 },
  fullText: { color: C.redLight, fontFamily: 'Anybody-Bold', fontSize: 8, marginTop: 10 },
  primaryButton: { alignItems: 'center', backgroundColor: C.red, borderRadius: 4, flexDirection: 'row', gap: 8, height: 50, justifyContent: 'center', marginTop: 9, paddingHorizontal: 10 },
  primaryText: { color: C.white, flex: 1, fontFamily: 'Anybody-Bold', fontSize: 8, textAlign: 'center' },
  nextSection: { marginTop: 5 },
  sectionTitle: { color: C.white, fontFamily: 'Anybody-Bold', fontSize: 9, marginBottom: 8 },
  upcomingCard: { backgroundColor: C.surface, borderColor: C.border, borderRadius: 4, borderWidth: 1, overflow: 'hidden' },
  upcomingArtwork: { backgroundColor: '#332020', height: 78, justifyContent: 'center', overflow: 'hidden', paddingHorizontal: 12 },
  artworkStripe: { backgroundColor: 'rgba(255,255,255,0.1)', height: 150, position: 'absolute', right: 70, top: -30, transform: [{ rotate: '29deg' }], width: 30 },
  artworkText: { color: 'rgba(255,255,255,0.55)', fontFamily: 'Anybody-BlackItalic', fontSize: 20 },
  upcomingCopy: { padding: 10 },
  upcomingTitle: { color: C.white, fontFamily: 'Anybody-Bold', fontSize: 9, lineHeight: 14 },
  prepareButton: { alignItems: 'center', alignSelf: 'flex-start', backgroundColor: C.input, borderColor: C.border, borderRadius: 4, borderWidth: 1, flexDirection: 'row', gap: 7, marginTop: 9, minHeight: 38, paddingHorizontal: 9 },
  prepareText: { color: C.white, fontFamily: 'Anybody-Bold', fontSize: 7 },
  emptyDay: { alignItems: 'center', backgroundColor: C.surface, borderColor: C.border, borderRadius: 4, borderWidth: 1, marginTop: 9, padding: 22 },
  emptyDayTitle: { color: C.white, fontFamily: 'Anybody-Bold', fontSize: 11, marginTop: 10 },
  weekSelector: { alignItems: 'center', backgroundColor: C.surface, borderColor: C.border, borderRadius: 4, borderWidth: 1, flexDirection: 'row', marginTop: 2, paddingHorizontal: 4, paddingVertical: 5 },
  weekArrow: { alignItems: 'center', height: 38, justifyContent: 'center', width: 38 },
  weekSelectorCopy: { alignItems: 'center', flex: 1 },
  weekSelectorTitle: { color: C.white, fontFamily: 'Anybody-Bold', fontSize: 9 },
  weekSelectorSubtitle: { color: C.gray, fontSize: 8, marginTop: 4 },
  quotaLine: { alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between', marginVertical: 12 },
  quotaLabel: { color: C.gray, fontFamily: 'Anybody-Bold', fontSize: 8 },
  quotaValue: { color: C.redLight, fontFamily: 'Anybody-Bold', fontSize: 9 },
  restCard: { backgroundColor: C.surface, borderColor: C.border, borderRadius: 4, borderWidth: 1, padding: 13 },
  restArtwork: { alignItems: 'center', backgroundColor: '#222224', borderColor: C.border, borderRadius: 4, borderWidth: 1, height: 137, justifyContent: 'center', marginBottom: 13, overflow: 'hidden' },
  restStripeOne: { backgroundColor: '#333336', height: 230, position: 'absolute', transform: [{ rotate: '25deg' }], width: 36 },
  restStripeTwo: { backgroundColor: 'rgba(0,0,0,0.38)', height: 230, left: '67%', position: 'absolute', transform: [{ rotate: '25deg' }], width: 56 },
  restOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.25)' },
  restArtworkLabel: { color: C.gray, fontFamily: 'Anybody-BlackItalic', fontSize: 17, letterSpacing: 1.2 },
  restTitle: { color: C.white, fontFamily: 'Anybody-BlackItalic', fontSize: 19, lineHeight: 24, textAlign: 'center' },
  restText: { color: C.gray, fontSize: 10, lineHeight: 16, marginTop: 8, textAlign: 'center' },
  secondaryWide: { alignItems: 'center', backgroundColor: C.input, borderColor: C.border, borderRadius: 4, borderWidth: 1, justifyContent: 'center', marginTop: 8, minHeight: 46, paddingHorizontal: 9 },
  reminderCard: { alignItems: 'flex-start', backgroundColor: C.surface, borderColor: C.border, borderRadius: 4, borderWidth: 1, flexDirection: 'row', gap: 9, marginTop: 10, padding: 11 },
  reminderCopy: { flex: 1 },
  reminderTitle: { color: C.redLight, fontFamily: 'Anybody-Bold', fontSize: 8 },
  returnCard: { alignItems: 'center', backgroundColor: C.surface, borderColor: C.border, borderRadius: 4, borderWidth: 1, flexDirection: 'row', gap: 9, marginTop: 10, padding: 10 },
  returnCopy: { flex: 1 },
  returnEyebrow: { color: C.gray, fontFamily: 'Anybody-Bold', fontSize: 7 },
  returnTitle: { color: C.white, fontFamily: 'Anybody-BlackItalic', fontSize: 14, marginTop: 3 },
  returnDetail: { color: C.redLight, fontFamily: 'Anybody-Bold', fontSize: 8, marginTop: 2 },
  pressed: { opacity: 0.78 },
})

export default StaffScheduleScreen