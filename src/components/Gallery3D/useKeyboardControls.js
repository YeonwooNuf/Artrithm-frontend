import { useRef, useEffect } from "react";

export default function useKeyboardControls() {
  const keys = useRef({});

  useEffect(() => {
    const down = (e) => {
      const key = e.key.toLowerCase();

      // ✅ 스페이스바는 기본 스크롤 막기
      if (e.code === "Space") {
        e.preventDefault();
        keys.current[" "] = true;
      } else {
        keys.current[key] = true;
      }
    };

    const up = (e) => {
      const key = e.key.toLowerCase();

      if (e.code === "Space") {
        keys.current[" "] = false;
      } else {
        keys.current[key] = false;
      }
    };

    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);

    return () => {
      window.removeEventListener("keydown", down);
      window.removeEventListener("keyup", up);
    };
  }, []);

  return keys;
}
