import { useState } from 'react'
import {
  Activity,
  Award,
  BookOpen,
  CalendarDays,
  ClipboardList,
  UserRound,
  Users,
} from 'lucide-react-native'
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text as NativeText,
  View,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import ProfileScreen from './ProfileScreen.js'
import ChildProfileScreen, { EMPTY_CHILD } from './ChildProfileScreen.js'
import ChildrenListScreen from './ChildrenListScreen.js'
import PlanningScreen from './PlanningScreen.js'
import SessionDetailScreen from './SessionDetailScreen.js'
import ParticipantSelectionScreen from './ParticipantSelectionScreen.js'
import MyReservationsScreen from './MyReservationsScreen.js'
import StaffScheduleScreen from './StaffScheduleScreen.js'
import AttendanceListScreen from './AttendanceListScreen.js'
import TechniquesLibraryScreen from './TechniquesLibraryScreen.js'

const COLORS = {
  canvas: '#0B0B0B',
  surface: '#1A1A1C',
  border: '#28282C',
  primary: '#FFFFFF',
  secondary: '#9A9A9A',
  muted: '#555558',
  active: '#E5322D',
}

const ROLES = [
  { id: 'adult', label: 'ADULTE' },
  { id: 'parent', label: 'PARENT' },
  { id: 'staff', label: 'STAFF' },
]

const TABS_BY_ROLE = {
  adult: [
    { id: 'schedule', label: 'PLANNING', title: 'Planning', icon: CalendarDays },
    { id: 'bookings', label: 'RÉSERVATIONS', title: 'Mes réservations', icon: BookOpen },
    { id: 'techniques', label: 'TECHNIQUES', title: 'Techniques', icon: Activity },
    { id: 'profile', label: 'PROFIL', title: 'Profil', icon: UserRound },
  ],
  parent: [
    { id: 'schedule', label: 'PLANNING', title: 'Planning', icon: CalendarDays },
    { id: 'bookings', label: 'RÉSERVATIONS', title: 'Mes réservations', icon: BookOpen },
    { id: 'techniques', label: 'TECHNIQUES', title: 'Techniques', icon: Activity },
    { id: 'children', label: 'ENFANTS', title: 'Mes enfants', icon: Users },
    { id: 'profile', label: 'PROFIL', title: 'Profil', icon: UserRound },
  ],
  staff: [
    { id: 'sessions', label: 'MES SÉANCES', title: 'Mes séances', icon: Award },
    { id: 'attendance', label: 'APPEL', title: 'Liste d’appel', icon: ClipboardList },
    { id: 'techniques', label: 'TECHNIQUES', title: 'Techniques', icon: Activity },
    { id: 'profile', label: 'PROFIL', title: 'Profil', icon: UserRound },
  ],
}

const Text = ({ style, ...props }) => (
  <NativeText {...props} style={[{ fontFamily: 'Chivo-Regular' }, style]} />
)

function MainTabNavigation({ initialRole = 'adult', onRoleChange, onLogout }) {
  const [role, setRole] = useState(
    Object.hasOwn(TABS_BY_ROLE, initialRole) ? initialRole : 'adult',
  )
  const [activeTab, setActiveTab] = useState(TABS_BY_ROLE[role][0].id)
  const [children, setChildren] = useState([
    {
      id: 'child-lea',
      firstName: 'Léa',
      lastName: 'Martin',
      sex: 'F',
      birthDate: '12/03/2016',
      nationality: 'Française',
      birthPlace: 'Paris, France',
      certificateValid: true,
      grade: 'JAUNE // 1 BARRETTE',
      gradeColor: '#E4C52A',
      monthlyAttendance: { count: 6, goal: 8 },
      attendanceHistory: [
        {
          label: 'OCTOBRE 2026',
          count: 6,
          sessions: [
            {
              date: '29 OCT.',
              title: 'JJB KIDS / TECHNIQUE',
              coach: 'COACH : SARAH M.',
              status: 'present',
            },
            {
              date: '26 OCT.',
              title: 'JJB KIDS / SPARRING',
              coach: 'COACH : THOMAS R.',
              status: 'present',
            },
            {
              date: '22 OCT.',
              title: 'JJB KIDS / TECHNIQUE',
              coach: 'COACH : SARAH M.',
              status: 'missed',
            },
          ],
        },
        {
          label: 'SEPTEMBRE 2026',
          count: 8,
          sessions: [
            {
              date: '24 SEPT.',
              title: 'JJB KIDS / TECHNIQUE',
              coach: 'COACH : SARAH M.',
              status: 'present',
            },
          ],
        },
      ],
      media: [
        { title: 'JJB KIDS — TECHNIQUE', subtitle: 'MERCREDI 29 OCTOBRE', variant: 'red' },
        { title: 'JEUX & SPARRING', subtitle: 'LUNDI 26 OCTOBRE', variant: 'blue' },
      ],
    },
    {
      id: 'child-noah',
      firstName: 'Noah',
      lastName: 'Martin',
      sex: 'H',
      birthDate: '08/09/2020',
      nationality: 'Française',
      birthPlace: 'Paris, France',
      certificateValid: false,
      grade: 'GRISE // 1 BARRETTE',
      gradeColor: '#B8B8BC',
      monthlyAttendance: { count: 4, goal: 8 },
      attendanceHistory: [
        {
          label: 'OCTOBRE 2026',
          count: 4,
          sessions: [
            {
              date: '27 OCT.',
              title: 'BABY JJB / ÉVEIL',
              coach: 'COACH : THOMAS R.',
              status: 'present',
            },
            {
              date: '20 OCT.',
              title: 'BABY JJB / MOTRICITÉ',
              coach: 'COACH : SARAH M.',
              status: 'present',
            },
          ],
        },
        {
          label: 'SEPTEMBRE 2026',
          count: 5,
          sessions: [
            {
              date: '22 SEPT.',
              title: 'BABY JJB / ÉVEIL',
              coach: 'COACH : THOMAS R.',
              status: 'present',
            },
          ],
        },
      ],
      media: [
        { title: 'BABY JJB — ÉVEIL', subtitle: 'MARDI 27 OCTOBRE', variant: 'blue' },
      ],
    },
  ])
  const [selectedChild, setSelectedChild] = useState(null)
  const [selectedSession, setSelectedSession] = useState(null)
  const [choosingParticipant, setChoosingParticipant] = useState(false)
  const tabs = TABS_BY_ROLE[role]
  const activeTabInfo = tabs.find((tab) => tab.id === activeTab) ?? tabs[0]
  const ActiveIcon = activeTabInfo.icon

  function selectRole(nextRole) {
    setRole(nextRole)
    setActiveTab(TABS_BY_ROLE[nextRole][0].id)
    setSelectedChild(null)
    setSelectedSession(null)
    setChoosingParticipant(false)
    onRoleChange?.(nextRole)
  }

  function saveChild(updatedChild) {
    if (String(updatedChild.id).startsWith('new-')) {
      setChildren((current) => [
        ...current,
        { ...updatedChild, id: `child-${Date.now()}` },
      ])
    } else {
      setChildren((current) =>
        current.map((child) =>
          child.id === updatedChild.id ? updatedChild : child,
        ),
      )
    }
    setSelectedChild(null)
  }

  return (
    <SafeAreaView edges={['top', 'bottom']} style={styles.safeArea}>
      <View style={styles.screen}>
        {activeTab === 'profile' ? (
          <ProfileScreen
            embedded
            role={role}
            onLogout={onLogout}
            onBack={() => setActiveTab(tabs[0].id)}
          />
        ) : activeTab === 'bookings' ? (
          <MyReservationsScreen
            role={role}
            onOpenPlanning={() => {
              setSelectedSession(null)
              setActiveTab('schedule')
            }}
          />
        ) : activeTab === 'attendance' && role === 'staff' ? (
          <AttendanceListScreen
            onFinishCall={() => setActiveTab('sessions')}
            onOpenSessions={() => setActiveTab('sessions')}
          />
        ) : activeTab === 'techniques' ? (
          <TechniquesLibraryScreen />
        ) : activeTab === 'sessions' && role === 'staff' ? (
          <StaffScheduleScreen
            onOpenAttendance={() => setActiveTab('attendance')}
            onOpenPlanning={() => setActiveTab('schedule')}
          />
        ) : activeTab === 'children' ? (
          selectedChild ? (
            <ChildProfileScreen
              child={selectedChild}
              onBack={() => setSelectedChild(null)}
              onSave={saveChild}
            />
          ) : (
            <ChildrenListScreen
              childProfiles={children}
              onSelectChild={setSelectedChild}
              onAddChild={() =>
                setSelectedChild({
                  ...EMPTY_CHILD,
                  id: `new-${Date.now()}`,
                })
              }
            />
          )
        ) : activeTab === 'schedule' || activeTab === 'sessions' ? (
          selectedSession && choosingParticipant ? (
            <ParticipantSelectionScreen
              session={selectedSession}
              onBack={() => setChoosingParticipant(false)}
              onConfirm={() => {
                setChoosingParticipant(false)
                setSelectedSession(null)
              }}
            />
          ) : selectedSession ? (
            <SessionDetailScreen
              role={role}
              session={selectedSession}
              onBack={() => setSelectedSession(null)}
              onChooseParticipants={() => setChoosingParticipant(true)}
            />
          ) : (
            <PlanningScreen
              role={role}
              onRoleChange={selectRole}
              onOpenSession={setSelectedSession}
            />
          )
        ) : (
          <>
            <View style={styles.header}>
              <View style={styles.brandRow}>
                <Text accessibilityRole="header" style={styles.brand}>
                  TATAMI
                </Text>
                <View style={styles.liveIndicator}>
                  <View style={styles.liveDot} />
                  <Text style={styles.liveLabel}>LIVE</Text>
                </View>
              </View>

              <View style={styles.roleSelector}>
                <Text style={styles.roleCaption}>RÔLE DÉMO</Text>
                <View style={styles.roleOptions}>
                  {ROLES.map((option) => {
                    const isSelected = role === option.id
                    return (
                      <Pressable
                        accessibilityRole="button"
                        accessibilityState={{ selected: isSelected }}
                        key={option.id}
                        onPress={() => selectRole(option.id)}
                        style={[
                          styles.roleButton,
                          isSelected && styles.roleButtonSelected,
                        ]}
                      >
                        <Text
                          style={[
                            styles.roleButtonText,
                            isSelected && styles.roleButtonTextSelected,
                          ]}
                        >
                          {option.label}
                        </Text>
                      </Pressable>
                    )
                  })}
                </View>
              </View>
            </View>

            <ScrollView
              contentContainerStyle={styles.mainContent}
              showsVerticalScrollIndicator={false}
            >
              <Text style={styles.sectionEyebrow}>ESPACE MEMBRE / {role.toUpperCase()}</Text>
              <Text style={styles.pageTitle}>{activeTabInfo.title.toUpperCase()}</Text>
              <View style={styles.headingRule} />

              <View style={styles.placeholderCard}>
                <View style={styles.placeholderIcon}>
                  <ActiveIcon color={COLORS.active} size={24} strokeWidth={1.8} />
                </View>
                <Text style={styles.placeholderEyebrow}>ÉCRAN EN DÉVELOPPEMENT</Text>
                <Text accessibilityRole="header" style={styles.placeholderTitle}>
                  {activeTabInfo.title}
                </Text>
                <Text style={styles.placeholderBody}>
                  Écran simulé : {activeTabInfo.title}
                </Text>
                <View style={styles.cardRule} />
                <Text style={styles.placeholderMeta}>
                  VOTRE ESPACE TATAMI SERA BIENTÔT DISPONIBLE
                </Text>
              </View>
            </ScrollView>
          </>
        )}

        <View accessibilityRole="tablist" style={styles.tabBar}>
          {tabs.map((tab) => {
            const isActive = activeTabInfo.id === tab.id
            const TabIcon = tab.icon
            const color = isActive ? COLORS.active : COLORS.secondary

            return (
              <Pressable
                accessibilityLabel={tab.title}
                accessibilityRole="tab"
                accessibilityState={{ selected: isActive }}
                key={tab.id}
                onPress={() => setActiveTab(tab.id)}
                style={styles.tab}
              >
                <TabIcon
                  color={color}
                  size={20}
                  strokeWidth={isActive ? 2.2 : 1.7}
                />
                <Text
                  numberOfLines={1}
                  style={[styles.tabLabel, isActive && styles.tabLabelActive]}
                >
                  {tab.label}
                </Text>
              </Pressable>
            )
          })}
        </View>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: COLORS.canvas,
    flex: 1,
  },
  screen: {
    backgroundColor: COLORS.canvas,
    flex: 1,
  },
  header: {
    borderBottomColor: COLORS.border,
    borderBottomWidth: 1,
    paddingHorizontal: 22,
    paddingTop: 12,
    paddingBottom: 16,
  },
  brandRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  brand: {
    color: COLORS.primary,
    fontFamily: 'Anybody-Bold',
    fontSize: 24,
    letterSpacing: 1.8,
  },
  liveIndicator: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 7,
  },
  liveDot: {
    backgroundColor: COLORS.active,
    height: 6,
    width: 6,
  },
  liveLabel: {
    color: COLORS.active,
    fontFamily: 'Anybody-Bold',
    fontSize: 9,
    letterSpacing: 1.2,
  },
  roleSelector: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 17,
  },
  roleCaption: {
    color: COLORS.muted,
    fontSize: 9,
    letterSpacing: 1,
  },
  roleOptions: {
    flexDirection: 'row',
    gap: 5,
  },
  roleButton: {
    alignItems: 'center',
    borderColor: COLORS.border,
    borderRadius: 4,
    borderWidth: 1,
    justifyContent: 'center',
    minHeight: 30,
    paddingHorizontal: 9,
  },
  roleButtonSelected: {
    backgroundColor: COLORS.surface,
    borderColor: COLORS.secondary,
  },
  roleButtonText: {
    color: COLORS.secondary,
    fontFamily: 'Anybody-Bold',
    fontSize: 8,
    letterSpacing: 0.6,
  },
  roleButtonTextSelected: {
    color: COLORS.primary,
  },
  mainContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 22,
    paddingVertical: 28,
  },
  sectionEyebrow: {
    color: COLORS.secondary,
    fontSize: 9,
    letterSpacing: 1.5,
    marginBottom: 9,
  },
  pageTitle: {
    color: COLORS.primary,
    fontFamily: 'Anybody-Bold',
    fontSize: 29,
    letterSpacing: 0.5,
  },
  headingRule: {
    backgroundColor: COLORS.border,
    height: 1,
    marginTop: 17,
    marginBottom: 22,
  },
  placeholderCard: {
    backgroundColor: COLORS.surface,
    borderColor: COLORS.border,
    borderRadius: 4,
    borderWidth: 1,
    padding: 20,
  },
  placeholderIcon: {
    alignItems: 'center',
    backgroundColor: COLORS.canvas,
    borderColor: COLORS.border,
    borderRadius: 4,
    borderWidth: 1,
    height: 46,
    justifyContent: 'center',
    marginBottom: 23,
    width: 46,
  },
  placeholderEyebrow: {
    color: COLORS.secondary,
    fontSize: 9,
    letterSpacing: 1.2,
    marginBottom: 8,
  },
  placeholderTitle: {
    color: COLORS.primary,
    fontFamily: 'Anybody-Bold',
    fontSize: 25,
    letterSpacing: 0.2,
  },
  placeholderBody: {
    color: COLORS.secondary,
    fontSize: 13,
    marginTop: 9,
  },
  cardRule: {
    backgroundColor: COLORS.border,
    height: 1,
    marginTop: 24,
    marginBottom: 13,
  },
  placeholderMeta: {
    color: COLORS.muted,
    fontSize: 8,
    letterSpacing: 0.9,
  },
  tabBar: {
    alignItems: 'stretch',
    backgroundColor: COLORS.surface,
    borderTopColor: COLORS.border,
    borderTopWidth: 1,
    flexDirection: 'row',
    height: 64,
    justifyContent: 'space-around',
    paddingHorizontal: 5,
  },
  tab: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    minWidth: 0,
    paddingTop: 6,
  },
  tabLabel: {
    color: COLORS.secondary,
    fontFamily: 'Anybody-Bold',
    fontSize: 8,
    letterSpacing: 0.2,
    marginTop: 5,
  },
  tabLabelActive: {
    color: COLORS.active,
  },
})

export default MainTabNavigation
