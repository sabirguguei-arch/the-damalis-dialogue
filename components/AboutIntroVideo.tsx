"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

function stopYouTubeVideo(iframe: HTMLIFrameElement | null) {
  iframe?.contentWindow?.postMessage(
    JSON.stringify({
      event: "command",
      func: "stopVideo",
      args: [],
    }),
    "https://www.youtube.com",
  );
}

export function AboutIntroVideo() {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    const iframe = iframeRef.current;

    return () => {
      stopYouTubeVideo(iframe);
    };
  }, [pathname]);

  useEffect(() => {
    if (pathname !== "/about") {
      stopYouTubeVideo(iframeRef.current);
    }
  }, [pathname]);

  if (pathname !== "/about") {
    return null;
  }

  return (
    <iframe
      ref={iframeRef}
      src="https://www.youtube.com/embed/RqBte5JD1V0?enablejsapi=1"
      title="The Damalis Dialogue — About Our Channel"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
      referrerPolicy="strict-origin-when-cross-origin"
      allowFullScreen
    />
  );
}
