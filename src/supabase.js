import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://sjffssxyieeearvoiqjz.supabase.co'
const SUPABASE_KEY = 'sb_publishable_tuameI-4Fb8po6kf7a8pZw_xiAZjhbn'

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)
