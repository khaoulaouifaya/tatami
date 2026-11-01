import React, { useEffect, useRef, useState } from "react";
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as ImagePicker from "expo-image-picker";
import {
  ArrowLeftRight,
  Bell,
  Check,
  ChevronRight,
  CloudUpload,
  FileImage,
  Film,
  Info,
  LockKeyhole,
  Search,
  Upload,
  UserRound,
  X,
} from "lucide-react-native";
import {
  Button,
  C,
  IconButton,
  Label,
  s,
  Step,
} from "../components/media/MediaUI";
import { initialFiles, students } from "../data/mediaDemo";

export default function AddMediaScreen({ embedded = false, onPreview }) {
  const [scope, setScope] = useState("some");
  const [selected, setSelected] = useState(["mehdi", "sarah", "lucas"]);
  const [query, setQuery] = useState("");
  const [files, setFiles] = useState(initialFiles);
  const [sending, setSending] = useState(false);
  const [message, setMessage] = useState("");
  const [course, setCourse] = useState(0);
  const timer = useRef(null);
  useEffect(() => () => clearInterval(timer.current), []);
  const recipients = students.filter(
    (p) => p.consent && (scope === "all" || selected.includes(p.id)),
  );
  function changeScope(value) {
    setScope(value);
    setMessage("");
    if (value === "one") setSelected(selected.slice(0, 1));
  }
  function toggle(id) {
    setMessage("");
    setSelected((prev) =>
      scope === "one"
        ? prev.includes(id)
          ? []
          : [id]
        : prev.includes(id)
          ? prev.filter((x) => x !== id)
          : [...prev, id],
    );
  }
  async function pick() {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images", "videos"],
        allowsMultipleSelection: true,
        quality: 1,
      });
      if (!result.canceled) {
        setMessage("");
        setFiles((prev) => [
          ...prev,
          ...result.assets.map((a, i) => ({
            id: `${Date.now()}-${i}`,
            uri: a.uri,
            name:
              a.fileName || `media-${i}.${a.type === "video" ? "mp4" : "jpg"}`,
            size: a.fileSize || 0,
            type: a.type,
            progress: 0,
          })),
        ]);
      }
    } catch (error) {
      Alert.alert("Galerie indisponible", error.message);
    }
  }
  function send() {
    setSending(true);
    setMessage("Simulation de téléversement en cours…");
    timer.current = setInterval(
      () =>
        setFiles((prev) =>
          prev.map((f) => ({ ...f, progress: Math.min(1, f.progress + 0.08) })),
        ),
      160,
    );
  }
  // Synchronize the completion message with the simulated transfer timer.
  /* eslint-disable react/set-state-in-effect */
  useEffect(() => {
    if (sending && files.length && files.every((f) => f.progress >= 1)) {
      clearInterval(timer.current);
      setSending(false);
      setMessage(
        `Simulation terminée • ${files.length} fichiers • ${recipients.length} destinataires. Aucun média transmis au serveur.`,
      );
    }
  }, [files, sending, recipients.length]);
  /* eslint-enable react/set-state-in-effect */
  const Wrapper = embedded ? View : SafeAreaView;
  return (
    <Wrapper style={s.safe}>
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={s.content}
      >
        <View style={s.between}>
          <View style={s.row}>
            <Label style={st.brand}>TATAMI</Label>
            <Label style={s.badge}>CDL STAFF</Label>
          </View>
          <View style={s.row}>
            <IconButton
              icon={Bell}
              label="Notifications"
              onPress={() =>
                Alert.alert("Notifications", "Aucune nouvelle notification.")
              }
            />
            <View style={st.avatar}>
              <UserRound color={C.bg} size={21} />
            </View>
          </View>
        </View>
        <View style={{ gap: 8 }}>
          <Label style={[s.bold, s.red]}>▪ MÉDIATHÈQUE TATAMI</Label>
          <Label style={s.title}>AJOUTER DES MÉDIAS</Label>
          <Label style={s.muted}>DU TAPIS À LA TRANSMISSION.</Label>
        </View>
        <Step number="01" title="SÉLECTION DU COURS" />
        <View style={[s.card, st.accent]}>
          <View style={s.between}>
            <Label style={s.badge}>GI</Label>
            <Label style={[s.bold, s.red]}>EN DIRECT</Label>
          </View>
          <View style={s.row}>
            <View style={{ flex: 1 }}>
              <Label numberOfLines={1} style={s.bold}>
                {course === 0
                  ? "JJB GI AVANCÉ & SPARRING"
                  : "JJB GI TECHNIQUE & DRILLS"}
              </Label>
              <Label style={s.muted}>
                {course === 0
                  ? "Mercredi 18h30 - 20h00"
                  : "Vendredi 18h30 - 20h00"}
              </Label>
              <Label style={s.muted}>Tapis 1 Bastille • 22 inscrits</Label>
            </View>
            <IconButton
              disabled={sending}
              icon={ArrowLeftRight}
              label="Changer de cours de démonstration"
              onPress={() => {
                setCourse(1 - course);
                setSelected([]);
                setScope("some");
                setMessage(
                  "Cours démo changé : resélectionnez les destinataires.",
                );
              }}
            />
          </View>
        </View>
        <Step number="02" title="IMPORT BRUT" />
        <Pressable
          disabled={sending}
          accessibilityRole="button"
          accessibilityLabel="Choisir des images ou vidéos dans la galerie"
          onPress={pick}
          style={[s.card, st.import]}
        >
          <Upload size={30} color={C.red} />
          <View style={{ flex: 1 }}>
            <Label style={s.bold}>CHOISIR DANS LA GALERIE</Label>
            <Label style={s.muted}>
              JPG, MP4 • {files.length} fichiers sélectionnés
            </Label>
          </View>
          <ChevronRight color={C.red} size={18} />
        </Pressable>
        <Step number="03" title="PERMISSIONS / DROIT À L’IMAGE" />
        <View style={s.card}>
          <Label style={s.bold}>QUI EST CONCERNÉ ?</Label>
          {[
            ["all", "TOUTE LA SÉANCE (GROUPE)"],
            ["some", "CERTAINS PARTICIPANTS"],
            ["one", "UN SEUL PARTICIPANT"],
          ].map(([id, title]) => (
            <Pressable
              key={id}
              disabled={sending}
              accessibilityRole="radio"
              accessibilityState={{ checked: scope === id }}
              onPress={() => changeScope(id)}
              style={st.option}
            >
              <View style={[st.square, scope === id && { borderColor: C.red }]}>
                {scope === id && <View style={st.dot} />}
              </View>
              <Label style={s.bold}>{title}</Label>
            </Pressable>
          ))}
          <View style={[s.row, { alignItems: "flex-start" }]}>
            <Info size={16} color={C.red} />
            <Label style={[s.muted, { flex: 1 }]}>
              Seules les personnes cochées verront ces médias dans leur espace.
              Les élèves sans autorisation sont exclus.
            </Label>
          </View>
          <View style={st.search}>
            <Search color={C.muted} size={17} />
            <TextInput
              accessibilityLabel="Rechercher un élève"
              placeholder="Rechercher un élève, enfant, adulte…"
              placeholderTextColor={C.muted}
              value={query}
              onChangeText={setQuery}
              style={st.input}
            />
          </View>
          {students
            .filter((p) =>
              `${p.name} ${p.category}`
                .toLowerCase()
                .includes(query.toLowerCase()),
            )
            .map((p) => {
              const checked =
                p.consent && (scope === "all" || selected.includes(p.id));
              return (
                <Pressable
                  key={p.id}
                  disabled={!p.consent || scope === "all" || sending}
                  onPress={() => toggle(p.id)}
                  accessibilityRole="checkbox"
                  accessibilityLabel={`${p.name}, ${p.category}${!p.consent ? ", sans autorisation droit à l’image" : ""}`}
                  accessibilityState={{
                    checked,
                    disabled: !p.consent || scope === "all" || sending,
                  }}
                  style={[st.student, !p.consent && { opacity: 0.4 }]}
                >
                  <View style={{ flex: 1 }}>
                    <View style={s.row}>
                      <Label>{p.name}</Label>
                      <Label style={[s.muted, { fontSize: 9 }]}>
                        {p.category}
                      </Label>
                    </View>
                    {!p.consent && (
                      <View style={s.row}>
                        <LockKeyhole size={11} color={C.muted} />
                        <Label style={{ fontSize: 10 }}>
                          Sans autorisation droit à l’image
                        </Label>
                      </View>
                    )}
                  </View>
                  <View style={[st.square, checked && st.checked]}>
                    {checked ? (
                      <Check size={14} color="white" />
                    ) : (
                      !p.consent && <LockKeyhole size={12} color={C.muted} />
                    )}
                  </View>
                </Pressable>
              );
            })}
          <Label style={[s.red, { fontSize: 10 }]}>
            {recipients.length} DESTINATAIRE(S) AUTORISÉ(S)
          </Label>
        </View>
        <View style={s.between}>
          <Label style={s.bold}>FICHIERS PRÊTS ({files.length})</Label>
          <Label style={s.muted}>
            Total{" "}
            {Math.round(files.reduce((n, f) => n + f.size, 0) / 1024 ** 2)} Mo
          </Label>
        </View>
        {files.map((f) => {
          const Icon = f.type === "video" ? Film : FileImage;
          return (
            <View
              key={f.id}
              style={[s.card, { padding: 0, overflow: "hidden" }]}
            >
              <View style={[s.row, { padding: 10 }]}>
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel={`Prévisualiser ${f.name}`}
                  onPress={() => onPreview?.(f)}
                  style={st.thumb}
                >
                  <Icon color={C.muted} size={22} />
                </Pressable>
                <View style={{ flex: 1 }}>
                  <Label numberOfLines={1} style={{ fontSize: 11 }}>
                    {f.name}
                  </Label>
                  <Label style={[s.muted, { fontSize: 10 }]}>
                    {f.size
                      ? `${Math.round(f.size / 1024 ** 2)} Mo`
                      : "Poids inconnu"}{" "}
                    • {f.type === "video" ? "Vidéo" : "Image"} •{" "}
                    {Math.round(f.progress * 100)}%
                  </Label>
                </View>
                <IconButton
                  icon={X}
                  label={`Retirer ${f.name}`}
                  disabled={sending}
                  onPress={() => {
                    setFiles((prev) => prev.filter((x) => x.id !== f.id));
                    setMessage("");
                  }}
                />
              </View>
              <View style={st.track}>
                <View
                  style={{
                    height: 2,
                    width: `${f.progress * 100}%`,
                    backgroundColor: C.red,
                  }}
                />
              </View>
            </View>
          );
        })}
        {!!message && (
          <Label accessibilityLiveRegion="polite" style={s.muted}>
            {message}
          </Label>
        )}
        <View style={s.row}>
          <Button
            icon={CloudUpload}
            disabled={sending || !files.length || !recipients.length}
            title={
              sending ? "ENVOI EN COURS…" : `ENVOYER (${files.length} FICHIERS)`
            }
            onPress={send}
          />
        </View>
      </ScrollView>
    </Wrapper>
  );
}
const st = StyleSheet.create({
  brand: { fontFamily: "Anybody-BlackItalic", fontSize: 24 },
  avatar: {
    width: 34,
    height: 34,
    borderRadius: 4,
    backgroundColor: "#FFB4AB",
    alignItems: "center",
    justifyContent: "center",
  },
  accent: { borderLeftWidth: 3, borderLeftColor: C.red },
  import: {
    flexDirection: "row",
    alignItems: "center",
    minHeight: 100,
    borderColor: "#71302F",
  },
  square: {
    width: 22,
    height: 22,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "#555558",
    alignItems: "center",
    justifyContent: "center",
  },
  dot: { width: 10, height: 10, backgroundColor: C.red },
  checked: { backgroundColor: C.red, borderColor: C.red },
  option: {
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
    minHeight: 44,
  },
  search: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 10,
    backgroundColor: C.bg,
    borderWidth: 1,
    borderColor: C.border,
    borderRadius: 4,
  },
  input: {
    flex: 1,
    minHeight: 46,
    color: C.white,
    fontFamily: "Chivo-Regular",
    fontSize: 11,
  },
  student: {
    minHeight: 54,
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: C.border,
    paddingVertical: 9,
  },
  thumb: {
    width: 42,
    height: 46,
    backgroundColor: C.bg,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 4,
  },
  track: { height: 2, backgroundColor: C.border },
});
