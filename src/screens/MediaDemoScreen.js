import React, { useEffect, useState } from "react";
import { BackHandler, Pressable, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  Activity,
  CalendarDays,
  ClipboardList,
  Images,
  UserRound,
} from "lucide-react-native";
import AddMediaScreen from "./AddMediaScreen";
import MediaViewerScreen from "./MediaViewerScreen";
import { C, Label, s } from "../components/media/MediaUI";
import { demoAlbum, demoVideos } from "../data/mediaDemo";
export default function MediaDemoScreen({ onExit }) {
  const [screen, setScreen] = useState("add");
  const [preview, setPreview] = useState(null);
  useEffect(() => {
    const subscription = BackHandler.addEventListener(
      "hardwareBackPress",
      () => {
        if (screen !== "add") {
          setPreview(null);
          setScreen("add");
        } else onExit();
        return true;
      },
    );
    return () => subscription.remove();
  }, [screen, onExit]);
  return (
    <View style={s.safe}>
      <SafeAreaView edges={["top"]} style={st.menu}>
        <Label style={st.caption}>SPRINT 05</Label>
        {[
          ["add", "AJOUT"],
          ["video", "VIDÉO"],
          ["image", "PHOTO"],
        ].map(([id, name]) => (
          <Pressable
            accessibilityRole="tab"
            accessibilityState={{ selected: screen === id }}
            key={id}
            onPress={() => {
              setPreview(null);
              setScreen(id);
            }}
            style={st.menuItem}
          >
            <Label style={[st.caption, screen === id && s.red]}>{name}</Label>
          </Pressable>
        ))}
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Retour à l’application"
          onPress={onExit}
          style={st.menuItem}
        >
          <Label style={st.caption}>FERMER</Label>
        </Pressable>
      </SafeAreaView>
      <View style={screen === "add" ? st.visible : st.hidden}>
        <AddMediaScreen
          embedded
          onPreview={(file) => {
            setPreview(
              file.uri
                ? file
                : file.type === "video"
                  ? demoVideos[0]
                  : demoAlbum[3],
            );
            setScreen(file.type);
          }}
        />
        <SafeAreaView edges={["bottom"]} style={st.bottom}>
          <View style={st.tabs}>
            {[
              [CalendarDays, "SÉANCES"],
              [ClipboardList, "APPEL"],
              [Activity, "TECHNIQUES"],
              [Images, "MÉDIAS"],
              [UserRound, "PROFIL"],
            ].map(([Icon, title]) => (
              <Pressable
                accessibilityRole="tab"
                accessibilityState={{ selected: title === "MÉDIAS" }}
                key={title}
                onPress={() => title !== "MÉDIAS" && onExit(title)}
                style={st.tab}
              >
                <Icon size={20} color={title === "MÉDIAS" ? C.red : C.muted} />
                <Label style={[st.tabLabel, title === "MÉDIAS" && s.red]}>
                  {title}
                </Label>
              </Pressable>
            ))}
          </View>
        </SafeAreaView>
      </View>
      {screen !== "add" && (
        <MediaViewerScreen
          key={`${screen}-${preview?.id || "demo"}`}
          mode={screen}
          media={preview}
          onClose={() => {
            setPreview(null);
            setScreen("add");
          }}
        />
      )}
    </View>
  );
}
const st = StyleSheet.create({
  visible: { flex: 1 },
  hidden: { display: "none" },
  menu: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    backgroundColor: C.bg,
    borderBottomWidth: 1,
    borderBottomColor: C.border,
    paddingHorizontal: 8,
  },
  caption: { fontSize: 8, color: C.muted, fontFamily: "Anybody-Bold" },
  menuItem: { minHeight: 36, justifyContent: "center", paddingHorizontal: 6 },
  bottom: { backgroundColor: C.card },
  tabs: {
    flexDirection: "row",
    height: 64,
    borderTopWidth: 1,
    borderTopColor: C.border,
  },
  tab: { flex: 1, alignItems: "center", justifyContent: "center", gap: 5 },
  tabLabel: { fontSize: 8, color: C.muted, fontFamily: "Anybody-Bold" },
});
