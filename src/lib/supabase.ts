import { createClient } from '@supabase/supabase-js'

const supabaseUrl = "https://sghztuggogphsoghhrzc.supabase.co"
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNnaHp0dWdnb2dwaHNvZ2hocnpjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzU2NzQxMjUsImV4cCI6MjA1MTI1MDEyNX0.12ZWpu2XKUHwn3DyZNWCEt0yZ7EpixfSn0slux5QJN4"

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase configuration.')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)