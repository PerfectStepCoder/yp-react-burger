import { useDispatch as useReduxDispatch, useSelector as useReduxSelector } from 'react-redux';
import { ThunkDispatch } from 'redux-thunk';
import { RootState, RootAction } from '../utils/types';

export type AppDispatch = ThunkDispatch<RootState, unknown, RootAction>;

// Типизированный хук useDispatch
export const useDispatch = (): AppDispatch => useReduxDispatch<AppDispatch>();

// Типизированный хук useSelector
export const useSelector = <TSelected = unknown>(
  selector: (state: RootState) => TSelected,
  equalityFn?: (left: TSelected, right: TSelected) => boolean
): TSelected => useReduxSelector<RootState, TSelected>(selector, equalityFn);
