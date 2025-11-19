import { useState, useEffect } from 'react';
import { API_BASE_URL } from '../utils/api';

export const useIngredients = () => {
  const [ingredients, setIngredients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchIngredients = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(`${API_BASE_URL}/ingredients`);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        if (!data.success) {
          throw new Error('API returned unsuccessful response');
        }

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

