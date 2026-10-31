import { useMemo, useState } from 'react'
import {
  AlertCircle,
  ArrowLeft,
  Check,
  LockKeyhole,
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
  border: '#28282C',
  primary: '#FFFFFF',
  secondary: '#9A9A9A',
  muted: '#555558',
  crimson: '#E5322D',
  crimsonLight: '#FFB4AB',
  success: '#1F9D55',
}

const FAMILY_MEMBERS = [
  {
    id: 'adult',
    name: 'Alexandre Dupont',
    label: 'MOI / TUTEUR LÉGAL',
    detail: 'Inéligible : Cours strictement réservé aux mineurs (KIDS/ADOS).',
    status: 'ineligible',
  },
  {
    id: 'leo',
    name: 'Léo Dupont',
    label: '8 ANS · KIDS',
    detail: 'Présence confirmée sur le Tapis 1.',
    status: 'enrolled',
  },
  {
    id: 'sarah',
    name: 'Sarah Dupont',
    label: '12 ANS · ADOS',
    detail: 'SECTION COMPÉTITION · SURCLASSEMENT POSSIBLE',
    status: 'eligible',
  },
]

const Text = ({ style, ...props }) => (
  <NativeText {...props} style={[{ fontFamily: 'Chivo-Regular' }, style]} />
)

function ParticipantSelectionScreen({
  onBack,
  onConfirm,
  session,
  parentName = 'Alexandre Dupont',
}) {
  const [selectedIds, setSelectedIds] = useState(['sarah'])
  const selectedMembers = useMemo(
    () => FAMILY_MEMBERS.filter((member) => selectedIds.includes(member.id)),
    [selectedIds],
  )

  function toggleMember(member) {
    if (member.status !== 'eligible') return
    setSelectedIds((current) =>
      current.includes(member.id)
        ? current.filter((id) => id !== member.id)
        : [...current, member.id],
    )
  }

  function confirmSelection() {
    if (selectedMembers.length === 0) {
      Alert.alert('Aucun participant sélectionné', 'Sélectionnez au moins un enfant éligible.')
      return
    }

    Alert.alert(
      'Réservation confirmée',
      `${selectedMembers.length} place${selectedMembers.length > 1 ? 's' : ''} réservée${selectedMembers.length > 1 ? 's' : ''} pour ${selectedMembers.map((member) => member.name).join(', ')}.`,
      [{ text: 'CONTINUER', onPress: () => onConfirm?.(selectedMembers) }],
    )
  }

  const sessionTitle = session?.title ?? 'JJB KIDS // MINI-LOUPS'

  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <Pressable
          accessibilityLabel="Retour au détail de la séance"
          accessibilityRole="button"
          onPress={onBack}
          style={({ pressed }) => [styles.headerButton, pressed && styles.pressed]}
        >
          <ArrowLeft color={COLORS.primary} size={20} />
        </Pressable>
        <Text accessibilityRole="header" style={styles.headerTitle}>
          CHOIX DU PARTICIPANT
        </Text>
        <View style={styles.avatar}>
          <UserRound color={COLORS.canvas} size={16} />
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.sessionSummary}>
          <View style={styles.sessionSummaryCopy}>
            <Text style={styles.eyebrow}>SÉANCE SÉLECTIONNÉE</Text>
            <Text style={styles.sessionTitle}>{sessionTitle}</Text>
            <Text style={styles.sessionMeta}>MERCREDI 24 OCTOBRE · 15H15 – 16H30</Text>
            <Text style={styles.sessionMeta}>TATAMI CENTRAL · CAMP DES LOUPS</Text>
          </View>
          <View style={styles.placesBadge}>
            <View style={styles.availabilityDot} />
            <Text style={styles.placesText}>5 PLACES RESTANTES</Text>
          </View>
        </View>

        <View style={styles.sectionHeading}>
          <Users color={COLORS.secondary} size={17} />
          <Text style={styles.sectionTitle}>POUR QUI RÉSERVEZ-VOUS ?</Text>
        </View>

        {FAMILY_MEMBERS.map((member) => {
          const selected = selectedIds.includes(member.id)
          const disabled = member.status !== 'eligible'
          return (
            <Pressable
              accessibilityLabel={`${member.name}, ${member.label}${disabled ? ', non sélectionnable' : ''}`}
              accessibilityRole="checkbox"
              accessibilityState={{ checked: selected, disabled }}
              disabled={disabled}
              key={member.id}
              onPress={() => toggleMember(member)}
              style={[
                styles.memberCard,
                member.status === 'ineligible' && styles.memberCardDisabled,
                selected && styles.memberCardSelected,
              ]}
            >
              <View style={styles.memberAvatar}>
                <Text style={styles.memberInitials}>
                  {member.name.split(' ').map((part) => part[0]).join('').toUpperCase()}
                </Text>
              </View>
              <View style={styles.memberCopy}>
                <View style={styles.memberNameRow}>
                  <Text style={styles.memberName}>{member.name.toUpperCase()}</Text>
                  {member.status === 'ineligible' ? (
                    <AlertCircle color={COLORS.secondary} size={15} />
                  ) : member.status === 'enrolled' ? (
                    <LockKeyhole color={COLORS.secondary} size={14} />
                  ) : null}
                </View>
                <Text style={styles.memberLabel}>{member.label}</Text>
                <Text
                  style={[
                    styles.memberDetail,
                    member.status === 'ineligible' && styles.memberDetailMuted,
                  ]}
                >
                  {member.detail}
                </Text>
                {member.status === 'enrolled' ? (
                  <View style={styles.lockedBadge}>
                    <LockKeyhole color={COLORS.secondary} size={11} />
                    <Text style={styles.lockedBadgeText}>DÉJÀ INSCRIT À CETTE SÉANCE</Text>
                  </View>
                ) : member.status === 'eligible' ? (
                  <View style={selected ? styles.selectedBadge : styles.eligibleBadge}>
                    <Text style={styles.statusBadgeText}>
                      {selected ? '🎟️ 1 PLACE SERA RÉSERVÉE' : 'ÉLIGIBLE'}
                    </Text>
                  </View>
                ) : null}
              </View>
              <View
                style={[
                  styles.checkbox,
                  selected && styles.checkboxSelected,
                  disabled && styles.checkboxDisabled,
                ]}
              >
                {selected && <Check color={COLORS.primary} size={14} strokeWidth={2.5} />}
              </View>
            </Pressable>
          )
        })}

        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>RÉCAPITULATIF DE LA SÉLECTION</Text>
          <Text style={styles.selectionCount}>
            {selectedMembers.length} {selectedMembers.length > 1 ? 'SÉLECTIONNÉS' : 'SÉLECTIONNÉ'}
          </Text>
          <Text style={styles.summaryText}>
            {selectedMembers.length === 0
              ? 'Aucune nouvelle inscription sélectionnée.'
              : `${selectedMembers.length} nouvelle inscription sélectionnée${selectedMembers.length > 1 ? 's' : ''} (${selectedMembers.map((member) => member.name).join(', ')}). Léo Dupont est déjà comptabilisé sur ce cours.`}
          </Text>
          <View style={styles.summaryDivider} />
          <View style={styles.balanceRow}>
            <Text style={styles.balanceLabel}>SOLDE RESTANT APRÈS RÉSERVATION</Text>
            <Text style={styles.balanceValue}>
              {Math.max(0, 8 - selectedMembers.length)} COURS
            </Text>
          </View>
          <Text style={styles.familyMeta}>
            DOSSIER FAMILLE {parentName.split(' ').slice(-1)[0].toUpperCase()} · 2/3 ACTIFS
          </Text>
        </View>

        <Pressable
          accessibilityRole="button"
          accessibilityState={{ disabled: selectedMembers.length === 0 }}
          disabled={selectedMembers.length === 0}
          onPress={confirmSelection}
          style={({ pressed }) => [
            styles.confirmButton,
            selectedMembers.length === 0 && styles.confirmButtonDisabled,
            pressed && styles.pressed,
          ]}
        >
          <Text style={styles.confirmButtonText}>CONFIRMER LA RÉSERVATION</Text>
        </Pressable>
        <Text style={styles.disclaimer}>
          Valider l’inscription de {selectedMembers.map((member) => member.name).join(', ') || 'votre enfant'}.
          Annulation sans pénalité possible jusqu’à 2h avant le début de la session.
        </Text>
      </ScrollView>
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
    paddingHorizontal: 12,
  },
  headerButton: {
    alignItems: 'center',
    height: 38,
    justifyContent: 'center',
    width: 38,
  },
  headerTitle: {
    color: COLORS.primary,
    flex: 1,
    fontFamily: 'Anybody-BlackItalic',
    fontSize: 13,
    textAlign: 'center',
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
    paddingBottom: 28,
    paddingHorizontal: 17,
    paddingTop: 16,
  },
  sessionSummary: {
    backgroundColor: COLORS.surface,
    borderColor: COLORS.border,
    borderLeftColor: COLORS.crimson,
    borderLeftWidth: 3,
    borderRadius: 4,
    borderWidth: 1,
    marginBottom: 21,
    padding: 13,
  },
  sessionSummaryCopy: {
    marginBottom: 10,
  },
  eyebrow: {
    color: COLORS.crimsonLight,
    fontFamily: 'Anybody-Bold',
    fontSize: 8,
    letterSpacing: 0.8,
    marginBottom: 5,
  },
  sessionTitle: {
    color: COLORS.primary,
    fontFamily: 'Anybody-BlackItalic',
    fontSize: 18,
    lineHeight: 23,
  },
  sessionMeta: {
    color: COLORS.secondary,
    fontSize: 9,
    letterSpacing: 0.35,
    marginTop: 5,
  },
  placesBadge: {
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: '#3A1B1C',
    borderRadius: 4,
    flexDirection: 'row',
    gap: 6,
    paddingHorizontal: 8,
    paddingVertical: 6,
  },
  availabilityDot: {
    backgroundColor: COLORS.crimson,
    height: 6,
    width: 6,
  },
  placesText: {
    color: COLORS.crimsonLight,
    fontFamily: 'Anybody-Bold',
    fontSize: 8,
    letterSpacing: 0.3,
  },
  sectionHeading: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
    marginBottom: 10,
  },
  sectionTitle: {
    color: COLORS.primary,
    fontFamily: 'Anybody-Bold',
    fontSize: 11,
    letterSpacing: 0.45,
  },
  memberCard: {
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderColor: COLORS.border,
    borderRadius: 4,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 10,
    marginBottom: 9,
    padding: 11,
  },
  memberCardSelected: {
    borderColor: COLORS.crimson,
  },
  memberCardDisabled: {
    opacity: 0.5,
  },
  memberAvatar: {
    alignItems: 'center',
    backgroundColor: COLORS.input,
    borderColor: COLORS.border,
    borderRadius: 4,
    borderWidth: 1,
    height: 40,
    justifyContent: 'center',
    width: 40,
  },
  memberInitials: {
    color: COLORS.primary,
    fontFamily: 'Anybody-Bold',
    fontSize: 10,
  },
  memberCopy: {
    flex: 1,
  },
  memberNameRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 5,
  },
  memberName: {
    color: COLORS.primary,
    flex: 1,
    fontFamily: 'Anybody-Bold',
    fontSize: 10,
    letterSpacing: 0.2,
  },
  memberLabel: {
    color: COLORS.secondary,
    fontFamily: 'Anybody-Bold',
    fontSize: 7,
    letterSpacing: 0.5,
    marginTop: 4,
  },
  memberDetail: {
    color: COLORS.secondary,
    fontSize: 9,
    lineHeight: 14,
    marginTop: 5,
  },
  memberDetailMuted: {
    color: COLORS.secondary,
  },
  lockedBadge: {
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: COLORS.input,
    borderColor: COLORS.border,
    borderRadius: 4,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 5,
    marginTop: 7,
    paddingHorizontal: 6,
    paddingVertical: 4,
  },
  lockedBadgeText: {
    color: COLORS.secondary,
    fontFamily: 'Anybody-Bold',
    fontSize: 7,
    letterSpacing: 0.2,
  },
  selectedBadge: {
    alignSelf: 'flex-start',
    backgroundColor: COLORS.crimson,
    borderRadius: 4,
    marginTop: 7,
    paddingHorizontal: 6,
    paddingVertical: 4,
  },
  eligibleBadge: {
    alignSelf: 'flex-start',
    backgroundColor: COLORS.success,
    borderRadius: 4,
    marginTop: 7,
    paddingHorizontal: 6,
    paddingVertical: 4,
  },
  statusBadgeText: {
    color: COLORS.primary,
    fontFamily: 'Anybody-Bold',
    fontSize: 7,
    letterSpacing: 0.2,
  },
  checkbox: {
    alignItems: 'center',
    backgroundColor: COLORS.input,
    borderColor: COLORS.secondary,
    borderRadius: 4,
    borderWidth: 1,
    height: 22,
    justifyContent: 'center',
    width: 22,
  },
  checkboxSelected: {
    backgroundColor: COLORS.crimson,
    borderColor: COLORS.crimson,
  },
  checkboxDisabled: {
    borderColor: COLORS.muted,
  },
  summaryCard: {
    backgroundColor: COLORS.surface,
    borderColor: COLORS.border,
    borderRadius: 4,
    borderWidth: 1,
    marginTop: 5,
    padding: 13,
  },
  summaryTitle: {
    color: COLORS.secondary,
    fontFamily: 'Anybody-Bold',
    fontSize: 8,
    letterSpacing: 0.65,
  },
  selectionCount: {
    color: COLORS.primary,
    fontFamily: 'Anybody-BlackItalic',
    fontSize: 22,
    marginTop: 8,
  },
  summaryText: {
    color: COLORS.secondary,
    fontSize: 10,
    lineHeight: 16,
    marginTop: 5,
  },
  summaryDivider: {
    backgroundColor: COLORS.border,
    height: 1,
    marginVertical: 11,
  },
  balanceRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  balanceLabel: {
    color: COLORS.secondary,
    flex: 1,
    fontFamily: 'Anybody-Bold',
    fontSize: 7,
    letterSpacing: 0.2,
  },
  balanceValue: {
    color: COLORS.primary,
    fontFamily: 'Anybody-Bold',
    fontSize: 9,
  },
  familyMeta: {
    color: COLORS.muted,
    fontFamily: 'Anybody-Bold',
    fontSize: 7,
    letterSpacing: 0.55,
    marginTop: 8,
  },
  confirmButton: {
    alignItems: 'center',
    backgroundColor: COLORS.crimson,
    borderRadius: 4,
    justifyContent: 'center',
    marginTop: 14,
    minHeight: 54,
    paddingHorizontal: 12,
  },
  confirmButtonDisabled: {
    opacity: 0.45,
  },
  confirmButtonText: {
    color: COLORS.primary,
    fontFamily: 'Anybody-Bold',
    fontSize: 10,
    letterSpacing: 0.4,
    textAlign: 'center',
  },
  disclaimer: {
    color: COLORS.secondary,
    fontSize: 9,
    lineHeight: 14,
    marginTop: 9,
    textAlign: 'center',
  },
  pressed: {
    opacity: 0.78,
  },
})

export default ParticipantSelectionScreen
