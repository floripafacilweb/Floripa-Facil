
import { createClient } from '@supabase/supabase-js';

// Estas variables se deben configurar en el panel de Vercel (Environment Variables)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * NOTA PARA EL DESARROLLADOR:
 * Para activar la base de datos real:
 * 1. Crea un proyecto en supabase.com
 * 2. Copia la URL y la Anon Key a las variables de entorno de Vercel.
 * 3. Las funciones de lib/actions.ts podrán entonces usar este cliente.
 */
