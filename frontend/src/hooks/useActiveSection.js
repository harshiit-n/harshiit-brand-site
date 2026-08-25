import { useEffect, useState } from "react";

// Tracks which of the given section ids is currently most "active" in the
// viewport, using a fixed reference line near the top of the screen rather
// than raw visibility, so the active section changes right as it starts
// dominating the view instead of the moment any sliver of it appears.
export default function useActiveSection(ids) {
  const [activeId, setActiveId] = useState(ids[0]);

  useEffect(() => {
    const REFERENCE_LINE = 160;

    function update() {
      let current = ids[0];
      for (const id of ids) {
        const el = document.getElementById(id);
        if (!el) continue;
        const top = el.getBoundingClientRect().top;
        if (top <= REFERENCE_LINE) {
          current = id;
        }
      }
      setActiveId(current);
    }

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [ids]);

  return activeId;
}
