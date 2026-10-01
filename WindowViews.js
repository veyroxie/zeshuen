import { Content } from "./Content.js";
import { byId, createElement } from "./Dom.js";
import { deferImage } from "./Preload.js";
import { RoomId } from "./Rooms.js";
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
  startSlideshow(glass, null, RoomId.LivingRoom);
}

/**
 * A bigger slideshow of the same views, for the window pop-up.
 * @returns {HTMLElement}
 */
export function createViewSlideshow() {
  const frame = createElement("figure", "view-show");
  const caption = createElement("figcaption", "");
  startSlideshow(frame, caption, null);
  frame.append(caption);

  return frame;
}

/**
 * @param {HTMLImageElement} image
 * @param {string} src
 * @param {string | null} deferToRoom
 */
function setSource(image, src, deferToRoom) {
  if (deferToRoom === null) {
    image.src = src;

    return;
  }

  deferImage(image, src, deferToRoom);
}

/** @returns {{ Src: string, Caption: string }[]} */
function viewsForNow() {
  const isNight = currentTime() === TimeType.Night;

  return isNight ? Content.Views.Night : Content.Views.Day;
}

/**
 * Crossfades through the views inside a box; stops when the box leaves the page.
 * @param {HTMLElement} box
 * @param {HTMLElement | null} caption
 * @param {string | null} deferToRoom load with this room instead of right away
 */
function startSlideshow(box, caption, deferToRoom) {
  const views = viewsForNow();
  const slides = views.map((view) => {
    const image = /** @type {HTMLImageElement} */ (createElement("img", "view-slide"));
    setSource(image, view.Src, deferToRoom);
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
