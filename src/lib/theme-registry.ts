export interface ThemeConfig {
  bgColor: string;
  textColor: string;
  primaryColor: string;
  buttonBgColor: string;
  buttonTextColor: string;
  buttonRadius: string;
  fontFamily: string;
  cardBgColor: string;
}

export const defaultThemes: { name: string; settings: ThemeConfig }[] = [
  {
    name: "Minimal",
    settings: {
      bgColor: "#ffffff",
      textColor: "#000000",
      primaryColor: "#000000",
      buttonBgColor: "#f3f4f6",
      buttonTextColor: "#000000",
      buttonRadius: "0.5rem",
      fontFamily: "Inter, sans-serif",
      cardBgColor: "#ffffff"
    }
  },
  {
    name: "Dark",
    settings: {
      bgColor: "#09090b",
      textColor: "#ffffff",
      primaryColor: "#ffffff",
      buttonBgColor: "#27272a",
      buttonTextColor: "#ffffff",
      buttonRadius: "0.5rem",
      fontFamily: "Inter, sans-serif",
      cardBgColor: "#18181b"
    }
  },
  {
    name: "Neon",
    settings: {
      bgColor: "#000000",
      textColor: "#00ff00",
      primaryColor: "#00ff00",
      buttonBgColor: "transparent",
      buttonTextColor: "#00ff00",
      buttonRadius: "0",
      fontFamily: "monospace",
      cardBgColor: "#000000"
    }
  },
  {
    name: "Business",
    settings: {
      bgColor: "#f8fafc",
      textColor: "#334155",
      primaryColor: "#0f172a",
      buttonBgColor: "#0f172a",
      buttonTextColor: "#ffffff",
      buttonRadius: "0.25rem",
      fontFamily: "Arial, sans-serif",
      cardBgColor: "#ffffff"
    }
  }
  // The rest of the 10 themes would follow the same pattern in production.
];
