import { useDispatch as useReduxDispatch, useSelector as useReduxSelector } from 'react-redux';

// Типизированный хук useDispatch
export const useDispatch = () => useReduxDispatch<any>();

// Типизированный хук useSelector
export const useSelector = <TSelected = unknown>(
  selector: (state: any) => TSelected,
  equalityFn?: (left: TSelected, right: TSelected) => boolean
): TSelected => useReduxSelector(selector, equalityFn);
