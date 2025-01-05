import { supabase } from "@/lib/supabase";

export const updateReadingSession = async (sessionId: string, finalMinutes: number) => {
  const { error: sessionError } = await supabase
    .from('bible_reading_sessions')
    .update({
      duration_minutes: finalMinutes,
      ended_at: new Date().toISOString()
    })
    .eq('id', sessionId);

  if (sessionError) throw sessionError;
  console.log("Updated session duration:", finalMinutes, "minutes");
};

export const updateReadingProgress = async (userId: string | undefined, book: string, chapter: number, finalMinutes: number) => {
  if (!userId) return;

  const { error: progressError } = await supabase
    .from('bible_reading_progress')
    .upsert({
      user_id: userId,
      book,
      chapter,
      minutes_spent: finalMinutes,
      completed: true,
      completed_at: new Date().toISOString()
    });

  if (progressError) throw progressError;
  console.log("Updated reading progress with minutes:", finalMinutes);
};

export const updateCumulativeProgress = async (userId: string | undefined, finalMinutes: number) => {
  if (!userId) return;

  const firstDayOfMonth = new Date();
  firstDayOfMonth.setDate(1);
  firstDayOfMonth.setHours(0, 0, 0, 0);

  const { data: existingData, error: fetchError } = await supabase
    .from('bible_reading_cumulative')
    .select('current_month_minutes')
    .eq('user_id', userId)
    .maybeSingle();

  if (fetchError) throw fetchError;

  if (existingData) {
    const { error: updateError } = await supabase
      .from('bible_reading_cumulative')
      .update({
        current_month_minutes: existingData.current_month_minutes + finalMinutes,
        last_reset_date: firstDayOfMonth.toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('user_id', userId);

    if (updateError) throw updateError;
  } else {
    const { error: insertError } = await supabase
      .from('bible_reading_cumulative')
      .insert({
        user_id: userId,
        current_month_minutes: finalMinutes,
        total_minutes: finalMinutes,
        last_reset_date: firstDayOfMonth.toISOString()
      });

    if (insertError) throw insertError;
  }
};