import { cn } from "@/lib/utils";
import * as React from "react";

export default function Section(
  props: React.PropsWithChildren<{ className?: string }>
) {
  return (
    <section
      className={cn(
        "max-w-2xl md:max-w-5xl w-full px-6 md:px-8 mx-auto",
        props.className
      )}
    >
      {props.children}
    </section>
  );
}
