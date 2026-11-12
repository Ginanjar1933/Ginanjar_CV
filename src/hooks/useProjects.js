import { useCallback, useEffect, useState } from 'react';
import { fetchProjects } from '../services/projectsService';

export function useProjects() {
  const [state, setState] = useState({ projects: [], loading: true, error: null });
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let aktif = true;

    fetchProjects()
      .then((projects) => {
        if (aktif) setState({ projects, loading: false, error: null });
      })
      .catch((err) => {
        if (aktif) setState({ projects: [], loading: false, error: err.message });
      });

    return () => {
      aktif = false;
    };
  }, [attempt]);

  const reload = useCallback(() => {
    setState((s) => ({ ...s, loading: true, error: null }));
    setAttempt((n) => n + 1);
  }, []);

  return { ...state, reload };
}