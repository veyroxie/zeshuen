// Small DOM helpers shared by every module.

export const SvgNamespace = "http://www.w3.org/2000/svg";

/** @returns {boolean} */
export const isMotionReduced = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/**
 * @param {string} id
 * @returns {HTMLElement}
 */
export const byId = (id) => document.getElementById(id);

/**
 * Creates an element with optional class and text.
 * @param {string} tag
 * @param {string} className
 * @param {string} text
 * @returns {HTMLElement}
 */
export function createElement(tag, className, text = "") {
  const element = document.createElement(tag);
  element.className = className;
  element.textContent = text;

  return element;
}
