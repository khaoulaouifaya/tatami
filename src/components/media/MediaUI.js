import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
export const C = {
  bg: "#0B0B0B",
  card: "#1A1A1C",
  border: "#28282C",
  red: "#E5322D",
  white: "#FFFFFF",
  muted: "#9A9A9F",
};
export function Label({ style, children, ...props }) {
  return (
    <Text {...props} style={[s.text, style]}>
      {children}
    </Text>
  );
}
export function IconButton({
  icon: Icon,
  label,
  onPress,
  color = C.white,
  disabled,
  style,
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      disabled={disabled}
      onPress={onPress}
      style={[s.icon, style, disabled && { opacity: 0.35 }]}
    >
      <Icon size={21} color={color} strokeWidth={1.6} />
    </Pressable>
  );
}
export function Button({ title, icon: Icon, onPress, secondary, disabled }) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: !!disabled }}
      disabled={disabled}
      onPress={onPress}
      style={[s.button, secondary && s.secondary, disabled && { opacity: 0.4 }]}
    >
      {Icon && <Icon size={18} color={C.white} />}
      <Label style={s.bold}>{title}</Label>
    </Pressable>
  );
}
export function Step({ number, title }) {
  return (
    <View style={s.row}>
      <Label style={s.step}>{number}</Label>
      <Label style={s.bold}>{title}</Label>
    </View>
  );
}
export const s = StyleSheet.create({
  text: {
    color: C.white,
    fontFamily: "Chivo-Regular",
    fontSize: 12,
    lineHeight: 18,
  },
  bold: {
    color: C.white,
    fontFamily: "Anybody-Bold",
    fontSize: 11,
    lineHeight: 17,
  },
  title: {
    color: C.white,
    fontFamily: "Anybody-BlackItalic",
    fontSize: 30,
    lineHeight: 34,
  },
  muted: { color: C.muted },
  red: { color: C.red },
  safe: { flex: 1, backgroundColor: C.bg },
  content: {
    padding: 20,
    gap: 18,
    width: "100%",
    maxWidth: 720,
    alignSelf: "center",
    paddingBottom: 28,
  },
  row: { flexDirection: "row", alignItems: "center", gap: 10 },
  between: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
  },
  card: {
    backgroundColor: C.card,
    borderColor: C.border,
    borderWidth: 1,
    borderRadius: 4,
    padding: 14,
    gap: 10,
  },
  icon: {
    minWidth: 44,
    minHeight: 44,
    alignItems: "center",
    justifyContent: "center",
  },
  button: {
    flex: 1,
    height: 54,
    borderRadius: 4,
    backgroundColor: C.red,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  secondary: { backgroundColor: C.card, borderWidth: 1, borderColor: C.border },
  step: {
    fontFamily: "Anybody-Bold",
    fontSize: 11,
    color: C.red,
    borderWidth: 1,
    borderColor: C.border,
    borderRadius: 4,
    padding: 6,
  },
  badge: {
    fontFamily: "Anybody-Bold",
    fontSize: 9,
    paddingHorizontal: 7,
    paddingVertical: 4,
    backgroundColor: C.card,
    borderWidth: 1,
    borderColor: C.border,
    borderRadius: 4,
  },
});
