import { useCallback, useState } from 'react';

type CallbackType = (...args: string[]) => void;

export const useToggle = (initialValue = false): [boolean, () => void] => {
  const [toggled, setToggled] = useState<boolean>(initialValue);
  const toggle = useCallback<CallbackType>(() => {
    setToggled((v) => !v);
  }, []);
  return [toggled, toggle];
};
