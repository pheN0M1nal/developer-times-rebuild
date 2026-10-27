import { FrontPage } from "@/components/home/front-page";
import { CareerReel } from "@/components/home/career-reel";
import { CaseMarquee } from "@/components/home/case-marquee";
import { Endorsements } from "@/components/home/endorsements";
import { DeskTeaser } from "@/components/home/desk-teaser";
import { Correspondence } from "@/components/home/correspondence";

export default function Home() {
  return (
    <main className="py-6" id="main-content" aria-label="Home page content">
      <div className="space-y-20">
        <FrontPage />
        <CareerReel />
        <CaseMarquee />
        <Endorsements />
        <DeskTeaser />
        <Correspondence />
      </div>
    </main>
  );
}
