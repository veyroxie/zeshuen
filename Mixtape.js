import { byId } from "./Dom.js";

// Spotify's embed shows the playlist's own tracklist, in the order set in Spotify.
const EmbedBaseUrl = "https://open.spotify.com/embed/playlist/";

/**
 * Points the mixtape player at the Spotify playlist and fills in the note.
 * @param {import("./Content.js").MixtapeContent} mixtape
 */
export function renderMixtape(mixtape) {
  const player = /** @type {HTMLIFrameElement} */ (byId("MixtapePlayer"));
  player.src = `${EmbedBaseUrl}${mixtape.SpotifyPlaylistId}`;
  byId("MixtapeNote").textContent = mixtape.Note;
}
