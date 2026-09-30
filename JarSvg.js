import { FlavourType } from "./Content.js";

const SvgNamespace = "http://www.w3.org/2000/svg";
// Labels longer than this wrap onto two lines so they stay inside the paper label.
const MaxSingleLineChars = 13;
// Label text is vertically centred on y=106; two lines sit either side of it.
const LabelLineY = Object.freeze({ Single: 106, First: 100, Second: 112 });

/** Jam colour + lid cloth colour for each flavour. */
const FlavourColours = Object.freeze({
  [FlavourType.Strawberry]: { Jam: "#D6455B", Cloth: "#E8798A" },
  [FlavourType.Blueberry]: { Jam: "#5B6BB5", Cloth: "#8C98D1" },
  [FlavourType.Lemon]: { Jam: "#F2C94C", Cloth: "#9DB38A" },
  [FlavourType.Marmalade]: { Jam: "#F2A65A", Cloth: "#E8798A" },
  [FlavourType.Raspberry]: { Jam: "#B8336A", Cloth: "#F4C7CF" },
  [FlavourType.Plum]: { Jam: "#7B4B8A", Cloth: "#B9A3C9" },
  Gift: { Jam: "#E0A93B", Cloth: "#D6455B" },
});

// Hand-drawn wobble lives in the paths; all shapes share one 120×150 box.
const JarMarkup = `
  <g class="jar__lid">
    <path d="M22 34 q4-16 38-18 q34 2 38 18 q-4 6-8 3 q-4 5-9 1 q-5 5-10 1 q-5 5-11 0 q-6 5-11 0 q-5 5-10 0 q-5 4-9-1 q-5 3-8-3z" class="jar__cloth"/>
    <path d="M22 34 q4-16 38-18 q34 2 38 18 q-4 6-8 3 q-4 5-9 1 q-5 5-10 1 q-5 5-11 0 q-6 5-11 0 q-5 5-10 0 q-5 4-9-1 q-5 3-8-3z" fill="url(#Gingham)"/>
    <path d="M28 33 q32 5 64 0" class="jar__twine"/>
    <path d="M60 34 q-10-9-14 1 q6 4 14-1 q10-9 14 1 q-6 4-14-1 l-6 12 m6-12 l7 11" class="jar__twine"/>
  </g>
  <path d="M30 40 q-12 6-12 34 v44 q0 22 22 24 h40 q22-2 22-24 v-44 q0-28-12-34z" class="jar__glass"/>
  <path d="M24 72 q0-8 8-9 h56 q8 1 8 9 v46 q0 18-18 19 h-36 q-18-1-18-19z" class="jar__jam"/>
  <path d="M28 58 q-3 20 0 60" class="jar__shine"/>
  <rect x="28" y="84" width="64" height="34" rx="6" class="jar__label" transform="rotate(-3 60 101)"/>
  <text x="60" y="106" class="jar__text" transform="rotate(-3 60 101)"></text>
`;

/**
 * Builds a jar illustration for a flavour.
 * @param {{ Flavour: string, Label: string }} jar
 * @returns {SVGSVGElement}
 */
export function createJarSvg(jar) {
  const colours = FlavourColours[jar.Flavour] ?? FlavourColours.Gift;
  const svg = document.createElementNS(SvgNamespace, "svg");
  svg.setAttribute("viewBox", "0 0 120 150");
  svg.setAttribute("aria-hidden", "true");
  svg.classList.add("jar");
  svg.style.setProperty("--jam", colours.Jam);
  svg.style.setProperty("--cloth", colours.Cloth);
  svg.innerHTML = JarMarkup;
  fillLabel(svg.querySelector(".jar__text"), jar.Label);

  return svg;
}

/**
 * Writes the label text, splitting long labels at the space nearest the middle.
 * Text goes in via textContent so copy can never inject markup.
 * @param {SVGTextElement} textNode
 * @param {string} label
 */
function fillLabel(textNode, label) {
  const middle = label.length / 2;
  const splitAt = [...label.matchAll(/ /g)]
    .map((match) => match.index)
    .sort((left, right) => Math.abs(left - middle) - Math.abs(right - middle))[0];
  const isSingleLine = label.length <= MaxSingleLineChars || splitAt === undefined;

  if (isSingleLine) {
    textNode.textContent = label;

    return;
  }

  const lines = [label.slice(0, splitAt), label.slice(splitAt + 1)];
  const lineYs = [LabelLineY.First, LabelLineY.Second];
  lines.forEach((line, index) => {
    const span = document.createElementNS(SvgNamespace, "tspan");
    span.setAttribute("x", "60");
    span.setAttribute("y", String(lineYs[index]));
    span.textContent = line;
    textNode.append(span);
  });
}
