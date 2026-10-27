import type { Metadata, Viewport } from "next";
import { ThemeProvider } from "next-themes";
import "./globals.css";
import { fontVariables } from "@/lib/fonts";
import { persona } from "@/content/site";
import { TorchProvider } from "@/components/providers/torch";
import { HireModeProvider } from "@/components/providers/hire-mode";
import { MusicProvider } from "@/components/providers/music";
import { SignalsTracker } from "@/components/providers/signals-tracker";
import { SmoothScroll } from "@/components/providers/smooth-scroll";
import { PomodoroProvider } from "@/components/desk/pomodoro/provider";
import { PocketWatch } from "@/components/desk/pomodoro/pocket-watch";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { ScrollProgress } from "@/components/layout/scroll-progress";
import { SvgDefs } from "@/components/layout/svg-defs";
import { Intro, introGateScript } from "@/components/layout/intro";
import { TorchOverlay } from "@/components/torch/torch-overlay";
import { Onboarding } from "@/components/layout/onboarding";

export const metadata: Metadata = {
  title: {
    default: `${persona.name} | Full Stack Engineer`,
    template: `%s | ${persona.name}`,
  },
  description:
    "A portfolio printed like a newspaper: case files, press clippings, an evidence locker and a desk of working instruments that all run in the browser.",
};

export const viewport: Viewport = {
  themeColor: "#704214",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={fontVariables} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: introGateScript }} />
      </head>
      <body className="antialiased min-h-screen flex flex-col">
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false} disableTransitionOnChange>
          <TorchProvider>
            <HireModeProvider>
              <MusicProvider>
                <PomodoroProvider>
                  <SvgDefs />
                  <Intro />
                  <ScrollProgress />
                  <Header />
                  <div className="flex-1">{children}</div>
                  <Footer />
                  <PocketWatch />
                  <Onboarding />
                  <TorchOverlay />
                  <SignalsTracker />
                  <SmoothScroll />
                </PomodoroProvider>
              </MusicProvider>
            </HireModeProvider>
          </TorchProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
