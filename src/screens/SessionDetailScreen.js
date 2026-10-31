import { useState } from 'react'
import {
  ArrowLeft,
  Bell,
  Check,
  Clock3,
  LockKeyhole,
  MapPin,
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
  error: '#93000A',
  success: '#1F9D55',
}

const DEMO_STATES = [
  { id: 'available', label: 'DISPONIBLE' },
  { id: 'reserved', label: 'INSCRIT' },
  { id: 'full', label: 'COMPLET' },
  { id: 'late', label: 'ANNULATION < 2H' },
]

const EQUIPMENT = ['Kimono GI', 'Gourde d’eau', 'Claquettes / Zoris', 'Protège-dents']

const Text = ({ style, ...props }) => (
  <NativeText {...props} style={[{ fontFamily: 'Chivo-Regular' }, style]} />
)

function SessionDetailScreen({ onBack, initialState = 'available', session }) {
  const [reservationState, setReservationState] = useState(initialState)
  const [waitlistJoined, setWaitlistJoined] = useState(false)
  const [cancellationAlert, setCancellationAlert] = useState(false)

  const title = session?.title ?? 'JJB KIDS // MINI-LOUPS & LOUVETEAUX'
  const isReserved = reservationState === 'reserved' || reservationState === 'late'
  const isFull = reservationState === 'full'

  function handlePrimaryAction() {
    if (reservationState === 'available') {
      setReservationState('reserved')
      Alert.alert('Réservation confirmée', 'Votre place est réservée pour cette séance.')
    } else if (reservationState === 'reserved') {
      setReservationState('available')
      Alert.alert('Réservation annulée', 'Votre place a été libérée.')
    } else if (reservationState === 'full') {
      setWaitlistJoined(true)
      Alert.alert('Liste d’attente', 'Vous êtes inscrit au rang 3.')
    } else {
      Alert.alert('Annulation impossible', 'Contactez le club pour toute situation urgente.')
    }
  }

  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <Pressable
          accessibilityLabel="Retour au planning"
          accessibilityRole="button"
          onPress={onBack}
          style={({ pressed }) => [styles.headerButton, pressed && styles.pressed]}
        >
          <ArrowLeft color={COLORS.primary} size={20} />
        </Pressable>
        <Text accessibilityRole="header" style={styles.headerTitle}>DÉTAIL DE LA SÉANCE</Text>
        <View style={styles.headerActions}>
          <Pressable
            accessibilityLabel="Notifications"
            accessibilityRole="button"
            onPress={() => Alert.alert('Notifications', 'Aucune nouvelle notification.')}
            style={styles.headerButton}
          >
            <Bell color={COLORS.primary} size={18} />
            <View style={styles.notificationDot} />
          </Pressable>
          <View style={styles.avatar}>
            <UserRound color={COLORS.canvas} size={16} />
          </View>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.demoPanel}>
          <Text style={styles.demoLabel}>ÉTAT DE DÉMONSTRATION</Text>
          <ScrollView
            horizontal
            contentContainerStyle={styles.demoOptions}
            showsHorizontalScrollIndicator={false}
          >
            {DEMO_STATES.map((item) => {
              const selected = reservationState === item.id
              return (
                <Pressable
                  accessibilityRole="button"
                  accessibilityState={{ selected }}
                  key={item.id}
                  onPress={() => {
                    setReservationState(item.id)
                    setWaitlistJoined(false)
                  }}
                  style={[styles.demoOption, selected && styles.demoOptionSelected]}
                >
                  <Text style={[styles.demoOptionText, selected && styles.demoOptionTextSelected]}>
                    {item.label}
                  </Text>
                </Pressable>
              )
            })}
          </ScrollView>
        </View>

        {isReserved && (
          <View style={[styles.stateBanner, reservationState === 'late' && styles.lateBanner]}>
            {reservationState === 'late' ? (
              <LockKeyhole color={COLORS.crimsonLight} size={18} />
            ) : (
              <Check color={COLORS.primary} size={18} strokeWidth={2.5} />
            )}
            <View style={styles.bannerCopy}>
              <Text style={styles.bannerTitle}>
                {reservationState === 'late'
                  ? 'ANNULATION IMPOSSIBLE À MOINS DE 2 H DE LA SÉANCE'
                  : 'VOUS ÊTES INSCRIT À CETTE SÉANCE'}
              </Text>
              <Text style={styles.bannerDetail}>
                {reservationState === 'late'
                  ? 'Le créneau débute dans 1h05. Conformément au règlement intérieur, les annulations tardives bloquent les places et ne peuvent pas être effectuées depuis l’application.'
                  : 'Adhérent : Léo Dupont'}
              </Text>
            </View>
          </View>
        )}

        {isFull && (
          <View style={styles.fullBanner}>
            <Users color={COLORS.primary} size={18} />
            <View style={styles.bannerCopy}>
              <Text style={styles.bannerTitle}>SÉANCE COMPLÈTE</Text>
              <Text style={styles.bannerDetail}>Capacité maximale atteinte.</Text>
            </View>
          </View>
        )}

        <View style={styles.cover}>
          <View style={styles.coverGlow} />
          <View style={styles.coverStripeOne} />
          <View style={styles.coverStripeTwo} />
          <View style={styles.coverMat} />
          <Text style={styles.coverWordmark}>TATAMI / CDL</Text>
          <View style={styles.coverBadges}>
            <View style={styles.confirmedBadge}>
              <View style={styles.confirmedDot} />
              <Text style={styles.coverBadgeText}>SESSION CONFIRMÉE</Text>
            </View>
            <View style={styles.giBadge}>
              <Text style={styles.coverBadgeText}>GI OBLIGATOIRE</Text>
            </View>
          </View>
        </View>

        <View style={styles.sessionHeading}>
          <Text style={styles.eyebrow}>COURS ENFANTS · JIU-JITSU BRÉSILIEN</Text>
          <Text style={styles.sessionTitle}>{title}</Text>
          <View style={styles.metaRow}>
            <CalendarMeta />
            <Text style={styles.metaText}>
              Mercredi 24 Octobre · 15h15 – 16h30 (1h15)
            </Text>
          </View>
          <View style={styles.metaRow}>
            <MapPin color={COLORS.secondary} size={15} />
            <Text style={styles.metaText}>CAMP DES LOUPS · TATAMI CENTRAL</Text>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardEyebrow}>THÉMATIQUE DE LA SEMAINE</Text>
          <Text style={styles.themeTitle}>
            PASSAGE DE GARDE TORREANDO & CONTRÔLE LATÉRAL
          </Text>
          <Text style={styles.bodyText}>
            Apprendre à contourner la garde en conservant une posture stable, puis à installer
            un contrôle latéral sûr. La séance alterne démonstration, exercices guidés et mises
            en situation adaptées aux enfants.
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>ENCADREMENT</Text>
          <CoachRow initials="MB" name="Professeur Mehdi Benali" detail="CEINTURE NOIRE 2E DEGRÉ" />
          <CoachRow initials="SL" name="Sarah Lambert" detail="COACH ADJOINTE" last />
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>ÉQUIPEMENT REQUIS</Text>
          <View style={styles.equipmentGrid}>
            {EQUIPMENT.map((item) => (
              <View key={item} style={styles.equipmentItem}>
                <Check color={COLORS.success} size={15} strokeWidth={2} />
                <Text style={styles.equipmentText}>{item}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.occupancyCard}>
          <View style={styles.occupancyHeader}>
            <View style={styles.occupancyCopy}>
              <Text style={styles.cardTitle}>OCCUPATION DU TATAMI</Text>
              <Text style={styles.occupancyDetail}>
                {isFull
                  ? '20 / 20 COMBATTANTS'
                  : reservationState === 'late'
                    ? '15 / 20 COMBATTANTS'
                    : reservationState === 'reserved'
                      ? '15 / 20 COMBATTANTS'
                      : '14 / 20 COMBATTANTS'}
              </Text>
            </View>
            {!isFull && (
              <Text style={styles.placesLeft}>
                {reservationState === 'reserved' || reservationState === 'late'
                  ? '5 PLACES RESTANTES'
                  : '6 PLACES RESTANTES'}
              </Text>
            )}
          </View>
          <View style={styles.progressTrack}>
            <View
              style={[
                styles.progressFill,
                { width: isFull ? '100%' : reservationState === 'reserved' ? '75%' : '70%' },
              ]}
            />
          </View>
          {isFull && (
            <Text style={styles.waitlistInfo}>
              Liste d’attente active : {waitlistJoined ? '3' : '2'} en attente
            </Text>
          )}
        </View>

        {reservationState === 'late' ? (
          <View style={styles.actions}>
            <Pressable
              accessibilityRole="button"
              disabled
              style={[styles.primaryAction, styles.disabledAction]}
            >
              <Text style={styles.primaryActionText}>ANNULER MA RÉSERVATION</Text>
            </Pressable>
            <Pressable
              accessibilityRole="button"
              onPress={() => Alert.alert('Contacter le club', 'Contactez le staff du dojo pour obtenir de l’aide.')}
              style={({ pressed }) => [styles.secondaryAction, pressed && styles.pressed]}
            >
              <Text style={styles.secondaryActionText}>CONTACTER LE CLUB / SECOURS</Text>
            </Pressable>
          </View>
        ) : isFull ? (
          <View style={styles.actions}>
            <Pressable
              accessibilityRole="button"
              onPress={handlePrimaryAction}
              style={({ pressed }) => [styles.primaryAction, pressed && styles.pressed]}
            >
              <Text style={styles.primaryActionText}>
                {waitlistJoined ? 'INSCRIPTION LISTE D’ATTENTE CONFIRMÉE (RANG 3)' : 'S’INSCRIRE SUR LISTE D’ATTENTE (RANG 3)'}
              </Text>
            </Pressable>
            <Pressable
              accessibilityRole="button"
              onPress={() => {
                setCancellationAlert((active) => !active)
                Alert.alert(
                  cancellationAlert ? 'Alerte désactivée' : 'Alerte activée',
                  cancellationAlert
                    ? 'Vous ne serez plus averti en cas de désistement.'
                    : 'Vous serez averti si une place se libère.',
                )
              }}
              style={({ pressed }) => [styles.secondaryAction, pressed && styles.pressed]}
            >
              <Text style={styles.secondaryActionText}>
                {cancellationAlert ? 'ALERTE DÉSACTIVÉE' : 'M’AVERTIR EN CAS DE DÉSISTEMENT'}
              </Text>
            </Pressable>
          </View>
        ) : (
          <Pressable
            accessibilityRole="button"
            onPress={handlePrimaryAction}
            style={({ pressed }) => [
              reservationState === 'reserved' ? styles.secondaryAction : styles.primaryAction,
              pressed && styles.pressed,
            ]}
          >
            <Text
              style={
                reservationState === 'reserved'
                  ? styles.secondaryActionText
                  : styles.primaryActionText
              }
            >
              {reservationState === 'reserved'
                ? 'ANNULER MA RÉSERVATION'
                : 'RÉSERVER CE CRÉNEAU'}
            </Text>
          </Pressable>
        )}

        <View style={styles.protocol}>
          <Shield color={COLORS.secondary} size={15} />
          <Text style={styles.protocolText}>
            Protocole Tatami : arrivée requise 10 min avant le salut.
          </Text>
        </View>
      </ScrollView>
    </View>
  )
}

function CalendarMeta() {
  return <Clock3 color={COLORS.secondary} size={15} />
}

function CoachRow({ initials, name, detail, last = false }) {
  return (
    <View style={[styles.coachRow, last && styles.coachRowLast]}>
      <View style={styles.coachAvatar}>
        <Text style={styles.coachInitials}>{initials}</Text>
      </View>
      <View style={styles.coachCopy}>
        <Text style={styles.coachName}>{name}</Text>
        <Text style={styles.coachDetail}>{detail}</Text>
      </View>
      <Shield color={COLORS.secondary} size={15} />
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
    backgroundColor: COLORS.canvas,
    borderBottomColor: COLORS.border,
    borderBottomWidth: 1,
    flexDirection: 'row',
    height: 54,
    justifyContent: 'space-between',
    paddingHorizontal: 10,
  },
  headerButton: {
    alignItems: 'center',
    height: 38,
    justifyContent: 'center',
    position: 'relative',
    width: 38,
  },
  headerTitle: {
    color: COLORS.primary,
    flex: 1,
    fontFamily: 'Anybody-BlackItalic',
    fontSize: 12,
    letterSpacing: 0.35,
    textAlign: 'center',
  },
  headerActions: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 2,
  },
  notificationDot: {
    backgroundColor: COLORS.crimson,
    borderColor: COLORS.canvas,
    borderRadius: 4,
    borderWidth: 1,
    height: 7,
    position: 'absolute',
    right: 7,
    top: 7,
    width: 7,
  },
  avatar: {
    alignItems: 'center',
    backgroundColor: COLORS.crimsonLight,
    borderRadius: 17,
    height: 32,
    justifyContent: 'center',
    marginLeft: 2,
    width: 32,
  },
  content: {
    paddingBottom: 28,
    paddingHorizontal: 17,
    paddingTop: 13,
  },
  demoPanel: {
    marginBottom: 13,
  },
  demoLabel: {
    color: COLORS.muted,
    fontFamily: 'Anybody-Bold',
    fontSize: 7,
    letterSpacing: 0.75,
    marginBottom: 6,
  },
  demoOptions: {
    gap: 5,
  },
  demoOption: {
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderColor: COLORS.border,
    borderRadius: 4,
    borderWidth: 1,
    justifyContent: 'center',
    minHeight: 28,
    paddingHorizontal: 8,
  },
  demoOptionSelected: {
    backgroundColor: COLORS.crimson,
    borderColor: COLORS.crimson,
  },
  demoOptionText: {
    color: COLORS.secondary,
    fontFamily: 'Anybody-Bold',
    fontSize: 7,
    letterSpacing: 0.15,
  },
  demoOptionTextSelected: {
    color: COLORS.primary,
  },
  stateBanner: {
    alignItems: 'center',
    backgroundColor: COLORS.success,
    borderRadius: 4,
    flexDirection: 'row',
    gap: 10,
    marginBottom: 12,
    padding: 11,
  },
  lateBanner: {
    backgroundColor: COLORS.surface,
    borderColor: COLORS.border,
    borderLeftColor: COLORS.crimson,
    borderLeftWidth: 3,
    borderWidth: 1,
  },
  fullBanner: {
    alignItems: 'center',
    backgroundColor: COLORS.error,
    borderRadius: 4,
    flexDirection: 'row',
    gap: 10,
    marginBottom: 12,
    padding: 11,
  },
  bannerCopy: {
    flex: 1,
  },
  bannerTitle: {
    color: COLORS.primary,
    fontFamily: 'Anybody-Bold',
    fontSize: 9,
    letterSpacing: 0.25,
    lineHeight: 14,
  },
  bannerDetail: {
    color: COLORS.primary,
    fontSize: 9,
    lineHeight: 14,
    marginTop: 3,
    opacity: 0.88,
  },
  cover: {
    backgroundColor: '#292020',
    borderColor: COLORS.border,
    borderRadius: 4,
    borderWidth: 1,
    height: 172,
    justifyContent: 'flex-end',
    marginBottom: 16,
    overflow: 'hidden',
    padding: 11,
  },
  coverGlow: {
    backgroundColor: '#5A2526',
    height: 140,
    left: '12%',
    opacity: 0.7,
    position: 'absolute',
    top: 15,
    transform: [{ rotate: '-22deg' }],
    width: '78%',
  },
  coverStripeOne: {
    backgroundColor: 'rgba(255,255,255,0.12)',
    height: 260,
    left: '42%',
    position: 'absolute',
    top: -40,
    transform: [{ rotate: '29deg' }],
    width: 42,
  },
  coverStripeTwo: {
    backgroundColor: 'rgba(0,0,0,0.35)',
    height: 260,
    left: '69%',
    position: 'absolute',
    top: -35,
    transform: [{ rotate: '29deg' }],
    width: 60,
  },
  coverMat: {
    backgroundColor: 'rgba(11,11,11,0.42)',
    bottom: 0,
    height: 54,
    left: 0,
    position: 'absolute',
    right: 0,
  },
  coverWordmark: {
    color: 'rgba(255,255,255,0.28)',
    fontFamily: 'Anybody-BlackItalic',
    fontSize: 28,
    left: 12,
    position: 'absolute',
    top: 15,
  },
  coverBadges: {
    flexDirection: 'row',
    gap: 6,
  },
  confirmedBadge: {
    alignItems: 'center',
    backgroundColor: COLORS.crimson,
    borderRadius: 4,
    flexDirection: 'row',
    gap: 5,
    paddingHorizontal: 7,
    paddingVertical: 5,
  },
  confirmedDot: {
    backgroundColor: COLORS.primary,
    height: 5,
    width: 5,
  },
  giBadge: {
    backgroundColor: 'rgba(11,11,11,0.84)',
    borderColor: 'rgba(255,255,255,0.2)',
    borderRadius: 4,
    borderWidth: 1,
    paddingHorizontal: 7,
    paddingVertical: 5,
  },
  coverBadgeText: {
    color: COLORS.primary,
    fontFamily: 'Anybody-Bold',
    fontSize: 7,
    letterSpacing: 0.25,
  },
  sessionHeading: {
    marginBottom: 14,
  },
  eyebrow: {
    color: COLORS.crimsonLight,
    fontFamily: 'Anybody-Bold',
    fontSize: 8,
    letterSpacing: 0.8,
    marginBottom: 6,
  },
  sessionTitle: {
    color: COLORS.primary,
    fontFamily: 'Anybody-BlackItalic',
    fontSize: 25,
    letterSpacing: -0.5,
    lineHeight: 30,
    marginBottom: 10,
  },
  metaRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
    marginTop: 6,
  },
  metaText: {
    color: COLORS.secondary,
    flex: 1,
    fontSize: 10,
    lineHeight: 15,
  },
  card: {
    backgroundColor: COLORS.surface,
    borderColor: COLORS.border,
    borderRadius: 4,
    borderWidth: 1,
    marginBottom: 11,
    padding: 13,
  },
  cardEyebrow: {
    color: COLORS.crimsonLight,
    fontFamily: 'Anybody-Bold',
    fontSize: 8,
    letterSpacing: 0.7,
    marginBottom: 8,
  },
  themeTitle: {
    color: COLORS.primary,
    fontFamily: 'Anybody-BlackItalic',
    fontSize: 16,
    letterSpacing: -0.15,
    lineHeight: 21,
  },
  bodyText: {
    color: COLORS.secondary,
    fontSize: 11,
    lineHeight: 17,
    marginTop: 9,
  },
  cardTitle: {
    color: COLORS.primary,
    fontFamily: 'Anybody-Bold',
    fontSize: 10,
    letterSpacing: 0.65,
    marginBottom: 8,
  },
  coachRow: {
    alignItems: 'center',
    borderBottomColor: COLORS.border,
    borderBottomWidth: 1,
    flexDirection: 'row',
    gap: 10,
    minHeight: 58,
  },
  coachRowLast: {
    borderBottomWidth: 0,
  },
  coachAvatar: {
    alignItems: 'center',
    backgroundColor: '#3A2929',
    borderColor: COLORS.border,
    borderRadius: 4,
    borderWidth: 1,
    height: 36,
    justifyContent: 'center',
    width: 36,
  },
  coachInitials: {
    color: COLORS.crimsonLight,
    fontFamily: 'Anybody-Bold',
    fontSize: 9,
  },
  coachCopy: {
    flex: 1,
  },
  coachName: {
    color: COLORS.primary,
    fontSize: 11,
  },
  coachDetail: {
    color: COLORS.secondary,
    fontFamily: 'Anybody-Bold',
    fontSize: 7,
    letterSpacing: 0.4,
    marginTop: 4,
  },
  equipmentGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  equipmentItem: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 6,
    minHeight: 28,
    width: '47%',
  },
  equipmentText: {
    color: COLORS.secondary,
    flex: 1,
    fontSize: 10,
  },
  occupancyCard: {
    backgroundColor: COLORS.surface,
    borderColor: COLORS.border,
    borderRadius: 4,
    borderWidth: 1,
    marginBottom: 12,
    padding: 13,
  },
  occupancyHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  occupancyCopy: {
    flex: 1,
  },
  occupancyDetail: {
    color: COLORS.secondary,
    fontFamily: 'Anybody-Bold',
    fontSize: 9,
    letterSpacing: 0.5,
    marginTop: 4,
  },
  placesLeft: {
    color: COLORS.crimsonLight,
    fontFamily: 'Anybody-Bold',
    fontSize: 8,
    letterSpacing: 0.2,
    marginLeft: 6,
  },
  progressTrack: {
    backgroundColor: COLORS.border,
    height: 5,
    marginTop: 10,
    overflow: 'hidden',
  },
  progressFill: {
    backgroundColor: COLORS.crimson,
    height: '100%',
  },
  waitlistInfo: {
    color: COLORS.crimsonLight,
    fontSize: 9,
    marginTop: 8,
  },
  actions: {
    gap: 8,
  },
  primaryAction: {
    alignItems: 'center',
    backgroundColor: COLORS.crimson,
    borderRadius: 4,
    justifyContent: 'center',
    minHeight: 54,
    paddingHorizontal: 12,
  },
  primaryActionText: {
    color: COLORS.primary,
    fontFamily: 'Anybody-Bold',
    fontSize: 9,
    letterSpacing: 0.4,
    textAlign: 'center',
  },
  secondaryAction: {
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderColor: COLORS.border,
    borderRadius: 4,
    borderWidth: 1,
    justifyContent: 'center',
    minHeight: 48,
    paddingHorizontal: 12,
  },
  secondaryActionText: {
    color: COLORS.crimsonLight,
    fontFamily: 'Anybody-Bold',
    fontSize: 9,
    letterSpacing: 0.4,
    textAlign: 'center',
  },
  disabledAction: {
    backgroundColor: COLORS.muted,
    opacity: 0.3,
  },
  protocol: {
    alignItems: 'center',
    borderTopColor: COLORS.border,
    borderTopWidth: 1,
    flexDirection: 'row',
    gap: 8,
    marginTop: 15,
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

export default SessionDetailScreen
