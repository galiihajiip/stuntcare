import { WHOGrowthTable, StuntingStatus } from '@/types/database';

/**
 * Calculate z-score using WHO table data
 * Uses linear interpolation between z-score values
 */
export function calculateZScore(
  measurement: number,
  whoData: WHOGrowthTable
): number {
  const { z_minus3, z_minus2, z_minus1, z0, z_plus1, z_plus2, z_plus3 } = whoData;
  
  // Define z-score ranges
  const zScores = [-3, -2, -1, 0, 1, 2, 3];
  const values = [z_minus3, z_minus2, z_minus1, z0, z_plus1, z_plus2, z_plus3];
  
  // Find which range the measurement falls into
  for (let i = 0; i < values.length - 1; i++) {
    if (measurement >= values[i] && measurement <= values[i + 1]) {
      // Linear interpolation
      const ratio = (measurement - values[i]) / (values[i + 1] - values[i]);
      return Number((zScores[i] + ratio * (zScores[i + 1] - zScores[i])).toFixed(2));
    }
  }
  
  // If measurement is below z-3
  if (measurement < z_minus3) {
    const diff = z_minus3 - measurement;
    const sd = z_minus2 - z_minus3;
    return Number((-3 - (diff / sd)).toFixed(2));
  }
  
  // If measurement is above z+3
  if (measurement > z_plus3) {
    const diff = measurement - z_plus3;
    const sd = z_plus3 - z_plus2;
    return Number((3 + (diff / sd)).toFixed(2));
  }
  
  return 0;
}

/**
 * Determine stunting status from HAZ (Height-for-Age Z-score)
 */
export function getStuntingStatus(haz: number): StuntingStatus {
  if (haz < -3) {
    return 'severe_stunting';
  } else if (haz < -2) {
    return 'stunting';
  } else if (haz < -1.5) {
    return 'risiko';
  } else {
    return 'normal';
  }
}

/**
 * Get status label in Indonesian
 */
export function getStatusLabel(status: StuntingStatus): string {
  const labels: Record<StuntingStatus, string> = {
    normal: 'Normal',
    risiko: 'Berisiko',
    stunting: 'Stunting',
    severe_stunting: 'Stunting Berat'
  };
  return labels[status];
}

/**
 * Get status color for UI
 */
export function getStatusColor(status: StuntingStatus): string {
  const colors: Record<StuntingStatus, string> = {
    normal: 'text-green-600 bg-green-50 border-green-200',
    risiko: 'text-yellow-600 bg-yellow-50 border-yellow-200',
    stunting: 'text-orange-600 bg-orange-50 border-orange-200',
    severe_stunting: 'text-red-600 bg-red-50 border-red-200'
  };
  return colors[status];
}

/**
 * Analyze growth trend from multiple visits
 */
export function analyzeGrowthTrend(visits: Array<{ age_months: number; height_cm: number; haz_score?: number }>): {
  trend: 'improving' | 'stable' | 'declining' | 'insufficient_data';
  message: string;
} {
  if (visits.length < 2) {
    return {
      trend: 'insufficient_data',
      message: 'Perlu minimal 2 kunjungan untuk analisis tren'
    };
  }
  
  // Sort by age
  const sorted = [...visits].sort((a, b) => a.age_months - b.age_months);
  
  // Calculate HAZ trend
  const hazScores = sorted.filter(v => v.haz_score !== undefined).map(v => v.haz_score!);
  
  if (hazScores.length < 2) {
    return {
      trend: 'insufficient_data',
      message: 'Data z-score tidak cukup untuk analisis tren'
    };
  }
  
  // Simple linear trend
  const firstHaz = hazScores[0];
  const lastHaz = hazScores[hazScores.length - 1];
  const change = lastHaz - firstHaz;
  
  if (change > 0.3) {
    return {
      trend: 'improving',
      message: 'Pertumbuhan membaik, pertahankan pola asuh dan gizi'
    };
  } else if (change < -0.3) {
    return {
      trend: 'declining',
      message: 'Pertumbuhan melambat, perlu perhatian khusus'
    };
  } else {
    return {
      trend: 'stable',
      message: 'Pertumbuhan stabil'
    };
  }
}

/**
 * Generate explainable output for screening result
 */
export function generateExplanation(
  haz: number,
  status: StuntingStatus,
  visit: {
    exclusive_breastfeeding?: boolean;
    sick_frequency?: number;
  },
  immunizationComplete: boolean
): string[] {
  const explanations: string[] = [];
  
  // HAZ explanation
  explanations.push(`Skor tinggi badan menurut usia (HAZ): ${haz.toFixed(2)}`);
  
  // Status explanation
  if (status === 'severe_stunting') {
    explanations.push('⚠️ Status: Stunting Berat - Perlu intervensi segera');
  } else if (status === 'stunting') {
    explanations.push('⚠️ Status: Stunting - Perlu perhatian khusus');
  } else if (status === 'risiko') {
    explanations.push('⚡ Status: Berisiko - Perlu pemantauan ketat');
  } else {
    explanations.push('✅ Status: Normal - Pertahankan pola asuh');
  }
  
  // Risk factors
  if (visit.exclusive_breastfeeding === false) {
    explanations.push('Faktor risiko: Tidak ASI eksklusif');
  }
  
  if (visit.sick_frequency && visit.sick_frequency > 3) {
    explanations.push(`Faktor risiko: Sering sakit (${visit.sick_frequency}x dalam 3 bulan)`);
  }
  
  if (!immunizationComplete) {
    explanations.push('Faktor risiko: Imunisasi belum lengkap');
  }
  
  return explanations;
}
