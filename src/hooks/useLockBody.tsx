import { useEffect } from "react";

function useLockBody(lock: boolean): void {
  useEffect(() => {
    if (lock) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";

      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [lock]);
}

export default useLockBody;
