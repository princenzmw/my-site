import Link from "next/link";
import { Download } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { FOOTER, SITE } from "@/lib/portfolio";

export function Footer() {
  return (
    <footer className="mt-auto border-t bg-muted/40">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <div className="flex flex-col gap-3 text-center md:flex-row md:items-center md:justify-between md:text-left">
          <div>
            <p className="font-medium">{FOOTER.referencesLine}</p>
            <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{FOOTER.privacyLine}</p>
          </div>
          <div className="flex flex-col items-center gap-2 md:items-end">
            <a
              href={SITE.resume}
              download
              data-pla="resume-download"
              className="inline-flex min-h-11 items-center gap-2 text-sm font-medium text-primary underline-offset-4 hover:underline"
            >
              <Download className="h-4 w-4" aria-hidden />
              Résumé (PDF)
            </a>
            <Separator className="md:hidden" />
            <p className="text-xs text-muted-foreground">
              {FOOTER.copyright} · <Link href="/contact" className="underline-offset-4 hover:underline">Contact</Link>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
