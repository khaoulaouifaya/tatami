import { useState } from 'react'
import {
  ArrowLeft,
  Bookmark,
  Check,
  Lightbulb,
  Maximize,
  Pause,
  Play,
  Repeat,
  Share,
  Square,
  Target,
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
  white: '#FFFFFF',
  secondary: '#9A9A9A',
  muted: '#626267',
  red: '#E5322D',
  redLight: '#FFB4AB',
}

const STEPS = [
  {
    number: '01',
    title: 'GRIP FIGHTING & ASSISE',
    description: 'Saisir les deux revers au niveau des tibias et garder une posture stable.',
    time: '00:24',
    seconds: 24,
  },
  {
    number: '02',
    title: 'DÉSAXAGE & RUPTURE D’AXE',
    description: 'Déplacer les jambes en diagonale pour contourner la ligne de défense.',
    time: '01:42',
    seconds: 102,
  },
  {
    number: '03',
    title: 'FIXATION LATÉRALE 100 KG',
    description: 'Descendre l’assise, libérer les jambes et stabiliser le contrôle latéral.',
    time: '03:10',
    seconds: 190,
  },
]

const Text = ({ style, ...props }) => (
  <NativeText {...props} style={[{ color: COLORS.white, fontFamily: 'Chivo-Regular' }, style]} />
)

function TechniqueDetailScreen({ onBack, role = 'adult' }) {
  const [bookmarked, setBookmarked] = useState(false)
  const [playing, setPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(134)
  const [reps, setReps] = useState(18)
  const [repsGoalValidated, setRepsGoalValidated] = useState(false)
  const [speed, setSpeed] = useState(1)

  const progress = (currentTime / 270) * 100

  function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60).toString().padStart(2, '0')
    const remainder = Math.floor(seconds % 60).toString().padStart(2, '0')
    return `${minutes}:${remainder}`
  }

  function validateReps() {
    if (repsGoalValidated) {
      setRepsGoalValidated(false)
      setReps((count) => Math.max(0, count - 10))
      return
    }
    setRepsGoalValidated(true)
    setReps((count) => count + 10)
  }

  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <Pressable
          accessibilityLabel="Retour"
          accessibilityRole="button"
          onPress={onBack}
          style={styles.headerButton}
        >
          <ArrowLeft color={COLORS.white} size={20} />
        </Pressable>
        <Text numberOfLines={1} style={styles.headerTitle}>TECHNIQUE DÉTAILLÉE</Text>
        <Pressable
          accessibilityLabel={bookmarked ? 'Retirer des favoris' : 'Ajouter aux favoris'}
          accessibilityRole="button"
          accessibilityState={{ selected: bookmarked }}
          onPress={() => setBookmarked((value) => !value)}
          style={styles.headerButton}
        >
          <Bookmark color={bookmarked ? COLORS.redLight : COLORS.white} fill={bookmarked ? COLORS.redLight : 'transparent'} size={18} />
        </Pressable>
        <Pressable
          accessibilityLabel="Partager la technique"
          accessibilityRole="button"
          onPress={() => Alert.alert('Partager', 'Le partage de cette technique sera disponible prochainement.')}
          style={styles.headerButton}
        >
          <Share color={COLORS.white} size={18} />
        </Pressable>
        <View style={styles.avatar}>
          <Text style={styles.avatarInitial}>{role === 'staff' ? 'M' : 'A'}</Text>
          <View style={styles.roleBadge}>
            <Text style={styles.roleBadgeText}>{role === 'staff' ? 'STAFF' : 'ATHLETE'}</Text>
          </View>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.player}>
          <View style={styles.playerScene}>
            <View style={styles.sceneMat}>
              <View style={styles.sceneCenterLine} />
              <View style={styles.sceneCircle} />
            </View>
            <View style={styles.sceneFighterOne} />
            <View style={styles.sceneFighterTwo} />
            <View style={styles.sceneLimbOne} />
            <View style={styles.sceneLimbTwo} />
          </View>
          <View style={styles.playerTop}>
            <Text style={styles.qualityBadge}>• QUALITÉ HD • MULTI-ANGLES</Text>
            <Text style={styles.dojoBadge}>DOJO BASTILLE</Text>
          </View>
          <View pointerEvents="box-none" style={styles.playOverlay}>
            <Pressable
              accessibilityLabel={playing ? 'Mettre en pause' : 'Lire la vidéo'}
              accessibilityRole="button"
              onPress={() => setPlaying((value) => !value)}
              style={styles.youtubeButton}
            >
              {playing
                ? <Pause color={COLORS.white} fill={COLORS.white} size={20} />
                : <Play color={COLORS.white} fill={COLORS.white} size={21} />}
            </Pressable>
          </View>
          <View style={styles.playerControls}>
            <Pressable
              accessibilityLabel={playing ? 'Pause' : 'Lecture'}
              accessibilityRole="button"
              onPress={() => setPlaying((value) => !value)}
              style={styles.controlButton}
            >
              {playing
                ? <Pause color={COLORS.white} size={15} />
                : <Play color={COLORS.white} fill={COLORS.white} size={15} />}
            </Pressable>
            <Text style={styles.timeText}>{formatTime(currentTime)} / 04:30</Text>
            <View style={styles.controlSpacer} />
            <Pressable
              accessibilityLabel={`Vitesse ${speed.toFixed(1)}x`}
              accessibilityRole="button"
              onPress={() => setSpeed((value) => value === 1 ? 1.25 : value === 1.25 ? 1.5 : 1)}
              style={styles.speedButton}
            >
              <Text style={styles.speedText}>{speed.toFixed(1)}X</Text>
            </Pressable>
            <Pressable
              accessibilityLabel="Recommencer la vidéo"
              accessibilityRole="button"
              onPress={() => {
                setCurrentTime(0)
                setPlaying(true)
              }}
              style={styles.controlButton}
            >
              <Repeat color={COLORS.white} size={16} />
            </Pressable>
            <Pressable
              accessibilityLabel="Plein écran"
              accessibilityRole="button"
              onPress={() => Alert.alert('Plein écran', 'Le lecteur est affiché en mode démo.')}
              style={styles.controlButton}
            >
              <Maximize color={COLORS.white} size={16} />
            </Pressable>
          </View>
          <View style={styles.playerProgressTrack}>
            <View style={[styles.playerProgressFill, { width: `${progress}%` }]} />
          </View>
        </View>

        <View style={styles.techniqueHeading}>
          <Text style={styles.eyebrow}>◼ PASSAGE DE GARDE // FONDAMENTAUX CDL</Text>
          <Text accessibilityRole="header" style={styles.title}>PASSAGE TORREANDO CLASSIQUE</Text>
          <Text style={styles.credits}>
            Par Prof. Mehdi Benali (Ceinture Noire 2e Degré) • Uke : Thomas R.
          </Text>
          <View style={styles.categoryRow}>
            <View style={styles.categoryActive}><Text style={styles.categoryActiveText}>PASSAGE DE GARDE</Text></View>
            <View style={styles.category}><Text style={styles.categoryText}>FONDAMENTAUX / BLANCHE</Text></View>
          </View>
        </View>

        <View style={styles.descriptionCard}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleGroup}>
              <Lightbulb color={COLORS.redLight} size={17} />
              <Text style={styles.sectionTitle}>DESCRIPTION PÉDAGOGIQUE</Text>
            </View>
            <Text style={styles.syllabus}>CDL SYLLABUS</Text>
          </View>
          <Text style={styles.description}>
            Le passage Torreando (ou « Bullfighter Pass ») est la clé de voûte de rupture contre
            la garde ouverte. Il neutralise la garde par un contrôle bilatéral des revers de
            pantalon aux tibias, suivi d&apos;une feinte de désaxage foudroyante et d&apos;un
            abaissement d&apos;assise vers le contrôle latéral 100 kg.
          </Text>
        </View>

        <View style={styles.sectionHeading}>
          <Target color={COLORS.redLight} size={15} />
          <Text style={styles.sectionHeadingText}>POINTS DE CONTRÔLE CRITIQUES • 3 ÉTAPES</Text>
        </View>
        <View style={styles.steps}>
          {STEPS.map((step) => (
            <Pressable
              accessibilityLabel={`Aller à ${step.time}, ${step.title}`}
              accessibilityRole="button"
              key={step.number}
              onPress={() => {
                setCurrentTime(step.seconds)
                setPlaying(true)
              }}
              style={({ pressed }) => [styles.stepCard, pressed && styles.pressed]}
            >
              <View style={styles.stepNumber}><Text style={styles.stepNumberText}>{step.number}</Text></View>
              <View style={styles.stepCopy}>
                <Text style={styles.stepTitle}>{step.title}</Text>
                <Text style={styles.stepDescription}>{step.description}</Text>
              </View>
              <Text style={styles.stepTime}>{step.time}</Text>
            </Pressable>
          ))}
        </View>

        <View style={styles.masteryCard}>
          <View style={styles.masteryHeader}>
            <Text style={styles.masteryTitle}>MAÎTRISE PERSONNELLE</Text>
            <View style={styles.masteryBadge}><Text style={styles.masteryBadgeText}>EN COURS D’ACQUISITION</Text></View>
          </View>
          <Text style={styles.repsText}>Drills enregistrés (Tatami Bastille) : <Text style={styles.repsCount}>{reps} / 50 REPS</Text></Text>
          <View style={styles.masteryProgressTrack}>
            <View style={[styles.masteryProgressFill, { width: `${Math.min(100, (reps / 50) * 100)}%` }]} />
          </View>
          <Pressable
            accessibilityRole="checkbox"
            accessibilityState={{ checked: repsGoalValidated }}
            onPress={validateReps}
            style={({ pressed }) => [styles.validateRow, pressed && styles.pressed]}
          >
            {repsGoalValidated
              ? <Check color={COLORS.redLight} size={17} />
              : <Square color={COLORS.secondary} size={17} />}
            <Text style={styles.validateText}>
              {repsGoalValidated ? '10 REPS VALIDÉES AU PROCHAIN DOJO' : 'VALIDER 10 REPS AU PROCHAIN DOJO'}
            </Text>
          </Pressable>
        </View>

        <View style={styles.sectionHeading}>
          <Target color={COLORS.redLight} size={15} />
          <Text style={styles.sectionHeadingText}>COMBINAISONS & VARIANTES • CURSUS CDL</Text>
        </View>
        <View style={styles.variants}>
          <VariantCard
            duration="03:15"
            title="SMASH PASS DIRECT"
            subtitle="Enchaînement si l’adversaire..."
          />
          <VariantCard
            duration="05:40"
            title="LEG DRAG COMBO"
            subtitle="Désaxage profond hand..."
          />
        </View>
      </ScrollView>
    </View>
  )
}

function VariantCard({ duration, title, subtitle }) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={() => Alert.alert(title, 'Cette variante sera bientôt disponible.')}
      style={styles.variantCard}
    >
      <View style={styles.variantArtwork}>
        <View style={styles.variantCircle} />
        <View style={styles.variantLine} />
        <View style={styles.variantPlay}>
          <Play color={COLORS.white} fill={COLORS.white} size={14} />
        </View>
        <Text style={styles.variantDuration}>{duration}</Text>
      </View>
      <View style={styles.variantCopy}>
        <Text numberOfLines={1} style={styles.variantTitle}>{title}</Text>
        <Text numberOfLines={1} style={styles.variantSubtitle}>{subtitle}</Text>
      </View>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  screen: { backgroundColor: COLORS.canvas, flex: 1 },
  header: { alignItems: 'center', borderBottomColor: COLORS.border, borderBottomWidth: 1, flexDirection: 'row', height: 52, paddingHorizontal: 9 },
  headerButton: { alignItems: 'center', height: 36, justifyContent: 'center', width: 34 },
  headerTitle: { color: COLORS.white, flex: 1, fontFamily: 'Anybody-BlackItalic', fontSize: 11, letterSpacing: 0.35, textAlign: 'center' },
  avatar: { alignItems: 'center', backgroundColor: COLORS.redLight, borderRadius: 18, height: 31, justifyContent: 'center', marginLeft: 4, width: 31 },
  avatarInitial: { color: COLORS.canvas, fontFamily: 'Anybody-Bold', fontSize: 11 },
  roleBadge: { backgroundColor: COLORS.red, borderColor: COLORS.canvas, borderRadius: 2, borderWidth: 1, bottom: -4, paddingHorizontal: 3, position: 'absolute', right: -6 },
  roleBadgeText: { color: COLORS.white, fontFamily: 'Anybody-Bold', fontSize: 5 },
  content: { paddingBottom: 24, paddingHorizontal: 14, paddingTop: 10 },
  player: { backgroundColor: COLORS.input, borderColor: COLORS.border, borderRadius: 4, borderWidth: 1, height: 226, overflow: 'hidden' },
  playerScene: { ...StyleSheet.absoluteFillObject, alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
  sceneMat: { alignItems: 'center', borderColor: '#343437', borderWidth: 1, height: 157, justifyContent: 'center', transform: [{ rotate: '-7deg' }], width: '83%' },
  sceneCenterLine: { backgroundColor: '#343437', height: 1, position: 'absolute', width: '100%' },
  sceneCircle: { borderColor: '#343437', borderRadius: 30, borderWidth: 1, height: 60, width: 60 },
  sceneFighterOne: { backgroundColor: '#8D282A', borderRadius: 22, height: 26, left: '35%', position: 'absolute', top: '39%', transform: [{ rotate: '25deg' }], width: 82 },
  sceneFighterTwo: { backgroundColor: '#C4B8A7', borderRadius: 20, height: 24, position: 'absolute', right: '26%', top: '51%', transform: [{ rotate: '-22deg' }], width: 72 },
  sceneLimbOne: { backgroundColor: '#A8443D', borderRadius: 8, height: 11, left: '27%', position: 'absolute', top: '58%', transform: [{ rotate: '-35deg' }], width: 63 },
  sceneLimbTwo: { backgroundColor: '#B5A795', borderRadius: 8, height: 10, position: 'absolute', right: '20%', top: '40%', transform: [{ rotate: '42deg' }], width: 58 },
  playerTop: { alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between', left: 8, position: 'absolute', right: 8, top: 8, zIndex: 2 },
  qualityBadge: { backgroundColor: '#111111D9', color: COLORS.redLight, fontFamily: 'Anybody-Bold', fontSize: 6, paddingHorizontal: 6, paddingVertical: 5 },
  dojoBadge: { backgroundColor: '#111111D9', color: COLORS.white, fontFamily: 'Anybody-Bold', fontSize: 6, paddingHorizontal: 6, paddingVertical: 5 },
  playOverlay: { alignItems: 'center', bottom: 30, justifyContent: 'center', left: 0, position: 'absolute', right: 0, top: 0, zIndex: 1 },
  youtubeButton: { alignItems: 'center', backgroundColor: COLORS.red, borderRadius: 12, height: 44, justifyContent: 'center', paddingLeft: 3, width: 64 },
  playerControls: { alignItems: 'center', backgroundColor: '#050505E8', bottom: 3, flexDirection: 'row', height: 35, left: 0, paddingHorizontal: 7, position: 'absolute', right: 0, zIndex: 2 },
  controlButton: { alignItems: 'center', height: 30, justifyContent: 'center', width: 28 },
  timeText: { color: COLORS.white, fontFamily: 'Chivo-Regular', fontSize: 8, marginLeft: 3 },
  controlSpacer: { flex: 1 },
  speedButton: { alignItems: 'center', borderColor: COLORS.red, borderRadius: 3, borderWidth: 1, height: 21, justifyContent: 'center', marginHorizontal: 3, width: 37 },
  speedText: { color: COLORS.redLight, fontFamily: 'Anybody-Bold', fontSize: 7 },
  playerProgressTrack: { backgroundColor: '#555558', bottom: 0, height: 3, left: 0, position: 'absolute', right: 0, zIndex: 3 },
  playerProgressFill: { backgroundColor: COLORS.red, height: '100%' },
  techniqueHeading: { paddingBottom: 12, paddingTop: 13 },
  eyebrow: { color: COLORS.redLight, fontFamily: 'Anybody-Bold', fontSize: 7, letterSpacing: 0.35 },
  title: { color: COLORS.white, fontFamily: 'Anybody-BlackItalic', fontSize: 26, letterSpacing: -0.5, lineHeight: 30, marginTop: 6 },
  credits: { color: COLORS.secondary, fontSize: 9, lineHeight: 14, marginTop: 5 },
  categoryRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 9 },
  categoryActive: { backgroundColor: COLORS.red, borderRadius: 4, paddingHorizontal: 8, paddingVertical: 6 },
  categoryActiveText: { color: COLORS.white, fontFamily: 'Anybody-Bold', fontSize: 7 },
  category: { backgroundColor: COLORS.surface, borderColor: COLORS.border, borderRadius: 4, borderWidth: 1, paddingHorizontal: 8, paddingVertical: 6 },
  categoryText: { color: COLORS.secondary, fontFamily: 'Anybody-Bold', fontSize: 7 },
  descriptionCard: { backgroundColor: COLORS.surface, borderColor: COLORS.border, borderRadius: 4, borderWidth: 1, padding: 11 },
  sectionHeader: { alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between' },
  sectionTitleGroup: { alignItems: 'center', flexDirection: 'row', gap: 7 },
  sectionTitle: { fontFamily: 'Anybody-Bold', fontSize: 8, letterSpacing: 0.25 },
  syllabus: { color: COLORS.redLight, fontFamily: 'Anybody-Bold', fontSize: 6, letterSpacing: 0.35 },
  description: { color: '#E2E2E4', fontSize: 10, lineHeight: 17, marginTop: 9 },
  sectionHeading: { alignItems: 'center', flexDirection: 'row', gap: 7, marginBottom: 8, marginTop: 16 },
  sectionHeadingText: { fontFamily: 'Anybody-Bold', fontSize: 8, letterSpacing: 0.3 },
  steps: { gap: 6 },
  stepCard: { alignItems: 'center', backgroundColor: COLORS.surface, borderColor: COLORS.border, borderRadius: 4, borderWidth: 1, flexDirection: 'row', gap: 9, minHeight: 74, padding: 9 },
  stepNumber: { alignItems: 'center', backgroundColor: COLORS.red, borderRadius: 4, height: 36, justifyContent: 'center', width: 36 },
  stepNumberText: { color: COLORS.white, fontFamily: 'Anybody-Bold', fontSize: 11 },
  stepCopy: { flex: 1 },
  stepTitle: { color: COLORS.white, fontFamily: 'Anybody-Bold', fontSize: 8, lineHeight: 12 },
  stepDescription: { color: COLORS.secondary, fontSize: 9, lineHeight: 14, marginTop: 3 },
  stepTime: { color: COLORS.redLight, fontFamily: 'Anybody-Bold', fontSize: 9, marginLeft: 2 },
  masteryCard: { backgroundColor: COLORS.surface, borderColor: COLORS.border, borderRadius: 4, borderWidth: 1, marginTop: 16, padding: 11 },
  masteryHeader: { alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between' },
  masteryTitle: { color: COLORS.white, fontFamily: 'Anybody-Bold', fontSize: 8 },
  masteryBadge: { backgroundColor: '#351718', borderRadius: 3, paddingHorizontal: 6, paddingVertical: 5 },
  masteryBadgeText: { color: COLORS.redLight, fontFamily: 'Anybody-Bold', fontSize: 6 },
  repsText: { color: COLORS.secondary, fontSize: 9, marginTop: 10 },
  repsCount: { color: COLORS.white, fontFamily: 'Anybody-Bold', fontSize: 8 },
  masteryProgressTrack: { backgroundColor: COLORS.border, height: 5, marginTop: 8, overflow: 'hidden' },
  masteryProgressFill: { backgroundColor: COLORS.red, height: '100%' },
  validateRow: { alignItems: 'center', backgroundColor: COLORS.input, borderColor: COLORS.border, borderRadius: 4, borderWidth: 1, flexDirection: 'row', gap: 8, marginTop: 10, minHeight: 40, paddingHorizontal: 9 },
  validateText: { color: COLORS.white, flex: 1, fontFamily: 'Anybody-Bold', fontSize: 7 },
  variants: { flexDirection: 'row', gap: 8 },
  variantCard: { backgroundColor: COLORS.surface, borderColor: COLORS.border, borderRadius: 4, borderWidth: 1, flex: 1, overflow: 'hidden' },
  variantArtwork: { alignItems: 'center', backgroundColor: '#202022', height: 92, justifyContent: 'center', overflow: 'hidden' },
  variantCircle: { borderColor: '#454548', borderRadius: 34, borderWidth: 1, height: 68, width: 68 },
  variantLine: { backgroundColor: '#454548', height: 1, position: 'absolute', width: '80%' },
  variantPlay: { alignItems: 'center', backgroundColor: '#E5322DCC', borderRadius: 4, height: 29, justifyContent: 'center', paddingLeft: 2, position: 'absolute', width: 38 },
  variantDuration: { backgroundColor: '#080808D9', bottom: 5, color: COLORS.white, fontFamily: 'Anybody-Bold', fontSize: 6, paddingHorizontal: 4, paddingVertical: 3, position: 'absolute', right: 5 },
  variantCopy: { padding: 7 },
  variantTitle: { color: COLORS.white, fontFamily: 'Anybody-Bold', fontSize: 7 },
  variantSubtitle: { color: COLORS.secondary, fontSize: 7, marginTop: 3 },
  pressed: { opacity: 0.78 },
})

export default TechniqueDetailScreen
