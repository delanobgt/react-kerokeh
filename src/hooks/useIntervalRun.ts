import React from "react";

function useIntervalRun(
  callback: (() => void) | (() => Promise<void>),
  delay: number
) {
  const savedCallback = React.useRef(callback);
  const runningRef = React.useRef(false);
  const [running, setRunning] = React.useState<boolean>(false);
  const lastTimeRef = React.useRef(0);
  const [lastTime, setLastTime] = React.useState<number>(0);
  const [alive, setAlive] = React.useState<boolean>(false);
  const [identity, setIdentity] = React.useState({});
  const [error, setError] = React.useState<boolean>(false);

  // componentDidMount
  React.useEffect(() => {
    return () => {
      setAlive(false);
    };
  }, []);

  // Remember the latest callback.
  React.useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Set up the timeout loop.
  React.useEffect(() => {
    if (!alive) return;

    let id: number;
    function tick() {
      setError(false);
      let ret;
      try {
        ret = savedCallback.current();
      } catch (error) {
        setError(true);
      }
      if (ret instanceof Promise) {
        setRunning((runningRef.current = true));
        ret
          .catch(() => {
            setError(true);
          })
          .finally(() => {
            id = setTimeout(tick, delay);
            setRunning((runningRef.current = false));
          });
      } else {
        id = setTimeout(tick, delay);
      }
    }
    tick();
    return () => id && clearTimeout(id);
  }, [delay, alive, identity]);

  // Set up the last time loop.
  React.useEffect(() => {
    if (!alive) {
      return;
    } else if (running) {
      setLastTime((lastTimeRef.current = 0));
      return;
    }

    function tick() {
      lastTimeRef.current += 1000;
      setLastTime(lastTimeRef.current);
    }
    let id: number = setInterval(tick, 1000);
    return () => id && clearInterval(id);
  }, [running, alive, identity]);

  const restart = React.useCallback(() => {
    setIdentity({});
  }, []);

  return React.useMemo(
    () => ({ running, lastTime, restart, error, setAlive, alive }),
    [running, lastTime, restart, error, setAlive, alive]
  );
}

export default useIntervalRun;
