import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { defaultSiteConfig } from '@/lib/site-config';

export function useSiteSettings() {
  return useQuery({
    queryKey: ['site-settings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('site_settings')
        .select('key, value');
      if (error) throw error;
      const settings = { ...defaultSiteConfig };
      data?.forEach((row) => {
        (settings as Record<string, string>)[row.key] = row.value;
      });
      return settings;
    },
    staleTime: 5 * 60 * 1000,
  });
}
