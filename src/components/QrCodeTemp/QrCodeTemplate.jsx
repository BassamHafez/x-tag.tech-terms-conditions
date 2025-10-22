import { useEffect, useRef, useMemo, useCallback } from "react";
import QRCodeStyling from "qr-code-styling";

const QrCodeTemplate = ({
  data = "https://dashboad.x-tag.tech/bassam",
  primaryColor = "#000000",
  backgroundColor = "#ffffff",
  dotsType = "square",
  cornersSquareType = "square",
  cornersDotType = "square",
  image = null,
  size = 200,
}) => {
  const containerRef = useRef(null);
  const qrCodeRef = useRef(null);

  const qrConfig = useMemo(
    () => ({
      width: size,
      height: size,
      data,
      image,
      dotsOptions: { color: primaryColor, type: dotsType},
      backgroundOptions: { color: backgroundColor },
      cornersSquareOptions: { color: primaryColor, type: cornersSquareType },
      cornersDotOptions: { color: primaryColor, type: cornersDotType },
    }),
    [
      data,
      image,
      size,
      primaryColor,
      backgroundColor,
      dotsType,
      cornersSquareType,
      cornersDotType,
    ]
  );

  const cleanup = useCallback(() => {
    if (containerRef.current) {
      while (containerRef.current.firstChild) {
        containerRef.current.removeChild(containerRef.current.firstChild);
      }
    }
  }, []);

  useEffect(() => {
    cleanup();

    if (!qrCodeRef.current) {
      qrCodeRef.current = new QRCodeStyling(qrConfig);
    } else {
      qrCodeRef.current.update(qrConfig);
    }

    if (containerRef.current && qrCodeRef.current) {
      qrCodeRef.current.append(containerRef.current);
    }

    return cleanup;
  }, [qrConfig, cleanup]);

  return <div ref={containerRef} />;
};

export default QrCodeTemplate;
