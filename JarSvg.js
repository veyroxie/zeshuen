import { FlavourType } from "./Content.js";
import { SvgNamespace } from "./Dom.js";

/** The honey jar isn't a Content flavour; it opens the faith pop-up. */
export const HoneyFlavour = "Honey";

// Labels longer than this wrap onto two lines so they stay on the paper label.
const MaxSingleLineChars = 11;
const LabelCenterX = "60";
const LabelLineY = Object.freeze({ Single: "106", First: "99", Second: "113" });

/** Jam colour + lid cloth colour for each flavour, softened to sit in a Nordic kitchen. */
const FlavourColours = Object.freeze({
  [FlavourType.Strawberry]: { Jam: "#D9535F", Cloth: "#F2B8B5" },
  [FlavourType.Blueberry]: { Jam: "#6B6FA8", Cloth: "#C9CCE4" },
  [FlavourType.Lemon]: { Jam: "#EECF7C", Cloth: "#B8C7B0" },
  [FlavourType.Marmalade]: { Jam: "#E59A57", Cloth: "#F2D6B8" },
  [FlavourType.Raspberry]: { Jam: "#B84F6E", Cloth: "#EECF7C" },
  [FlavourType.Plum]: { Jam: "#7D5B86", Cloth: "#D9C6DD" },
  [HoneyFlavour]: { Jam: "#EBC05E", Cloth: "#C4704F" },
});

// Hand-drawn wobble lives in the paths; all shapes share one 120×150 box.
const JarMarkup = `
  <path d="M22 34 q4-16 38-18 q34 2 38 18 q-4 6-8 3 q-4 5-9 1 q-5 5-10 1 q-5 5-11 0 q-6 5-11 0 q-5 5-10 0 q-5 4-9-1 q-5 3-8-3z" class="jar__cloth"/>
  <path d="M30 40 q-12 6-12 34 v44 q0 22 22 24 h40 q22-2 22-24 v-44 q0-28-12-34z" class="jar__glass"/>
  <path d="M24 72 q0-8 8-9 h56 q8 1 8 9 v46 q0 18-18 19 h-36 q-18-1-18-19z" class="jar__jam"/>
  <path d="M28 58 q-3 20 0 60" class="jar__shine"/>
  <rect x="27" y="86" width="66" height="32" rx="5" class="jar__label" transform="rotate(-3 60 101)"/>
  <text class="jar__text" transform="rotate(-3 60 101)"></text>
`;

/**
 * Builds a jar illustration for a flavour, with its label in her handwriting.
 * @param {{ Flavour: string, Label: string }} jar
 * @returns {SVGSVGElement}
 */
export function createJarSvg(jar) {
  const colours = FlavourColours[jar.Flavour] ?? FlavourColours[HoneyFlavour];
  const svg = document.createElementNS(SvgNamespace, "svg");
  svg.setAttribute("viewBox", "0 0 120 150");
  svg.setAttribute("aria-hidden", "true");
  svg.classList.add("jar__art");
  svg.style.setProperty("--jam", colours.Jam);
  svg.style.setProperty("--cloth", colours.Cloth);
  svg.innerHTML = JarMarkup;
  fillLabel(svg.querySelector(".jar__text"), jar.Label.toLowerCase());

  return svg;
}

/**
 * Splits a long label at the space nearest the middle. Text goes in via
 * textContent so copy can never inject markup.
 * @param {SVGTextElement} textNode
 * @param {string} label
 */
function fillLabel(textNode, label) {
  const splitAt = findMiddleSpace(label);
  const isSingleLine = label.length <= MaxSingleLineChars || splitAt === -1;
  if (isSingleLine) {
    textNode.append(createLine(label, LabelLineY.Single));

    return;
  }

  textNode.append(
    createLine(label.slice(0, splitAt), LabelLineY.First),
    createLine(label.slice(splitAt + 1), LabelLineY.Second),
  );
}

/**
 * @param {string} label
 * @returns {number} index of the space closest to the middle, or -1 when there is none
 */
function findMiddleSpace(label) {
  const middle = label.length / 2;
  const spaces = [...label.matchAll(/ /g)].map((match) => match.index);
  const nearest = spaces.sort((left, right) => Math.abs(left - middle) - Math.abs(right - middle))[0];

  return nearest ?? -1;
}

/**
 * @param {string} text
 * @param {string} y
 * @returns {SVGTSpanElement}
 */
function createLine(text, y) {
  const span = document.createElementNS(SvgNamespace, "tspan");
  span.setAttribute("x", LabelCenterX);
  span.setAttribute("y", y);
  span.textContent = text;

  return span;
}
