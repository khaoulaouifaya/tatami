import { useEffect, useState } from "react";
import {
  BackHandler,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from "react-native";
import {
  ArrowLeft,
  Bell,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  CircleAlert,
  Info,
  ShieldCheck,
  UserRound,
  X,
} from "lucide-react-native";
import { Button, C, IconButton, Label, s } from "../components/media/MediaUI";
import { compensationPeriods } from "../data/compensationDemo";
import { compensationSummary, HOURLY_RATE } from "../utils/sessionRules.mjs";
const money = (value) =>
  value.toLocaleString("fr-FR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
export default function CompensationScreen({ onBack }) {
  useEffect(() => {
    const subscription = BackHandler.addEventListener(
      "hardwareBackPress",
      () => {
        onBack();
        return true;
      },
    );
    return () => subscription.remove();
  }, [onBack]);
  const [month, setMonth] = useState(new Date(2026, 10, 1));
  const [expanded, setExpanded] = useState(false);
  const [reportOpen, setReportOpen] = useState(false);
  const [report, setReport] = useState("");
  const [reported, setReported] = useState(false);
  const key = `${month.getFullYear()}-${String(month.getMonth() + 1).padStart(2, "0")}`;
  const period = compensationPeriods[key] || {
    status: "en_cours",
    sessions: [],
  };
  const summary = compensationSummary(period.sessions);
  const validated = period.status === "validee";
  const monthLabel = month
    .toLocaleDateString("fr-FR", { month: "long", year: "numeric" })
    .toUpperCase();
  const changeMonth = (delta) => {
    setMonth(new Date(month.getFullYear(), month.getMonth() + delta, 1));
    setExpanded(false);
    setReported(false);
    setReport("");
  };
  return (
    <View style={s.safe}>
      <View style={st.header}>
        <IconButton
          icon={ArrowLeft}
          label="Retour au profil"
          onPress={onBack}
        />
        <Label style={[st.heading, { flex: 1 }]}>MON DÉFRAIEMENT</Label>
        <Bell size={18} color={C.muted} />
        <View style={st.avatar}>
          <UserRound color={C.bg} size={18} />
        </View>
      </View>
      <ScrollView contentContainerStyle={s.content}>
        <View>
          <Label style={[s.bold, { fontSize: 9 }]}>
            ♢ ESPACE COACH & STAFF CDL
          </Label>
          <Label style={s.title}>MON DÉFRAIEMENT</Label>
          <Label style={[s.muted, { fontSize: 9, letterSpacing: 1 }]}>
            INDEMNITÉS D’ENCADREMENT & SÉANCES TATAMI
          </Label>
        </View>
        <View style={[s.card, s.between]}>
          <IconButton
            icon={ChevronLeft}
            label="Mois précédent"
            onPress={() => changeMonth(-1)}
          />
          <View style={s.row}>
            <CalendarDays size={17} color={C.red} />
            <Label style={st.heading}>{monthLabel}</Label>
          </View>
          <IconButton
            icon={ChevronRight}
            label="Mois suivant"
            onPress={() => changeMonth(1)}
          />
        </View>
        <View style={[s.card, st.accent, st.summary]}>
          <View style={s.between}>
            <Label style={st.micro}>
              {validated ? "MONTANT VALIDÉ" : "MONTANT PROVISOIRE"}
            </Label>
            <Label style={st.status}>
              ● {validated ? "VALIDÉE" : "EN COURS"}
            </Label>
          </View>
          <Label style={st.amount}>
            {money(summary.amount)} <Label style={[st.amount, s.red]}>€</Label>
          </Label>
          <Label style={s.muted}>
            Calculé sur {summary.count} séances effectuées ce mois-ci.{" "}
            {validated
              ? "Période validée par le bureau CDL."
              : "En attente de validation comptable de fin de mois."}
          </Label>
          <View style={st.stats}>
            {[
              ["SÉANCES", summary.count],
              ["VOLUME", `${money(summary.hours)} H`],
              [
                "ÉCHÉANCE",
                `${new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate()} ${month.toLocaleDateString("fr-FR", { month: "short" }).toUpperCase()}`,
              ],
            ].map(([label, value], i) => (
              <View key={label} style={st.stat}>
                <Label style={st.micro}>{label}</Label>
                <Label style={[st.heading, i === 1 && s.red]}>{value}</Label>
              </View>
            ))}
          </View>
        </View>
        <View style={[s.card, s.between]}>
          <ShieldCheck size={15} color={C.muted} />
          <Label style={[s.muted, { flex: 1, fontSize: 10 }]}>
            Statut transmission bureau CDL
          </Label>
          <Label style={[st.micro, s.red]}>
            {validated ? "CYCLE VALIDÉ" : "CYCLE ACTIF"}
          </Label>
        </View>
        <View style={s.between}>
          <Label style={st.heading}>DÉTAIL DES SÉANCES</Label>
          <Label style={s.badge}>● {summary.count} SÉANCES</Label>
        </View>
        {!summary.count && (
          <View style={s.card}>
            <CalendarDays color={C.red} size={24} />
            <Label style={st.heading}>AUCUNE SÉANCE</Label>
            <Label style={s.muted}>
              Aucune séance enregistrée sur cette période.
            </Label>
          </View>
        )}
        {(expanded ? period.sessions : period.sessions.slice(0, 7)).map(
          (session) => (
            <View style={s.card} key={session.id}>
              <View style={s.between}>
                <Label style={st.micro}>
                  {new Date(`${session.date}T12:00:00`)
                    .toLocaleDateString("fr-FR", {
                      weekday: "long",
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })
                    .toUpperCase()}
                </Label>
                <Label style={st.micro}>{session.category}</Label>
              </View>
              <View style={s.between}>
                <View style={{ flex: 1 }}>
                  <Label style={st.heading}>{session.title}</Label>
                  <Label style={[s.muted, { fontSize: 10 }]}>
                    {session.time} • Durée {session.minutes / 60} h
                  </Label>
                </View>
                <Label style={st.heading}>
                  {money((session.minutes / 60) * HOURLY_RATE)} €
                </Label>
              </View>
            </View>
          ),
        )}
        {period.sessions.length > 7 && (
          <Pressable
            accessibilityRole="button"
            onPress={() => setExpanded(!expanded)}
            style={st.more}
          >
            <Label style={s.muted}>
              {expanded
                ? "Réduire la liste"
                : `+ ${period.sessions.length - 7} séances précédentes • Afficher`}
            </Label>
          </Pressable>
        )}
        <View style={s.card}>
          <View style={s.row}>
            <Info color={C.red} size={15} />
            <Label style={st.micro}>BARÈME OFFICIEL DU CLUB • 12 €/H</Label>
          </View>
          <View style={st.stats}>
            {[
              ["BABY 1 H", "12 €"],
              ["KIDS 1,25 H", "15 €"],
              ["ADOS 1,5 H", "18 €"],
            ].map(([label, value]) => (
              <View style={st.stat} key={label}>
                <Label style={st.micro}>{label}</Label>
                <Label style={st.heading}>{value}</Label>
              </View>
            ))}
          </View>
        </View>
        {reported && (
          <Label accessibilityLiveRegion="polite" style={s.muted}>
            Signalement conservé dans cet aperçu. Aucun message n’a été envoyé
            au bureau.
          </Label>
        )}
        <View style={s.row}>
          <Button
            secondary
            icon={CircleAlert}
            title="SIGNALER UNE SÉANCE MANQUANTE"
            onPress={() => setReportOpen(true)}
          />
        </View>
        <Label style={[s.muted, { fontSize: 9 }]}>
          Données d’exemple • À relier aux présences validées par
          l’administration.
        </Label>
      </ScrollView>
      <Modal
        transparent
        visible={reportOpen}
        animationType="fade"
        onRequestClose={() => setReportOpen(false)}
      >
        <View style={st.backdrop}>
          <View style={[s.card, st.dialog]}>
            <View style={s.between}>
              <Label style={s.bold}>SÉANCE MANQUANTE</Label>
              <IconButton
                icon={X}
                label="Fermer le signalement"
                onPress={() => setReportOpen(false)}
              />
            </View>
            <Label style={s.muted}>
              Indiquez la date, le cours et les horaires de la séance.
            </Label>
            <TextInput
              accessibilityLabel="Description de la séance manquante"
              placeholder="Ex. 25 novembre, Kids, 15h15–16h30"
              placeholderTextColor={C.muted}
              value={report}
              onChangeText={setReport}
              multiline
              style={st.input}
            />
            <Label style={s.muted}>Aperçu local : aucun envoi au bureau.</Label>
            <View style={s.row}>
              <Button
                title="ENREGISTRER LE SIGNALEMENT"
                disabled={!report.trim()}
                onPress={() => {
                  setReported(true);
                  setReportOpen(false);
                }}
              />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}
const st = StyleSheet.create({
  header: {
    minHeight: 60,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingRight: 20,
    borderBottomWidth: 1,
    borderBottomColor: C.border,
  },
  heading: { fontFamily: "Anybody-BlackItalic", fontSize: 16, lineHeight: 22 },
  avatar: {
    backgroundColor: "#FFB4AB",
    width: 32,
    height: 32,
    borderRadius: 4,
    alignItems: "center",
    justifyContent: "center",
  },
  accent: { borderLeftColor: C.red, borderLeftWidth: 3 },
  summary: { gap: 16, paddingVertical: 20 },
  amount: { fontFamily: "Anybody-BlackItalic", fontSize: 36, lineHeight: 42 },
  micro: {
    fontFamily: "Anybody-Bold",
    fontSize: 8,
    lineHeight: 12,
    color: "#C2BABB",
  },
  status: {
    backgroundColor: C.red,
    color: C.bg,
    paddingHorizontal: 8,
    borderRadius: 4,
    fontSize: 8,
    fontFamily: "Anybody-Bold",
  },
  stats: { flexDirection: "row", paddingVertical: 8 },
  stat: { flex: 1, alignItems: "center", gap: 6 },
  more: { minHeight: 44, justifyContent: "center", alignItems: "center" },
  backdrop: {
    flex: 1,
    backgroundColor: "#000000CC",
    padding: 22,
    justifyContent: "center",
    alignItems: "center",
  },
  dialog: { width: "100%", maxWidth: 500 },
  input: {
    minHeight: 100,
    padding: 12,
    borderWidth: 1,
    borderColor: C.border,
    borderRadius: 4,
    color: C.white,
    fontFamily: "Chivo-Regular",
    textAlignVertical: "top",
  },
});
