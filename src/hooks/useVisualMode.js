import { useState } from "react";

export function useVisualMode(initial) {
    const [mode, setMode] = useState(initial);
    const [history, setHistory] = useState([initial]);

    function transition(mode, replace = false) {
        if (replace) {
            setMode(mode)
        } else {
            history.push(mode)
            setHistory(history)
            const last = history[history.length-1]
            setMode(last)
        }
    }

    function back() {
        if(history.length > 1) {
            history.pop()
            setHistory(history)
            const last = history[history.length-1]
            setMode(last)
        }
    }

  return {
    mode,
    transition,
    back
  };
}