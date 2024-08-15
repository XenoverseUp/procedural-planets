import { useRef, useState } from "react";
import domtoimage from "dom-to-image";

interface UseScreenshotReturn<U extends HTMLElement> {
  elementRef: React.RefObject<U>;
  loading: boolean;
  captureScreenshot: (scale?: number) => Promise<string>;
  downloadScreenshot: (scale?: number, filename?: string) => Promise<void>;
}

export const useScreenshot = <
  T extends HTMLElement,
>(): UseScreenshotReturn<T> => {
  const elementRef = useRef<T>(null);
  const [loading, setLoading] = useState(false);

  const captureScreenshot = async (scale: number = 1): Promise<string> => {
    if (!elementRef.current) {
      throw new Error("Element reference is null");
    }

    try {
      const dataUrl = await domtoimage.toPng(elementRef.current, {
        quality: 100,
        width: elementRef.current.scrollWidth * scale,
        height: elementRef.current.scrollHeight * scale,
        style: {
          transform: `scale(${scale})`,
          transformOrigin: "top left",
          width: `${elementRef.current.scrollWidth}px`,
          height: `${elementRef.current.scrollHeight}px`,
        },
      });
      return dataUrl;
    } catch (error) {
      console.error("Error capturing screenshot:", error);
      throw error;
    }
  };

  const downloadScreenshot = async (
    scale: number = 1,
    filename: string = "screenshot.png",
  ): Promise<void> => {
    setLoading(true);

    try {
      const dataUrl = await captureScreenshot(scale);
      const link = document.createElement("a");
      link.href = dataUrl;
      link.download = filename;
      link.click();
    } catch (error) {
      console.error("Failed to download screenshot:", error);
    } finally {
      setLoading(false);
    }
  };

  return { elementRef, loading, captureScreenshot, downloadScreenshot };
};
