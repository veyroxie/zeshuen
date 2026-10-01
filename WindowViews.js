import { Content } from "./Content.js";
import { byId, createElement } from "./Dom.js";
import { currentTime, TimeType } from "./TimeOfDay.js";

// What's outside the living-room window, cycling slowly. Daytime views by day,
// city lights and stars at night. Photos: Unsplash (free licence), credited in Content.Views.
const SlideMs = 6000;
const IsShownClass = "is-shown";

// The bright part of the window in the living-room photo, as % of it.
const WindowGlass = Object.freeze({ X: 88, Y: 34, W: 9, H: 32 });

/** Puts a slowly changing view behind the living-room window glass. */
export function initWindowViews() {
  const glass = createElement("div", "window-view");
  Object.assign(glass.style, { left: `${WindowGlass.X}%`, top: `${WindowGlass.Y}%`, width: `${WindowGlass.W}%`, height: `${WindowGlass.H}%` });
  byId("LivingRoomView").querySelector(".scene").append(glass);
  startSlideshow(glass);
}

/**
 * A bigger slideshow of the same views, for the window pop-up.
 * @returns {HTMLElement}
 */
export function createViewSlideshow() {
  const frame = createElement("figure", "view-show");
  const caption = createElement("figcaption", "");
  startSlideshow(frame, caption);
  frame.append(caption);

  return frame;
}

/** @returns {{ Src: string, Caption: string }[]} */
function viewsForNow() {
  const isNight = currentTime() === TimeType.Night;

  return isNight ? Content.Views.Night : Content.Views.Day;
}

/**
 * Crossfades through the views inside a box; stops when the box leaves the page.
 * @param {HTMLElement} box
 * @param {HTMLElement} [caption]
 */
function startSlideshow(box, caption) {
  const views = viewsForNow();
  const slides = views.map((view) => {
    const image = /** @type {HTMLImageElement} */ (createElement("img", "view-slide"));
    image.src = view.Src;
    image.alt = view.Caption;
    image.decoding = "async";

    return image;
  });
  box.prepend(...slides);
  let index = 0;
  const show = () => {
    slides.forEach((slide, slideIndex) => slide.classList.toggle(IsShownClass, slideIndex === index));
    if (caption) {
      caption.textContent = views[index].Caption;
    }

    index = (index + 1) % slides.length;
  };
  show();
  const timer = window.setInterval(() => {
    if (box.isConnected === false) {
      window.clearInterval(timer);

      return;
    }

    show();
  }, SlideMs);
}
