import { SvgNamespace } from "./Dom.js";

// Little fruit magnets for the fridge door; all drawn in one 32×32 box.
const FruitMarkup = Object.freeze([
  // strawberry
  `<path d="M16 29 C7 24 5 14 9 10 C12 8 20 8 23 10 C27 14 25 24 16 29Z" fill="#D9535F" stroke="#2B2A27" stroke-width="1.4"/>
   <path d="M10 10 L13 5 L16 8 L19 5 L22 10 Q16 12 10 10Z" fill="#8C9E86" stroke="#2B2A27" stroke-width="1.2"/>
   <g fill="#F7E3A1"><circle cx="13" cy="15" r=".9"/><circle cx="19" cy="15" r=".9"/><circle cx="16" cy="19" r=".9"/><circle cx="13" cy="22" r=".9"/><circle cx="19" cy="22" r=".9"/></g>`,
  // lemon slice
  `<circle cx="16" cy="16" r="12" fill="#EECF7C" stroke="#2B2A27" stroke-width="1.4"/>
   <circle cx="16" cy="16" r="8.5" fill="#FBEFC4"/>
   <path d="M16 7.5 V24.5 M7.5 16 H24.5 M10 10 L22 22 M22 10 L10 22" stroke="#EECF7C" stroke-width="1.3"/>`,
  // cherries
  `<path d="M11 21 Q13 10 20 5 M21 21 Q20 11 20 5" fill="none" stroke="#6E8566" stroke-width="1.6" stroke-linecap="round"/>
   <path d="M20 5 Q26 3 27 8 Q22 9 20 5Z" fill="#8C9E86" stroke="#2B2A27" stroke-width="1"/>
   <circle cx="10" cy="23" r="6" fill="#B84F6E" stroke="#2B2A27" stroke-width="1.4"/>
   <circle cx="22" cy="23" r="6" fill="#B84F6E" stroke="#2B2A27" stroke-width="1.4"/>
   <circle cx="8" cy="21" r="1.4" fill="#fff" opacity=".7"/><circle cx="20" cy="21" r="1.4" fill="#fff" opacity=".7"/>`,
  // orange slice
  `<path d="M4 18 A12 12 0 0 0 28 18 Z" fill="#E59A57" stroke="#2B2A27" stroke-width="1.4"/>
   <path d="M7.5 18 A8.5 8.5 0 0 0 24.5 18 Z" fill="#F7C79A"/>
   <path d="M16 18 V26 M16 18 L10.5 24 M16 18 L21.5 24" stroke="#E59A57" stroke-width="1.2"/>`,
  // peach
  `<circle cx="16" cy="18" r="11" fill="#F2B28F" stroke="#2B2A27" stroke-width="1.4"/>
   <path d="M16 8 Q13 14 16 28" fill="none" stroke="#D98A6A" stroke-width="1.2"/>
   <path d="M16 8 Q20 2 26 5 Q22 10 16 8Z" fill="#8C9E86" stroke="#2B2A27" stroke-width="1.1"/>`,
]);

/**
 * A fruit magnet; the fruit cycles with the index so neighbours differ.
 * @param {number} index
 * @returns {SVGSVGElement}
 */
export function createFruitMagnet(index) {
  const svg = document.createElementNS(SvgNamespace, "svg");
  svg.setAttribute("viewBox", "0 0 32 32");
  svg.setAttribute("aria-hidden", "true");
  svg.classList.add("magnet");
  svg.innerHTML = FruitMarkup[index % FruitMarkup.length];

  return svg;
}
