/**
 * Calculate age from date of birth
 * @param dateOfBirth - Date of birth string (YYYY-MM-DD)
 * @param referenceDate - Reference date (default: today)
 * @returns Object with years, months, and totalMonths
 */
export function calculateAge(
  dateOfBirth: string,
  referenceDate: Date = new Date()
): { years: number; months: number; totalMonths: number } {
  const dob = new Date(dateOfBirth);
  
  let years = referenceDate.getFullYear() - dob.getFullYear();
  let months = referenceDate.getMonth() - dob.getMonth();
  
  if (months < 0) {
    years--;
    months += 12;
  }
  
  const totalMonths = years * 12 + months;
  
  return { years, months, totalMonths };
}

/**
 * Calculate age in months with decimal precision
 * @param dateOfBirth - Date of birth (Date or ISO string)
 * @param visitDate - Visit date (Date or ISO string)
 * @returns Age in months (e.g., 24.5)
 */
export function getAgeInMonths(
  dateOfBirth: Date | string,
  visitDate: Date | string = new Date()
): number {
  const dob = typeof dateOfBirth === 'string' ? new Date(dateOfBirth) : dateOfBirth;
  const visit = typeof visitDate === 'string' ? new Date(visitDate) : visitDate;

  const years = visit.getFullYear() - dob.getFullYear();
  const months = visit.getMonth() - dob.getMonth();
  const days = visit.getDate() - dob.getDate();
  
  const totalMonths = years * 12 + months + (days / 30.4375);
  
  return Number(totalMonths.toFixed(2));
}

/**
 * Calculate age in days
 */
export function getAgeInDays(
  dateOfBirth: Date | string,
  visitDate: Date | string = new Date()
): number {
  const dob = typeof dateOfBirth === 'string' ? new Date(dateOfBirth) : dateOfBirth;
  const visit = typeof visitDate === 'string' ? new Date(visitDate) : visitDate;
  
  const diffTime = Math.abs(visit.getTime() - dob.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  return diffDays;
}

/**
 * Format age for display
 */
export function formatAge(ageMonths: number): string {
  const years = Math.floor(ageMonths / 12);
  const months = Math.floor(ageMonths % 12);
  
  if (years === 0) {
    return `${months} bulan`;
  } else if (months === 0) {
    return `${years} tahun`;
  } else {
    return `${years} tahun ${months} bulan`;
  }
}
