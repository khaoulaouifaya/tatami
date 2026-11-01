// Illustrative records; replace with periods and staff attendance validated by the API.
const templates = [
  ["JJB ADOS & CADETS", "ADOS", 90, "18:00 – 19:30"],
  ["JJB KIDS 6–11 ANS", "KIDS", 75, "15:15 – 16:30"],
  ["ÉVEIL TATAMI", "BABY", 60, "14:30 – 15:30"],
  ["JJB KIDS SPARRING", "KIDS", 60, "14:30 – 15:30"],
  ["ÉVEIL BABY JIU-JITSU", "BABY", 60, "10:00 – 11:00"],
  ["JJB ADOS", "ADOS", 90, "15:00 – 16:30"],
  ["JJB KIDS", "KIDS", 75, "15:15 – 16:30"],
];
export const compensationPeriods = {
  "2026-11": {
    status: "en_cours",
    sessions: Array.from({ length: 15 }, (_, i) => {
      const [title, category, minutes, time] =
        templates[i < 7 ? i : i === 10 ? 1 : 4];
      const day = [25, 25, 25, 21, 21, 18, 18, 15, 14, 12, 11, 8, 7, 5, 4][i];
      return {
        id: `nov-${i}`,
        title,
        category,
        minutes,
        time,
        date: `2026-11-${String(day).padStart(2, "0")}`,
      };
    }),
  },
  "2026-10": {
    status: "validee",
    sessions: [
      {
        id: "oct-1",
        title: "JJB ADOS",
        category: "ADOS",
        minutes: 90,
        time: "15:00 – 16:30",
        date: "2026-10-28",
      },
      {
        id: "oct-2",
        title: "ÉVEIL TATAMI",
        category: "BABY",
        minutes: 60,
        time: "14:30 – 15:30",
        date: "2026-10-28",
      },
    ],
  },
};
