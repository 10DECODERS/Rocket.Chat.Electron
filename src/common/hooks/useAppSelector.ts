import { TypedUseSelectorHook, useSelector } from 'react-redux';

import { RootState } from '../types/RootState';

export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
