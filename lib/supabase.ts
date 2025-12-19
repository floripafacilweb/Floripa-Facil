
import { createClient } from '@supabase/supabase-js';

// Credenciales del proyecto Floripa Fácil
const supabaseUrl = 'https://qvwfjojldqyrjgbwmxsg.supabase.co';
const supabaseAnonKey = 'sb_publishable_xm_l-XmsjaDSnToN8M95oA_DvtFGw3r';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * RECOMENDACIÓN PARA EL USUARIO:
 * Asegúrate de crear las tablas 'packages' y 'reservations' en tu dashboard de Supabase
 * para que la persistencia sea efectiva.
 */
