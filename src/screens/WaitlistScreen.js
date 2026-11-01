import { useState } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import {
  ArrowLeft,
  Bell,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Flame,
  Gavel,
  Info,
  MapPin,
  Shield,
  TimerOff,
  UserRound,
  UserRoundMinus,
  X,
  Zap,
} from "lucide-react-native";
import Svg, { Circle } from "react-native-svg";
import { Button, C, IconButton, Label, s } from "../components/media/MediaUI";
const OFFER_MINUTES = 15; // Design default; the production API must provide expires_at.
export default function WaitlistScreen({
  session,
  role = "adult",
  onBack,
  onBrowse,
  onConfirmed,
  waitlist,
}) {
  const [showTestStates, setShowTestStates] = useState(false);
  const { status: state, remaining, offer, changeStatus } = waitlist;
  const title = session?.title || "JJB KIDS & CADETS (10–15 ANS)";
  const date = session?.dateLabel || "Mercredi 25 novembre 2026";
  const time = session?.time || "18:00 – 19:30";
  function confirm() {
    if (waitlist.confirm()) onConfirmed?.();
  }
  const closed = ["expired", "declined", "left"].includes(state);
  return (
    <View style={s.safe}>
      <View style={st.header}>
        <IconButton
          icon={ArrowLeft}
          label="Retour au détail de la séance"
          onPress={onBack}
        />
        <Label style={[st.heading, { flex: 1 }]}>SESSION DETAIL</Label>
        <Bell size={20} color="#D4BDBB" />
        <View style={st.avatar}>
          <UserRound size={19} color={C.bg} />
        </View>
      </View>
      <ScrollView contentContainerStyle={s.content}>
        <View style={s.between}>
          <Pressable
            accessibilityRole="button"
            onPress={onBrowse}
            style={st.link}
          >
            <Label style={[s.bold, st.pink]}>‹ PLANNING CDL</Label>
          </Pressable>
          <Label style={[s.badge, state === "offered" && st.urgent]}>
            {state === "waiting"
              ? "⌛ FILE ACTIVE"
              : state === "offered"
                ? "● URGENCE ATTRIBUTION"
                : state === "confirmed"
                  ? "PLACE CONFIRMÉE"
                  : state === "expired"
                    ? "DÉLAI EXPIRÉ"
                    : "SORTIE DE LISTE"}
          </Label>
        </View>
        {state === "waiting" && (
          <>
            <View style={[s.card, st.accent]}>
              <View style={s.between}>
                <Label style={s.badge}>GI TECHNIQUE</Label>
                <Label style={st.urgent}>COMPLET</Label>
              </View>
              <Label style={st.heading}>{title}</Label>
              <Detail icon={CalendarDays} text={`${date} • ${time}`} />
              <Detail
                icon={MapPin}
                text="Dojo Central // Tapis A • Coach Mehdi"
              />
            </View>
            <View style={[s.card, st.focus]}>
              <View style={st.ring}>
                <Svg
                  width={260}
                  height={260}
                  viewBox="0 0 260 260"
                  style={st.ringSvg}
                >
                  <Circle
                    cx={130}
                    cy={130}
                    r={119}
                    stroke={C.border}
                    strokeWidth={7}
                    fill="none"
                  />
                  <Circle
                    cx={130}
                    cy={130}
                    r={119}
                    stroke={C.red}
                    strokeWidth={7}
                    fill="none"
                    strokeDasharray="180 748"
                    strokeLinecap="round"
                    rotation={-90}
                    origin="130,130"
                  />
                </Svg>
                <Label style={st.rank}>3E</Label>
              </View>
              <View style={st.flow}>
                <Label style={st.positionLabel}>POSITION</Label>
                <Label style={st.listLabel}>SUR LA LISTE D’ATTENTE</Label>
                <Label style={st.explanation}>
                  Si un combattant se désiste, une place pourra vous être
                  proposée. Votre rang sera actualisé par le club.
                </Label>
              </View>
              <View style={st.density}>
                <View style={s.between}>
                  <Label style={s.bold}>DENSITÉ DE FILE</Label>
                  <Label style={s.bold}>3 / 8 EN ATTENTE</Label>
                </View>
                <View style={st.track}>
                  <View style={[st.fill, { width: "37.5%" }]} />
                </View>
                <Detail
                  icon={Zap}
                  text="Une place vous sera proposée dès qu’elle se libère."
                />
              </View>
            </View>
            <View style={s.card}>
              <Detail icon={Gavel} text="RÈGLES DE PRIORITÉ DU TATAMI" bold />
              <Rule
                icon={Bell}
                title="ALERTE DE DISPONIBILITÉ"
                text="Dès qu’une place se libère, vous recevez une proposition."
              />
              <Rule
                icon={Clock3}
                title="FENÊTRE DE 15 MINUTES"
                text="Vous avez 15 minutes pour confirmer votre place."
              />
              <Rule
                icon={Zap}
                title="PASSAGE DE RELAIS IMMÉDIAT"
                text="Sans réponse, la place est proposée au suivant sur la liste."
              />
            </View>
            <View style={[s.card, s.row]}>
              <Bell size={25} color={C.red} />
              <View style={{ flex: 1 }}>
                <Label style={s.bold}>ALERTES DE DISPONIBILITÉ</Label>
                <Label style={s.muted}>
                  Notifications non connectées dans cet aperçu.
                </Label>
              </View>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Simuler une place disponible"
                onPress={() => offer()}
                style={st.testButton}
              >
                <Label style={s.bold}>TESTER</Label>
              </Pressable>
            </View>
            <Action
              secondary
              icon={UserRoundMinus}
              title="QUITTER LA LISTE D’ATTENTE"
              onPress={() => changeStatus("left")}
            />
            <Action
              secondary
              title="VOIR D’AUTRES CRÉNEAUX"
              onPress={onBrowse}
            />
          </>
        )}
        {state === "offered" && (
          <>
            <View style={[s.card, st.banner]}>
              <Flame color={C.red} size={30} />
              <Label style={s.bold}>CLUB CDL · FILE PRIORITAIRE</Label>
            </View>
            <View style={[s.card, st.offer]}>
              <Detail icon={Info} text="UNE PLACE EST DISPONIBLE !" bold />
              <Label style={st.pink}>
                Un désistement vient d’avoir lieu sur cette séance.
              </Label>
              <View style={st.clockBox}>
                <Detail icon={Clock3} text="TEMPS RESTANT POUR VALIDER" bold />
                <Label
                  accessibilityLabel={`${Math.floor(remaining / 60)} minutes ${remaining % 60} secondes restantes`}
                  style={st.countdown}
                >
                  {String(Math.floor(remaining / 60)).padStart(2, "0")}:
                  {String(remaining % 60).padStart(2, "0")}{" "}
                  <Label style={s.bold}>MIN</Label>
                </Label>
                <View style={st.track}>
                  <View
                    style={[
                      st.fill,
                      {
                        width: `${Math.min(100, (remaining / (OFFER_MINUTES * 60)) * 100)}%`,
                      },
                    ]}
                  />
                </View>
                <Label style={[st.pink, st.center]}>
                  Passé ce délai, votre place sera automatiquement proposée au
                  pratiquant suivant.
                </Label>
              </View>
            </View>
            <View style={s.card}>
              <Label style={[s.bold, st.pink]}>DÉTAIL DU CRÉNEAU</Label>
              <Label style={st.heading}>{title}</Label>
              <Detail icon={CalendarDays} text={date} />
              <Detail icon={Clock3} text={time} />
              <Detail icon={MapPin} text="Dojo Central • Tapis A" />
              <View style={st.person}>
                <UserRound size={22} color={C.muted} />
                <View>
                  <Label style={s.bold}>
                    {role === "parent"
                      ? "PARTICIPANT À CONFIRMER"
                      : "VOTRE PLACE"}
                  </Label>
                  <Label style={s.muted}>
                    {role === "parent"
                      ? "Le choix de l’enfant suit la confirmation."
                      : "Une place dans cette séance"}
                  </Label>
                </View>
              </View>
            </View>
            <Action
              icon={CheckCircle2}
              title="CONFIRMER MA PLACE"
              onPress={confirm}
            />
            <Action
              secondary
              icon={X}
              title="DÉCLINER LA PLACE"
              onPress={() => changeStatus("declined")}
            />
            <View style={s.card}>
              <Detail
                icon={Shield}
                text="Esprit Club : en refusant rapidement, vous permettez au camarade suivant d’être prévenu à temps."
              />
            </View>
          </>
        )}
        {closed && (
          <>
            <View style={[s.card, st.focus]}>
              <View style={st.expiredIcon}>
                <TimerOff size={48} color="#806463" />
                <Label style={s.badge}>
                  {state === "expired" ? "00:00" : "FILE TERMINÉE"}
                </Label>
              </View>
              <Label style={[st.heading, st.center]}>
                {state === "expired"
                  ? "DÉLAI DÉPASSÉ, LA PLACE EST PROPOSÉE AU SUIVANT"
                  : state === "declined"
                    ? "VOUS AVEZ DÉCLINÉ LA PLACE"
                    : "VOUS AVEZ QUITTÉ LA LISTE"}
              </Label>
              <Label style={[s.muted, st.center]}>
                {state === "expired"
                  ? "Le temps imparti pour confirmer votre réservation a expiré. Votre place peut être proposée au pratiquant suivant."
                  : "Vous ne recevrez plus de proposition pour cette inscription à la liste d’attente."}
              </Label>
              <Label style={s.badge}>RÈGLE DE ROTATION TATAMI #4</Label>
            </View>
            <View style={[s.card, st.accent]}>
              <Label style={[s.bold, st.pink]}>SÉANCE NON VALIDÉE</Label>
              <Label style={st.heading}>{title}</Label>
              <Detail icon={CalendarDays} text={`${date} • ${time}`} />
              <Label style={s.muted}>Statut de la file • Sortie de liste</Label>
            </View>
            <Label style={st.heading}>CRÉNEAUX DISPONIBLES</Label>
            <View style={s.card}>
              <CalendarDays color={C.red} size={25} />
              <Label style={s.muted}>
                Consultez le planning pour voir les places disponibles dans les
                autres séances.
              </Label>
            </View>
            <View style={s.card}>
              <Detail icon={Info} text="CONSEIL CAMP DES LOUPS" bold />
              <Label style={s.muted}>
                Consultez vos notifications pour répondre dès qu’une place vous
                est proposée.
              </Label>
            </View>
            <Action title="VOIR LES AUTRES SÉANCES" onPress={onBrowse} />
            <Action
              secondary
              icon={ArrowLeft}
              title="RETOURNER AU PLANNING"
              onPress={onBrowse}
            />
          </>
        )}
        {state === "confirmed" && (
          <View style={[s.card, st.focus]}>
            <CheckCircle2 size={48} color={C.red} />
            <Label style={st.heading}>PLACE CONFIRMÉE</Label>
            <Label style={s.muted}>
              Réservation simulée pour cette séance. Aucun enregistrement
              serveur n’a été effectué.
            </Label>
            <Action title="RETOURNER À LA SÉANCE" onPress={onBack} />
          </View>
        )}
        <Label style={[s.muted, { fontSize: 9 }]}>
          Aperçu local • Rang et disponibilités simulés. Délai de 15 minutes à
          valider avec le club.
        </Label>
        {__DEV__ && (
          <View>
            <Pressable
              accessibilityRole="button"
              onPress={() => setShowTestStates(!showTestStates)}
              style={st.link}
            >
              <Label style={[s.muted, { fontSize: 9 }]}>
                ÉTATS DE TEST {showTestStates ? "−" : "+"}
              </Label>
            </Pressable>
            {showTestStates && (
              <View style={st.tests}>
                {[
                  ["Attente", () => changeStatus("waiting")],
                  ["Proposition", () => offer()],
                  ["Expiration (5 s)", () => offer(5)],
                ].map(([label, action]) => (
                  <Pressable
                    accessibilityRole="button"
                    key={label}
                    onPress={action}
                    style={st.testButton}
                  >
                    <Label>{label}</Label>
                  </Pressable>
                ))}
              </View>
            )}
          </View>
        )}
      </ScrollView>
    </View>
  );
}
function Detail({ icon: Icon, text, bold }) {
  return (
    <View style={[s.row, { alignItems: "flex-start" }]}>
      <Icon size={18} color={C.red} />
      <Label style={[{ flex: 1 }, bold ? s.bold : st.pink]}>{text}</Label>
    </View>
  );
}
function Rule({ icon, title, text }) {
  return (
    <View style={{ gap: 4, paddingVertical: 7 }}>
      <Detail icon={icon} text={title} bold />
      <Label style={[st.pink, { paddingLeft: 28 }]}>{text}</Label>
    </View>
  );
}
function Action(props) {
  return (
    <View style={{ flexDirection: "row", width: "100%" }}>
      <Button {...props} />
    </View>
  );
}
const st = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingRight: 20,
    minHeight: 64,
    borderBottomWidth: 1,
    borderBottomColor: C.border,
  },
  heading: { fontFamily: "Anybody-BlackItalic", fontSize: 20, lineHeight: 27 },
  avatar: {
    width: 36,
    height: 36,
    backgroundColor: "#FFB4AB",
    borderRadius: 4,
    alignItems: "center",
    justifyContent: "center",
  },
  pink: { color: "#D4BDBB" },
  link: { minHeight: 44, justifyContent: "center" },
  urgent: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    backgroundColor: "#93000A",
    color: "#FFB4AB",
    fontFamily: "Anybody-Bold",
    fontSize: 10,
    borderRadius: 4,
  },
  accent: { borderLeftWidth: 4, borderLeftColor: C.red },
  focus: { alignItems: "center", paddingVertical: 24 },
  center: { textAlign: "center" },
  ring: {
    width: 260,
    height: 260,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  ringSvg: {
    position: "absolute",
    left: 0,
    top: 0,
  },
  flow: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
  positionLabel: {
    fontFamily: "Chivo-Regular",
    color: "#9A9A9A",
    fontSize: 12,
    textTransform: "uppercase",
    marginBottom: 4,
  },
  rank: {
    fontFamily: "Anybody-BlackItalic",
    fontSize: 88,
    lineHeight: 88,
    color: "#E5322D",
    textTransform: "uppercase",
    textAlign: "center",
    includeFontPadding: false,
  },
  listLabel: {
    fontFamily: "Anybody-Bold",
    fontSize: 16,
    lineHeight: 20,
    color: "#FFFFFF",
    textTransform: "uppercase",
    marginBottom: 16,
    textAlign: "center",
  },
  explanation: {
    fontFamily: "Chivo-Regular",
    color: "#9A9A9A",
    fontSize: 14,
    lineHeight: 20,
    textAlign: "center",
    marginHorizontal: 20,
    marginBottom: 24,
  },
  density: {
    width: "100%",
    gap: 10,
    padding: 12,
    backgroundColor: "#171719",
    borderRadius: 4,
  },
  track: {
    height: 5,
    backgroundColor: "#38383A",
    borderRadius: 4,
    width: "100%",
    overflow: "hidden",
  },
  fill: { height: 5, backgroundColor: C.red },
  testButton: {
    padding: 10,
    minHeight: 44,
    backgroundColor: "#303032",
    borderRadius: 4,
    justifyContent: "center",
  },
  banner: {
    minHeight: 125,
    justifyContent: "flex-end",
    borderColor: "#4B2526",
    backgroundColor: "#1C1213",
  },
  offer: { borderTopWidth: 4, borderTopColor: C.red, gap: 18 },
  clockBox: {
    backgroundColor: C.bg,
    padding: 18,
    gap: 18,
    alignItems: "center",
    borderRadius: 4,
  },
  countdown: {
    fontFamily: "Anybody-BlackItalic",
    color: C.red,
    fontSize: 44,
    lineHeight: 52,
  },
  person: {
    flexDirection: "row",
    gap: 14,
    alignItems: "center",
    padding: 14,
    backgroundColor: "#252527",
    borderRadius: 4,
  },
  expiredIcon: {
    backgroundColor: C.bg,
    padding: 20,
    gap: 10,
    alignItems: "center",
    borderRadius: 4,
  },
  tests: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
});
