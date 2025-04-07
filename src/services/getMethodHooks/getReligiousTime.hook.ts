import { useState, useEffect } from 'react';

export interface ReligiousTimeData {
  ok: boolean;
  result: {
    azan_sobh: string;
    tolu_aftab: string;
    azan_zohr: string;
    ghorub_aftab: string;
    azan_maghreb: string;
    nimeshab: string;
    month: string;
    day: string;
  };
}

export const useReligiousTime = (day?: number, month?: number, city: string = 'تهران') => {
  const [data, setData] = useState<ReligiousTimeData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchReligiousTime = async () => {
      try {
        setLoading(true);
        const dayParam = day ? `&day=${day}` : '';
        const monthParam = month ? `&month=${month}` : '';
        const url = `https://api.keybit.ir/owghat/?city=${encodeURIComponent(city)}${monthParam}${dayParam}`;
        
        const response = await fetch(url, {
          method: "GET",
          redirect: "follow"
        });
        
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        const result = await response.json();
        setData(result);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('An unknown error occurred'));
      } finally {
        setLoading(false);
      }
    };

    fetchReligiousTime();
  }, [day, month, city]);

  return { data, loading, error };
}; 