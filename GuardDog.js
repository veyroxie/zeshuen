import { createElement, SvgNamespace } from "./Dom.js";

const BarkResetMs = 2600;
const IsBarkingClass = "is-barking";

const BubbleText = Object.freeze({
  Idle: "guard dog: on duty",
  Barked: "woof! scaries: scared away ✓",
});

// Hand-drawn guard dog after the real plush: grey herringbone, tan ears and cheeks, big brown nose.
// All shapes share one 100×100 box.
const DogMarkup = `
  <path d="M74 78 q16-2 14-20" class="dog__tail"/>
  <path d="M28 94 q-6-32 20-38 q26-2 28 24 q2 14-6 14z" class="dog__fur"/>
  <path d="M42 94 v-13 M58 94 v-13" class="dog__line"/>
  <path d="M34 60 q14 7 28 0" class="dog__collar"/>
  <path d="M33 27 q-6-20-19-14 q-4 12 10 20z M63 27 q6-20 19-14 q4 12-10 20z" class="dog__ear"/>
  <ellipse cx="48" cy="40" rx="20" ry="18" class="dog__fur"/>
  <ellipse cx="40" cy="39" rx="5" ry="4.5" class="dog__patch"/>
  <ellipse cx="56" cy="39" rx="5" ry="4.5" class="dog__patch"/>
  <path d="M40 48 q8 10 16 0z" class="dog__patch"/>
  <circle cx="40" cy="39" r="2.2" class="dog__ink"/>
  <circle cx="56" cy="39" r="2.2" class="dog__ink"/>
  <ellipse cx="48" cy="47" rx="5" ry="3.6" class="dog__nose"/>
`;

/** @returns {SVGSVGElement} */
function createDogSvg() {
  const svg = document.createElementNS(SvgNamespace, "svg");
  svg.setAttribute("viewBox", "0 0 100 100");
  svg.setAttribute("aria-hidden", "true");
  svg.classList.add("dog");
  svg.innerHTML = DogMarkup;

  return svg;
}

/**
 * The guard dog from the "can't sleep" jar. Tap it and it scares the scaries away.
 * @returns {HTMLButtonElement}
 */
export function createGuardDog() {
  const button = createElement("button", "guard-dog");
  button.type = "button";
  button.setAttribute("aria-label", "Your guard dog. Tap to scare the scaries away");
  const bubble = createElement("span", "guard-dog__bubble", BubbleText.Idle);
  bubble.setAttribute("role", "status");
  button.append(bubble, createDogSvg());
  button.addEventListener("click", () => bark(button, bubble));

  return /** @type {HTMLButtonElement} */ (button);
}

/**
 * @param {HTMLElement} button
 * @param {HTMLElement} bubble
 */
function bark(button, bubble) {
  bubble.textContent = BubbleText.Barked;
  button.classList.add(IsBarkingClass);
  window.setTimeout(() => {
    bubble.textContent = BubbleText.Idle;
    button.classList.remove(IsBarkingClass);
  }, BarkResetMs);
}
