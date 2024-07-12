import { useEffect, useState } from 'react';

export const usePageLifecycle = () => {
  const [isFirstMount, setIsFirstMount] = useState(false);
  const [isRefresh, setIsRefresh] = useState(false);

  useEffect(() => {
    const isFirstVisit = sessionStorage.getItem('firstVisit') === null;

    if (isFirstVisit) {
      sessionStorage.setItem('firstVisit', '1');
      setIsFirstMount(true);
    } else {
      setIsRefresh(true);
    }
  }, []);

  return { isFirstMount, isRefresh };
};
