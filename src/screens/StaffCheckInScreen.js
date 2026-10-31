import { useState } from 'react'
import {
  AlertTriangle,
  ArrowRight,
  Award,
  BadgeCheck,
  Banknote,
  Bell,
  Check,
  ChevronRight,
  ClipboardCheck,
  Fingerprint,
  LockKeyhole,
  MapPin,
  Radio,
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
  success: '#1F9D55',
  warning: '#F28C28',
}

const DEMO_STEPS = [
  { id: 1, title: 'EN ATTENTE' },
  { id: 2, title: 'POINTÉ' },
  { id: 3, title: 'ARCHIVE' },
]

const Text = ({ style, ...props }) => (
  <NativeText {...props} style={[{ fontFamily: 'Chivo-Regular' }, style]} />
)

function StaffCheckInScreen({ role = 'staff', onOpenAttendance }) {
  const [step, setStep] = useState(1)
  const [acknowledged, setAcknowledged] = useState(false)

  if (role !== 'staff') {
    return (
      <View style={styles.restricted}>
        <LockKeyhole color={COLORS.crimsonLight} size={25} />
        <Text style={styles.restrictedTitle}>ACCÈS RÉSERVÉ AU STAFF</Text>
        <Text style={styles.restrictedCopy}>
          Cet espace est disponible uniquement pour les coachs accrédités du club.
        </Text>
      </View>
    )
  }

  function handleCheckIn() {
    setStep(2)
    Alert.alert('Pointage enregistré', 'Votre présence est confirmée. Bienvenue sur le tatami.')
  }

  function handleAttendance() {
    if (onOpenAttendance) {
      onOpenAttendance()
      return
    }
    Alert.alert('Appel des élèves', 'Ouverture de la liste des 18 athlètes inscrits.')
  }

  function handleImpediment() {
    Alert.alert(
      'Signaler un empêchement ou retard',
      'Le club sera informé de votre indisponibilité. Confirmez auprès de la direction sportive.',
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
          <View accessibilityLabel="Profil staff" style={styles.avatar}>
            <UserRound color={COLORS.canvas} size={16} />
            <View style={styles.staffAvatarBadge}>
              <Text style={styles.staffAvatarText}>STAFF</Text>
            </View>
          </View>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.demoPanel}>
          <Text style={styles.demoCaption}>APERÇU DU PARCOURS STAFF</Text>
          <View style={styles.demoOptions}>
            {DEMO_STEPS.map((item) => {
              const selected = step === item.id
              return (
                <Pressable
                  accessibilityRole="button"
                  accessibilityState={{ selected }}
                  key={item.id}
                  onPress={() => {
                    setStep(item.id)
                    setAcknowledged(false)
                  }}
                  style={[styles.demoStep, selected && styles.demoStepActive]}
                >
                  <Text style={[styles.demoStepText, selected && styles.demoStepTextActive]}>
                    {item.id} · {item.title}
                  </Text>
                </Pressable>
              )
            })}
          </View>
        </View>

        {step === 1 ? (
          <CheckInPending onCheckIn={handleCheckIn} onImpediment={handleImpediment} />
        ) : step === 2 ? (
          <CheckInConfirmed onAttendance={handleAttendance} />
        ) : (
          <CheckInArchive
            acknowledged={acknowledged}
            onAcknowledge={() => {
              setAcknowledged(true)
              Alert.alert('Réception confirmée', 'Votre archive de séance est acquittée.')
            }}
          />
        )}
      </ScrollView>
    </View>
  )
}

function CheckInPending({ onCheckIn, onImpediment }) {
  return (
    <>
      <View style={styles.contextRow}>
        <View style={styles.contextLeft}>
          <View style={styles.liveDot} />
          <Text style={styles.contextEyebrow}>POINTAGE COACH & STAFF</Text>
        </View>
        <View style={styles.contextRight}>
          <Text style={styles.contextVenue}>DOJO BASTILLE</Text>
          <Text style={styles.contextMat}>MAT #01</Text>
        </View>
      </View>

      <View style={styles.pageHeading}>
        <Text accessibilityRole="header" style={styles.pageTitle}>SIGNALER MA PRÉSENCE</Text>
        <Text style={styles.pageSubtitle}>En attente de validation du coach</Text>
      </View>

      <View style={styles.coachCard}>
        <View style={styles.coachPortrait}>
          <Award color={COLORS.crimsonLight} size={25} strokeWidth={1.4} />
          <View style={styles.portraitStripe} />
        </View>
        <View style={styles.coachIdentity}>
          <Text style={styles.coachName}>PROF. MEHDI BENALI</Text>
          <Text style={styles.coachBelt}>FAIXA PRETA</Text>
          <Text style={styles.coachRole}>CDL BASTILLE HEAD COACH</Text>
        </View>
        <BadgeCheck color={COLORS.secondary} size={18} />
      </View>

      <SessionArtwork />

      <View style={styles.infoGrid}>
        <InfoCard
          label="THÉMATIQUE"
          value="Passage Torreando & Contrôle latéral"
          icon={Award}
        />
        <InfoCard
          label="AFFLUENCE"
          value="18 / 20 COMPLET · 90%"
          icon={UserRound}
          accent
        />
      </View>

      <Pressable
        accessibilityRole="button"
        onPress={onCheckIn}
        style={({ pressed }) => [styles.primaryButton, pressed && styles.pressed]}
      >
        <Fingerprint color={COLORS.primary} size={21} />
        <Text style={styles.primaryButtonText}>JE SUIS LÀ</Text>
      </Pressable>

      <Pressable
        accessibilityRole="button"
        onPress={onImpediment}
        style={({ pressed }) => [styles.impedimentButton, pressed && styles.pressed]}
      >
        <AlertTriangle color={COLORS.crimsonLight} size={14} />
        <Text style={styles.impedimentText}>SIGNALER UN EMPÊCHEMENT OU RETARD</Text>
      </Pressable>

      <Charter />
    </>
  )
}

function CheckInConfirmed({ onAttendance }) {
  return (
    <>
      <View style={styles.confirmedHeading}>
        <BadgeCheck color={COLORS.success} size={29} strokeWidth={1.8} />
        <View style={styles.confirmedHeadingCopy}>
          <Text style={styles.statusEyebrow}>POINTAGE STAFF VALIDÉ</Text>
          <Text accessibilityRole="header" style={styles.pageTitle}>PRÉSENCE CONFIRMÉE</Text>
        </View>
      </View>

      <View style={styles.beaconCard}>
        <View style={styles.beaconIcon}>
          <Radio color={COLORS.success} size={21} />
        </View>
        <View style={styles.beaconCopy}>
          <Text style={styles.beaconTitle}>PRÉSENCE ENREGISTRÉE À 15H04</Text>
          <Text style={styles.beaconDetail}>BALISE ACTIVE · STATUT : SUR LE TATAMI (ACTIF)</Text>
        </View>
        <View style={styles.activeDot} />
      </View>

      <SessionArtwork compact />

      <View style={styles.assistantRow}>
        <View style={styles.assistantAvatar}><Text style={styles.assistantInitial}>SL</Text></View>
        <View style={styles.assistantCopy}>
          <Text style={styles.assistantName}>SARAH LAMBERT</Text>
          <Text style={styles.assistantDetail}>Assistante Instructrice · Présente à 15h02</Text>
        </View>
        <BadgeCheck color={COLORS.success} size={16} />
      </View>

      <View style={styles.metricRow}>
        <View style={styles.metricCard}>
          <Text style={styles.metricLabel}>INSCRITS CONFIRMÉS</Text>
          <Text style={styles.metricValue}>18 / 20</Text>
          <Text style={styles.metricDetail}>PLACES OCCUPÉES</Text>
        </View>
        <View style={styles.metricCard}>
          <Text style={styles.metricLabel}>DÉBUT DE SÉANCE</Text>
          <Text style={styles.countdownValue}>11 MIN</Text>
          <Text style={styles.metricDetail}>15:15 · TAPIS 1</Text>
        </View>
      </View>

      <Pressable
        accessibilityRole="button"
        onPress={onAttendance}
        style={({ pressed }) => [styles.primaryButton, pressed && styles.pressed]}
      >
        <ClipboardCheck color={COLORS.primary} size={18} />
        <Text style={styles.primaryButtonText}>FAIRE L’APPEL DES ÉLÈVES (18)</Text>
        <ArrowRight color={COLORS.primary} size={18} />
      </Pressable>

      <Pressable
        accessibilityRole="button"
        onPress={() => Alert.alert('Programme technique', 'Passage Torreando & contrôle latéral.')}
        style={({ pressed }) => [styles.secondaryButton, pressed && styles.pressed]}
      >
        <Text style={styles.secondaryButtonText}>VOIR LE PROGRAMME TECHNIQUE</Text>
        <ChevronRight color={COLORS.secondary} size={16} />
      </Pressable>

      <View style={[styles.secondaryButton, styles.lockedButton]}>
        <LockKeyhole color={COLORS.muted} size={15} />
        <Text style={styles.lockedButtonText}>DÉCLARER FIN DE SÉANCE · DISPONIBLE À 16H30</Text>
      </View>

      <Charter />
    </>
  )
}

function CheckInArchive({ acknowledged, onAcknowledge }) {
  return (
    <>
      <View style={styles.archiveTitleRow}>
        <View style={styles.archiveHeadingCopy}>
          <Text style={styles.statusEyebrow}>DOSSIER DE SÉANCE</Text>
          <Text accessibilityRole="header" style={styles.pageTitle}>PRÉSENCE CONFIRMÉE</Text>
        </View>
        <View style={styles.archiveBadge}>
          <Check color={COLORS.success} size={12} />
          <Text style={styles.archiveBadgeText}>ARCHIVE CONFORME</Text>
        </View>
      </View>

      <View style={styles.directionCard}>
        <Text style={styles.directionTitle}>
          PRÉSENCE CONFIRMÉE PAR LA DIRECTION SPORTIVE
        </Text>
        <Text style={styles.directionDetail}>
          SUPERVISION DIRECTION SPORTIVE CDL · VALIDATION MANUELLE
        </Text>
        <View style={styles.signatureRow}>
          <View style={styles.signatureMark}><Text style={styles.signatureInitials}>MV</Text></View>
          <View style={styles.signatureCopy}>
            <Text style={styles.signatureName}>MARC V.</Text>
            <Text style={styles.signatureRole}>DIRECTION SPORTIVE</Text>
          </View>
          <BadgeCheck color={COLORS.success} size={18} />
        </View>
        <View style={styles.payrollBadge}>
          <Check color={COLORS.primary} size={12} />
          <Text style={styles.payrollBadgeText}>
            RÉGULARISÉ LE 24/10/2026 À 16H05 · VALIDE RÉMUNÉRATION
          </Text>
        </View>
      </View>

      <SessionArtwork compact audit />

      <View style={styles.card}>
        <Text style={styles.cardTitle}>RÉCAPITULATIF D’ÉMARGEMENT</Text>
        <View style={styles.archiveInfoRow}>
          <MapPin color={COLORS.secondary} size={15} />
          <Text style={styles.archiveInfoText}>JJB KIDS // MINI-LOUPS & FONDAMENTAUX</Text>
        </View>
        <View style={styles.archiveInfoRow}>
          <Award color={COLORS.secondary} size={15} />
          <Text style={styles.archiveInfoText}>24/10/2026 · 15:15 — 16:30 · TAPIS 1 (RDC)</Text>
        </View>
        <View style={styles.archiveInfoRow}>
          <ClipboardCheck color={COLORS.secondary} size={15} />
          <Text style={styles.archiveInfoText}>APPEL CLÔTURÉ PAR MEHDI B. À 16:28:11</Text>
        </View>
      </View>

      <View style={styles.payImpactCard}>
        <Banknote color={COLORS.crimson} size={21} />
        <View style={styles.payImpactCopy}>
          <Text style={styles.payImpactEyebrow}>IMPACT PAIE & VOLUME</Text>
          <Text style={styles.payImpactText}>
            +1.25h ajoutée au compteur mensuel (Octobre 2026)
          </Text>
        </View>
      </View>

      <Pressable
        accessibilityRole="button"
        onPress={onAcknowledge}
        style={({ pressed }) => [
          styles.primaryButton,
          acknowledged && styles.acknowledgedButton,
          pressed && styles.pressed,
        ]}
      >
        <Check color={COLORS.primary} size={17} />
        <Text style={styles.primaryButtonText}>
          {acknowledged ? 'RÉCEPTION ACCUSÉE' : 'ACCUSER RÉCEPTION'}
        </Text>
      </Pressable>
      <Pressable
        accessibilityRole="button"
        onPress={() => Alert.alert('Administration CDL', 'Contactez l’administration du club.')}
        style={({ pressed }) => [styles.contactLink, pressed && styles.pressed]}
      >
        <Text style={styles.contactLinkText}>CONTACTER L’ADMINISTRATION CDL</Text>
      </Pressable>
      <Charter />
    </>
  )
}

function SessionArtwork({ compact = false, audit = false }) {
  return (
    <View style={[styles.sessionArtwork, compact && styles.sessionArtworkCompact]}>
      <View style={styles.artworkGlow} />
      <View style={styles.artworkStripeA} />
      <View style={styles.artworkStripeB} />
      <View style={styles.artworkMat} />
      <View style={styles.artworkTopRow}>
        <View style={styles.artworkTag}>
          <MapPin color={COLORS.primary} size={10} />
          <Text style={styles.artworkTagText}>TAPIS 1 (RDC)</Text>
        </View>
        <View style={styles.artworkTag}>
          <Award color={COLORS.crimsonLight} size={10} />
          <Text style={styles.artworkTagText}>HEAD COACH</Text>
        </View>
      </View>
      <View style={styles.artworkTitleBlock}>
        <Text style={styles.artworkTitle}>JJB KIDS // MINI-LOUPS</Text>
        <Text style={styles.artworkSubtitle}>FONDAMENTAUX · 24 OCT · 15:15 — 16:30</Text>
      </View>
      {audit && (
        <View style={styles.auditBadge}>
          <Check color={COLORS.primary} size={11} />
          <Text style={styles.auditText}>AUDIT CONFORME</Text>
        </View>
      )}
    </View>
  )
}

function InfoCard({ label, value, icon: Icon, accent = false }) {
  return (
    <View style={styles.infoCard}>
      <View style={styles.infoHeading}>
        <Icon color={accent ? COLORS.crimson : COLORS.secondary} size={14} />
        <Text style={styles.infoLabel}>{label}</Text>
      </View>
      <Text style={[styles.infoValue, accent && styles.infoValueAccent]}>{value}</Text>
    </View>
  )
}

function Charter() {
  return (
    <View style={styles.charter}>
      <View style={styles.charterTitleRow}>
        <Award color={COLORS.secondary} size={15} />
        <Text style={styles.charterTitle}>CHARTE D’ENCADREMENT CDL TATAMI</Text>
      </View>
      <Text style={styles.charterText}>
        Le pointage certifie votre présence effective et votre disponibilité sur le tapis.
        Toute heure d’encadrement validée est enregistrée pour le suivi d’assurance et le
        calcul de la rémunération horaire selon les règles de la direction sportive.
      </Text>
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
    gap: 12,
  },
  headerIcon: {
    alignItems: 'center',
    height: 35,
    justifyContent: 'center',
    width: 35,
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
  staffAvatarBadge: {
    backgroundColor: COLORS.crimson,
    borderColor: COLORS.canvas,
    borderRadius: 3,
    borderWidth: 1,
    bottom: -3,
    paddingHorizontal: 3,
    position: 'absolute',
    right: -5,
  },
  staffAvatarText: {
    color: COLORS.primary,
    fontFamily: 'Anybody-Bold',
    fontSize: 5,
  },
  content: {
    paddingBottom: 22,
    paddingHorizontal: 17,
    paddingTop: 13,
  },
  demoPanel: {
    marginBottom: 17,
  },
  demoCaption: {
    color: COLORS.muted,
    fontFamily: 'Anybody-Bold',
    fontSize: 7,
    letterSpacing: 0.8,
    marginBottom: 6,
  },
  demoOptions: {
    flexDirection: 'row',
    gap: 5,
  },
  demoStep: {
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderColor: COLORS.border,
    borderRadius: 4,
    borderWidth: 1,
    flex: 1,
    justifyContent: 'center',
    minHeight: 30,
    paddingHorizontal: 5,
  },
  demoStepActive: {
    backgroundColor: COLORS.crimson,
    borderColor: COLORS.crimson,
  },
  demoStepText: {
    color: COLORS.secondary,
    fontFamily: 'Anybody-Bold',
    fontSize: 7,
  },
  demoStepTextActive: {
    color: COLORS.primary,
  },
  contextRow: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  contextLeft: {
    alignItems: 'center',
    flexDirection: 'row',
    flex: 1,
    gap: 6,
    marginRight: 7,
  },
  liveDot: {
    backgroundColor: COLORS.crimson,
    height: 7,
    width: 7,
  },
  contextEyebrow: {
    color: COLORS.crimsonLight,
    fontFamily: 'Anybody-Bold',
    fontSize: 8,
    letterSpacing: 0.5,
  },
  contextRight: {
    alignItems: 'flex-end',
  },
  contextVenue: {
    color: COLORS.primary,
    fontFamily: 'Anybody-Bold',
    fontSize: 8,
    letterSpacing: 0.4,
  },
  contextMat: {
    color: COLORS.secondary,
    fontFamily: 'Anybody-Bold',
    fontSize: 7,
    letterSpacing: 0.6,
    marginTop: 3,
  },
  pageHeading: {
    marginBottom: 14,
  },
  pageTitle: {
    color: COLORS.primary,
    fontFamily: 'Anybody-BlackItalic',
    fontSize: 27,
    letterSpacing: -0.5,
    lineHeight: 33,
  },
  pageSubtitle: {
    color: COLORS.secondary,
    fontSize: 11,
    marginTop: 4,
  },
  coachCard: {
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderColor: COLORS.border,
    borderRadius: 4,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 11,
    marginBottom: 11,
    padding: 11,
  },
  coachPortrait: {
    alignItems: 'center',
    backgroundColor: '#302020',
    borderColor: COLORS.border,
    borderRadius: 4,
    borderWidth: 1,
    height: 54,
    justifyContent: 'center',
    overflow: 'hidden',
    width: 54,
  },
  portraitStripe: {
    backgroundColor: 'rgba(255,255,255,0.12)',
    height: 80,
    position: 'absolute',
    transform: [{ rotate: '31deg' }],
    width: 12,
  },
  coachIdentity: {
    flex: 1,
  },
  coachName: {
    color: COLORS.primary,
    fontFamily: 'Anybody-Bold',
    fontSize: 11,
    letterSpacing: 0.25,
  },
  coachBelt: {
    color: COLORS.crimsonLight,
    fontFamily: 'Anybody-Bold',
    fontSize: 8,
    letterSpacing: 0.8,
    marginTop: 4,
  },
  coachRole: {
    color: COLORS.secondary,
    fontSize: 8,
    letterSpacing: 0.3,
    marginTop: 4,
  },
  sessionArtwork: {
    backgroundColor: '#352020',
    borderColor: COLORS.border,
    borderRadius: 4,
    borderWidth: 1,
    height: 178,
    justifyContent: 'space-between',
    marginBottom: 10,
    overflow: 'hidden',
    padding: 10,
  },
  sessionArtworkCompact: {
    height: 144,
  },
  artworkGlow: {
    backgroundColor: '#713131',
    height: 150,
    left: '12%',
    opacity: 0.65,
    position: 'absolute',
    top: 10,
    transform: [{ rotate: '-22deg' }],
    width: '78%',
  },
  artworkStripeA: {
    backgroundColor: 'rgba(255,255,255,0.12)',
    height: 260,
    left: '44%',
    position: 'absolute',
    top: -40,
    transform: [{ rotate: '29deg' }],
    width: 40,
  },
  artworkStripeB: {
    backgroundColor: 'rgba(0,0,0,0.35)',
    height: 260,
    left: '73%',
    position: 'absolute',
    top: -38,
    transform: [{ rotate: '29deg' }],
    width: 55,
  },
  artworkMat: {
    backgroundColor: 'rgba(11,11,11,0.52)',
    bottom: 0,
    height: 58,
    left: 0,
    position: 'absolute',
    right: 0,
  },
  artworkTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  artworkTag: {
    alignItems: 'center',
    backgroundColor: 'rgba(11,11,11,0.82)',
    borderColor: 'rgba(255,255,255,0.16)',
    borderRadius: 4,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 5,
    paddingHorizontal: 6,
    paddingVertical: 5,
  },
  artworkTagText: {
    color: COLORS.primary,
    fontFamily: 'Anybody-Bold',
    fontSize: 7,
    letterSpacing: 0.3,
  },
  artworkTitleBlock: {
    zIndex: 1,
  },
  artworkTitle: {
    color: COLORS.primary,
    fontFamily: 'Anybody-BlackItalic',
    fontSize: 14,
  },
  artworkSubtitle: {
    color: COLORS.secondary,
    fontSize: 8,
    marginTop: 4,
  },
  auditBadge: {
    alignItems: 'center',
    alignSelf: 'flex-end',
    backgroundColor: COLORS.success,
    borderRadius: 4,
    flexDirection: 'row',
    gap: 5,
    paddingHorizontal: 7,
    paddingVertical: 5,
    position: 'absolute',
    bottom: 9,
    right: 9,
    zIndex: 2,
  },
  auditText: {
    color: COLORS.primary,
    fontFamily: 'Anybody-Bold',
    fontSize: 7,
  },
  infoGrid: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 3,
  },
  infoCard: {
    backgroundColor: COLORS.surface,
    borderColor: COLORS.border,
    borderRadius: 4,
    borderWidth: 1,
    flex: 1,
    minHeight: 78,
    padding: 9,
  },
  infoHeading: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 6,
  },
  infoLabel: {
    color: COLORS.secondary,
    fontFamily: 'Anybody-Bold',
    fontSize: 7,
    letterSpacing: 0.4,
  },
  infoValue: {
    color: COLORS.primary,
    fontSize: 9,
    lineHeight: 14,
    marginTop: 8,
  },
  infoValueAccent: {
    color: COLORS.crimsonLight,
    fontFamily: 'Anybody-Bold',
  },
  primaryButton: {
    alignItems: 'center',
    backgroundColor: COLORS.crimson,
    borderRadius: 4,
    flexDirection: 'row',
    gap: 10,
    height: 54,
    justifyContent: 'center',
    marginTop: 13,
    paddingHorizontal: 10,
  },
  primaryButtonText: {
    color: COLORS.primary,
    flex: 1,
    fontFamily: 'Anybody-Bold',
    fontSize: 10,
    letterSpacing: 0.45,
    textAlign: 'center',
  },
  impedimentButton: {
    alignItems: 'center',
    alignSelf: 'center',
    flexDirection: 'row',
    gap: 6,
    justifyContent: 'center',
    marginTop: 11,
    minHeight: 32,
    paddingHorizontal: 8,
  },
  impedimentText: {
    color: COLORS.crimsonLight,
    fontFamily: 'Anybody-Bold',
    fontSize: 8,
    letterSpacing: 0.4,
  },
  charter: {
    borderTopColor: COLORS.border,
    borderTopWidth: 1,
    marginTop: 18,
    paddingTop: 12,
  },
  charterTitleRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 7,
  },
  charterTitle: {
    color: COLORS.secondary,
    fontFamily: 'Anybody-Bold',
    fontSize: 8,
    letterSpacing: 0.5,
  },
  charterText: {
    color: COLORS.secondary,
    fontSize: 9,
    lineHeight: 14,
    marginTop: 7,
  },
  confirmedHeading: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 10,
    marginBottom: 14,
  },
  confirmedHeadingCopy: {
    flex: 1,
  },
  statusEyebrow: {
    color: COLORS.success,
    fontFamily: 'Anybody-Bold',
    fontSize: 8,
    letterSpacing: 0.8,
    marginBottom: 4,
  },
  beaconCard: {
    alignItems: 'center',
    backgroundColor: COLORS.input,
    borderColor: COLORS.border,
    borderRadius: 4,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 9,
    marginBottom: 10,
    padding: 11,
  },
  beaconIcon: {
    alignItems: 'center',
    backgroundColor: '#10251A',
    borderRadius: 4,
    height: 38,
    justifyContent: 'center',
    width: 38,
  },
  beaconCopy: {
    flex: 1,
  },
  beaconTitle: {
    color: COLORS.primary,
    fontFamily: 'Anybody-Bold',
    fontSize: 8,
    letterSpacing: 0.25,
  },
  beaconDetail: {
    color: COLORS.success,
    fontFamily: 'Anybody-Bold',
    fontSize: 7,
    lineHeight: 12,
    marginTop: 4,
  },
  activeDot: {
    backgroundColor: COLORS.success,
    borderRadius: 5,
    height: 8,
    width: 8,
  },
  assistantRow: {
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderColor: COLORS.border,
    borderRadius: 4,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 9,
    marginBottom: 10,
    padding: 10,
  },
  assistantAvatar: {
    alignItems: 'center',
    backgroundColor: '#302020',
    borderRadius: 4,
    height: 34,
    justifyContent: 'center',
    width: 34,
  },
  assistantInitial: {
    color: COLORS.crimsonLight,
    fontFamily: 'Anybody-Bold',
    fontSize: 9,
  },
  assistantCopy: {
    flex: 1,
  },
  assistantName: {
    color: COLORS.primary,
    fontFamily: 'Anybody-Bold',
    fontSize: 9,
  },
  assistantDetail: {
    color: COLORS.secondary,
    fontSize: 8,
    marginTop: 4,
  },
  metricRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 2,
  },
  metricCard: {
    backgroundColor: COLORS.surface,
    borderColor: COLORS.border,
    borderRadius: 4,
    borderWidth: 1,
    flex: 1,
    minHeight: 94,
    padding: 10,
  },
  metricLabel: {
    color: COLORS.secondary,
    fontFamily: 'Anybody-Bold',
    fontSize: 7,
    letterSpacing: 0.3,
  },
  metricValue: {
    color: COLORS.primary,
    fontFamily: 'Anybody-BlackItalic',
    fontSize: 24,
    marginTop: 10,
  },
  countdownValue: {
    color: COLORS.crimson,
    fontFamily: 'Anybody-BlackItalic',
    fontSize: 24,
    marginTop: 10,
  },
  metricDetail: {
    color: COLORS.secondary,
    fontFamily: 'Anybody-Bold',
    fontSize: 7,
    letterSpacing: 0.3,
    marginTop: 3,
  },
  secondaryButton: {
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderColor: COLORS.border,
    borderRadius: 4,
    borderWidth: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 8,
    minHeight: 44,
    paddingHorizontal: 11,
  },
  secondaryButtonText: {
    color: COLORS.primary,
    flex: 1,
    fontFamily: 'Anybody-Bold',
    fontSize: 8,
    letterSpacing: 0.3,
    textAlign: 'center',
  },
  lockedButton: {
    backgroundColor: COLORS.input,
    justifyContent: 'flex-start',
    opacity: 0.55,
  },
  lockedButtonText: {
    color: COLORS.muted,
    flex: 1,
    fontFamily: 'Anybody-Bold',
    fontSize: 7,
    letterSpacing: 0.2,
    marginLeft: 8,
  },
  archiveTitleRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  archiveHeadingCopy: {
    flex: 1,
  },
  archiveBadge: {
    alignItems: 'center',
    backgroundColor: '#10251A',
    borderColor: '#21432F',
    borderRadius: 4,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 4,
    paddingHorizontal: 6,
    paddingVertical: 5,
  },
  archiveBadgeText: {
    color: COLORS.success,
    fontFamily: 'Anybody-Bold',
    fontSize: 6,
    letterSpacing: 0.2,
  },
  directionCard: {
    backgroundColor: COLORS.surface,
    borderColor: COLORS.border,
    borderLeftColor: COLORS.crimson,
    borderLeftWidth: 3,
    borderRadius: 4,
    borderWidth: 1,
    marginBottom: 11,
    padding: 12,
  },
  directionTitle: {
    color: COLORS.primary,
    fontFamily: 'Anybody-Bold',
    fontSize: 9,
    letterSpacing: 0.25,
    lineHeight: 14,
  },
  directionDetail: {
    color: COLORS.secondary,
    fontSize: 7,
    letterSpacing: 0.35,
    lineHeight: 12,
    marginTop: 4,
  },
  signatureRow: {
    alignItems: 'center',
    borderTopColor: COLORS.border,
    borderTopWidth: 1,
    flexDirection: 'row',
    gap: 9,
    marginTop: 11,
    paddingTop: 10,
  },
  signatureMark: {
    alignItems: 'center',
    backgroundColor: '#252527',
    borderColor: COLORS.border,
    borderRadius: 4,
    borderWidth: 1,
    height: 35,
    justifyContent: 'center',
    width: 35,
  },
  signatureInitials: {
    color: COLORS.primary,
    fontFamily: 'Anybody-BlackItalic',
    fontSize: 12,
  },
  signatureCopy: {
    flex: 1,
  },
  signatureName: {
    color: COLORS.primary,
    fontFamily: 'Anybody-Bold',
    fontSize: 9,
  },
  signatureRole: {
    color: COLORS.secondary,
    fontSize: 7,
    letterSpacing: 0.4,
    marginTop: 3,
  },
  payrollBadge: {
    alignItems: 'center',
    backgroundColor: COLORS.success,
    borderRadius: 4,
    flexDirection: 'row',
    gap: 5,
    marginTop: 10,
    paddingHorizontal: 7,
    paddingVertical: 6,
  },
  payrollBadgeText: {
    color: COLORS.primary,
    flex: 1,
    fontFamily: 'Anybody-Bold',
    fontSize: 6,
    letterSpacing: 0.12,
  },
  archiveInfoRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
    marginTop: 9,
  },
  archiveInfoText: {
    color: COLORS.secondary,
    flex: 1,
    fontSize: 8,
    lineHeight: 13,
  },
  payImpactCard: {
    alignItems: 'flex-start',
    backgroundColor: COLORS.surface,
    borderColor: COLORS.border,
    borderRadius: 4,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 10,
    marginBottom: 2,
    padding: 12,
  },
  payImpactCopy: {
    flex: 1,
  },
  payImpactEyebrow: {
    color: COLORS.secondary,
    fontFamily: 'Anybody-Bold',
    fontSize: 8,
    letterSpacing: 0.5,
  },
  payImpactText: {
    color: COLORS.crimson,
    fontFamily: 'Anybody-Bold',
    fontSize: 10,
    lineHeight: 15,
    marginTop: 5,
  },
  acknowledgedButton: {
    backgroundColor: COLORS.success,
  },
  contactLink: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 7,
    minHeight: 36,
  },
  contactLinkText: {
    color: COLORS.crimsonLight,
    fontFamily: 'Anybody-Bold',
    fontSize: 8,
    letterSpacing: 0.45,
  },
  restricted: {
    alignItems: 'center',
    backgroundColor: COLORS.canvas,
    flex: 1,
    justifyContent: 'center',
    padding: 28,
  },
  restrictedTitle: {
    color: COLORS.primary,
    fontFamily: 'Anybody-BlackItalic',
    fontSize: 18,
    marginTop: 13,
  },
  restrictedCopy: {
    color: COLORS.secondary,
    fontSize: 12,
    lineHeight: 18,
    marginTop: 8,
    textAlign: 'center',
  },
  pressed: {
    opacity: 0.78,
  },
})

export default StaffCheckInScreen
