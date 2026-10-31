import { useMemo, useState } from 'react'
import {
  ArrowRight,
  Bell,
  Check,
  ChevronDown,
  ClipboardCheck,
  Crosshair,
  Plus,
  Search,
  Shuffle,
  UserRound,
  Users,
  X,
} from 'lucide-react-native'
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text as NativeText,
  TextInput,
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
  warning: '#F28C28',
  success: '#1F9D55',
  error: '#93000A',
}

const DEMO_VIEWS = [
  { id: 'active', label: 'LIVE / CLASSIQUE' },
  { id: 'full', label: 'COMPLET / ATTENTE' },
  { id: 'empty', label: 'SÉANCE VIDE' },
]

const CLASSIC_STUDENTS = [
  { id: 'ml', initials: 'ML', name: 'Mila Laurent', age: 8, grade: 'Blanche 2 barrettes', medical: 'DOSSIER COMPLET', medicalStatus: 'ok', present: true },
  { id: 'lm', initials: 'LM', name: 'Lucas Moreau', age: 9, grade: 'Blanche 1 barrette', medical: 'CERTIFICAT OK', medicalStatus: 'ok', present: true },
  { id: 'al', initials: 'AL', name: 'Adam Leroy', age: 7, grade: 'Grise 1 barrette', medical: 'DOSSIER COMPLET', medicalStatus: 'ok', present: true },
  { id: 'em', initials: 'EM', name: 'Emma Martin', age: 10, grade: 'Jaune 1 barrette', medical: 'CERTIFICAT OK', medicalStatus: 'ok', present: true },
  { id: 'no', initials: 'NO', name: 'Noah Olivier', age: 8, grade: 'Blanche', medical: 'DOSSIER COMPLET', medicalStatus: 'ok', present: true },
  { id: 'ch', initials: 'CH', name: 'Chloé Henry', age: 9, grade: 'Grise 2 barrettes', medical: 'CERTIFICAT OK', medicalStatus: 'ok', present: true },
  { id: 'ib', initials: 'IB', name: 'Ilyes Bernard', age: 11, grade: 'Jaune 2 barrettes', medical: 'DOSSIER COMPLET', medicalStatus: 'ok', present: true },
  { id: 'zo', initials: 'ZO', name: 'Zoé Robert', age: 7, grade: 'Blanche', medical: 'CERTIFICAT OK', medicalStatus: 'ok', present: true },
  { id: 'ma', initials: 'MA', name: 'Maël André', age: 10, grade: 'Grise 1 barrette', medical: 'DOSSIER COMPLET', medicalStatus: 'ok', present: true },
  { id: 'in', initials: 'IN', name: 'Inès Thomas', age: 8, grade: 'Blanche 2 barrettes', medical: 'CERTIFICAT OK', medicalStatus: 'ok', present: true },
  { id: 'hu', initials: 'HU', name: 'Hugo Petit', age: 9, grade: 'Grise', medical: 'DOSSIER COMPLET', medicalStatus: 'ok', present: true },
  { id: 'mr', initials: 'MR', name: 'Mathis Roux', age: 10, grade: 'Blanche', medical: 'CERTIFICAT EXPIRÉ', medicalStatus: 'expired', present: false, replaceable: true },
  { id: 'cd', initials: 'CD', name: 'Camille Dubois', age: 11, grade: 'Jaune 1 barrette', medical: 'SANS AVIS', medicalStatus: 'missing', present: false, replaceable: true },
  { id: 'sr', initials: 'SR', name: 'Sacha Richard', age: 7, grade: 'Blanche', medical: 'DOSSIER COMPLET', medicalStatus: 'ok', present: false },
]

const FULL_STUDENTS = [
  ...CLASSIC_STUDENTS.slice(0, 11),
  { ...CLASSIC_STUDENTS[11], id: 'mr-full', present: false, replaceable: true },
  { ...CLASSIC_STUDENTS[12], id: 'cd-full', present: false, replaceable: true },
  ...[
    ['lp', 'LP', 'Lina Petit'],
    ['mb', 'MB', 'Malo Bernard'],
    ['sc', 'SC', 'Sofia Caron'],
    ['lm2', 'LM', 'Léo Mercier'],
    ['ma2', 'MA', 'Maya Aubert'],
    ['eb', 'EB', 'Ethan Blanc'],
    ['am', 'AM', 'Aya Marchand'],
  ].map(([id, initials, name]) => ({
    id,
    initials,
    name,
    age: 8,
    grade: 'Blanche 1 barrette',
    medical: 'CERTIFICAT OK',
    medicalStatus: 'ok',
    present: true,
  })),
]

const WAITLIST = [
  { id: 'wait-1', initials: 'SY', name: 'Samir Yilmaz', age: 9, medical: 'CERTIFICAT OK' },
  { id: 'wait-2', initials: 'LE', name: 'Louna Evrard', age: 8, medical: 'DOSSIER COMPLET' },
  { id: 'wait-3', initials: 'TA', name: 'Tiago Alves', age: 10, medical: 'CERTIFICAT OK' },
]

const Text = ({ style, ...props }) => (
  <NativeText {...props} style={[{ fontFamily: 'Chivo-Regular' }, style]} />
)

function AttendanceListScreen({ onFinishCall, onOpenSessions }) {
  const [view, setView] = useState('active')
  const [students, setStudents] = useState(() => CLASSIC_STUDENTS.map((item) => ({ ...item })))
  const [fullStudents, setFullStudents] = useState(() => FULL_STUDENTS.map((item) => ({ ...item })))
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all')
  const [waitlistExpanded, setWaitlistExpanded] = useState(false)
  const [replacements, setReplacements] = useState({})

  const roster = view === 'full' ? fullStudents : students
  const expected = view === 'full' ? 20 : 14
  const presentCount = roster.filter((student) => student.present).length
  const absentCount = expected - presentCount
  const pendingCount = absentCount

  const visibleStudents = useMemo(() => {
    const source = view === 'full' ? fullStudents : students
    const normalizedSearch = search.trim().toLocaleLowerCase('fr')
    return source.filter((student) => {
      const matchesSearch = !normalizedSearch ||
        `${student.name} ${student.grade} ${student.medical}`.toLocaleLowerCase('fr').includes(normalizedSearch)
      const matchesFilter =
        filter === 'all' ||
        (filter === 'present' && student.present) ||
        (filter === 'absent' && !student.present)
      return matchesSearch && matchesFilter
    })
  }, [filter, fullStudents, search, students, view])

  function changeView(nextView) {
    setView(nextView)
    setSearch('')
    setFilter('all')
    setWaitlistExpanded(false)
    setReplacements({})
    setStudents(CLASSIC_STUDENTS.map((item) => ({ ...item })))
    setFullStudents(FULL_STUDENTS.map((item) => ({ ...item })))
  }

  function toggleAttendance(studentId, present) {
    const update = (current) =>
      current.map((student) =>
        student.id === studentId ? { ...student, present } : student,
      )
    if (view === 'full') {
      setFullStudents(update)
    } else {
      setStudents(update)
    }
  }

  function replaceStudent(student) {
    const candidate = WAITLIST.find(
      (item) => !Object.values(replacements).some((replacement) => replacement.id === item.id),
    )
    if (!candidate) {
      Alert.alert('Liste d’attente vide', 'Aucun autre élève n’est disponible pour remplacer cet enfant.')
      return
    }

    setReplacements((current) => ({ ...current, [student.id]: candidate }))
    const update = (current) =>
      current.map((item) =>
        item.id === student.id
          ? {
              ...item,
              replacedBy: candidate,
              present: true,
              medical: candidate.medical,
              medicalStatus: 'ok',
              replaceable: false,
            }
          : item,
      )
    if (view === 'full') {
      setFullStudents(update)
    } else {
      setStudents(update)
    }
    Alert.alert('Remplacement effectué', `${candidate.name} prend la place de ${student.name}.`)
  }

  function addStudent() {
    const candidate = WAITLIST.find(
      (item) => !Object.values(replacements).some((replacement) => replacement.id === item.id),
    )
    if (!candidate) {
      Alert.alert('Aucun élève disponible', 'La liste d’attente ne contient plus d’élève.')
      return
    }
    setStudents((current) => [
      ...current,
      {
        id: `live-${candidate.id}`,
        initials: candidate.initials,
        name: candidate.name,
        age: candidate.age,
        grade: 'Blanche',
        medical: candidate.medical,
        medicalStatus: 'ok',
        present: true,
      },
    ])
    setView('active')
    setFilter('all')
    Alert.alert('Élève ajouté', `${candidate.name} a été ajouté au registre en direct.`)
  }

  function finishCall() {
    Alert.alert(
      'Terminer l’appel ?',
      'L’émargement final verrouille la liste et transmet le registre au secrétariat CDL.',
      [
        { text: 'CONTINUER L’APPEL', style: 'cancel' },
        { text: 'TERMINER', onPress: () => onFinishCall?.() },
      ],
    )
  }

  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <View style={styles.brandGroup}>
          <Text style={styles.brand}>TATAMI</Text>
          <View style={styles.clubBadge}><Text style={styles.clubBadgeText}>CDL</Text></View>
        </View>
        <View style={styles.headerActions}>
          <Pressable
            accessibilityLabel="Notifications"
            accessibilityRole="button"
            onPress={() => Alert.alert('Notifications', 'Aucune nouvelle notification.')}
            style={styles.headerIcon}
          >
            <Bell color={COLORS.primary} size={18} />
            <View style={styles.notificationDot} />
          </Pressable>
          <View style={styles.avatar}>
            <UserRound color={COLORS.canvas} size={16} />
            <View style={styles.staffBadge}><Text style={styles.staffBadgeText}>STAFF</Text></View>
          </View>
        </View>
      </View>

      <View style={styles.demoPanel}>
        <Text style={styles.demoCaption}>VUE DE DÉMONSTRATION</Text>
        <ScrollView horizontal contentContainerStyle={styles.demoOptions} showsHorizontalScrollIndicator={false}>
          {DEMO_VIEWS.map((option) => {
            const active = view === option.id
            return (
              <Pressable
                accessibilityRole="button"
                accessibilityState={{ selected: active }}
                key={option.id}
                onPress={() => changeView(option.id)}
                style={[styles.demoButton, active && styles.demoButtonActive]}
              >
                <Text style={[styles.demoButtonText, active && styles.demoButtonTextActive]}>
                  {option.label}
                </Text>
              </Pressable>
            )
          })}
        </ScrollView>
      </View>

      {view === 'empty' ? (
        <EmptyAttendance onAddStudent={addStudent} onOpenSessions={onOpenSessions} />
      ) : (
        <>
          <ScrollView
            contentContainerStyle={styles.listContent}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.sessionContext}>
              <View style={styles.contextTop}>
                <View style={styles.liveBadge}>
                  <View style={styles.liveDot} />
                  <Text style={styles.liveBadgeText}>
                    {view === 'full' ? 'CAPACITÉ MAXIMALE ATTEINTE' : 'ÉMARGEMENT TATAMI EN DIRECT'}
                  </Text>
                </View>
                <Text style={styles.matLabel}>TAPIS 2 (RDC)</Text>
              </View>
              <Text style={styles.dojoLabel}>DOJO BASTILLE</Text>
            </View>

            <Text accessibilityRole="header" style={styles.pageTitle}>LISTE D’APPEL</Text>
            <Text style={styles.sessionDescription}>
              JJB KIDS (6-11 ANS) // MINI-LOUPS & FONDAMENTAUX
            </Text>
            <Text style={styles.sessionMeta}>
              Mercredi 24 Oct · 15h15 · Coachs : Mehdi B. & Sarah L.
            </Text>

            <AttendanceSummary
              view={view}
              expected={expected}
              presentCount={presentCount}
              absentCount={absentCount}
              pendingCount={pendingCount}
            />

            {view === 'full' && (
              <Pressable
                accessibilityRole="button"
                accessibilityState={{ expanded: waitlistExpanded }}
                onPress={() => setWaitlistExpanded((expanded) => !expanded)}
                style={({ pressed }) => [styles.waitlistToggle, pressed && styles.pressed]}
              >
                <Users color={COLORS.crimsonLight} size={15} />
                <Text style={styles.waitlistToggleText}>
                  LISTE D’ATTENTE (3 EN ATTENTE SUR PLACE...)
                </Text>
                <ChevronDown
                  color={COLORS.secondary}
                  size={16}
                  style={waitlistExpanded && styles.chevronRotated}
                />
              </Pressable>
            )}

            {waitlistExpanded && (
              <View style={styles.waitlistCard}>
                {WAITLIST.map((student, index) => {
                  const alreadyUsed = Object.values(replacements).some(
                    (replacement) => replacement.id === student.id,
                  )
                  return (
                    <View key={student.id} style={styles.waitlistRow}>
                      <Text style={styles.waitlistRank}>#{index + 1}</Text>
                      <View style={styles.waitlistIdentity}>
                        <Text style={styles.waitlistName}>{student.name.toUpperCase()}</Text>
                        <Text style={styles.waitlistMedical}>{student.age} ANS · {student.medical}</Text>
                      </View>
                      <Text style={[styles.waitlistState, alreadyUsed && styles.waitlistStateUsed]}>
                        {alreadyUsed ? 'AFFECTÉ' : 'EN ATTENTE'}
                      </Text>
                    </View>
                  )
                })}
              </View>
            )}

            <View style={styles.searchBox}>
              <Search color={COLORS.secondary} size={16} />
              <TextInput
                accessibilityLabel="Rechercher un élève"
                onChangeText={setSearch}
                placeholder="Rechercher un élève..."
                placeholderTextColor={COLORS.muted}
                style={styles.searchInput}
                value={search}
              />
              {search.length > 0 && (
                <Pressable accessibilityLabel="Effacer la recherche" onPress={() => setSearch('')}>
                  <View><X color={COLORS.secondary} size={16} /></View>
                </Pressable>
              )}
            </View>

            <View style={styles.filters}>
              {[
                { id: 'all', label: `TOUS (${expected})` },
                { id: 'present', label: `PRÉSENTS (${presentCount})` },
                { id: 'absent', label: `ABSENTS (${absentCount})` },
              ].map((item) => {
                const active = filter === item.id
                return (
                  <Pressable
                    accessibilityRole="tab"
                    accessibilityState={{ selected: active }}
                    key={item.id}
                    onPress={() => setFilter(item.id)}
                    style={[styles.filterButton, active && styles.filterButtonActive]}
                  >
                    <Text style={[styles.filterText, active && styles.filterTextActive]}>
                      {item.label}
                    </Text>
                  </Pressable>
                )
              })}
            </View>

            {view === 'full' && (
              <View style={styles.saturatedRow}>
                <Text style={styles.saturatedCount}>SÉANCE COMPLÈTE · 20 / 20 ENFANTS</Text>
                <View style={styles.saturatedBadge}>
                  <Text style={styles.saturatedBadgeText}>SÉANCE SATURÉE</Text>
                </View>
              </View>
            )}

            {visibleStudents.length ? (
              visibleStudents.map((student) => (
                <StudentCard
                  key={student.id}
                  student={student}
                  view={view}
                  onSetPresent={(present) => toggleAttendance(student.id, present)}
                  onReplace={() => replaceStudent(student)}
                />
              ))
            ) : (
              <View style={styles.noResults}>
                <Users color={COLORS.muted} size={21} />
                <Text style={styles.noResultsText}>Aucun élève ne correspond à la recherche.</Text>
              </View>
            )}
          </ScrollView>
          <View style={styles.callFooter}>
            <View style={styles.footerCounter}>
              <Text style={styles.footerCountText}>
                {presentCount} PRÉSENTS • {absentCount} ABSENTS
              </Text>
              <Text style={styles.footerActiveText}>SÉANCE ACTIVE</Text>
            </View>
            <Pressable
              accessibilityRole="button"
              onPress={finishCall}
              style={({ pressed }) => [styles.finishButton, pressed && styles.pressed]}
            >
              <ClipboardCheck color={COLORS.primary} size={18} />
              <Text style={styles.finishButtonText}>TERMINER L’APPEL</Text>
              <ArrowRight color={COLORS.primary} size={18} />
            </Pressable>
            <Text style={styles.footerLegal}>
              L’émargement final verrouille la liste et transmet le registre au secrétariat CDL.
            </Text>
          </View>
        </>
      )}
    </View>
  )
}

function AttendanceSummary({ view, expected, presentCount, absentCount, pendingCount }) {
  return (
    <View style={styles.summaryCard}>
      {view === 'full' ? (
        <>
          <View style={styles.summaryFullRow}>
            <Text style={styles.summaryTitle}>SÉANCE COMPLÈTE • {expected} / {expected} ENFANTS</Text>
            <View style={styles.saturatedBadge}>
              <Text style={styles.saturatedBadgeText}>SÉANCE SATURÉE</Text>
            </View>
          </View>
          <View style={styles.fullCounters}>
            <Counter label="PRÉSENTS" value={presentCount} />
            <Counter label="ABSENTS" value={absentCount} />
            <Counter label="ATTENTE DOJO" value={3} accent />
          </View>
          <ProgressBar progress={100} />
        </>
      ) : (
        <>
          <View style={styles.summaryHeadline}>
            <Text style={styles.summaryNumber}>{presentCount} / {expected}</Text>
            <Text style={styles.summaryTitle}>ATHLÈTES ATTENDUS</Text>
          </View>
          <Text style={styles.pendingText}>{pendingCount > 0 ? `${pendingCount} EN ATTENTE` : 'TOUS LES ÉLÈVES POINTÉS'}</Text>
          <ProgressBar progress={Math.round((presentCount / expected) * 100)} />
        </>
      )}
    </View>
  )
}

function Counter({ label, value, accent = false }) {
  return (
    <View style={styles.counter}>
      <Text style={styles.counterLabel}>{label}</Text>
      <Text style={[styles.counterValue, accent && styles.counterValueAccent]}>{value}</Text>
    </View>
  )
}

function ProgressBar({ progress }) {
  return (
    <View style={styles.progressTrack}>
      <View style={[styles.progressFill, { width: `${Math.min(100, Math.max(0, progress))}%` }]} />
    </View>
  )
}

function StudentCard({ student, view, onSetPresent, onReplace }) {
  const isFull = view === 'full'
  const canReplace = isFull && student.replaceable && !student.replacedBy
  const medicalTone = student.medicalStatus === 'ok'
    ? styles.medicalOk
    : student.medicalStatus === 'expired'
      ? styles.medicalExpired
      : styles.medicalMissing

  return (
    <View style={styles.studentCard}>
      <View style={styles.studentMainRow}>
        <View style={styles.studentAvatar}>
          <Text style={styles.studentInitials}>{student.initials}</Text>
        </View>
        <View style={styles.studentInfo}>
          <View style={styles.studentNameRow}>
            <Text style={styles.studentName}>{student.name.toUpperCase()}</Text>
            <Text style={styles.studentAge}>{student.age} ANS</Text>
          </View>
          <Text style={styles.studentGrade}>⚪ {student.grade}</Text>
          <View style={styles.medicalLine}>
            <View style={[styles.medicalDot, student.medicalStatus === 'ok' ? styles.medicalDotOk : styles.medicalDotError]} />
            <Text style={[styles.medicalText, medicalTone]}>{student.medical}</Text>
          </View>
          {student.replacedBy && (
            <Text style={styles.replacementConfirmation}>
              REMPLACÉ PAR {student.replacedBy.name.toUpperCase()}
            </Text>
          )}
        </View>
      </View>

      <View style={styles.attendanceActions}>
        <Pressable
          accessibilityRole="button"
          accessibilityState={{ selected: student.present }}
          onPress={() => onSetPresent(true)}
          style={({ pressed }) => [
            styles.presentButton,
            student.present && styles.presentButtonActive,
            pressed && styles.pressed,
          ]}
        >
          <Check color={student.present ? COLORS.primary : COLORS.secondary} size={13} />
          <Text style={[styles.presenceButtonText, student.present && styles.presenceButtonTextActive]}>
            {student.present ? 'PRÉSENT' : 'PRÉSENT'}
          </Text>
        </Pressable>
        <Pressable
          accessibilityRole="button"
          accessibilityState={{ selected: !student.present }}
          onPress={() => onSetPresent(false)}
          style={({ pressed }) => [
            styles.absentButton,
            !student.present && styles.absentButtonActive,
            pressed && styles.pressed,
          ]}
        >
          <X color={!student.present ? COLORS.crimsonLight : COLORS.secondary} size={13} />
          <Text style={[styles.presenceButtonText, !student.present && styles.absentTextActive]}>
            ABSENT
          </Text>
        </Pressable>
      </View>

      {canReplace && (
        <Pressable
          accessibilityRole="button"
          onPress={onReplace}
          style={({ pressed }) => [styles.replaceLink, pressed && styles.pressed]}
        >
          <Shuffle color={COLORS.crimsonLight} size={14} />
          <Text style={styles.replaceText}>REMPLACER PAR UN ÉLÈVE DE LA LISTE D’ATTENTE</Text>
        </Pressable>
      )}
    </View>
  )
}

function EmptyAttendance({ onAddStudent, onOpenSessions }) {
  return (
    <ScrollView contentContainerStyle={styles.emptyContent} showsVerticalScrollIndicator={false}>
      <View style={styles.emptyContext}>
        <Text style={styles.registerLabel}>REGISTRE OFFICIEL STAFF • TAPIS 2</Text>
        <View style={styles.liveBadge}>
          <View style={styles.liveDot} />
          <Text style={styles.liveBadgeText}>EN DIRECT</Text>
        </View>
      </View>

      <View style={styles.emptyStats}>
        <Text style={styles.zeroExpected}>🛑 0 ENFANT ATTENDU</Text>
        <Text style={styles.emptyStatus}>SÉANCE VIDE</Text>
      </View>

      <View style={styles.emptyCard}>
        <View style={styles.dojoDiagram}>
          <View style={styles.matOuter}>
            <View style={styles.matInner}>
              <View style={styles.matCenterLine} />
              <View style={styles.matCenterCircle} />
              <View style={styles.emptyMatLabel}><Text style={styles.matLabelText}>TATAMI 2</Text></View>
            </View>
          </View>
          <View style={styles.emptyDiagramDot} />
          <View style={styles.emptyDiagramDotTwo} />
        </View>
        <Text style={styles.emptyTitle}>AUCUN ÉLÈVE INSCRIT</Text>
        <Text style={styles.emptyDescription}>
          Ce créneau n’enregistre aucune réservation d’élève pour aujourd’hui. Le tatami reste
          disponible pour les sparrings libres ou la préparation technique du staff.
        </Text>
        <Text style={styles.emptySessionMeta}>
          MERCREDI 24 OCTOBRE • 16H45 — 18H00 • PROF. MEHDI BENALI
        </Text>
        <Pressable
          accessibilityRole="button"
          onPress={onAddStudent}
          style={({ pressed }) => [styles.addStudentButton, pressed && styles.pressed]}
        >
          <Plus color={COLORS.primary} size={19} />
          <Text style={styles.addStudentText}>AJOUTER UN ÉLÈVE EN DIRECT</Text>
        </Pressable>
        <View style={styles.emptyActionRow}>
          <Pressable
            accessibilityRole="button"
            onPress={() => Alert.alert('Tatami libre', 'Le créneau est marqué comme libre en mode démo.')}
            style={({ pressed }) => [styles.emptySecondaryButton, pressed && styles.pressed]}
          >
            <Text style={styles.emptySecondaryText}>🎛️ TATAMI LIBRE</Text>
          </Pressable>
          <Pressable
            accessibilityRole="button"
            onPress={onOpenSessions}
            style={({ pressed }) => [styles.emptySecondaryButton, pressed && styles.pressed]}
          >
            <Text style={styles.emptySecondaryText}>← TOUTES SÉANCES</Text>
          </Pressable>
        </View>
      </View>

      <View style={styles.protocolCard}>
        <Crosshair color={COLORS.crimson} size={17} />
        <Text style={styles.protocolText}>
          PROTOCOLE CLUB CDL : Tout élève montant sur le tapis doit obligatoirement être
          enregistré au registre numérique pour des raisons d’assurance club et de
          responsabilité civile.
        </Text>
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  screen: { backgroundColor: COLORS.canvas, flex: 1 },
  header: {
    alignItems: 'center',
    borderBottomColor: COLORS.border,
    borderBottomWidth: 1,
    flexDirection: 'row',
    height: 52,
    justifyContent: 'space-between',
    paddingHorizontal: 18,
  },
  brandGroup: { alignItems: 'center', flexDirection: 'row', gap: 7 },
  brand: { color: COLORS.primary, fontFamily: 'Anybody-BlackItalic', fontSize: 22, letterSpacing: 1.4 },
  clubBadge: { alignItems: 'center', backgroundColor: COLORS.crimson, height: 21, justifyContent: 'center', width: 27 },
  clubBadgeText: { color: COLORS.primary, fontFamily: 'Anybody-Bold', fontSize: 8 },
  headerActions: { alignItems: 'center', flexDirection: 'row', gap: 12 },
  headerIcon: { alignItems: 'center', height: 34, justifyContent: 'center', width: 34 },
  notificationDot: { backgroundColor: COLORS.crimson, borderColor: COLORS.canvas, borderRadius: 4, borderWidth: 1, height: 7, position: 'absolute', right: 6, top: 5, width: 7 },
  avatar: { alignItems: 'center', backgroundColor: COLORS.crimsonLight, borderRadius: 18, height: 33, justifyContent: 'center', width: 33 },
  staffBadge: { backgroundColor: COLORS.crimson, borderColor: COLORS.canvas, borderRadius: 3, borderWidth: 1, bottom: -3, paddingHorizontal: 3, position: 'absolute', right: -5 },
  staffBadgeText: { color: COLORS.primary, fontFamily: 'Anybody-Bold', fontSize: 5 },
  demoPanel: { paddingHorizontal: 15, paddingTop: 7, paddingBottom: 5 },
  demoCaption: { color: COLORS.muted, fontFamily: 'Anybody-Bold', fontSize: 6, letterSpacing: 0.6, marginBottom: 5 },
  demoOptions: { gap: 5 },
  demoButton: { alignItems: 'center', backgroundColor: COLORS.surface, borderColor: COLORS.border, borderRadius: 4, borderWidth: 1, justifyContent: 'center', minHeight: 25, paddingHorizontal: 8 },
  demoButtonActive: { backgroundColor: COLORS.crimson, borderColor: COLORS.crimson },
  demoButtonText: { color: COLORS.secondary, fontFamily: 'Anybody-Bold', fontSize: 6 },
  demoButtonTextActive: { color: COLORS.primary },
  listContent: { paddingHorizontal: 15, paddingTop: 8, paddingBottom: 12 },
  sessionContext: { backgroundColor: COLORS.surface, borderColor: COLORS.border, borderRadius: 4, borderWidth: 1, marginBottom: 12, padding: 9 },
  contextTop: { alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between' },
  liveBadge: { alignItems: 'center', backgroundColor: '#351718', borderRadius: 4, flexDirection: 'row', gap: 5, paddingHorizontal: 7, paddingVertical: 5 },
  liveDot: { backgroundColor: COLORS.crimson, height: 6, width: 6 },
  liveBadgeText: { color: COLORS.crimsonLight, fontFamily: 'Anybody-Bold', fontSize: 7, letterSpacing: 0.2 },
  matLabel: { color: COLORS.primary, fontFamily: 'Anybody-Bold', fontSize: 7 },
  dojoLabel: { color: COLORS.secondary, fontSize: 8, letterSpacing: 0.5, marginTop: 5 },
  pageTitle: { color: COLORS.primary, fontFamily: 'Anybody-BlackItalic', fontSize: 30, letterSpacing: -0.5 },
  sessionDescription: { color: COLORS.primary, fontFamily: 'Anybody-Bold', fontSize: 8, letterSpacing: 0.1, lineHeight: 13, marginTop: 3 },
  sessionMeta: { color: COLORS.secondary, fontSize: 9, lineHeight: 14, marginTop: 3 },
  summaryCard: { backgroundColor: COLORS.input, borderColor: COLORS.border, borderRadius: 4, borderWidth: 1, marginTop: 11, padding: 11 },
  summaryHeadline: { alignItems: 'baseline', flexDirection: 'row', gap: 7 },
  summaryNumber: { color: COLORS.primary, fontFamily: 'Anybody-BlackItalic', fontSize: 25 },
  summaryTitle: { color: COLORS.primary, fontFamily: 'Anybody-Bold', fontSize: 8, letterSpacing: 0.2 },
  pendingText: { color: COLORS.secondary, fontFamily: 'Anybody-Bold', fontSize: 7, letterSpacing: 0.45, marginTop: 2 },
  progressTrack: { backgroundColor: COLORS.border, height: 5, marginTop: 9, overflow: 'hidden' },
  progressFill: { backgroundColor: COLORS.crimson, height: '100%' },
  summaryFullRow: { alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between' },
  saturatedBadge: { backgroundColor: COLORS.crimson, borderRadius: 4, paddingHorizontal: 6, paddingVertical: 4 },
  saturatedBadgeText: { color: COLORS.primary, fontFamily: 'Anybody-Bold', fontSize: 6, letterSpacing: 0.2 },
  fullCounters: { flexDirection: 'row', marginTop: 10 },
  counter: { alignItems: 'center', borderRightColor: COLORS.border, borderRightWidth: 1, flex: 1 },
  counterLabel: { color: COLORS.secondary, fontFamily: 'Anybody-Bold', fontSize: 6, letterSpacing: 0.35 },
  counterValue: { color: COLORS.primary, fontFamily: 'Anybody-BlackItalic', fontSize: 20, marginTop: 3 },
  counterValueAccent: { color: COLORS.crimsonLight },
  waitlistToggle: { alignItems: 'center', backgroundColor: COLORS.surface, borderColor: COLORS.border, borderRadius: 4, borderWidth: 1, flexDirection: 'row', gap: 7, marginTop: 8, minHeight: 42, paddingHorizontal: 10 },
  waitlistToggleText: { color: COLORS.primary, flex: 1, fontFamily: 'Anybody-Bold', fontSize: 7, letterSpacing: 0.2 },
  chevronRotated: { transform: [{ rotate: '180deg' }] },
  waitlistCard: { backgroundColor: COLORS.input, borderColor: COLORS.border, borderRadius: 4, borderWidth: 1, marginTop: 5, paddingHorizontal: 9 },
  waitlistRow: { alignItems: 'center', borderBottomColor: COLORS.border, borderBottomWidth: 1, flexDirection: 'row', gap: 8, minHeight: 45 },
  waitlistRank: { color: COLORS.crimsonLight, fontFamily: 'Anybody-Bold', fontSize: 8, width: 23 },
  waitlistIdentity: { flex: 1 },
  waitlistName: { color: COLORS.primary, fontFamily: 'Anybody-Bold', fontSize: 8 },
  waitlistMedical: { color: COLORS.secondary, fontSize: 7, marginTop: 3 },
  waitlistState: { color: COLORS.secondary, fontFamily: 'Anybody-Bold', fontSize: 6 },
  waitlistStateUsed: { color: COLORS.success },
  searchBox: { alignItems: 'center', backgroundColor: COLORS.input, borderColor: COLORS.border, borderRadius: 4, borderWidth: 1, flexDirection: 'row', gap: 8, marginTop: 10, minHeight: 42, paddingHorizontal: 10 },
  searchInput: { color: COLORS.primary, flex: 1, fontFamily: 'Chivo-Regular', fontSize: 11, minHeight: 40, paddingVertical: 0 },
  filters: { flexDirection: 'row', gap: 5, marginTop: 7, marginBottom: 8 },
  filterButton: { alignItems: 'center', backgroundColor: COLORS.surface, borderColor: COLORS.border, borderRadius: 4, borderWidth: 1, flex: 1, justifyContent: 'center', minHeight: 34, paddingHorizontal: 3 },
  filterButtonActive: { backgroundColor: COLORS.crimson, borderColor: COLORS.crimson },
  filterText: { color: COLORS.secondary, fontFamily: 'Anybody-Bold', fontSize: 6, letterSpacing: 0.1 },
  filterTextActive: { color: COLORS.primary },
  saturatedRow: { alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between', marginBottom: 7 },
  saturatedCount: { color: COLORS.crimsonLight, fontFamily: 'Anybody-Bold', fontSize: 8 },
  studentCard: { backgroundColor: COLORS.surface, borderColor: COLORS.border, borderRadius: 4, borderWidth: 1, marginBottom: 7, padding: 9 },
  studentMainRow: { alignItems: 'center', flexDirection: 'row', gap: 9 },
  studentAvatar: { alignItems: 'center', backgroundColor: COLORS.input, borderColor: COLORS.border, borderRadius: 20, borderWidth: 1, height: 38, justifyContent: 'center', width: 38 },
  studentInitials: { color: COLORS.primary, fontFamily: 'Anybody-Bold', fontSize: 9 },
  studentInfo: { flex: 1 },
  studentNameRow: { alignItems: 'center', flexDirection: 'row', gap: 6 },
  studentName: { color: COLORS.primary, flex: 1, fontFamily: 'Anybody-Bold', fontSize: 9 },
  studentAge: { color: COLORS.secondary, fontSize: 8 },
  studentGrade: { color: COLORS.secondary, fontSize: 8, marginTop: 3 },
  medicalLine: { alignItems: 'center', flexDirection: 'row', gap: 5, marginTop: 4 },
  medicalDot: { borderRadius: 4, height: 6, width: 6 },
  medicalDotOk: { backgroundColor: COLORS.success },
  medicalDotError: { backgroundColor: COLORS.crimson },
  medicalText: { fontSize: 7 },
  medicalOk: { color: COLORS.success },
  medicalExpired: { color: COLORS.crimsonLight },
  medicalMissing: { color: COLORS.crimsonLight },
  replacementConfirmation: { color: COLORS.success, fontFamily: 'Anybody-Bold', fontSize: 6, marginTop: 4 },
  attendanceActions: { flexDirection: 'row', gap: 6, marginTop: 8 },
  presentButton: { alignItems: 'center', backgroundColor: COLORS.input, borderColor: COLORS.border, borderRadius: 4, borderWidth: 1, flex: 1, flexDirection: 'row', gap: 4, height: 34, justifyContent: 'center' },
  presentButtonActive: { backgroundColor: COLORS.crimson, borderColor: COLORS.crimson },
  absentButton: { alignItems: 'center', backgroundColor: COLORS.surface, borderColor: COLORS.border, borderRadius: 4, borderWidth: 1, flex: 1, flexDirection: 'row', gap: 4, height: 34, justifyContent: 'center' },
  absentButtonActive: { backgroundColor: '#321719', borderColor: '#5B2527' },
  presenceButtonText: { color: COLORS.secondary, fontFamily: 'Anybody-Bold', fontSize: 7 },
  presenceButtonTextActive: { color: COLORS.primary },
  absentTextActive: { color: COLORS.crimsonLight },
  replaceLink: { alignItems: 'center', backgroundColor: '#271719', borderColor: '#5B2527', borderRadius: 4, borderWidth: 1, flexDirection: 'row', gap: 6, marginTop: 8, minHeight: 33, paddingHorizontal: 8 },
  replaceText: { color: COLORS.crimsonLight, flex: 1, fontFamily: 'Anybody-Bold', fontSize: 6, letterSpacing: 0.1 },
  noResults: { alignItems: 'center', backgroundColor: COLORS.surface, borderColor: COLORS.border, borderRadius: 4, borderWidth: 1, padding: 20 },
  noResultsText: { color: COLORS.secondary, fontSize: 10, marginTop: 8 },
  callFooter: { backgroundColor: COLORS.canvas, borderTopColor: COLORS.border, borderTopWidth: 1, paddingHorizontal: 15, paddingTop: 7, paddingBottom: 8 },
  footerCounter: { alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5 },
  footerCountText: { color: COLORS.primary, fontFamily: 'Anybody-Bold', fontSize: 7 },
  footerActiveText: { color: COLORS.crimsonLight, fontFamily: 'Anybody-Bold', fontSize: 7 },
  finishButton: { alignItems: 'center', backgroundColor: COLORS.crimson, borderRadius: 4, flexDirection: 'row', gap: 8, height: 48, justifyContent: 'center', paddingHorizontal: 11 },
  finishButtonText: { color: COLORS.primary, flex: 1, fontFamily: 'Anybody-Bold', fontSize: 9, letterSpacing: 0.4, textAlign: 'center' },
  footerLegal: { color: COLORS.secondary, fontSize: 7, lineHeight: 11, marginTop: 5, textAlign: 'center' },
  emptyContent: { paddingHorizontal: 15, paddingTop: 10, paddingBottom: 18 },
  emptyContext: { alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between' },
  registerLabel: { color: COLORS.secondary, fontFamily: 'Anybody-Bold', fontSize: 7, letterSpacing: 0.25 },
  emptyStats: { alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between', marginTop: 13, marginBottom: 10 },
  zeroExpected: { color: COLORS.primary, fontFamily: 'Anybody-Bold', fontSize: 10 },
  emptyStatus: { color: COLORS.crimson, fontFamily: 'Anybody-Bold', fontSize: 9 },
  emptyCard: { alignItems: 'center', backgroundColor: COLORS.surface, borderColor: COLORS.border, borderRadius: 4, borderWidth: 1, padding: 14 },
  dojoDiagram: { alignItems: 'center', backgroundColor: COLORS.input, borderColor: COLORS.crimson, borderRadius: 4, borderStyle: 'dashed', borderWidth: 1, height: 145, justifyContent: 'center', marginBottom: 14, overflow: 'hidden', width: '100%' },
  matOuter: { borderColor: '#6A292B', borderWidth: 1, height: 100, justifyContent: 'center', padding: 9, width: '78%' },
  matInner: { alignItems: 'center', borderColor: '#6A292B', borderWidth: 1, flex: 1, justifyContent: 'center', overflow: 'hidden' },
  matCenterLine: { backgroundColor: '#6A292B', height: 1, position: 'absolute', width: '100%' },
  matCenterCircle: { borderColor: '#6A292B', borderRadius: 22, borderWidth: 1, height: 44, width: 44 },
  emptyMatLabel: { backgroundColor: COLORS.input, bottom: 4, paddingHorizontal: 5, position: 'absolute' },
  matLabelText: { color: COLORS.muted, fontFamily: 'Anybody-Bold', fontSize: 6 },
  emptyDiagramDot: { backgroundColor: COLORS.crimson, height: 4, left: 10, position: 'absolute', top: 10, width: 4 },
  emptyDiagramDotTwo: { backgroundColor: COLORS.crimson, bottom: 10, height: 4, position: 'absolute', right: 10, width: 4 },
  emptyTitle: { color: COLORS.primary, fontFamily: 'Anybody-BlackItalic', fontSize: 20, textAlign: 'center' },
  emptyDescription: { color: COLORS.secondary, fontSize: 10, lineHeight: 16, marginTop: 8, textAlign: 'center' },
  emptySessionMeta: { color: COLORS.crimsonLight, fontFamily: 'Anybody-Bold', fontSize: 7, lineHeight: 12, marginTop: 10, textAlign: 'center' },
  addStudentButton: { alignItems: 'center', backgroundColor: COLORS.crimson, borderRadius: 4, flexDirection: 'row', gap: 8, height: 54, justifyContent: 'center', marginTop: 14, paddingHorizontal: 9, width: '100%' },
  addStudentText: { color: COLORS.primary, fontFamily: 'Anybody-Bold', fontSize: 8, letterSpacing: 0.3 },
  emptyActionRow: { flexDirection: 'row', gap: 7, marginTop: 8, width: '100%' },
  emptySecondaryButton: { alignItems: 'center', backgroundColor: COLORS.input, borderColor: COLORS.border, borderRadius: 4, borderWidth: 1, flex: 1, justifyContent: 'center', minHeight: 42, paddingHorizontal: 5 },
  emptySecondaryText: { color: COLORS.secondary, fontFamily: 'Anybody-Bold', fontSize: 7, textAlign: 'center' },
  protocolCard: { alignItems: 'flex-start', backgroundColor: COLORS.surface, borderColor: COLORS.border, borderRadius: 4, borderWidth: 1, flexDirection: 'row', gap: 9, marginTop: 10, padding: 10 },
  protocolText: { color: COLORS.secondary, flex: 1, fontSize: 8, lineHeight: 13 },
  pressed: { opacity: 0.78 },
})

export default AttendanceListScreen
