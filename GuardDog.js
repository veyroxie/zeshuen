import { createElement, SvgNamespace } from "./Dom.js";

const BarkResetMs = 2600;
const IsBarkingClass = "is-barking";

const BubbleText = Object.freeze({
  Idle: "on duty",
  Barked: "woof! scaries: scared away ✓",
});

// Hand-drawn sitting pup; all shapes share one 100×100 box.
const DogMarkup = `
  <path d="M74 78 q16-2 14-20" class="dog__tail"/>
  <path d="M28 94 q-6-32 20-38 q26-2 28 24 q2 14-6 14z" class="dog__fur"/>
  <path d="M42 94 v-13 M58 94 v-13" class="dog__line"/>
  <ellipse cx="48" cy="40" rx="22" ry="20" class="dog__fur"/>
  <path d="M29 28 q-11 4-8 23 q8 2 12-10z M67 28 q11 4 8 23 q-8 2-12-10z" class="dog__ear"/>
  <circle cx="41" cy="38" r="2.6" class="dog__ink"/>
  <circle cx="55" cy="38" r="2.6" class="dog__ink"/>
  <ellipse cx="48" cy="46" rx="4" ry="3" class="dog__ink"/>
  <path d="M48 49 q-4 5-8 2 M48 49 q4 5 8 2" class="dog__line"/>
  <path d="M46 53 q2 7 4 0z" class="dog__tongue"/>
  <path d="M34 58 q14 7 28 0" class="dog__collar"/>
  <circle cx="48" cy="63" r="3.5" class="dog__tag"/>
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
