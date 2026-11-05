import { useState } from "react";
import {
  Alert,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text as NativeText,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useEvent } from "expo";
import { useVideoPlayer, VideoView } from "expo-video";
import {
  ArrowLeft,
  Bell,
  Camera,
  ChevronRight,
  EyeOff,
  Lock,
  Play,
  Send,
  Share2,
  UserRound,
  Users,
  Video,
} from "lucide-react-native";
import { demoVideos } from "../data/mediaDemo.js";

const C = {
  bg: "#0B0B0B",
  surface: "#1A1A1C",
  border: "#28282C",
  white: "#FFFFFF",
  gray: "#9A9A9A",
  muted: "#555558",
  red: "#E5322D",
  redLight: "#FFB4AB",
};

const Text = ({ style, ...props }) => (
  <NativeText {...props} style={[{ fontFamily: "Chivo-Regular" }, style]} />
);

// Aperçu local uniquement : les vignettes et métadonnées proviennent d'un CDN autorisé en production.
const PHOTO = (seed) =>
  `https://images.unsplash.com/photo-1555597673-b21d5c935865?auto=format&fit=crop&w=800&q=80&sig=${seed}`;

const FILTERS = [
  { id: "all", label: "TOUS (20)" },
  { id: "groupe", label: "GROUPE (8)" },
  { id: "leo", label: "LÉO (3)" },
  { id: "ines", label: "INÈS (3)" },
];

const MEDIA = [
  {
    id: "photo-groupe",
    type: "photo",
    uri: PHOTO(0),
    badge: "📷 HD",
    tags: ["groupe"],
    caption: "GROUPE",
    group: true,
    send: true,
  },
  {
    id: "video-leo-ines",
    type: "video",
    uri: demoVideos[0].uri,
    duration: "0:45",
    tags: ["leo", "ines"],
    caption: "LÉO, INÈS",
    detail: "2 ATH",
    group: false,
  },
  {
    id: "photo-mehdi",
    type: "photo",
    uri: PHOTO(1),
    badge: "📷",
    tags: ["mehdi"],
    caption: "MEHDI",
    status: true,
  },
  {
    id: "photo-sarah-enzo",
    type: "photo",
    uri: PHOTO(2),
    badge: "📷",
    tags: ["sarah", "enzo"],
    caption: "SARAH, ENZO",
    detail: "2 ATH",
  },
  {
    id: "restricted",
    type: "restricted",
    tags: [],
  },
  {
    id: "video-groupe",
    type: "video",
    uri: demoVideos[1].uri,
    duration: "1:12",
    tags: ["groupe"],
    caption: "GROUPE",
    group: true,
  },
  {
    id: "photo-lucas",
    type: "photo",
    uri: PHOTO(3),
    badge: "📷",
    tags: ["lucas"],
    caption: "LUCAS",
    status: true,
  },
];

export default function StaffMediaGalleryScreen({
  onBack,
  onAddMedia,
  onPreview,
}) {
  const [filter, setFilter] = useState("all");
  const notify = (message) => Alert.alert("Médias staff", message);
  const visible = MEDIA.filter(
    (media) => filter === "all" || media.tags.includes(filter),
  );

  return (
    <View style={s.screen}>
      <SafeAreaView edges={["top"]} style={s.safeTop}>
        <View style={s.header}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Retour"
            onPress={() => (onBack ? onBack() : notify("Retour aux séances."))}
            style={s.headerButton}
          >
            <ArrowLeft color={C.white} size={20} />
          </Pressable>
          <Text accessibilityRole="header" style={s.brand}>
            TATAMI <Text style={s.brandAccent}>CDL</Text>{" "}
            <Text style={s.brandAccent}>STAFF</Text>
          </Text>
          <View style={s.headerActions}>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Notifications"
              onPress={() => notify("Aucune nouvelle notification.")}
              style={s.headerButton}
            >
              <Bell color={C.white} size={18} />
              <View style={s.notificationDot} />
            </Pressable>
            <View style={s.avatar}>
              <UserRound color={C.bg} size={16} />
            </View>
          </View>
        </View>
      </SafeAreaView>

      <ScrollView
        contentContainerStyle={s.content}
        showsVerticalScrollIndicator={false}
      >
        {/* BANDEAU SESSION ACTIVE */}
        <View style={s.sessionBanner}>
          <View style={s.sessionBody}>
            <Text style={s.sessionOverline}>
              SESSION ACTIVE • DOJO PRINCIPAL
            </Text>
            <Text style={s.sessionTitle}>JJB GI AVANCÉ & SPARRING</Text>
            <Text style={s.sessionMeta}>📅 Mercredi 24 Octobre • 18h30 – 20h00</Text>
            <Text style={s.sessionCount}>📸 18 photos • 2 vidéos</Text>
          </View>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Ajouter des médias"
            onPress={onAddMedia ?? (() => notify("Ouverture de l’import de médias."))}
            style={s.addButton}
          >
            <Camera color={C.white} size={16} />
            <Text style={s.addButtonText}>AJOUTER</Text>
          </Pressable>
        </View>

        {/* FILTRE PAR ATHLÈTE */}
        <View style={s.filterHead}>
          <Text style={s.filterTitle}>FILTRER PAR ATHLÈTE</Text>
          <Text style={s.filterCount}>
            {visible.length} ÉLÉMENT{visible.length > 1 ? "S" : ""}
          </Text>
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={s.chips}
        >
          {FILTERS.map((item) => {
            const active = filter === item.id;
            return (
              <Pressable
                accessibilityRole="button"
                accessibilityState={{ selected: active }}
                key={item.id}
                onPress={() => setFilter(item.id)}
                style={[s.chip, active && s.chipActive]}
              >
                <Text style={[s.chipText, active && s.chipTextActive]}>
                  {item.label}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>

        {/* GRILLE MÉDIAS */}
        <View style={s.grid}>
          {visible.map((media) => (
            <MediaCard
              key={media.id}
              media={media}
              onPress={() =>
                media.type === "restricted"
                  ? notify("Ce média ne peut pas être diffusé sans autorisation.")
                  : onPreview?.(media)
              }
            />
          ))}
        </View>

        {/* DIFFUSION EXPRESS */}
        <View style={s.diffusion}>
          <View style={s.diffusionIcon}>
            <Share2 color={C.red} size={22} />
          </View>
          <View style={s.diffusionCopy}>
            <Text style={s.diffusionTitle}>DIFFUSION EXPRESS</Text>
            <Text style={s.diffusionSub}>Envoyer les albums aux athlètes</Text>
          </View>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Transmettre"
            onPress={() => notify("Les albums prêts à transmettre seront disponibles ici.")}
            style={s.diffusionButton}
          >
            <Text style={s.diffusionButtonText}>TRANSMETTRE</Text>
            <ChevronRight color={C.red} size={16} />
          </Pressable>
        </View>
      </ScrollView>

    </View>
  );
}

function MediaCard({ media, onPress }) {
  if (media.type === "restricted") return <RestrictedCard onPress={onPress} />;

  const isVideo = media.type === "video";
  const isGroup = !!media.group;
  const Icon = isGroup ? Users : UserRound;

  if (isVideo) return <VideoMediaCard media={media} Icon={Icon} />;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={media.caption}
      onPress={onPress}
      style={s.card}
    >
      <View style={s.thumb}>
        <Image source={{ uri: media.uri }} style={s.thumbImage} />

        <View style={s.badge}>
          <Text style={s.badgeText}>
            {media.badge}
          </Text>
        </View>

        <View style={s.captionBar}>
          <View style={s.captionLeft}>
            <Icon size={13} color={C.red} />
            <Text numberOfLines={1} style={s.captionText}>
              {media.caption}
              {media.detail ? ` • ${media.detail}` : ""}
            </Text>
          </View>
          {media.send ? (
            <Send size={13} color={C.white} />
          ) : media.status ? (
            <View style={s.statusDot} />
          ) : (
            <Video size={13} color={C.white} />
          )}
        </View>
      </View>
    </Pressable>
  );
}

function VideoMediaCard({ media, Icon }) {
  const player = useVideoPlayer(media.uri);
  const { isPlaying } = useEvent(player, "playingChange", {
    isPlaying: player.playing,
  });

  return (
    <View style={s.card}>
      <View style={s.thumb}>
        <VideoView
          player={player}
          style={StyleSheet.absoluteFill}
          contentFit="cover"
          nativeControls={false}
          surfaceType="textureView"
        />
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={isPlaying ? "Mettre la vidéo en pause" : `Lire la vidéo ${media.caption}`}
          onPress={() => (isPlaying ? player.pause() : player.play())}
          style={s.videoControl}
        >
          {!isPlaying && (
            <View style={s.playButton}>
              <Play size={16} color={C.white} fill={C.white} />
            </View>
          )}
        </Pressable>

        <View style={s.badge}>
          <Text style={s.badgeText}>🔴 {media.duration}</Text>
        </View>

        <View style={s.captionBar}>
          <View style={s.captionLeft}>
            <Icon size={13} color={C.red} />
            <Text numberOfLines={1} style={s.captionText}>
              {media.caption}
              {media.detail ? ` • ${media.detail}` : ""}
            </Text>
          </View>
          <Video size={13} color={C.white} />
        </View>
      </View>
    </View>
  );
}

function RestrictedCard({ onPress }) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel="Média restreint"
      onPress={onPress}
      style={[s.card, s.restrictedCard]}
    >
      <View style={s.restrictedThumb}>
        <View style={s.restrictedBadge}>
          <Text style={s.restrictedBadgeText}>⚠️ NON DIFFUSABLE</Text>
        </View>
        <View style={s.restrictedCenter}>
          <Lock size={28} color={C.red} />
          <Text style={s.restrictedTitle}>
            SANS AUTORISATION DE DROIT À L’IMAGE
          </Text>
          <Text style={s.restrictedSub}>
            Signature manquante d’un participant
          </Text>
        </View>
        <View style={s.restrictedFooter}>
          <EyeOff size={13} color={C.red} />
          <Text style={s.restrictedFooterText}>MÉDIA RESTREINT</Text>
        </View>
      </View>
    </Pressable>
  );
}

const s = StyleSheet.create({
  screen: { flex: 1, backgroundColor: C.bg },
  safeTop: { backgroundColor: C.bg },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 20,
    minHeight: 64,
    borderBottomWidth: 1,
    borderBottomColor: C.border,
  },
  headerButton: {
    minWidth: 44,
    minHeight: 44,
    alignItems: "center",
    justifyContent: "center",
  },
  headerActions: { flexDirection: "row", alignItems: "center", gap: 14 },
  brand: {
    flex: 1,
    fontFamily: "Anybody-BlackItalic",
    fontSize: 15,
    color: C.white,
    letterSpacing: 0.5,
  },
  brandAccent: { color: C.red },
  notificationDot: {
    position: "absolute",
    top: 10,
    right: 10,
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: C.red,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 4,
    backgroundColor: C.redLight,
    alignItems: "center",
    justifyContent: "center",
  },
  content: {
    padding: 20,
    gap: 18,
    width: "100%",
    maxWidth: 720,
    alignSelf: "center",
    paddingBottom: 28,
  },
  sessionBanner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    backgroundColor: C.surface,
    borderColor: C.border,
    borderWidth: 1,
    borderLeftWidth: 4,
    borderLeftColor: C.red,
    borderRadius: 4,
    padding: 14,
  },
  sessionBody: { flex: 1, gap: 5 },
  sessionOverline: {
    fontFamily: "Anybody-Bold",
    fontSize: 10,
    color: C.red,
    letterSpacing: 0.6,
  },
  sessionTitle: {
    fontFamily: "Anybody-BlackItalic",
    fontSize: 24,
    lineHeight: 28,
    color: C.white,
  },
  sessionMeta: { fontSize: 12, color: C.white },
  sessionCount: { fontSize: 11, color: C.gray },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    height: 40,
    paddingHorizontal: 12,
    borderRadius: 4,
    backgroundColor: C.red,
  },
  addButtonText: {
    fontFamily: "Anybody-Bold",
    fontSize: 10,
    color: C.white,
  },
  filterHead: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  filterTitle: {
    fontFamily: "Anybody-Bold",
    fontSize: 11,
    color: C.white,
  },
  filterCount: { fontFamily: "Anybody-Bold", fontSize: 10, color: C.gray },
  chips: { gap: 8, paddingRight: 8 },
  chip: {
    minHeight: 34,
    justifyContent: "center",
    paddingHorizontal: 14,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: C.border,
    backgroundColor: C.surface,
  },
  chipActive: { backgroundColor: C.red, borderColor: C.red },
  chipText: { fontFamily: "Anybody-Bold", fontSize: 10, color: C.gray },
  chipTextActive: { color: C.white },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    rowGap: 10,
  },
  card: {
    width: "48.5%",
    aspectRatio: 3 / 4,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: C.border,
    backgroundColor: C.surface,
    overflow: "hidden",
  },
  thumb: { flex: 1, position: "relative", backgroundColor: "#121214" },
  thumbImage: { width: "100%", height: "100%" },
  badge: {
    position: "absolute",
    top: 8,
    left: 8,
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 4,
    backgroundColor: "rgba(0,0,0,0.72)",
  },
  badgeText: { fontFamily: "Anybody-Bold", fontSize: 9, color: C.white },
 videoControl: {
  position: "absolute",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  alignItems: "center",
  justifyContent: "center",
  zIndex: 10,
  elevation: 10,
},
  playButton: {
  width: 46,
  height: 32,
  borderRadius: 12,
  backgroundColor: C.red,
  alignItems: "center",
  justifyContent: "center",
},
  captionBar: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 8,
    paddingVertical: 6,
    backgroundColor: "rgba(0,0,0,0.78)",
  },
  captionLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    flex: 1,
  },
  captionText: {
    flex: 1,
    fontFamily: "Anybody-Bold",
    fontSize: 9,
    color: C.white,
  },
  statusDot: { width: 7, height: 7, borderRadius: 4, backgroundColor: C.red },
  restrictedCard: { borderColor: "#4B2526" },
  restrictedThumb: {
    flex: 1,
    backgroundColor: "#0F0E0F",
    padding: 10,
    gap: 8,
  },
  restrictedBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 4,
    backgroundColor: "rgba(147,0,10,0.9)",
  },
  restrictedBadgeText: {
    fontFamily: "Anybody-Bold",
    fontSize: 8,
    color: C.redLight,
  },
  restrictedCenter: { flex: 1, alignItems: "center", justifyContent: "center", gap: 8 },
  restrictedTitle: {
    fontFamily: "Anybody-Bold",
    fontSize: 10,
    lineHeight: 14,
    color: C.red,
    textAlign: "center",
  },
  restrictedSub: { fontSize: 9, color: C.gray, textAlign: "center" },
  restrictedFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 5,
  },
  restrictedFooterText: { fontFamily: "Anybody-Bold", fontSize: 8, color: C.gray },
  diffusion: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: C.surface,
    borderWidth: 1,
    borderColor: C.border,
    borderRadius: 4,
    padding: 14,
  },
  diffusionIcon: {
    width: 40,
    height: 40,
    borderRadius: 4,
    backgroundColor: "rgba(229,50,45,0.12)",
    alignItems: "center",
    justifyContent: "center",
  },
  diffusionCopy: { flex: 1, gap: 2 },
  diffusionTitle: {
    fontFamily: "Anybody-Bold",
    fontSize: 12,
    color: C.white,
  },
  diffusionSub: { fontSize: 11, color: C.gray },
  diffusionButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
    height: 40,
    paddingHorizontal: 10,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: C.red,
    backgroundColor: "transparent",
  },
  diffusionButtonText: {
    fontFamily: "Anybody-Bold",
    fontSize: 10,
    color: C.white,
  },
});
