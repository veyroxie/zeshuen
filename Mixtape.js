import { byId, createElement } from "./Dom.js";

// youtube-nocookie keeps YouTube from setting tracking cookies until she presses play.
const EmbedBaseUrl = "https://www.youtube-nocookie.com/embed/";
const IsPlayingClass = "is-current";

const EmbedParam = Object.freeze({
  Playlist: "playlist",
  InlineOnPhone: "playsinline",
  RelatedFromSameChannel: "rel",
  Autoplay: "autoplay",
  Loop: "loop",
});

/**
 * Builds an embed URL that starts at one track, plays the rest in order, then loops the whole list.
 * @param {string[]} videoIds
 * @param {number} startIndex
 * @returns {string}
 */
function buildEmbedUrl(videoIds, startIndex) {
  const ordered = [...videoIds.slice(startIndex), ...videoIds.slice(0, startIndex)];
  const url = new URL(`${EmbedBaseUrl}${ordered[0]}`);
  // With loop on, YouTube plays this list from its first entry and moves the path video
  // to the end, so the list must hold every track, starting with the one in the path.
  url.searchParams.set(EmbedParam.Playlist, ordered.join(","));
  url.searchParams.set(EmbedParam.InlineOnPhone, "1");
  url.searchParams.set(EmbedParam.RelatedFromSameChannel, "0");
  url.searchParams.set(EmbedParam.Loop, "1");

  return url.toString();
}

/**
 * Renders the tracklist and the player. The first load never autoplays;
 * picking a track asks the player to start (iPhones may still need a tap on the video).
 * @param {import("./Content.js").MixtapeContent} mixtape
 */
export function renderMixtape(mixtape) {
  const player = /** @type {HTMLIFrameElement} */ (byId("MixtapePlayer"));
  const list = byId("Tracklist");
  const videoIds = mixtape.Tracks.map((track) => track.VideoId);
  player.src = buildEmbedUrl(videoIds, 0);
  byId("MixtapeNote").textContent = mixtape.Note;
  mixtape.Tracks.forEach((track, index) => {
    const button = createElement("button", "track", track.Title);
    button.type = "button";
    button.append(createElement("small", "track__artist", track.Artist));
    button.addEventListener("click", () => playTrack({ player, list, button, url: buildEmbedUrl(videoIds, index) }));
    const item = createElement("li", "");
    item.append(button);
    list.append(item);
  });
}

/**
 * @param {{ player: HTMLIFrameElement, list: HTMLElement, button: HTMLElement, url: string }} options
 */
function playTrack({ player, list, button, url }) {
  const autoplayUrl = new URL(url);
  autoplayUrl.searchParams.set(EmbedParam.Autoplay, "1");
  player.src = autoplayUrl.toString();
  list.querySelectorAll(`.${IsPlayingClass}`).forEach((track) => track.classList.remove(IsPlayingClass));
  button.classList.add(IsPlayingClass);
}
