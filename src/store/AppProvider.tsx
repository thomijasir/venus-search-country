import React, {
  FC,
  ReactElement,
  useCallback,
  useEffect,
  useMemo,
  useReducer,
} from 'react';
import appReducers, {
  initialState,
  makeInitialState,
  IAppContext,
  SET_LOADING,
  SET_ERROR,
} from './AppReducers';
import { APP_CONTEXT, RESISTANCE_CONTEXT } from '../constants';

export interface IContext extends IAppContext {
  setContext: (type: string, payload: any) => void;
  setLoading: (isLoading: boolean, text?: string) => void;
  setError: (
    isError: boolean,
    title?: string,
    message?: string,
    image?: string,
  ) => void;
}

export const AppContext: React.Context<IContext> =
  React.createContext(initialState);

// MEMOIZE FROM CONTEXT
export const AppContextMemoize = React.memo(AppContext.Provider);

const AppProvider: FC<{ children: ReactElement }> = ({ children }) => {
  const [state, dispatch] = useReducer(appReducers, makeInitialState());
  // ? USE RESISTANCE IF APPLICATION NEED DATA ON STORE RESISTANCE TO BROWSER REFRESH
  if (RESISTANCE_CONTEXT) {
    useEffect(() => {
      localStorage.setItem(APP_CONTEXT, JSON.stringify(state));
    }, [state]);
  }
  // ! USE CONTEXT BE WISE, ONLY USE CONTEXT API IF DATA NEED TO PASS TO OTHER COMPONENT
  // ! DON'T USE CONTEXT TO STORE ALL DATA, CONTEXT OR REDUX MIGHT USE HIGH RESOURCE OF RAM

  const handleContext = useCallback((type: string, payload: any) => {
    dispatch({
      type,
      payload,
    });
  }, []);

  const handleLoading = useCallback((isLoading: boolean, text?: string) => {
    dispatch({
      type: SET_LOADING,
      payload: {
        isLoading,
        text,
      },
    });
  }, []);

  const handleError = useCallback(
    (isError: boolean, title?: string, message?: string, image?: string) => {
      dispatch({
        type: SET_ERROR,
        payload: { isError, title, message, image },
      });
    },
    [],
  );

  const context = useMemo<IContext>(
    () => ({
      ...state,
      setContext: handleContext,
      setLoading: handleLoading,
      setError: handleError,
    }),
    [state],
  );

  return <AppContextMemoize value={context}>{children}</AppContextMemoize>;
};

export default AppProvider;
