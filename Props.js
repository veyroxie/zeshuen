import { createElement, SvgNamespace } from "./Dom.js";

// Things drawn into a room photo. The radio is Marshall-style: black tolex, brass panel,
// mesh grille, with her handwriting where the logo would be. Its power light follows the song.
const PropMarkup = Object.freeze({
  Radio: {
    ViewBox: "0 0 220 160",
    Markup: `
  <defs>
    <pattern id="Tolex" width="4" height="4" patternUnits="userSpaceOnUse"><rect width="4" height="4" fill="#1C1B19"/><circle cx="1" cy="1" r=".7" fill="#2A2926"/><circle cx="3" cy="3" r=".6" fill="#252421"/></pattern>
    <pattern id="Mesh" width="5" height="5" patternUnits="userSpaceOnUse"><rect width="5" height="5" fill="#232220"/><path d="M0 0 L5 5 M5 0 L0 5" stroke="#34322E" stroke-width=".8"/></pattern>
    <linearGradient id="Brass" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#E9D29A"/><stop offset=".55" stop-color="#C9A45C"/><stop offset="1" stop-color="#A9853F"/></linearGradient>
  </defs>
  <!-- leather strap on brass rings -->
  <path d="M38 26 q0 -24 72 -24 q72 0 72 24" fill="none" stroke="#1C1B19" stroke-width="7" stroke-linecap="round"/>
  <circle cx="38" cy="27" r="5" fill="none" stroke="url(#Brass)" stroke-width="3"/>
  <circle cx="182" cy="27" r="5" fill="none" stroke="url(#Brass)" stroke-width="3"/>
  <!-- black tolex body with cream piping -->
  <rect x="4" y="30" width="212" height="128" rx="12" fill="url(#Tolex)"/>
  <rect x="10" y="36" width="200" height="116" rx="8" fill="none" stroke="#EDE6D6" stroke-width="1.4"/>
  <!-- brass control panel -->
  <rect x="18" y="42" width="184" height="24" rx="3" fill="url(#Brass)"/>
  <circle cx="38" cy="54" r="7" fill="#1C1B19"/><path d="M38 54 v-5" stroke="#E9D29A" stroke-width="1.6"/>
  <circle cx="64" cy="54" r="7" fill="#1C1B19"/><path d="M64 54 l4 -3" stroke="#E9D29A" stroke-width="1.6"/>
  <circle cx="90" cy="54" r="7" fill="#1C1B19"/><path d="M90 54 l-4 -3" stroke="#E9D29A" stroke-width="1.6"/>
  <circle cx="116" cy="54" r="7" fill="#1C1B19"/><path d="M116 54 v-5" stroke="#E9D29A" stroke-width="1.6"/>
  <rect x="150" y="48" width="18" height="12" rx="2" fill="#1C1B19"/>
  <circle class="radio__power" cx="186" cy="54" r="4"/>
  <!-- mesh grille with her handwriting where the logo goes -->
  <rect x="18" y="72" width="184" height="72" rx="4" fill="url(#Mesh)"/>
  <text class="radio__logo" x="110" y="118" text-anchor="middle">Alyesa</text>
`,
  },
});

/**
 * @param {import("./Rooms.js").PropLayout} prop
 * @returns {HTMLElement}
 */
export function createProp(prop) {
  const holder = createElement("div", "prop");
  holder.dataset.prop = prop.Key;
  Object.assign(holder.style, { left: `${prop.X}%`, top: `${prop.Y}%`, width: `${prop.W}%` });
  if (prop.Image) {
    holder.append(createPropImage(prop.Image));

    return holder;
  }

  const svg = document.createElementNS(SvgNamespace, "svg");
  svg.setAttribute("viewBox", PropMarkup[prop.Key].ViewBox);
  svg.setAttribute("aria-hidden", "true");
  svg.innerHTML = PropMarkup[prop.Key].Markup;
  holder.append(svg);

  return holder;
}

/**
 * @param {string} src a cut-out photo with a transparent background
 * @returns {HTMLImageElement}
 */
function createPropImage(src) {
  const image = /** @type {HTMLImageElement} */ (createElement("img", "prop__image"));
  image.src = src;
  image.alt = "";

  return image;
}
