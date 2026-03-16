import { supabase } from '@/integrations/supabase/client';

export async function uploadImage(file: File, folder: string): Promise<string | null> {
  const ext = file.name.split('.').pop();
  const fileName = `${folder}/${Date.now()}.${ext}`;

  const { error } = await supabase.storage.from('images').upload(fileName, file);
  if (error) {
    console.error('Upload error:', error);
    return null;
  }

  const { data } = supabase.storage.from('images').getPublicUrl(fileName);
  return data.publicUrl;
}
