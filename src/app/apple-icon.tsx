import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

// Icône de l'application : un « s » blanc sur fond bissap.
export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#a8153a",
          color: "#fff",
          fontSize: 128,
          fontWeight: 800,
          letterSpacing: -6,
          paddingBottom: 14,
        }}
      >
        s
      </div>
    ),
    size,
  );
}
