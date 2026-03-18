import { useState, useEffect, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

export default function OffersSlider() {
  const [current, setCurrent] = useState(0);

  const { data: offers } = useQuery({
    queryKey: ['active-offers'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('offers')
        .select('*')
        .eq('is_active', true)
        .order('sort_order');
      if (error) throw error;
      return data;
    },
  });

  const next = useCallback(() => {
    if (offers && offers.length > 0) {
      setCurrent((c) => (c + 1) % offers.length);
    }
  }, [offers]);

  const prev = useCallback(() => {
    if (offers && offers.length > 0) {
      setCurrent((c) => (c - 1 + offers.length) % offers.length);
    }
  }, [offers]);

  useEffect(() => {
    if (!offers || offers.length <= 1) return;
    const interval = setInterval(next, 5000);
    return () => clearInterval(interval);
  }, [offers, next]);

  if (!offers || offers.length === 0) return null;

  const offer = offers[current];

  return (
    <section className="relative overflow-hidden bg-gradient-to-l from-primary/20 via-primary/5 to-background">
      <div className="container mx-auto px-4 py-12 md:py-20">
        <div className="flex items-center gap-8">
          <div className="flex-1 min-w-0">
            <span className="inline-block bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-full mb-4">
              عرض خاص
            </span>
            <h2 className="text-3xl md:text-5xl font-extrabold mb-4 leading-tight">{offer.title}</h2>
            {offer.description && (
              <p className="text-muted-foreground text-lg mb-6 max-w-lg">{offer.description}</p>
            )}
            {offer.link && (
              <Button size="lg" asChild>
                <Link to={offer.link}>تسوق الآن</Link>
              </Button>
            )}
          </div>
          {offer.image_url && (
            <div className="hidden md:block w-80 h-80 rounded-2xl overflow-hidden flex-shrink-0 shadow-xl">
              <img src={offer.image_url} alt={offer.title} className="w-full h-full object-cover" />
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      {offers.length > 1 && (
        <>
          <Button
            size="icon"
            variant="secondary"
            className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full opacity-70 hover:opacity-100"
            onClick={prev}
          >
            <ChevronRight className="h-5 w-5" />
          </Button>
          <Button
            size="icon"
            variant="secondary"
            className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full opacity-70 hover:opacity-100"
            onClick={next}
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>

          {/* Dots */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
            {offers.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`w-2.5 h-2.5 rounded-full transition-colors ${
                  i === current ? 'bg-primary' : 'bg-primary/30'
                }`}
              />
            ))}
          </div>
        </>
      )}
    </section>
  );
}
