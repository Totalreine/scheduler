import { useState } from "react";

export function useVisualMode(initial) {
  const [mode, setMode] = useState(initial);
  const [history, setHistory] = useState([initial]);

  function transition(mode, replace = false) {
    if (replace) {
      setMode(mode);
    } else {
      const newHistory = [...history];
      newHistory.push(mode);
      setHistory(newHistory);
      const last = newHistory[newHistory.length - 1];
      setMode(last);
    }
  }

  function back() {
    if (history.length > 1) {
      const newHistory = [...history];
      newHistory.pop(mode);
      setHistory(newHistory);
      const last = newHistory[newHistory.length - 1];
      setMode(last);
    }
  }

  return {
    mode,
    transition,
    back,
  };
}
