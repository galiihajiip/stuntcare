export interface Symptom {
  id: string;
  name: string;
  severity: "mild" | "moderate" | "severe";
  category: "respiratory" | "digestive" | "fever" | "skin" | "other";
}

export interface SymptomCheckResult {
  urgency: "emergency" | "urgent" | "routine" | "monitor";
  title: string;
  description: string;
  actions: string[];
  redFlags: string[];
  disclaimer: string;
}

export const symptoms: Symptom[] = [
  { id: "fever_high", name: "Demam tinggi (>39°C)", severity: "severe", category: "fever" },
  { id: "fever_mild", name: "Demam ringan (<38°C)", severity: "mild", category: "fever" },
  { id: "cough", name: "Batuk", severity: "mild", category: "respiratory" },
  { id: "difficulty_breathing", name: "Sesak napas", severity: "severe", category: "respiratory" },
  { id: "diarrhea", name: "Diare", severity: "moderate", category: "digestive" },
  { id: "vomiting", name: "Muntah", severity: "moderate", category: "digestive" },
  { id: "rash", name: "Ruam kulit", severity: "mild", category: "skin" },
  { id: "lethargy", name: "Lemas/tidak responsif", severity: "severe", category: "other" },
  { id: "loss_appetite", name: "Tidak mau makan", severity: "moderate", category: "digestive" },
  { id: "seizure", name: "Kejang", severity: "severe", category: "other" },
];

export function checkSymptoms(selectedSymptoms: string[]): SymptomCheckResult {
  const symptomObjects = symptoms.filter((s) => selectedSymptoms.includes(s.id));
  
  const hasSevere = symptomObjects.some((s) => s.severity === "severe");
  const hasMultipleModerate = symptomObjects.filter((s) => s.severity === "moderate").length >= 2;

  // RED FLAGS - Emergency
  if (
    selectedSymptoms.includes("difficulty_breathing") ||
    selectedSymptoms.includes("seizure") ||
    selectedSymptoms.includes("lethargy")
  ) {
    return {
      urgency: "emergency",
      title: "⚠️ SEGERA KE IGD/PUSKESMAS",
      description: "Gejala yang Anda laporkan menunjukkan kondisi yang memerlukan penanganan medis segera.",
      actions: [
        "Segera bawa anak ke IGD atau Puskesmas terdekat",
        "Jangan menunda atau mencoba pengobatan sendiri",
        "Hubungi ambulans jika diperlukan (119)",
        "Tetap tenang dan dampingi anak",
      ],
      redFlags: [
        "Sesak napas atau kesulitan bernapas",
        "Kejang",
        "Anak sangat lemas atau tidak responsif",
        "Bibir atau kulit membiru",
      ],
      disclaimer: "Ini bukan diagnosis medis. Segera konsultasi dengan tenaga kesehatan profesional.",
    };
  }

  // Urgent - Same day medical attention
  if (hasSevere || hasMultipleModerate || selectedSymptoms.includes("fever_high")) {
    return {
      urgency: "urgent",
      title: "Perlu Pemeriksaan Hari Ini",
      description: "Gejala menunjukkan anak perlu diperiksa dokter dalam 24 jam.",
      actions: [
        "Kunjungi Puskesmas atau dokter hari ini",
        "Catat perkembangan gejala",
        "Pastikan anak cukup minum",
        "Jaga suhu ruangan tetap nyaman",
      ],
      redFlags: [
        "Demam tinggi lebih dari 3 hari",
        "Diare dengan tanda dehidrasi",
        "Muntah terus menerus",
        "Anak rewel atau menangis terus",
      ],
      disclaimer: "Ini bukan diagnosis medis. Konsultasikan dengan dokter untuk pemeriksaan lebih lanjut.",
    };
  }

  // Routine - Can wait for regular appointment
  if (symptomObjects.length > 0) {
    return {
      urgency: "routine",
      title: "Pantau dan Jadwalkan Konsultasi",
      description: "Gejala ringan yang perlu dipantau. Jadwalkan kunjungan ke Posyandu atau Puskesmas.",
      actions: [
        "Pantau perkembangan gejala selama 2-3 hari",
        "Pastikan anak istirahat cukup",
        "Berikan makanan bergizi dan cukup cairan",
        "Jadwalkan kunjungan ke Posyandu saat jadwal rutin",
      ],
      redFlags: [
        "Gejala memburuk atau tidak membaik dalam 3 hari",
        "Muncul gejala baru yang lebih berat",
        "Anak menolak makan/minum sama sekali",
      ],
      disclaimer: "Ini bukan diagnosis medis. Jika gejala memburuk, segera konsultasi dengan tenaga kesehatan.",
    };
  }

  // No symptoms
  return {
    urgency: "monitor",
    title: "Tidak Ada Gejala Mengkhawatirkan",
    description: "Lanjutkan pemantauan rutin dan pola hidup sehat.",
    actions: [
      "Lanjutkan pola makan bergizi seimbang",
      "Pastikan anak cukup istirahat",
      "Ikuti jadwal imunisasi rutin",
      "Kunjungi Posyandu sesuai jadwal",
    ],
    redFlags: [],
    disclaimer: "Tetap waspada terhadap perubahan kondisi anak. Konsultasi rutin dengan tenaga kesehatan tetap penting.",
  };
}
