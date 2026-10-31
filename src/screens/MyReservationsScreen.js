import { useState } from 'react'
import {
  AlertCircle,
  Bell,
  CalendarDays,
  ChevronRight,
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
  orange: '#F28C28',
  success: '#1F9D55',
}

const DEMO_RESERVATIONS = [
  {
    id: 'leo-kids',
    initial: 'L',
    name: 'LÉO DUPONT (8 ANS - MINI-LOUP)',
    className: 'SECTION 6-9 ANS // JJB KIDS // MINI-LOUPS & LOUVETEAUX',
    date: 'MERCREDI 24 OCTOBRE · 15:15 — 16:30',
    place: 'DOJO BASTILLE — TAPIS 1',
    variant: 'red',
  },
  {
    id: 'sarah-grappling',
    initial: 'S',
    name: 'SARAH DUPONT (12 ANS)',
    className: 'GRAPPLING TEEN NO-GI',
    date: 'JEUDI 25 OCTOBRE · 17:30 — 18:45',
    place: 'DOJO BASTILLE — TAPIS 2',
    variant: 'blue',
  },
  {
    id: 'alexandre-adult',
    initial: 'A',
    name: 'ALEXANDRE DUPONT (MOI) - CEINTURE BLEUE 2° BARRETTE',
    className: 'JJB ADULTE GI // FONDAMENTAUX & SPARRING',
    date: 'JEUDI 25 OCTOBRE · 19:00 — 20:30',
    place: 'GRAND TAPIS CENTRAL',
    variant: 'gray',
  },
]

const PAST_RESERVATIONS = [
  {
    id: 'past-leo',
    initial: 'L',
    name: 'LÉO DUPONT (8 ANS - MINI-LOUP)',
    className: 'JJB KIDS // TECHNIQUE & JEUX',
    date: 'LUNDI 22 OCTOBRE · 15:15 — 16:30',
    place: 'DOJO BASTILLE — TAPIS 1',
    attended: true,
  },
  {
    id: 'past-alexandre',
    initial: 'A',
    name: 'ALEXANDRE DUPONT (MOI)',
    className: 'JJB ADULTE GI // FONDAMENTAUX',
    date: 'MARDI 23 OCTOBRE · 19:00 — 20:30',
    place: 'GRAND TAPIS CENTRAL',
    attended: true,
  },
]

const Text = ({ style, ...props }) => (
  <NativeText {...props} style={[{ fontFamily: 'Chivo-Regular' }, style]} />
)

function MyReservationsScreen({ role = 'adult', onOpenPlanning }) {
  const [activeFilter, setActiveFilter] = useState('upcoming')
  const [showDemoReservations, setShowDemoReservations] = useState(false)
  const [cancelledIds, setCancelledIds] = useState([])

  const upcoming = showDemoReservations
    ? DEMO_RESERVATIONS.filter((item) => !cancelledIds.includes(item.id))
    : []
  function cancelReservation(reservation) {
    Alert.alert(
      'Annuler la réservation ?',
      `Souhaitez-vous libérer la place de ${reservation.name.split(' (')[0]} ?`,
      [
        { text: 'GARDER', style: 'cancel' },
        {
          text: 'ANNULER',
          style: 'destructive',
          onPress: () => setCancelledIds((current) => [...current, reservation.id]),
        },
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
            style={styles.iconButton}
          >
            <Bell color={COLORS.primary} size={19} />
            <View style={styles.notificationDot} />
          </Pressable>
          <View accessibilityLabel="Profil" style={styles.avatar}>
            <UserRound color={COLORS.canvas} size={17} />
          </View>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.titleRow}>
          <View style={styles.titleCopy}>
            <Text style={styles.spaceBadge}>
              🔴 {role === 'parent' ? 'ESPACE PARENT & ADHÉRENT' : 'ESPACE ADHÉRENT'}
            </Text>
            <Text accessibilityRole="header" style={styles.title}>MES RÉSERVATIONS</Text>
          </View>
          <Text style={styles.season}>SAISON 26-27</Text>
        </View>

        <View style={styles.demoRow}>
          <Text style={styles.demoLabel}>APERÇU DÉMO</Text>
          <View style={styles.demoOptions}>
            {[
              { id: false, label: 'VIDE' },
              { id: true, label: 'AVEC COURS' },
            ].map((option) => {
              const selected = showDemoReservations === option.id
              return (
                <Pressable
                  accessibilityRole="button"
                  accessibilityState={{ selected }}
                  key={option.label}
                  onPress={() => {
                    setShowDemoReservations(option.id)
                    setCancelledIds([])
                    setActiveFilter('upcoming')
                  }}
                  style={[styles.demoButton, selected && styles.demoButtonSelected]}
                >
                  <Text style={[styles.demoButtonText, selected && styles.demoButtonTextSelected]}>
                    {option.label}
                  </Text>
                </Pressable>
              )
            })}
          </View>
        </View>

        <View style={styles.segmentedControl}>
          <FilterButton
            active={activeFilter === 'upcoming'}
            label={`À VENIR [${upcoming.length}]`}
            onPress={() => setActiveFilter('upcoming')}
          />
          <FilterButton
            active={activeFilter === 'past'}
            label={`PASSÉES [${PAST_RESERVATIONS.length}]`}
            onPress={() => setActiveFilter('past')}
          />
        </View>

        {activeFilter === 'upcoming' && upcoming.length === 0 ? (
          <EmptyReservations onOpenPlanning={onOpenPlanning} />
        ) : (
          <>
            <View style={styles.reservationList}>
              {(activeFilter === 'upcoming' ? upcoming : PAST_RESERVATIONS).map((item) => (
                <ReservationCard
                  item={item}
                  key={item.id}
                  past={activeFilter === 'past'}
                  onCancel={() => cancelReservation(item)}
                />
              ))}
            </View>
            {activeFilter === 'upcoming' && (
              <View style={styles.legalNote}>
                <AlertCircle color={COLORS.orange} size={17} />
                <Text style={styles.legalText}>
                  Annulation possible sans pénalité jusqu’à 2h avant le début de la séance.
                  Respectez les créneaux pour libérer la place sur le tatami pour vos coéquipiers
                  de meute.
                </Text>
              </View>
            )}
          </>
        )}

        {activeFilter === 'upcoming' && upcoming.length === 0 && (
          <TodayProgram />
        )}
      </ScrollView>
    </View>
  )
}

function FilterButton({ active, label, onPress }) {
  return (
    <Pressable
      accessibilityRole="tab"
      accessibilityState={{ selected: active }}
      onPress={onPress}
      style={[styles.filterButton, active && styles.filterButtonActive]}
    >
      <Text style={[styles.filterText, active && styles.filterTextActive]}>{label}</Text>
    </Pressable>
  )
}

function EmptyReservations({ onOpenPlanning }) {
  return (
    <>
      <View style={styles.emptyCard}>
        <View style={styles.emptyIconWrap}>
          <CalendarDays color={COLORS.secondary} size={28} strokeWidth={1.6} />
        </View>
        <Text style={styles.emptyTitle}>AUCUNE RÉSERVATION</Text>
        <Text style={styles.emptyText}>
          Vous n’avez aucune réservation à venir. Consultez le planning des cours JJB & Grappling
          pour réserver un tapis pour vous ou vos enfants (Mini-Loups, Ados).
        </Text>
        <Pressable
          accessibilityRole="button"
          onPress={onOpenPlanning}
          style={({ pressed }) => [styles.primaryButton, pressed && styles.pressed]}
        >
          <Text style={styles.primaryButtonText}>VOIR LE PLANNING →</Text>
        </Pressable>
      </View>

      <View style={styles.ruleCard}>
        <Bell color={COLORS.crimsonLight} size={17} />
        <View style={styles.ruleCopy}>
          <Text style={styles.ruleTitle}>RÈGLE DU TATAMI</Text>
          <Text style={styles.ruleText}>
            Les créneaux ouvrent à la réservation 7 jours à l’avance. Pensez à vérifier la
            validité du certificat médical.
          </Text>
        </View>
      </View>
    </>
  )
}

function ReservationCard({ item, past, onCancel }) {
  return (
    <View style={[styles.reservationCard, past && styles.pastCard]}>
      <View style={styles.reservationTop}>
        <View style={styles.memberAvatar}>
          <Text style={styles.memberInitial}>{item.initial}</Text>
        </View>
        <View style={styles.reservationCopy}>
          <Text style={styles.memberName}>{item.name}</Text>
          <Text style={styles.className}>{item.className}</Text>
        </View>
      </View>
      <View style={styles.metaLine}>
        <CalendarDays color={COLORS.secondary} size={14} />
        <Text style={styles.metaText}>{item.date}</Text>
      </View>
      <View style={styles.metaLine}>
        <MapPin color={COLORS.secondary} size={14} />
        <Text style={styles.metaText}>{item.place}</Text>
      </View>
      <View style={styles.cardFooter}>
        <View style={styles.checkin}>
          <View style={styles.qrMark} />
          <Text style={styles.checkinText}>
            {past ? (item.attended ? 'PRÉSENCE ENREGISTRÉE' : 'SÉANCE PASSÉE') : 'QR CODE CHECK-IN DOJO'}
          </Text>
        </View>
        {past ? (
          <View style={styles.pastBadge}>
            <Text style={styles.pastBadgeText}>TERMINÉE</Text>
          </View>
        ) : (
          <Pressable
            accessibilityRole="button"
            onPress={onCancel}
            style={({ pressed }) => [styles.cancelButton, pressed && styles.pressed]}
          >
            <Text style={styles.cancelText}>🚫 ANNULER</Text>
          </Pressable>
        )}
      </View>
    </View>
  )
}

function TodayProgram() {
  return (
    <View style={styles.programSection}>
      <View style={styles.programHeading}>
        <View>
          <Text style={styles.programTitle}>PROGRAMME DU CAMP</Text>
          <Text style={styles.programEyebrow}>AUJOURD’HUI</Text>
        </View>
        <ChevronRight color={COLORS.secondary} size={18} />
      </View>
      <ScrollView
        horizontal
        contentContainerStyle={styles.programList}
        showsHorizontalScrollIndicator={false}
      >
        <ProgramTile
          time="18:30"
          title="ADULTES // JJB GI"
          subtitle="FONDAMENTAUX & SPARRING"
          variant="red"
        />
        <ProgramTile
          time="17:15"
          title="SECTION JEUNES"
          subtitle="MINI-LOUPS & LOUVETEAUX"
          variant="blue"
        />
      </ScrollView>
    </View>
  )
}

function ProgramTile({ time, title, subtitle, variant }) {
  return (
    <View style={styles.programTile}>
      <View style={[styles.programArtwork, variant === 'blue' && styles.programArtworkBlue]}>
        <View style={styles.artworkStripe} />
        <View style={styles.programOverlay} />
        <Text style={styles.programTime}>{time}</Text>
        <Text style={styles.programTileTitle}>{title}</Text>
        <Text style={styles.programSubtitle}>{subtitle}</Text>
      </View>
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
    height: 21,
    justifyContent: 'center',
    width: 27,
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
    right: 6,
    top: 5,
    width: 7,
  },
  avatar: {
    alignItems: 'center',
    backgroundColor: COLORS.crimsonLight,
    borderRadius: 18,
    height: 34,
    justifyContent: 'center',
    width: 34,
  },
  content: {
    paddingBottom: 22,
    paddingHorizontal: 17,
    paddingTop: 16,
  },
  titleRow: {
    alignItems: 'flex-end',
    flexDirection: 'row',
    gap: 5,
    justifyContent: 'space-between',
    marginBottom: 13,
  },
  titleCopy: {
    flex: 1,
  },
  spaceBadge: {
    alignSelf: 'flex-start',
    backgroundColor: COLORS.surface,
    borderColor: COLORS.border,
    borderRadius: 4,
    borderWidth: 1,
    color: COLORS.secondary,
    fontFamily: 'Anybody-Bold',
    fontSize: 7,
    letterSpacing: 0.3,
    marginBottom: 8,
    overflow: 'hidden',
    paddingHorizontal: 7,
    paddingVertical: 5,
  },
  title: {
    color: COLORS.primary,
    fontFamily: 'Anybody-BlackItalic',
    fontSize: 26,
    letterSpacing: -0.5,
  },
  season: {
    color: COLORS.secondary,
    fontFamily: 'Anybody-Bold',
    fontSize: 7,
    letterSpacing: 0.4,
    marginBottom: 5,
  },
  demoRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 11,
  },
  demoLabel: {
    color: COLORS.muted,
    fontFamily: 'Anybody-Bold',
    fontSize: 7,
    letterSpacing: 0.7,
  },
  demoOptions: {
    flexDirection: 'row',
    gap: 5,
  },
  demoButton: {
    alignItems: 'center',
    borderColor: COLORS.border,
    borderRadius: 4,
    borderWidth: 1,
    justifyContent: 'center',
    minHeight: 27,
    paddingHorizontal: 9,
  },
  demoButtonSelected: {
    backgroundColor: COLORS.surface,
    borderColor: COLORS.secondary,
  },
  demoButtonText: {
    color: COLORS.secondary,
    fontFamily: 'Anybody-Bold',
    fontSize: 7,
  },
  demoButtonTextSelected: {
    color: COLORS.primary,
  },
  segmentedControl: {
    flexDirection: 'row',
    gap: 7,
    marginBottom: 14,
  },
  filterButton: {
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderColor: COLORS.border,
    borderRadius: 4,
    borderWidth: 1,
    flex: 1,
    justifyContent: 'center',
    minHeight: 42,
  },
  filterButtonActive: {
    backgroundColor: COLORS.crimson,
    borderColor: COLORS.crimson,
  },
  filterText: {
    color: COLORS.secondary,
    fontFamily: 'Anybody-Bold',
    fontSize: 9,
    letterSpacing: 0.3,
  },
  filterTextActive: {
    color: COLORS.primary,
  },
  emptyCard: {
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderColor: COLORS.border,
    borderRadius: 4,
    borderWidth: 1,
    padding: 18,
  },
  emptyIconWrap: {
    alignItems: 'center',
    backgroundColor: '#3A1B1C',
    borderRadius: 28,
    height: 56,
    justifyContent: 'center',
    width: 56,
  },
  emptyTitle: {
    color: COLORS.primary,
    fontFamily: 'Anybody-BlackItalic',
    fontSize: 18,
    letterSpacing: 0.2,
    marginTop: 13,
  },
  emptyText: {
    color: COLORS.secondary,
    fontSize: 11,
    lineHeight: 17,
    marginTop: 8,
    textAlign: 'center',
  },
  primaryButton: {
    alignItems: 'center',
    backgroundColor: COLORS.crimson,
    borderRadius: 4,
    height: 54,
    justifyContent: 'center',
    marginTop: 14,
    width: '100%',
  },
  primaryButtonText: {
    color: COLORS.primary,
    fontFamily: 'Anybody-Bold',
    fontSize: 10,
    letterSpacing: 0.55,
  },
  ruleCard: {
    alignItems: 'flex-start',
    backgroundColor: COLORS.surface,
    borderColor: COLORS.border,
    borderRadius: 4,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 10,
    marginTop: 10,
    padding: 12,
  },
  ruleCopy: {
    flex: 1,
  },
  ruleTitle: {
    color: COLORS.primary,
    fontFamily: 'Anybody-Bold',
    fontSize: 9,
    letterSpacing: 0.5,
  },
  ruleText: {
    color: COLORS.secondary,
    fontSize: 10,
    lineHeight: 15,
    marginTop: 4,
  },
  reservationList: {
    gap: 10,
  },
  reservationCard: {
    backgroundColor: COLORS.surface,
    borderColor: COLORS.border,
    borderLeftColor: COLORS.crimson,
    borderLeftWidth: 4,
    borderRadius: 4,
    borderWidth: 1,
    padding: 12,
  },
  pastCard: {
    borderLeftColor: COLORS.muted,
  },
  reservationTop: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 10,
    marginBottom: 10,
  },
  memberAvatar: {
    alignItems: 'center',
    backgroundColor: COLORS.input,
    borderColor: COLORS.border,
    borderRadius: 20,
    borderWidth: 1,
    height: 38,
    justifyContent: 'center',
    width: 38,
  },
  memberInitial: {
    color: COLORS.primary,
    fontFamily: 'Anybody-BlackItalic',
    fontSize: 16,
  },
  reservationCopy: {
    flex: 1,
  },
  memberName: {
    color: COLORS.primary,
    fontFamily: 'Anybody-Bold',
    fontSize: 9,
    letterSpacing: 0.2,
  },
  className: {
    color: COLORS.crimsonLight,
    fontFamily: 'Anybody-Bold',
    fontSize: 8,
    letterSpacing: 0.15,
    lineHeight: 13,
    marginTop: 4,
  },
  metaLine: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
    marginTop: 6,
  },
  metaText: {
    color: COLORS.secondary,
    flex: 1,
    fontSize: 9,
    lineHeight: 14,
  },
  cardFooter: {
    alignItems: 'center',
    borderTopColor: COLORS.border,
    borderTopWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 11,
    paddingTop: 9,
  },
  checkin: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 6,
  },
  qrMark: {
    borderColor: COLORS.secondary,
    borderWidth: 1,
    height: 11,
    width: 11,
  },
  checkinText: {
    color: COLORS.secondary,
    fontFamily: 'Anybody-Bold',
    fontSize: 6,
    letterSpacing: 0.2,
  },
  cancelButton: {
    alignItems: 'center',
    backgroundColor: '#321719',
    borderColor: '#5B2527',
    borderRadius: 4,
    borderWidth: 1,
    justifyContent: 'center',
    minHeight: 31,
    paddingHorizontal: 8,
  },
  cancelText: {
    color: COLORS.crimsonLight,
    fontFamily: 'Anybody-Bold',
    fontSize: 7,
  },
  pastBadge: {
    backgroundColor: COLORS.border,
    borderRadius: 4,
    paddingHorizontal: 7,
    paddingVertical: 6,
  },
  pastBadgeText: {
    color: COLORS.secondary,
    fontFamily: 'Anybody-Bold',
    fontSize: 7,
  },
  legalNote: {
    alignItems: 'flex-start',
    backgroundColor: '#211B15',
    borderColor: '#463321',
    borderRadius: 4,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 9,
    marginTop: 11,
    padding: 11,
  },
  legalText: {
    color: '#D5B89B',
    flex: 1,
    fontSize: 9,
    lineHeight: 14,
  },
  programSection: {
    marginTop: 17,
  },
  programHeading: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  programTitle: {
    color: COLORS.primary,
    fontFamily: 'Anybody-BlackItalic',
    fontSize: 14,
  },
  programEyebrow: {
    color: COLORS.crimsonLight,
    fontFamily: 'Anybody-Bold',
    fontSize: 8,
    letterSpacing: 0.75,
    marginTop: 3,
  },
  programList: {
    gap: 9,
  },
  programTile: {
    width: 225,
  },
  programArtwork: {
    backgroundColor: '#392122',
    borderColor: COLORS.border,
    borderRadius: 4,
    borderWidth: 1,
    height: 112,
    justifyContent: 'flex-end',
    overflow: 'hidden',
    padding: 10,
  },
  programArtworkBlue: {
    backgroundColor: '#1C2A35',
  },
  artworkStripe: {
    backgroundColor: 'rgba(255,255,255,0.12)',
    height: 190,
    position: 'absolute',
    right: 55,
    top: -25,
    transform: [{ rotate: '29deg' }],
    width: 34,
  },
  programOverlay: {
    backgroundColor: 'rgba(0,0,0,0.48)',
    bottom: 0,
    height: 58,
    left: 0,
    position: 'absolute',
    right: 0,
  },
  programTime: {
    color: COLORS.crimsonLight,
    fontFamily: 'Anybody-Bold',
    fontSize: 8,
    letterSpacing: 0.4,
  },
  programTileTitle: {
    color: COLORS.primary,
    fontFamily: 'Anybody-BlackItalic',
    fontSize: 13,
    marginTop: 3,
  },
  programSubtitle: {
    color: COLORS.secondary,
    fontSize: 7,
    marginTop: 2,
  },
  pressed: {
    opacity: 0.78,
  },
})

export default MyReservationsScreen
