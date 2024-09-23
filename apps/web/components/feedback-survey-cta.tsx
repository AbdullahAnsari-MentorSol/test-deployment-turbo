import { Button } from '@kit/ui/button';
import { ThumbsDown, ThumbsUp } from 'lucide-react';
import { getSupabaseServerClient } from '@kit/supabase/server-client';
export default async function FeedbackSurveyCTA() {
  const client = getSupabaseServerClient();

  const {
    data: { user },
  } = await client.auth.getUser();
  if(!user){
    return
  }
  return (
    <div className="fixed bottom-5 right-10 z-20 flex space-x-4">
        <a href="http://public.getmetasurvey.com/survey/66daf1fca8607000125a0e17" target="_blank" rel="noopener noreferrer">
      <Button className="p-0 bg-transparent hover:bg-transparent flex items-center space-x-2 opacity-50 hover:opacity-100 transition-opacity duration-200">
        <ThumbsUp className="text-green-500" />
      </Button>
        </a>

      <a href="http://public.getmetasurvey.com/survey/66daf1fca8607000125a0e17" target="_blank" rel="noopener noreferrer">
      <Button className="p-0 bg-transparent hover:bg-transparent flex items-center space-x-2 opacity-50 hover:opacity-100 transition-opacity duration-200">
        <ThumbsDown className="text-red-500" />
      </Button>
      </a>
    </div>
  );
}
