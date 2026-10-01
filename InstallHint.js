import { Content } from "./Content.js";
import { byId } from "./Dom.js";

const DismissedKey = "Alyesa.InstallHintDismissed";
const StandaloneQueries = Object.freeze(["(display-mode: standalone)", "(display-mode: fullscreen)"]);
const IosDevice = /iPad|iPhone|iPod/;
const AndroidDevice = /Android/;
const TouchMacPoints = 1;

/** @type {Event & { prompt: () => Promise<void> } | null} */
let installPrompt = null;

/**
 * On a phone's front door, a small tip to add the site to the home screen,
 * which is the only way an iPhone shows it without browser bars.
 */
export function initInstallHint() {
  window.addEventListener("beforeinstallprompt", (event) => {
    event.preventDefault();
    installPrompt = /** @type {Event & { prompt: () => Promise<void> }} */ (event);
    showHint();
  });
  byId("InstallDismiss").addEventListener("click", dismiss);
  byId("InstallButton").addEventListener("click", installNow);
  showHint();
}

function showHint() {
  const isSkipped = isInstalled() || wasDismissed();
  const text = isSkipped ? "" : tipForDevice();
  byId("Install").hidden = text === "";
  byId("InstallText").textContent = text;
  byId("InstallButton").hidden = installPrompt === null;
}

/** @returns {string} the right instructions for this phone, or "" on a laptop */
function tipForDevice() {
  if (installPrompt !== null) {
    return Content.House.Install.Prompt;
  }

  if (isIos()) {
    return Content.House.Install.Ios;
  }

  return AndroidDevice.test(navigator.userAgent) ? Content.House.Install.Android : "";
}

async function installNow() {
  const prompt = installPrompt;
  installPrompt = null;
  await prompt?.prompt().catch((error) => console.warn("Install prompt failed:", error));
  dismiss();
}

function dismiss() {
  try {
    localStorage.setItem(DismissedKey, "1");
  } catch (error) {
    console.warn("Could not remember the dismissed tip:", error);
  }

  byId("Install").hidden = true;
}

/** @returns {boolean} */
function wasDismissed() {
  try {
    return localStorage.getItem(DismissedKey) !== null;
  } catch (error) {
    console.warn("Could not read the dismissed tip:", error);

    return false;
  }
}

/** @returns {boolean} already opened from the home screen */
function isInstalled() {
  const isIosHomeScreen = /** @type {Navigator & { standalone?: boolean }} */ (navigator).standalone === true;

  return isIosHomeScreen || StandaloneQueries.some((query) => window.matchMedia(query).matches);
}

/** @returns {boolean} iPhones, and iPads that report themselves as Macs */
function isIos() {
  const isTouchMac = navigator.platform === "MacIntel" && navigator.maxTouchPoints > TouchMacPoints;

  return IosDevice.test(navigator.userAgent) || isTouchMac;
}
