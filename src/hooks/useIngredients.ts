import { useState, useEffect } from 'react';
import { request } from '../utils/request';
import { Ingredient } from '../utils/types';

export const useIngredients = () => {
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchIngredients = async () => {
      try {
        setLoading(true);
        setError(null);

        const data = await request<Ingredient[]>('/ingredients');
        setIngredients(data.data || []);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch ingredients');
        console.error('Error fetching ingredients:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchIngredients();
  }, []);

  return { ingredients, loading, error };
};
