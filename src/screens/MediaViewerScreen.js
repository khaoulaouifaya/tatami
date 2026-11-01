/* Expo VideoPlayer is a mutable native controller: its documented setters control playback. */
/* eslint-disable react/immutability */
import React, { useRef, useState } from "react";
import {
  Alert,
  Image,
  Modal,
  PanResponder,
  Platform,
  Pressable,
  ScrollView,
  Share,
  StyleSheet,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useEvent } from "expo";
import { useVideoPlayer, VideoView } from "expo-video";
import { File, Paths } from "expo-file-system";
import * as Sharing from "expo-sharing";
import * as MediaLibrary from "expo-media-library";
import {
  Bookmark,
  Camera,
  ChevronLeft,
  ChevronRight,
  Download,
  Info,
  Maximize,
  MoreVertical,
  Pause,
  Play,
  RotateCcw,
  RotateCw,
  Share2,
  Trash2,
  Users,
  Volume2,
  VolumeX,
  X,
  ZoomIn,
} from "lucide-react-native";
import { Button, C, IconButton, Label, s } from "../components/media/MediaUI";
import { demoAlbum, demoVideos } from "../data/mediaDemo";
const clock = (n) =>
  `${Math.floor(Math.max(0, n) / 60)
    .toString()
    .padStart(2, "0")}:${Math.floor(Math.max(0, n) % 60)
    .toString()
    .padStart(2, "0")}`;

function VideoPlayer({ item, onClose, navigate }) {
  const ref = useRef(null);
  const [muted, setMuted] = useState(false);
  const [rate, setRate] = useState(1);
  const [width, setWidth] = useState(1);
  const player = useVideoPlayer(item.uri, (p) => {
    p.timeUpdateEventInterval = 0.25;
  });
  const { isPlaying } = useEvent(player, "playingChange", {
    isPlaying: player.playing,
  });
  const { currentTime = 0 } = useEvent(player, "timeUpdate", {
    currentTime: 0,
  });
  const { status, error } = useEvent(player, "statusChange", {
    status: player.status,
  });
  const duration = player.duration || 0;
  const seek = (n) => {
    player.currentTime = Math.min(duration, Math.max(0, n));
  };
  const gestures = PanResponder.create({
    onMoveShouldSetPanResponder: (_, g) =>
      Math.abs(g.dx) > 35 && Math.abs(g.dx) > Math.abs(g.dy) * 2,
    onPanResponderRelease: (_, g) => {
      if (Math.abs(g.dx) > 60) navigate(g.dx < 0 ? 1 : -1);
    },
  });
  return (
    <View>
      <View style={st.video} {...gestures.panHandlers}>
        <VideoView
          ref={ref}
          player={player}
          style={StyleSheet.absoluteFill}
          nativeControls={false}
          contentFit="contain"
        />
        <View style={st.videoTop}>
          <IconButton icon={X} label="Fermer la vidéo" onPress={onClose} />
          <Label style={[s.bold, { flex: 1, fontSize: 9 }]}>
            JJB SPARRING BASTILLE{"\n"}VIDÉO {item.id === "video-1" ? "1" : "2"}{" "}
            / 2 • {clock(duration)}
          </Label>
          <Label style={[s.badge, { backgroundColor: C.red }]}>4K CDL</Label>
        </View>
        <View style={st.playRow}>
          <View>
            <IconButton
              icon={RotateCcw}
              label="Reculer de 10 secondes"
              onPress={() => seek(currentTime - 10)}
            />
            <Label style={st.center}>−10</Label>
          </View>
          <Pressable
            style={st.play}
            accessibilityRole="button"
            accessibilityLabel={isPlaying ? "Pause" : "Lire la vidéo"}
            onPress={() => (isPlaying ? player.pause() : player.play())}
          >
            {isPlaying ? (
              <Pause color="white" size={38} />
            ) : (
              <Play color="white" size={38} />
            )}
          </Pressable>
          <View>
            <IconButton
              icon={RotateCw}
              label="Avancer de 10 secondes"
              onPress={() => seek(currentTime + 10)}
            />
            <Label style={st.center}>+10</Label>
          </View>
        </View>
        <Label style={st.hint}>
          GLISSER HORIZONTALEMENT POUR NAVIGUER ENTRE LES MÉDIAS
        </Label>
        <View style={st.videoBottom}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Changer la vitesse"
            style={s.icon}
            onPress={() => {
              const next = rate === 2 ? 0.5 : rate + 0.5;
              setRate(next);
              player.playbackRate = next;
            }}
          >
            <Label style={s.bold}>{rate.toFixed(1)}X</Label>
          </Pressable>
          <IconButton
            icon={muted ? VolumeX : Volume2}
            label={muted ? "Activer le son" : "Couper le son"}
            onPress={() => {
              player.muted = !muted;
              setMuted(!muted);
            }}
          />
          <Label style={[s.badge, { marginLeft: "auto", fontSize: 8 }]}>
            ROUND 3 // ATACADO
          </Label>
          <IconButton
            icon={Maximize}
            label="Plein écran"
            onPress={() => ref.current?.enterFullscreen()}
          />
        </View>
      </View>
      {status === "loading" && (
        <Label style={s.muted}>Chargement de la vidéo…</Label>
      )}
      {status === "error" && (
        <Label style={s.red}>
          Vidéo indisponible : {error?.message || "vérifiez votre connexion."}
        </Label>
      )}
      <View style={s.row}>
        <Label style={s.red}>{clock(currentTime)}</Label>
        <Pressable
          accessibilityRole="adjustable"
          accessibilityLabel="Position dans la vidéo"
          accessibilityValue={{
            min: 0,
            max: Math.round(duration),
            now: Math.round(currentTime),
          }}
          accessibilityActions={[{ name: "increment" }, { name: "decrement" }]}
          onAccessibilityAction={(e) =>
            seek(
              currentTime +
                (e.nativeEvent.actionName === "increment" ? 10 : -10),
            )
          }
          onLayout={(e) => setWidth(e.nativeEvent.layout.width)}
          onPress={(e) => seek((e.nativeEvent.locationX / width) * duration)}
          style={st.scrub}
        >
          <View style={st.track}>
            <View
              style={[
                st.fill,
                { width: `${duration ? (currentTime / duration) * 100 : 0}%` },
              ]}
            />
            <View
              style={[
                st.knob,
                { left: `${duration ? (currentTime / duration) * 100 : 0}%` },
              ]}
            />
          </View>
        </Pressable>
        <Label style={s.muted}>−{clock(duration - currentTime)}</Label>
      </View>
    </View>
  );
}

export default function MediaViewerScreen({ mode = "image", media, onClose }) {
  const [items, setItems] = useState(
    media ? [media] : mode === "video" ? demoVideos : demoAlbum,
  );
  const [index, setIndex] = useState(media ? 0 : mode === "video" ? 1 : 3);
  const [saved, setSaved] = useState([]);
  const [zoom, setZoom] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState("");
  const [imageError, setImageError] = useState(false);
  const item = items[index];
  function navigate(delta) {
    setIndex((i) => (i + delta + items.length) % items.length);
    setImageError(false);
    setNotice("");
  }
  async function localFile() {
    if (!item.uri.startsWith("http")) return item.uri;
    const file = await File.downloadFileAsync(
      item.uri,
      new File(
        Paths.cache,
        `${item.id}.${item.type === "video" ? "mp4" : "jpg"}`,
      ),
      { idempotent: true },
    );
    return file.uri;
  }
  async function action(kind) {
    setBusy(true);
    setNotice("");
    try {
      if (Platform.OS === "web") {
        if (kind === "share") await Share.share({ message: item.uri });
        else {
          const a = document.createElement("a");
          a.href = item.uri;
          a.target = "_blank";
          a.rel = "noopener";
          a.click();
          setNotice(
            "Média ouvert : utilisez le menu du navigateur pour l’enregistrer.",
          );
        }
      } else if (kind === "share") {
        if (!(await Sharing.isAvailableAsync()))
          throw new Error("Le partage est indisponible sur cet appareil.");
        await Sharing.shareAsync(await localFile());
      } else {
        const permission = await MediaLibrary.requestPermissionsAsync(true, [
          "photo",
          "video",
        ]);
        if (!permission.granted)
          throw new Error(
            "Autorisez l’accès à la photothèque pour enregistrer ce média.",
          );
        await MediaLibrary.Asset.create(await localFile());
        setNotice("Média enregistré dans votre photothèque.");
      }
    } catch (error) {
      setNotice(error.message);
    } finally {
      setBusy(false);
    }
  }
  function remove() {
    setConfirmDelete(false);
    if (items.length === 1) {
      onClose();
      return;
    }
    setItems((prev) => prev.filter((x) => x.id !== item.id));
    setIndex(Math.max(0, index - 1));
    setNotice("Média retiré de cet album de démonstration.");
  }
  const toggleSave = () =>
    setSaved((prev) =>
      prev.includes(item.id)
        ? prev.filter((id) => id !== item.id)
        : [...prev, item.id],
    );
  const gestures = PanResponder.create({
    onMoveShouldSetPanResponder: (_, g) =>
      Math.abs(g.dx) > 35 && Math.abs(g.dx) > Math.abs(g.dy) * 2,
    onPanResponderRelease: (_, g) => {
      if (Math.abs(g.dx) > 60) navigate(g.dx < 0 ? 1 : -1);
    },
  });
  return (
    <SafeAreaView style={s.safe}>
      <View style={st.header}>
        <IconButton icon={X} label="Fermer la visionneuse" onPress={onClose} />
        <Label
          numberOfLines={1}
          style={[s.bold, { flex: 1, textAlign: "center" }]}
        >
          {item.type === "video"
            ? item.title || item.name
            : `PHOTO ${index + 1} / ${items.length}`}
        </Label>
        <IconButton
          icon={MoreVertical}
          label="Informations du média"
          onPress={() =>
            Alert.alert(
              "Informations",
              `${item.title || item.name}\n${media ? "Média importé localement" : "Média de démonstration — métadonnées illustratives"}`,
            )
          }
        />
      </View>
      <ScrollView contentContainerStyle={s.content}>
        {item.type === "video" ? (
          <VideoPlayer
            key={item.id}
            item={item}
            onClose={onClose}
            navigate={navigate}
          />
        ) : (
          <>
            <View style={st.photo} {...gestures.panHandlers}>
              <Image
                source={{ uri: item.uri }}
                style={StyleSheet.absoluteFill}
                resizeMode="cover"
                onError={() => setImageError(true)}
                accessibilityLabel="Photo de l’album"
              />
              <View style={st.photoTop}>
                <Label
                  numberOfLines={1}
                  style={[s.badge, { flex: 1, fontSize: 8 }]}
                >
                  ● PHOTO {index + 1} SUR {items.length} // JJB GI AVANCÉ • MER.
                </Label>
                <IconButton
                  icon={Info}
                  label="Informations de la photo"
                  onPress={() =>
                    setNotice(
                      "Métadonnées de démonstration : 1/1000s • f/2.0 • ISO 1600.",
                    )
                  }
                />
                <IconButton
                  icon={ZoomIn}
                  label="Agrandir la photo"
                  onPress={() => setZoom(true)}
                />
              </View>
              <View style={st.arrows}>
                <IconButton
                  icon={ChevronLeft}
                  label="Photo précédente"
                  onPress={() => navigate(-1)}
                  style={st.overlay}
                />
                <IconButton
                  icon={ChevronRight}
                  label="Photo suivante"
                  onPress={() => navigate(1)}
                  style={st.overlay}
                />
              </View>
              {imageError && (
                <Label style={st.imageError}>
                  Photo indisponible. Vérifiez votre connexion.
                </Label>
              )}
            </View>
            <View style={s.row}>
              <Camera size={14} color={C.muted} />
              <Label style={[s.muted, { flex: 1, fontSize: 10 }]}>
                {item.caption || "Média importé • aperçu local"}
              </Label>
            </View>
          </>
        )}
        {item.type === "video" && (
          <View style={[s.card, s.row]}>
            <Users color={C.red} size={24} />
            <View style={{ flex: 1 }}>
              <Label style={s.bold}>ATHLÈTES TATAMI</Label>
              <Label style={s.muted}>Participants : Léo M., Inès R.</Label>
            </View>
            <Label style={s.badge}>● NO-GI</Label>
          </View>
        )}
        <View style={s.row}>
          <Button
            icon={Download}
            title="TÉLÉCHARGER"
            secondary
            disabled={busy}
            onPress={() => action("download")}
          />
          <Button
            icon={Share2}
            title="PARTAGER"
            disabled={busy}
            onPress={() => action("share")}
          />
        </View>
        {busy && <Label style={s.muted}>Préparation du média…</Label>}
        {!!notice && (
          <Label accessibilityLiveRegion="polite" style={s.muted}>
            {notice}
          </Label>
        )}
        {item.type === "video" ? (
          <View style={s.card}>
            <View style={s.between}>
              <Label style={s.bold}>TECHNIQUE PIVOT</Label>
              <Label style={[s.bold, s.red]}>01:42 ANALYSE</Label>
            </View>
            <Label style={s.muted}>
              Passage en Guillo-Darce inversée suite au scramble défensif contre
              la cage tatami. Pression scapulaire verrouillée.
            </Label>
          </View>
        ) : (
          <>
            <View
              style={[s.card, { borderLeftWidth: 3, borderLeftColor: C.red }]}
            >
              <Label style={s.bold}>{item.title || "PHOTO IMPORTÉE"}</Label>
              <Label style={[s.bold, { fontSize: 10 }]}>
                PASSAGE DE GARDE DE LA RIVA
              </Label>
              <Label style={s.red}>1/1000s • f/2.0 • ISO 1600</Label>
              <Label style={s.muted}>
                Phase d’écrasement en tripod passée avec verrouillage du col.
                Transition vers contrôle latéral à 3:42 du round 4.
              </Label>
            </View>
            <View>
              <Label style={s.bold}>BOBINE DU CAMP</Label>
              <Label style={s.muted}>
                // {items.length} clichés haute définition
              </Label>
            </View>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ gap: 10 }}
            >
              {items.map((photo, i) => (
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel={`Afficher la photo ${i + 1}`}
                  accessibilityState={{ selected: i === index }}
                  key={photo.id}
                  onPress={() => {
                    setIndex(i);
                    setImageError(false);
                  }}
                  style={[st.thumbnail, i === index && { borderColor: C.red }]}
                >
                  <Image
                    source={{ uri: photo.uri }}
                    style={{ width: "100%", height: "100%" }}
                  />
                  {i === index && <View style={st.activeDot} />}
                </Pressable>
              ))}
            </ScrollView>
          </>
        )}
        {!media && (
          <Label style={[s.muted, { fontSize: 9 }]}>
            APERÇU DÉMO • Médias et métadonnées illustratifs.
          </Label>
        )}
      </ScrollView>
      <View style={st.footer}>
        <IconButton
          icon={Share2}
          label="Partager"
          disabled={busy}
          onPress={() => action("share")}
        />
        <IconButton
          icon={Bookmark}
          label={
            saved.includes(item.id)
              ? "Retirer des favoris"
              : "Ajouter aux favoris"
          }
          color={saved.includes(item.id) ? C.red : C.muted}
          onPress={toggleSave}
        />
        <IconButton
          icon={Download}
          label="Télécharger"
          disabled={busy}
          onPress={() => action("download")}
        />
        <IconButton
          icon={Trash2}
          label="Supprimer de l’album démo"
          disabled={busy}
          onPress={() => setConfirmDelete(true)}
        />
      </View>
      <Modal
        visible={zoom}
        animationType="fade"
        onRequestClose={() => setZoom(false)}
      >
        <SafeAreaView style={s.safe}>
          <IconButton
            icon={X}
            label="Fermer le zoom"
            onPress={() => setZoom(false)}
          />
          <ScrollView
            minimumZoomScale={1}
            maximumZoomScale={4}
            centerContent
            contentContainerStyle={{ flexGrow: 1 }}
          >
            <Image
              source={{ uri: item.uri }}
              style={{ flex: 1, minHeight: 500, width: "100%" }}
              resizeMode="contain"
            />
          </ScrollView>
        </SafeAreaView>
      </Modal>
      <Modal
        visible={confirmDelete}
        transparent
        animationType="fade"
        onRequestClose={() => setConfirmDelete(false)}
      >
        <View style={st.modal}>
          <View style={[s.card, { width: "100%", maxWidth: 420 }]}>
            <Label style={s.bold}>RETIRER CE MÉDIA ?</Label>
            <Label style={s.muted}>
              Il sera retiré de cet aperçu uniquement. Le fichier d’origine sera
              conservé.
            </Label>
            <View style={s.row}>
              <Button
                title="ANNULER"
                secondary
                onPress={() => setConfirmDelete(false)}
              />
              <Button title="RETIRER" onPress={remove} />
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
const st = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: C.border,
    paddingHorizontal: 8,
    minHeight: 58,
  },
  video: {
    height: 300,
    backgroundColor: "#141416",
    borderRadius: 4,
    overflow: "hidden",
    justifyContent: "space-between",
  },
  videoTop: {
    flexDirection: "row",
    alignItems: "center",
    paddingRight: 10,
    backgroundColor: "#00000099",
  },
  playRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 24,
  },
  play: {
    width: 86,
    height: 58,
    borderRadius: 4,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#B92121CC",
  },
  center: { textAlign: "center", fontSize: 10 },
  hint: {
    fontSize: 8,
    textAlign: "center",
    paddingHorizontal: 25,
    backgroundColor: "#00000066",
  },
  videoBottom: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#00000099",
  },
  scrub: { flex: 1, height: 44, justifyContent: "center" },
  track: { height: 3, backgroundColor: "#3E3E42" },
  fill: { height: 3, backgroundColor: C.red },
  knob: {
    position: "absolute",
    top: -4,
    marginLeft: -5,
    width: 11,
    height: 11,
    borderRadius: 6,
    backgroundColor: C.red,
  },
  photo: {
    height: 340,
    backgroundColor: C.card,
    borderRadius: 4,
    overflow: "hidden",
  },
  photoTop: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#00000099",
    paddingLeft: 8,
  },
  arrows: {
    position: "absolute",
    top: "45%",
    left: 6,
    right: 6,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  overlay: { backgroundColor: "#00000099", borderRadius: 4 },
  imageError: { position: "absolute", bottom: 20, left: 20, right: 20 },
  thumbnail: {
    width: 76,
    height: 76,
    borderWidth: 2,
    borderColor: C.border,
    borderRadius: 4,
    overflow: "hidden",
  },
  activeDot: {
    position: "absolute",
    right: 4,
    bottom: 4,
    width: 7,
    height: 7,
    backgroundColor: C.red,
    borderRadius: 4,
  },
  footer: {
    height: 60,
    borderTopWidth: 1,
    borderTopColor: C.border,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
  },
  modal: {
    flex: 1,
    padding: 24,
    backgroundColor: "#000000CC",
    alignItems: "center",
    justifyContent: "center",
  },
});
