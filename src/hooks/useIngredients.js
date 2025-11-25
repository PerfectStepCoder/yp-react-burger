import { useState, useEffect } from 'react';
import { request } from '../utils/request';

export const useIngredients = () => {
  const [ingredients, setIngredients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchIngredients = async () => {
      try {
        setLoading(true);
        setError(null);

        const data = await request('/ingredients');
        setIngredients(data.data || []);
      } catch (err) {
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

