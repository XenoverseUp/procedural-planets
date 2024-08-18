import { useState, useEffect } from "react";

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const userAgent = navigator.userAgent || navigator?.vendor;

    // Check for mobile user agents
    if (/android/i.test(userAgent)) setIsMobile(true);
    else if (/iPhone|iPad|iPod/i.test(userAgent)) setIsMobile(true);
    else setIsMobile(false);
  }, []);

  return isMobile;
}

export default useIsMobile;
