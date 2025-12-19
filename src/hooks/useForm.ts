import { useState, ChangeEvent } from 'react';
import { FormValues } from '../utils/types';

export function useForm(inputValues: FormValues = {}) {
  const [values, setValues] = useState<FormValues>(inputValues);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { value, name } = event.target;
    setValues({ ...values, [name]: value });
  };

  return { values, handleChange, setValues };
}
