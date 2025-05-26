import { Class } from '../services/classesService';

// Formato de capacidad toca crear otro util para esto por ahora se queda aqui 
export const formatCapacity = (current: number, max: number): string => {
  return `${current}/${max}`;
};

// Abreviaturas para los días de la semana
const dayAbbreviations: Record<string, string> = {
  'lunes': 'Lun',
  'martes': 'Mar',
  'miércoles': 'Mier',
  'jueves': 'Jue',
  'viernes': 'Vie',
  'sábado': 'Sab',
  'domingo': 'Dom'
};

// Función para abreviar los días de la semana
export const abbreviateDay = (day: string): string => {
  // Convertir a minúsculas para hacer la comparación insensible a mayúsculas
  const dayLower = day.toLowerCase();
  return dayAbbreviations[dayLower] || day; // Si no se encuentra una abreviación, devolver el día original
};

// Formatear el horario de una clase
export const formatSchedule = (classItem: Class, formatTime: (time: string) => string): string => {
  // Verificar si el objeto tiene la estructura de sesiones
  if (classItem.sessions && Array.isArray(classItem.sessions) && classItem.sessions.length > 0) {
    return classItem.sessions.map(s => 
      `${abbreviateDay(s.day)} ${formatTime(s.startTime)}-${formatTime(s.endTime)}`).join(', ');
  } 
  // Si no tiene sessions, usar el formato alternativo con repetición
  else {
    let schedule = '';
    if (classItem.repetition) {
      // Si repetition incluye nombres de días, intentar abreviarlos
      const repetitionWords = classItem.repetition.split(' ');
      const abbreviatedRepetition = repetitionWords.map(word => abbreviateDay(word)).join(' ');
      schedule += `${abbreviatedRepetition} `;
    }
    schedule += `${formatTime(classItem.startTime)}-${formatTime(classItem.endTime)}`;
    return schedule.trim();
  }
};