// The flat follows her clock: soft morning light, plain daylight, a golden evening,
// and lamps-on night. CSS reads data-time on <html> and tints the room photos.

export const TimeType = Object.freeze({ Morning: "Morning", Day: "Day", Evening: "Evening", Night: "Night" });

// Hour each period starts at, latest first, so the first one she's past wins.
const Periods = Object.freeze([
  { From: 20, Time: TimeType.Night },
  { From: 17, Time: TimeType.Evening },
  { From: 11, Time: TimeType.Day },
  { From: 6, Time: TimeType.Morning },
]);

const RecheckMs = 5 * 60 * 1000;

/** Tints the flat for the time where she is, and keeps it current if she stays a while. */
export function initTimeOfDay() {
  applyTime();
  window.setInterval(applyTime, RecheckMs);
}

/** @returns {string} one of TimeType */
export function currentTime() {
  const hour = new Date().getHours();

  return Periods.find((period) => hour >= period.From)?.Time ?? TimeType.Night;
}

function applyTime() {
  document.documentElement.dataset.time = currentTime();
}
