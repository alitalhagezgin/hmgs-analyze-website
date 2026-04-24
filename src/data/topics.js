export const TOPICS = [
  "Anayasa Hukuku",
  "Anayasa Yargısı",
  "İdare Hukuku",
  "İdari Yargılama Usulü",
  "Medeni Hukuk",
  "Borçlar Hukuku",
  "Ticaret Hukuku",
  "Hukuk Yargılama Usulü",
  "İcra ve İflas Hukuku",
  "Ceza Hukuku",
  "Ceza Yargılama Usulü",
  "İş ve Sosyal Güvenlik Hukuku",
  "Vergi Hukuku",
  "Vergi Usul Hukuku",
  "Avukatlık Hukuku",
  "Hukuk Felsefesi ve Sosyolojisi",
  "Türk Hukuk Tarihi",
  "Milletlerarası Hukuk",
  "Milletlerarası Özel Hukuk",
  "Genel Kamu Hukuku"
];

export const STATUSES = [
  { key: "correct",      label: "Doğru",          shortLabel: "Doğru",     emoji: "✅", color: "green"   },
  { key: "wrong",        label: "Yanlış",          shortLabel: "Yanlış",    emoji: "❌", color: "red"     },
  { key: "near_correct", label: "Doğruya yakın",   shortLabel: "Kısmen D",  emoji: "🟢", color: "lime"    },
  { key: "near_wrong",   label: "Yanlışa yakın",   shortLabel: "Kısmen Y",  emoji: "🔴", color: "orange"  },
  { key: "forgot",       label: "Hatırlamıyorum",  shortLabel: "Hatırlamam",emoji: "❓", color: "gray"    },
  { key: "blank",        label: "Boş bıraktım",    shortLabel: "Boş",       emoji: "⚪", color: "neutral" },
];

export const TOTAL_QUESTIONS = 120;

// HMGS'nin tipik soru dağılımına göre her soru numarasına varsayılan konu atar
export function getDefaultTopicForQuestion(questionNumber) {
  const ranges = [
    { start: 1,   end: 9,   topic: "Anayasa Hukuku" },
    { start: 10,  end: 15,  topic: "İdare Hukuku" },
    { start: 16,  end: 18,  topic: "İdari Yargılama Usulü" },
    { start: 19,  end: 33,  topic: "Medeni Hukuk" },
    { start: 34,  end: 45,  topic: "Borçlar Hukuku" },
    { start: 46,  end: 57,  topic: "Ticaret Hukuku" },
    { start: 58,  end: 69,  topic: "Hukuk Yargılama Usulü" },
    { start: 70,  end: 75,  topic: "İcra ve İflas Hukuku" },
    { start: 76,  end: 84,  topic: "Ceza Hukuku" },
    { start: 85,  end: 90,  topic: "Ceza Yargılama Usulü" },
    { start: 91,  end: 96,  topic: "İş ve Sosyal Güvenlik Hukuku" },
    { start: 97,  end: 102, topic: "Vergi Hukuku" },
    { start: 103, end: 105, topic: "Avukatlık Hukuku" },
    { start: 106, end: 108, topic: "Hukuk Felsefesi ve Sosyolojisi" },
    { start: 109, end: 111, topic: "Türk Hukuk Tarihi" },
    { start: 112, end: 117, topic: "Milletlerarası Hukuk" },
    { start: 118, end: 120, topic: "Genel Kamu Hukuku" },
  ];

  const match = ranges.find(r => questionNumber >= r.start && questionNumber <= r.end);
  return match ? match.topic : null;
}
