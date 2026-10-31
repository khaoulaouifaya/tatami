import {
  ChevronRight,
  ShieldCheck,
  ShieldX,
  UserRound,
} from 'lucide-react-native'
import {
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

const Text = ({ style, ...props }) => (
  <NativeText {...props} style={[{ fontFamily: 'Chivo-Regular' }, style]} />
)

function getAge(dateString) {
  const [day, month, year] = (dateString ?? '').split('/').map(Number)
  if (!day || !month || !year) return null

  const today = new Date()
  let age = today.getFullYear() - year
  if (
    today.getMonth() + 1 < month ||
    (today.getMonth() + 1 === month && today.getDate() < day)
  ) {
    age -= 1
  }
  return age
}

function getAgeCategory(dateString) {
  const age = getAge(dateString)
  if (age === null) return 'CATÉGORIE À COMPLÉTER'
  if (age < 6) return 'BABY'
  if (age < 12) return 'KIDS'
  return 'ADOS'
}

function ChildrenListScreen({ childProfiles = [], onSelectChild, onAddChild }) {
  return (
    <View style={styles.screen}>
      <View style={styles.heading}>
        <Text style={styles.eyebrow}>06 . COMPTE PARENT</Text>
        <Text accessibilityRole="header" style={styles.title}>MES ENFANTS</Text>
        <Text style={styles.subtitle}>GÉRER LES PROFILS LIÉS À VOTRE COMPTE</Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      >
        {childProfiles.length === 0 ? (
          <View style={styles.emptyState}>
            <UserRound color={COLORS.secondary} size={25} strokeWidth={1.5} />
            <Text style={styles.emptyText}>
              Aucun enfant enregistré sur ce compte parent.
            </Text>
          </View>
        ) : (
          childProfiles.map((child) => {
            const CertificateIcon = child.certificateValid ? ShieldCheck : ShieldX
            return (
              <Pressable
                accessibilityLabel={`Ouvrir la fiche de ${child.firstName} ${child.lastName}`}
                accessibilityRole="button"
                key={child.id}
                onPress={() => onSelectChild?.(child)}
                style={({ pressed }) => [styles.childCard, pressed && styles.pressed]}
              >
                <View style={styles.avatar}>
                  <Text style={styles.avatarText}>
                    {(child.firstName?.[0] ?? '?').toUpperCase()}
                  </Text>
                </View>
                <View style={styles.childDetails}>
                  <Text style={styles.childName}>
                    {`${child.firstName} ${child.lastName}`.trim().toUpperCase()}
                  </Text>
                  <Text style={styles.category}>{getAgeCategory(child.birthDate)}</Text>
                  <View
                    style={[
                      styles.certificateBadge,
                      child.certificateValid
                        ? styles.certificateValid
                        : styles.certificateMissing,
                    ]}
                  >
                    <CertificateIcon color={COLORS.primary} size={12} />
                    <Text style={styles.certificateText}>
                      {child.certificateValid ? 'VALIDE' : 'MANQUANT'}
                    </Text>
                  </View>
                </View>
                <ChevronRight color={COLORS.secondary} size={20} />
              </Pressable>
            )
          })
        )}
      </ScrollView>

      <Pressable
        accessibilityRole="button"
        onPress={onAddChild}
        style={({ pressed }) => [styles.addButton, pressed && styles.pressed]}
      >
        <Text style={styles.addButtonText}>AJOUTER UN ENFANT</Text>
      </Pressable>
    </View>
  )
}

const styles = StyleSheet.create({
  screen: {
    backgroundColor: COLORS.canvas,
    flex: 1,
    paddingHorizontal: 18,
    paddingTop: 18,
  },
  heading: {
    marginBottom: 18,
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
  listContent: {
    flexGrow: 1,
    gap: 10,
    paddingBottom: 16,
  },
  childCard: {
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderColor: COLORS.border,
    borderRadius: 4,
    borderWidth: 1,
    flexDirection: 'row',
    minHeight: 98,
    paddingHorizontal: 13,
    paddingVertical: 12,
  },
  avatar: {
    alignItems: 'center',
    backgroundColor: COLORS.canvas,
    borderColor: COLORS.border,
    borderRadius: 4,
    borderWidth: 1,
    height: 48,
    justifyContent: 'center',
    marginRight: 12,
    width: 48,
  },
  avatarText: {
    color: COLORS.primary,
    fontFamily: 'Anybody-BlackItalic',
    fontSize: 21,
  },
  childDetails: {
    flex: 1,
  },
  childName: {
    color: COLORS.primary,
    fontFamily: 'Anybody-Bold',
    fontSize: 12,
    letterSpacing: 0.3,
  },
  category: {
    color: COLORS.secondary,
    fontSize: 9,
    letterSpacing: 0.8,
    marginTop: 4,
  },
  certificateBadge: {
    alignItems: 'center',
    alignSelf: 'flex-start',
    borderRadius: 4,
    flexDirection: 'row',
    gap: 5,
    marginTop: 8,
    paddingHorizontal: 7,
    paddingVertical: 4,
  },
  certificateValid: {
    backgroundColor: COLORS.success,
  },
  certificateMissing: {
    backgroundColor: COLORS.crimson,
  },
  certificateText: {
    color: COLORS.primary,
    fontFamily: 'Anybody-Bold',
    fontSize: 8,
    letterSpacing: 0.5,
  },
  emptyState: {
    alignItems: 'center',
    borderColor: COLORS.border,
    borderRadius: 4,
    borderWidth: 1,
    justifyContent: 'center',
    marginTop: 28,
    minHeight: 150,
    padding: 20,
  },
  emptyText: {
    color: COLORS.secondary,
    fontSize: 12,
    lineHeight: 19,
    marginTop: 12,
    textAlign: 'center',
  },
  addButton: {
    alignItems: 'center',
    backgroundColor: COLORS.crimson,
    borderRadius: 4,
    justifyContent: 'center',
    marginBottom: 12,
    minHeight: 54,
  },
  addButtonText: {
    color: COLORS.primary,
    fontFamily: 'Anybody-Bold',
    fontSize: 11,
    letterSpacing: 0.7,
  },
  pressed: {
    opacity: 0.78,
  },
})

export default ChildrenListScreen
