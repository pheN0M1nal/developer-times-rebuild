"use client";

import { arsenal } from "@/content/site";
import { useTorch } from "@/components/providers/torch";
import { Highlighter } from "@/components/ui/highlighter";
import { hash } from "@/lib/utils";

/** Four ruled columns. Under the torch, one skill per column gets circled. */
export function Arsenal() {
  const { torchEnabled } = useTorch();

  return (
    <section className="mt-6 sm:mt-8 font-serif text-sm sm:text-[0.85rem] text-foreground tracking-wide leading-relaxed relative overflow-hidden px-1 sm:px-0">
      <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6 justify-center">
        <hr className="flex-grow border-t border-foreground max-w-[40px] sm:max-w-none" />
        <h3 className="uppercase text-[0.65rem] sm:text-xs font-sans tracking-widest px-2 whitespace-nowrap">Technical Arsenal</h3>
        <hr className="flex-grow border-t border-foreground max-w-[40px] sm:max-w-none" />
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 sm:gap-x-6 gap-y-4 sm:gap-y-6 relative z-0">
        {arsenal.map(({ title, skills }, i) => {
          const pick = hash(title) % skills.length;
          return (
            <div key={title} className={`pr-2 sm:pr-6 ${i % 2 === 0 && i < arsenal.length - 1 ? "border-r border-foreground/30" : ""}`}>
              <h4 className="uppercase text-[0.65rem] sm:text-[0.7rem] font-bold tracking-widest mb-1 sm:mb-2 border-b border-foreground/60 pb-1 border-dashed">{title}</h4>
              <ul className="list-none space-y-1 sm:space-y-1.5 tracking-[0.02em]">
                {skills.map((s, j) => (
                  <li key={s} className="relative pl-4 sm:pl-5 before:absolute before:left-0 before:top-[0.15rem] before:text-foreground before:text-[0.7rem] sm:before:text-[0.8rem] before:content-['✦']">
                    {torchEnabled && j === pick ? (
                      <Highlighter action="circle" color="#f59e0b" strokeWidth={1.5} animationDuration={600} iterations={2} padding={2}>
                        <span className="text-[0.8rem] sm:text-[0.85rem]">{s}</span>
                      </Highlighter>
                    ) : (
                      <span className="text-[0.8rem] sm:text-[0.85rem]">{s}</span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    </section>
  );
}
