import type { LoaderFunctionArgs } from "react-router";
import { ImageResponse } from "@vercel/og";

export async function loader({ request }: LoaderFunctionArgs) {
  const { searchParams } = new URL(request.url);
  const title = searchParams.get("title") ?? "Arkeonix Labs";
  const category = searchParams.get("category") ?? "";
  const author = searchParams.get("author") ?? "Arkeonix Labs";

  const displayTitle = title.length > 70 ? title.slice(0, 67) + "…" : title;

  return new ImageResponse(
    ({
      type: "div",
      props: {
        style: {
          width: "1200px",
          height: "630px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "64px",
          background: "linear-gradient(135deg, #080b16 0%, #0d1425 50%, #0a1020 100%)",
          fontFamily: "system-ui, sans-serif",
          position: "relative",
          overflow: "hidden",
        },
        children: [
          {
            type: "div",
            props: {
              style: {
                position: "absolute",
                top: "-120px",
                left: "-120px",
                width: "500px",
                height: "500px",
                borderRadius: "50%",
                background: "radial-gradient(circle, rgba(99,102,241,0.15) 0%, transparent 70%)",
              },
            },
          },
          {
            type: "div",
            props: {
              style: {
                position: "absolute",
                bottom: "-100px",
                right: "-80px",
                width: "400px",
                height: "400px",
                borderRadius: "50%",
                background: "radial-gradient(circle, rgba(167,139,250,0.1) 0%, transparent 70%)",
              },
            },
          },
          {
            type: "div",
            props: {
              style: { display: "flex", alignItems: "center", gap: "16px" },
              children: [
                {
                  type: "div",
                  props: {
                    style: { display: "flex", alignItems: "center", gap: "10px" },
                    children: [
                      {
                        type: "div",
                        props: {
                          style: {
                            width: "36px",
                            height: "36px",
                            borderRadius: "8px",
                            background: "linear-gradient(135deg, #6366f1, #a78bfa)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: "18px",
                            fontWeight: "bold",
                            color: "white",
                          },
                          children: "A",
                        },
                      },
                      {
                        type: "span",
                        props: {
                          style: {
                            color: "rgba(255,255,255,0.9)",
                            fontWeight: "700",
                            fontSize: "20px",
                            letterSpacing: "-0.02em",
                          },
                          children: "Arkeonix Labs",
                        },
                      },
                    ],
                  },
                },
                category
                  ? {
                      type: "div",
                      props: {
                        style: {
                          width: "1px",
                          height: "20px",
                          background: "rgba(255,255,255,0.2)",
                          marginLeft: "4px",
                        },
                      },
                    }
                  : null,
                category
                  ? {
                      type: "span",
                      props: {
                        style: {
                          padding: "4px 12px",
                          borderRadius: "999px",
                          background: "rgba(99,102,241,0.2)",
                          border: "1px solid rgba(99,102,241,0.4)",
                          color: "#a5b4fc",
                          fontSize: "14px",
                          fontWeight: "600",
                          letterSpacing: "0.02em",
                        },
                        children: category.toUpperCase(),
                      },
                    }
                  : null,
              ].filter(Boolean),
            },
          },
          {
            type: "div",
            props: {
              style: {
                flex: 1,
                display: "flex",
                alignItems: "center",
                paddingTop: "32px",
                paddingBottom: "32px",
              },
              children: {
                type: "h1",
                props: {
                  style: {
                    fontSize: displayTitle.length > 50 ? "48px" : "60px",
                    fontWeight: "800",
                    lineHeight: "1.1",
                    letterSpacing: "-0.03em",
                    background: "linear-gradient(135deg, #ffffff 0%, rgba(255,255,255,0.75) 100%)",
                    backgroundClip: "text",
                    WebkitBackgroundClip: "text",
                    color: "transparent",
                    margin: "0",
                  },
                  children: displayTitle,
                },
              },
            },
          },
          {
            type: "div",
            props: {
              style: { display: "flex", alignItems: "center", justifyContent: "space-between" },
              children: [
                {
                  type: "span",
                  props: {
                    style: { color: "rgba(255,255,255,0.5)", fontSize: "16px" },
                    children: `By ${author}`,
                  },
                },
                {
                  type: "span",
                  props: {
                    style: { color: "rgba(165,180,252,0.7)", fontSize: "16px", fontWeight: "600" },
                    children: "arkeonixlabs.com",
                  },
                },
              ],
            },
          },
        ],
      },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any),
    { width: 1200, height: 630 }
  );
}
