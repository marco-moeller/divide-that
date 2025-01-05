import { useEffect } from "react";

function MonetagAd() {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://vemtoutcheeg.com/400/8744114";
    script.async = true;

    try {
      (document.body || document.documentElement).appendChild(script);
    } catch (e) {
      console.error("Error appending script:", e);
    }

    return () => {
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, []);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://vemtoutcheeg.com/400/8747483";
    script.async = true;

    try {
      (document.body || document.documentElement).appendChild(script);
    } catch (e) {
      console.error("Error appending script:", e);
    }

    return () => {
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, []);

  return null; // No visible UI for this ad
}

export default MonetagAd;
