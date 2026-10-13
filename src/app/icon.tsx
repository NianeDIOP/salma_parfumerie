import { ImageResponse } from "next/og";

export const size = { width: 512, height: 512 };
export const contentType = "image/png";

// Icône de l'application : un « s » blanc sur fond bissap.
export default function Icon() {
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
          fontSize: 360,
          fontWeight: 800,
          letterSpacing: -20,
          paddingBottom: 40,
        }}
      >
        s
      </div>
    ),
    size,
  );
}
