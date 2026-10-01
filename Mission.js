import { Content } from "./Content.js";
import { hasStartedHunt, isLoungeOpen } from "./JarHunt.js";

// The missions, in order: turn on the radio, find the jars in the fridge, then (every jar found) the secret lounge.
const MissionStage = Object.freeze({ Radio: "Radio", Fridge: "Fridge", Lounge: "Lounge", Done: "Done" });

const StageSpots = Object.freeze({
  [MissionStage.Radio]: '[data-spot="Radio"]',
  [MissionStage.Fridge]: '[data-spot="ToKitchen"], [data-spot="Fridge"]',
  // #Back is the fridge's way out, in case the last jar was in there
  [MissionStage.Lounge]: '[data-spot="ToLivingRoom"], [data-spot="ToLounge"], #Back',
});
const MissionClass = "is-mission";

let isRadioDone = false;
let isLoungeFound = false;

/** @returns {string} one of MissionStage */
function currentStage() {
  if (isLoungeOpen()) {
    return isLoungeFound ? MissionStage.Done : MissionStage.Lounge;
  }

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

/** She's walked into the secret lounge: nothing left to lead her to. */
export function completeLoungeMission() {
  isLoungeFound = true;
}
