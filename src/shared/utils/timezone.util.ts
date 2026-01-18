import { format, toZonedTime } from 'date-fns-tz';

/**
 * Convierte una fecha UTC a la zona horaria de Ecuador (America/Guayaquil)
 * @param fecha Fecha a convertir
 * @param formatoPersonalizado Formato personalizado (por defecto: 'yyyy-MM-dd HH:mm:ss zzz')
 * @returns Fecha formateada en hora de Ecuador
 */
export function convertirAZonaHorariaEcuador(
  fecha: Date,
  formatoPersonalizado: string = 'yyyy-MM-dd HH:mm:ss zzz',
): string {
  const zonaHoraria = process.env.TIMEZONE || 'America/Guayaquil';
  const fechaConZona = toZonedTime(fecha, zonaHoraria);
  return format(fechaConZona, formatoPersonalizado, { timeZone: zonaHoraria });
}

/**
 * Obtiene la fecha actual en la zona horaria de Ecuador
 * @returns Fecha actual en hora de Ecuador
 */
export function obtenerFechaActualEcuador(): Date {
  const zonaHoraria = process.env.TIMEZONE || 'America/Guayaquil';
  return toZonedTime(new Date(), zonaHoraria);
}

/**
 * Formatea una fecha a formato legible en Ecuador
 * @param fecha Fecha a formatear
 * @returns Fecha formateada
 */
export function formatearFechaEcuador(fecha: Date): string {
  return convertirAZonaHorariaEcuador(fecha, 'dd/MM/yyyy HH:mm:ss');
}
