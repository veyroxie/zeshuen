import { Content } from "./Content.js";
import { hasStartedHunt } from "./JarHunt.js";

// The opening missions, in order: turn on the radio, then find the jars in the fridge.
const MissionStage = Object.freeze({ Radio: "Radio", Fridge: "Fridge", Done: "Done" });

const StageSpots = Object.freeze({
  [MissionStage.Radio]: '[data-spot="Radio"]',
  [MissionStage.Fridge]: '[data-spot="ToKitchen"], [data-spot="Fridge"]',
});
const MissionClass = "is-mission";

let isRadioDone = false;

/** @returns {string} one of MissionStage */
function currentStage() {
  if (hasStartedHunt()) {
    return MissionStage.Done;
  }

  return isRadioDone ? MissionStage.Fridge : MissionStage.Radio;
}

/**
 * @param {string} roomId one of RoomId
 * @returns {string | undefined} the hint for this step in this room, if the step has one here
 */
export function missionHint(roomId) {
  return Content.House.Mission[currentStage()]?.[roomId];
}

/** Lights up only the current step's spots. */
export function showMission() {
  const stage = currentStage();
  Object.entries(StageSpots).forEach(([spotStage, selector]) => {
    document.querySelectorAll(selector).forEach((spot) => spot.classList.toggle(MissionClass, spotStage === stage));
  });
}

/** She's opened the radio: the kitchen lights up next. */
export function completeRadioMission() {
  isRadioDone = true;
  showMission();
}
