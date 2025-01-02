import { supabase } from "@/lib/supabase";
import { toast } from "@/hooks/use-toast";

export async function getApiKey(): Promise<string | null> {
  try {
    console.log('Fetching API key from secrets table...');
    const { data: secretData, error } = await supabase
      .from('secrets')
      .select('value')
      .eq('name', 'AGENTIVE_HUB_API_KEY')
      .maybeSingle();
    
    console.log('Secret data response:', secretData);

    if (error) {
      console.error('Error fetching API key:', error);
      throw error;
    }
    
    if (!secretData?.value) {
      console.error('API key not found in secrets table');
      toast({
        variant: "destructive",
        title: "Configuration Error",
        description: "AGENTIVE_HUB_API_KEY not found in secrets table. Please ensure it has been added.",
      });
      return null;
    }

    return secretData.value;
  } catch (error) {
    console.error('Error fetching API key:', error);
    toast({
      variant: "destructive",
      title: "Error",
      description: "Failed to retrieve API key. Please check the configuration.",
    });
    return null;
  }
}