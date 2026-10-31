import { useMemo, useState } from 'react'
import {
  Award,
  Bell,
  Bookmark,
  Check,
  Play,
  RotateCcw,
  Search,
  Sliders,
  UserRound,
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
  red: '#E5322D',
  redLight: '#FFB4AB',
}

const CATEGORIES = ['TOUS', '+ PASSAGES DE GARDE', 'GARDES & RENVERSEMENTS']
const LEVELS = ['TOUS NIVEAUX', '◼ FONDAMENTAUX / BLANC', 'INTERMÉDIAIRE / BLEU']
const EMPTY_QUERY = 'Gogoplata inversée hélicoptère'

const VIDEOS = [
  {
    id: 'torreando',
    category: '+ PASSAGES DE GARDE',
    level: '◼ FONDAMENTAUX / BLANC',
    belt: 'BLANC • FONDAMENTAL',
    duration: '03:45',
    title: 'PASSAGE TORREANDO CLASSIQUE',
    coach: 'Prof. Mehdi Benali',
    description: 'Contrôler les chevilles, déplacer les jambes et stabiliser la position latérale.',
    technique: 'TEMPO : EXPLOSIF',
    progress: 85,
    progressLabel: 'VU À 85%',
  },
  {
    id: 'rnc',
    category: 'GARDES & RENVERSEMENTS',
    level: 'INTERMÉDIAIRE / BLEU',
    belt: 'BLEU • INTERMÉDIAIRE',
    duration: '06:12',
    title: 'ÉTRANGLEMENT ARRIÈRE (RNC) & CONTRÔLE CROCHETS',
    coach: 'Prof. Mehdi Benali',
    description: 'Sécuriser le dos, fermer les crochets et finaliser sans perdre le contrôle.',
    technique: 'FINITION : ÉTRANGLEMENT',
    progress: 40,
    progressLabel: 'EN COURS (40%)',
  },
  {
    id: 'triangle',
    category: 'GARDES & RENVERSEMENTS',
    level: '◼ FONDAMENTAUX / BLANC',
    belt: 'BLANC • FONDAMENTAL',
    duration: '04:28',
    title: 'TRIANGLE (SANKAKU-JIME)',
    coach: 'Prof. Sarah Laurent',
    description: 'Repères de posture et ajustements pour verrouiller le triangle depuis la garde.',
    technique: 'GARDE : FERMETURE',
    progress: 100,
    progressLabel: 'MAÎTRISE (100%)',
  },
]

const Text = ({ style, ...props }) => (
  <NativeText {...props} style={[{ color: COLORS.primary, fontFamily: 'Chivo-Regular' }, style]} />
)

function TechniquesLibraryScreen() {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('+ PASSAGES DE GARDE')
  const [level, setLevel] = useState('◼ FONDAMENTAUX / BLANC')
  const [emptyDemo, setEmptyDemo] = useState(false)
  const [bookmarks, setBookmarks] = useState({})

  const visibleVideos = useMemo(() => {
    if (emptyDemo) return []
    const normalizedQuery = query.trim().toLocaleLowerCase('fr')
    return VIDEOS.filter((video) => {
      const matchesCategory = category === 'TOUS' || video.category === category
      const matchesLevel = level === 'TOUS NIVEAUX' || video.level === level
      const matchesQuery = !normalizedQuery ||
        `${video.title} ${video.coach} ${video.description} ${video.technique}`
          .toLocaleLowerCase('fr')
          .includes(normalizedQuery)
      return matchesCategory && matchesLevel && matchesQuery
    })
  }, [category, emptyDemo, level, query])

  const isEmpty = visibleVideos.length === 0
  const displayedQuery = query.trim() || EMPTY_QUERY
  const displayedCategories = isEmpty ? ['NO-GI SOUMISSION ✕'] : CATEGORIES
  const displayedLevels = isEmpty ? ['CEINTURE MARRON / NOIR'] : LEVELS

  function showEmptyDemo() {
    setQuery(EMPTY_QUERY)
    setEmptyDemo(true)
  }

  function resetFilters() {
    setQuery('')
    setCategory('+ PASSAGES DE GARDE')
    setLevel('◼ FONDAMENTAUX / BLANC')
    setEmptyDemo(false)
  }

  function toggleBookmark(id) {
    setBookmarks((current) => ({ ...current, [id]: !current[id] }))
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
          <View style={styles.avatar}><UserRound color={COLORS.canvas} size={16} /></View>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.eyebrowRow}>
          <View style={styles.redSquare} />
          <Text style={styles.eyebrow}>ENCYCLOPÉDIE TACTIQUE & COMBAT • CDL</Text>
        </View>
        <View style={styles.titleRow}>
          <Text accessibilityRole="header" style={styles.title}>BIBLIOTHÈQUE{'\n'}DE TECHNIQUES</Text>
          <View style={styles.videoCount}><Text style={styles.videoCountText}>142 VIDÉOS</Text></View>
        </View>
        <Text style={styles.subtitle}>Vidéothèque officielle • Étude gestuelle, transitions et finalisations</Text>

        <View style={styles.searchBox}>
          <Search color={COLORS.secondary} size={18} />
          <TextInput
            accessibilityLabel="Rechercher une technique"
            onChangeText={(value) => {
              setQuery(value)
              setEmptyDemo(false)
            }}
            placeholder="Rechercher une technique..."
            placeholderTextColor={COLORS.muted}
            style={styles.searchInput}
            value={query}
          />
          {query.length > 0 && (
            <Pressable
              accessibilityLabel="Effacer la recherche"
              onPress={() => {
                setQuery('')
                setEmptyDemo(false)
              }}
            >
              <X color={COLORS.secondary} size={18} />
            </Pressable>
          )}
        </View>

        <View style={styles.filterHeading}>
          <Sliders color={COLORS.secondary} size={13} />
          <Text style={styles.filterCaption}>DISCIPLINE</Text>
        </View>
        <ScrollView horizontal contentContainerStyle={styles.chipList} showsHorizontalScrollIndicator={false}>
          {displayedCategories.map((item) => {
            const active = isEmpty || category === item
            return (
              <Pressable
                accessibilityRole="button"
                accessibilityState={{ selected: active }}
                key={item}
                onPress={isEmpty ? resetFilters : () => {
                  setCategory(item)
                  setEmptyDemo(false)
                }}
                style={[styles.chip, active && styles.chipActive]}
              >
                <Text style={[styles.chipText, active && styles.chipTextActive]}>{item}</Text>
              </Pressable>
            )
          })}
        </ScrollView>

        <View style={styles.filterHeading}>
          <Award color={COLORS.secondary} size={13} />
          <Text style={styles.filterCaption}>NIVEAU</Text>
        </View>
        <ScrollView horizontal contentContainerStyle={styles.chipList} showsHorizontalScrollIndicator={false}>
          {displayedLevels.map((item) => {
            const active = isEmpty || level === item
            return (
              <Pressable
                accessibilityRole="button"
                accessibilityState={{ selected: active }}
                key={item}
                onPress={isEmpty ? resetFilters : () => {
                  setLevel(item)
                  setEmptyDemo(false)
                }}
                style={[styles.chip, styles.levelChip, active && styles.levelChipActive]}
              >
                <Text style={[styles.chipText, active && styles.levelTextActive]}>{item}</Text>
              </Pressable>
            )
          })}
        </ScrollView>

        <Pressable
          accessibilityRole="button"
          accessibilityState={{ selected: emptyDemo }}
          onPress={() => emptyDemo ? resetFilters() : showEmptyDemo()}
          style={({ pressed }) => [styles.demoToggle, pressed && styles.pressed]}
        >
          <Text style={styles.demoToggleText}>
            {emptyDemo ? 'REVENIR AU CATALOGUE' : 'TESTER L’ÉTAT SANS RÉSULTAT'}
          </Text>
        </Pressable>

        {isEmpty ? (
          <EmptyResults
            query={displayedQuery}
            onReset={resetFilters}
          />
        ) : (
          <>
            <View style={styles.resultsHeading}>
              <Text style={styles.resultsTitle}>MODULES TECHNIQUES</Text>
              <Text style={styles.resultsCount}>{visibleVideos.length} RÉSULTATS</Text>
            </View>
            {visibleVideos.map((video) => (
              <VideoCard
                key={video.id}
                video={video}
                bookmarked={Boolean(bookmarks[video.id])}
                onBookmark={() => toggleBookmark(video.id)}
              />
            ))}
            <View style={styles.curriculum}>
              <View style={styles.curriculumHeader}>
                <View style={styles.curriculumTitleGroup}>
                  <Award color={COLORS.redLight} size={15} />
                  <Text style={styles.curriculumTitle}>PROGRESSION CURRICULUM</Text>
                </View>
                <Text style={styles.curriculumGrade}>CEINTURE BLANCHE 2 STRIPES</Text>
              </View>
              <View style={styles.curriculumProgressTrack}>
                <View style={styles.curriculumProgressFill} />
              </View>
              <View style={styles.curriculumFooter}>
                <Text style={styles.curriculumCount}>28 / 42 FONDAMENTAUX VALIDÉS</Text>
                <Text style={styles.curriculumGoal}>OBJECTIF PASSAGE BLEU CDL</Text>
              </View>
            </View>
          </>
        )}
      </ScrollView>
    </View>
  )
}

function VideoCard({ video, bookmarked, onBookmark }) {
  return (
    <View style={styles.videoCard}>
      <View style={styles.thumbnail}>
        <View style={styles.thumbnailTop}>
          <Text style={styles.levelTag}>{video.belt}</Text>
          <Text style={styles.duration}>{video.duration}</Text>
        </View>
        <View style={styles.thumbnailArtwork}>
          <View style={styles.artCircle} />
          <View style={styles.artLine} />
          <View style={styles.artLineShort} />
        </View>
        <View pointerEvents="box-none" style={styles.playOverlay}>
          <Pressable
            accessibilityLabel={`Lire ${video.title}`}
            accessibilityRole="button"
            onPress={() => Alert.alert('Lecture vidéo', `${video.title} — démonstration vidéo.`)}
            style={styles.playButton}
          >
            <Play color={COLORS.primary} fill={COLORS.primary} size={21} />
          </Pressable>
        </View>
        <View style={styles.videoProgressTrack}>
          <View style={[styles.videoProgressFill, { width: `${video.progress}%` }]} />
        </View>
      </View>
      <View style={styles.videoDetails}>
        <View style={styles.videoTitleRow}>
          <Text style={styles.videoTitle}>{video.title}</Text>
          <Pressable
            accessibilityLabel={bookmarked ? 'Retirer des favoris' : 'Enregistrer la technique'}
            accessibilityRole="button"
            accessibilityState={{ selected: bookmarked }}
            onPress={onBookmark}
            style={styles.bookmarkButton}
          >
            <Bookmark color={bookmarked ? COLORS.redLight : COLORS.secondary} fill={bookmarked ? COLORS.redLight : 'transparent'} size={17} />
          </Pressable>
        </View>
        <View style={styles.videoMetaRow}>
          <Text style={styles.coach}>{video.coach}</Text>
          <Text style={styles.progressLabel}>● {video.progressLabel}</Text>
        </View>
        <Text style={styles.videoDescription}>{video.description}</Text>
        <View style={styles.cardFooter}>
          <View style={styles.techniqueTag}>
            <Text style={styles.techniqueTagText}>🎚 {video.technique}</Text>
          </View>
          <Pressable
            accessibilityRole="button"
            onPress={() => Alert.alert('Module technique', `Ouverture de « ${video.title} » en mode démo.`)}
            style={styles.launchButton}
          >
            <Text style={styles.launchText}>LANCER LE MODULE</Text>
            <Text style={styles.launchArrow}>→</Text>
          </Pressable>
        </View>
      </View>
    </View>
  )
}

function EmptyResults({ query, onReset }) {
  return (
    <View style={styles.emptyState}>
      <View style={styles.emptyIcon}>
        <Search color={COLORS.secondary} size={34} />
        <View style={styles.emptyIconSlash} />
        <View style={styles.emptyIconError}><X color={COLORS.primary} size={10} /></View>
      </View>
      <Text style={styles.emptyTitle}>AUCUN RÉSULTAT</Text>
      <Text style={styles.emptyDescription}>
        Aucune vidéo technique ne correspond à « {query} » dans les catégories sélectionnées.
      </Text>
      <View style={styles.tipsBox}>
        <Text style={styles.tipsTitle}>💡 CONSEILS D’EXPLORATION :</Text>
        <Text style={styles.tip}>• Vérifiez l’orthographe ou utilisez des mots-clés plus courts.</Text>
        <Text style={styles.tip}>• Élargissez les catégories et niveaux sélectionnés.</Text>
        <Text style={styles.tip}>• Réinitialisez les filtres pour parcourir le catalogue.</Text>
      </View>
      <Pressable
        accessibilityRole="button"
        onPress={onReset}
        style={({ pressed }) => [styles.resetButton, pressed && styles.pressed]}
      >
        <RotateCcw color={COLORS.primary} size={17} />
        <Text style={styles.resetButtonText}>RÉINITIALISER FILTRES ET RECHERCHE</Text>
      </Pressable>
      <View style={styles.recommendedHeading}>
        <Check color={COLORS.redLight} size={14} />
        <Text style={styles.recommendedTitle}>TECHNIQUES RECOMMANDÉES PAR LE CLUB</Text>
      </View>
      <View style={styles.recommendations}>
        <Recommendation title="PASSAGE TORREANDO" subtitle="BLANC • FONDAMENTAL" />
        <Recommendation title="TRIANGLE (SANKAKU-JIME)" subtitle="BLANC • FONDAMENTAL" />
      </View>
    </View>
  )
}

function Recommendation({ title, subtitle }) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={() => Alert.alert('Technique recommandée', `Ouverture de « ${title} » en mode démo.`)}
      style={styles.recommendation}
    >
      <View style={styles.recommendationThumb}>
        <Play color={COLORS.redLight} fill={COLORS.redLight} size={14} />
      </View>
      <Text style={styles.recommendationTitle}>{title}</Text>
      <Text style={styles.recommendationSubtitle}>{subtitle}</Text>
    </Pressable>
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
  brand: { fontFamily: 'Anybody-BlackItalic', fontSize: 22, letterSpacing: 1.4 },
  clubBadge: { alignItems: 'center', backgroundColor: COLORS.red, height: 21, justifyContent: 'center', width: 27 },
  clubBadgeText: { fontFamily: 'Anybody-Bold', fontSize: 8 },
  headerActions: { alignItems: 'center', flexDirection: 'row', gap: 12 },
  headerIcon: { alignItems: 'center', height: 34, justifyContent: 'center', width: 34 },
  notificationDot: { backgroundColor: COLORS.red, borderColor: COLORS.canvas, borderRadius: 4, borderWidth: 1, height: 7, position: 'absolute', right: 6, top: 5, width: 7 },
  avatar: { alignItems: 'center', backgroundColor: COLORS.redLight, borderRadius: 18, height: 33, justifyContent: 'center', width: 33 },
  content: { paddingBottom: 22, paddingHorizontal: 15, paddingTop: 16 },
  eyebrowRow: { alignItems: 'center', flexDirection: 'row', gap: 7 },
  redSquare: { backgroundColor: COLORS.red, height: 7, width: 7 },
  eyebrow: { color: COLORS.redLight, fontFamily: 'Anybody-Bold', fontSize: 8, letterSpacing: 0.45 },
  titleRow: { alignItems: 'flex-start', flexDirection: 'row', justifyContent: 'space-between', marginTop: 8 },
  title: { fontFamily: 'Anybody-BlackItalic', fontSize: 29, letterSpacing: -0.5, lineHeight: 31 },
  videoCount: { backgroundColor: COLORS.surface, borderColor: COLORS.border, borderRadius: 4, borderWidth: 1, marginTop: 5, paddingHorizontal: 7, paddingVertical: 5 },
  videoCountText: { color: COLORS.secondary, fontFamily: 'Anybody-Bold', fontSize: 7 },
  subtitle: { color: COLORS.secondary, fontSize: 10, lineHeight: 15, marginTop: 5 },
  searchBox: { alignItems: 'center', backgroundColor: COLORS.input, borderColor: COLORS.border, borderRadius: 4, borderWidth: 1, flexDirection: 'row', gap: 9, height: 52, marginTop: 14, paddingHorizontal: 12 },
  searchInput: { color: COLORS.primary, flex: 1, fontFamily: 'Chivo-Regular', fontSize: 12, height: '100%', padding: 0 },
  filterHeading: { alignItems: 'center', flexDirection: 'row', gap: 6, marginBottom: 7, marginTop: 13 },
  filterCaption: { color: COLORS.secondary, fontFamily: 'Anybody-Bold', fontSize: 7, letterSpacing: 0.6 },
  chipList: { gap: 6, paddingBottom: 1 },
  chip: { alignItems: 'center', backgroundColor: COLORS.input, borderColor: COLORS.border, borderRadius: 4, borderWidth: 1, justifyContent: 'center', minHeight: 31, paddingHorizontal: 10 },
  chipActive: { backgroundColor: COLORS.red, borderColor: COLORS.red },
  levelChipActive: { backgroundColor: COLORS.surface, borderColor: COLORS.red },
  chipText: { color: COLORS.secondary, fontFamily: 'Anybody-Bold', fontSize: 7, letterSpacing: 0.1 },
  chipTextActive: { color: COLORS.primary },
  levelTextActive: { color: COLORS.redLight },
  demoToggle: { alignSelf: 'flex-end', borderColor: COLORS.border, borderRadius: 4, borderWidth: 1, marginTop: 12, paddingHorizontal: 9, paddingVertical: 7 },
  demoToggleText: { color: COLORS.secondary, fontFamily: 'Anybody-Bold', fontSize: 6, letterSpacing: 0.25 },
  resultsHeading: { alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8, marginTop: 12 },
  resultsTitle: { fontFamily: 'Anybody-Bold', fontSize: 9, letterSpacing: 0.4 },
  resultsCount: { color: COLORS.secondary, fontFamily: 'Anybody-Bold', fontSize: 7 },
  videoCard: { backgroundColor: COLORS.surface, borderColor: COLORS.border, borderRadius: 4, borderWidth: 1, marginBottom: 10, overflow: 'hidden' },
  thumbnail: { backgroundColor: COLORS.input, height: 170, justifyContent: 'center', overflow: 'hidden' },
  thumbnailTop: { alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between', left: 9, position: 'absolute', right: 9, top: 9, zIndex: 2 },
  levelTag: { backgroundColor: '#29292B', color: COLORS.primary, fontFamily: 'Anybody-Bold', fontSize: 7, paddingHorizontal: 7, paddingVertical: 5 },
  duration: { backgroundColor: '#080808D9', color: COLORS.primary, fontFamily: 'Anybody-Bold', fontSize: 8, paddingHorizontal: 6, paddingVertical: 4 },
  thumbnailArtwork: { alignItems: 'center', justifyContent: 'center', ...StyleSheet.absoluteFillObject },
  artCircle: { borderColor: '#37373A', borderRadius: 45, borderWidth: 1, height: 90, width: 90 },
  artLine: { backgroundColor: '#37373A', height: 1, position: 'absolute', width: '70%' },
  artLineShort: { backgroundColor: '#37373A', height: 1, position: 'absolute', transform: [{ rotate: '90deg' }], width: '55%' },
  playOverlay: { alignItems: 'center', bottom: 0, justifyContent: 'center', left: 0, position: 'absolute', right: 0, top: 0, zIndex: 1 },
  playButton: { alignItems: 'center', backgroundColor: COLORS.red, borderRadius: 12, height: 44, justifyContent: 'center', paddingLeft: 3, width: 64 },
  videoProgressTrack: { backgroundColor: '#3A3A3C', bottom: 0, height: 3, left: 0, position: 'absolute', right: 0 },
  videoProgressFill: { backgroundColor: COLORS.red, height: '100%' },
  videoDetails: { padding: 10 },
  videoTitleRow: { alignItems: 'flex-start', flexDirection: 'row', gap: 6, justifyContent: 'space-between' },
  videoTitle: { flex: 1, fontFamily: 'Anybody-Bold', fontSize: 11, lineHeight: 16 },
  bookmarkButton: { alignItems: 'center', height: 25, justifyContent: 'center', width: 25 },
  videoMetaRow: { alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between', marginTop: 4 },
  coach: { color: COLORS.secondary, fontSize: 9 },
  progressLabel: { color: COLORS.redLight, fontFamily: 'Anybody-Bold', fontSize: 6, letterSpacing: 0.1 },
  videoDescription: { color: COLORS.secondary, fontSize: 9, lineHeight: 14, marginTop: 7 },
  cardFooter: { alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 },
  techniqueTag: { backgroundColor: COLORS.input, borderColor: COLORS.border, borderRadius: 4, borderWidth: 1, paddingHorizontal: 6, paddingVertical: 6 },
  techniqueTagText: { color: COLORS.secondary, fontFamily: 'Anybody-Bold', fontSize: 6 },
  launchButton: { alignItems: 'center', flexDirection: 'row', gap: 5, paddingVertical: 6 },
  launchText: { color: COLORS.redLight, fontFamily: 'Anybody-Bold', fontSize: 7 },
  launchArrow: { color: COLORS.red, fontFamily: 'Anybody-Bold', fontSize: 12 },
  curriculum: { backgroundColor: COLORS.surface, borderColor: COLORS.border, borderRadius: 4, borderWidth: 1, marginTop: 2, padding: 11 },
  curriculumHeader: { alignItems: 'flex-start', flexDirection: 'row', justifyContent: 'space-between' },
  curriculumTitleGroup: { alignItems: 'center', flexDirection: 'row', gap: 6 },
  curriculumTitle: { fontFamily: 'Anybody-Bold', fontSize: 8 },
  curriculumGrade: { color: COLORS.redLight, fontFamily: 'Anybody-Bold', fontSize: 6, textAlign: 'right' },
  curriculumProgressTrack: { backgroundColor: COLORS.border, height: 5, marginTop: 10, overflow: 'hidden' },
  curriculumProgressFill: { backgroundColor: COLORS.red, height: '100%', width: '67%' },
  curriculumFooter: { alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between', marginTop: 7 },
  curriculumCount: { color: COLORS.primary, fontFamily: 'Anybody-Bold', fontSize: 7 },
  curriculumGoal: { color: COLORS.secondary, fontFamily: 'Anybody-Bold', fontSize: 6 },
  emptyState: { alignItems: 'center', backgroundColor: COLORS.surface, borderColor: COLORS.border, borderRadius: 4, borderWidth: 1, marginTop: 14, padding: 14 },
  emptyIcon: { alignItems: 'center', height: 60, justifyContent: 'center', marginBottom: 7, width: 60 },
  emptyIconSlash: { backgroundColor: COLORS.red, height: 2, position: 'absolute', transform: [{ rotate: '-45deg' }], width: 44 },
  emptyIconError: { alignItems: 'center', backgroundColor: COLORS.red, borderRadius: 8, bottom: 2, height: 16, justifyContent: 'center', position: 'absolute', right: 1, width: 16 },
  emptyTitle: { fontFamily: 'Anybody-BlackItalic', fontSize: 23, textAlign: 'center' },
  emptyDescription: { color: COLORS.secondary, fontSize: 10, lineHeight: 16, marginTop: 7, textAlign: 'center' },
  tipsBox: { alignSelf: 'stretch', backgroundColor: COLORS.input, borderColor: COLORS.border, borderRadius: 4, borderWidth: 1, marginTop: 12, padding: 10 },
  tipsTitle: { color: COLORS.redLight, fontFamily: 'Anybody-Bold', fontSize: 8, marginBottom: 5 },
  tip: { color: COLORS.secondary, fontSize: 9, lineHeight: 15 },
  resetButton: { alignItems: 'center', backgroundColor: COLORS.red, borderRadius: 4, flexDirection: 'row', gap: 8, height: 54, justifyContent: 'center', marginTop: 11, paddingHorizontal: 8, width: '100%' },
  resetButtonText: { fontFamily: 'Anybody-Bold', fontSize: 8, letterSpacing: 0.2 },
  recommendedHeading: { alignItems: 'center', alignSelf: 'stretch', flexDirection: 'row', gap: 6, marginTop: 17, marginBottom: 8 },
  recommendedTitle: { fontFamily: 'Anybody-Bold', fontSize: 8, letterSpacing: 0.2 },
  recommendations: { alignSelf: 'stretch', flexDirection: 'row', gap: 8 },
  recommendation: { backgroundColor: COLORS.input, borderColor: COLORS.border, borderRadius: 4, borderWidth: 1, flex: 1, overflow: 'hidden', paddingBottom: 8 },
  recommendationThumb: { alignItems: 'center', backgroundColor: '#202022', height: 56, justifyContent: 'center' },
  recommendationTitle: { fontFamily: 'Anybody-Bold', fontSize: 7, lineHeight: 11, marginHorizontal: 7, marginTop: 7 },
  recommendationSubtitle: { color: COLORS.redLight, fontFamily: 'Anybody-Bold', fontSize: 5, marginHorizontal: 7, marginTop: 3 },
  pressed: { opacity: 0.78 },
})

export default TechniquesLibraryScreen
