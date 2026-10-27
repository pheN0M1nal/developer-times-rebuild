import Link from "next/link";
import { Feather } from "lucide-react";
import { GithubIcon, LinkedinIcon } from "@/components/ui/brand-icons";
import { footer, persona } from "@/content/site";

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer id="site-footer" className="mt-16 border-t border-foreground/15 bg-foreground/[0.02]">
      <div className="max-w-4xl mx-auto px-6 py-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div className="space-y-1">
            <p className="font-sans text-foreground/90">
              © {year} The Chronicles of {persona.name}
            </p>
            <p className="font-mono text-xs text-muted-foreground">
              Est. {persona.established.roman} • Volume {persona.volume} • All articles and investigations reserved
            </p>
            <p className="font-mono text-xs text-muted-foreground">
              <Link href="/legal/terms/" className="underline underline-offset-2 hover:text-foreground">
                Publication Terms
              </Link>{" "}
              • Unauthorized reproduction strictly prohibited
            </p>
            <p className="font-mono text-xs text-muted-foreground">
              <Link href="/locker/" className="underline underline-offset-2 hover:text-foreground">
                The Evidence Locker
              </Link>{" "}
              •{" "}
              <Link href="/locker/vinyl/" className="underline underline-offset-2 hover:text-foreground">
                Record Shelf
              </Link>
            </p>
          </div>
          <div className="flex items-center gap-8 text-foreground/80">
            <a href={persona.github} target="_blank" rel="noreferrer" aria-label="GitHub" title="Peruse my collection of digital artifices" className="hover:text-foreground">
              <GithubIcon className="w-5 h-5" />
            </a>
            <a href={persona.linkedin.href} target="_blank" rel="noreferrer" aria-label="LinkedIn" title="Establish professional correspondence" className="hover:text-foreground">
              <LinkedinIcon className="w-5 h-5" />
            </a>
            <a href={`mailto:${persona.email}`} aria-label="Pigeon Post" title="Pigeon Post" className="hover:text-foreground">
              <Feather className="w-5 h-5" />
            </a>
          </div>
        </div>
        <div className="mt-8 pt-6 border-t border-foreground/15 text-center">
          <p className="font-serif italic text-sm text-muted-foreground">“{footer.motto}”</p>
        </div>
      </div>
    </footer>
  );
}
