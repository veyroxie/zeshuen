import { Content } from "./Content.js";
import { byId, createElement } from "./Dom.js";
import { openSheet } from "./Sheet.js";

// "Leave me a note": she writes on a sticky note on the fridge and it lands in my
// Google Form responses. GitHub Pages has no server, so the form is the mailbox.
const FormBaseUrl = "https://docs.google.com/forms/d/e/";
const FormSubmitPath = "/formResponse";
const MaxLength = 1000;

/** Shows the sticky note only once the Google Form is set up in Content.ReplyForm. */
export function initReplyNote() {
  const sticky = byId("ReplySticky");
  const isReady = Content.ReplyForm.FormId !== "" && Content.ReplyForm.EntryId !== "";
  sticky.hidden = isReady === false;
  sticky.addEventListener("click", openReplySheet);
}

function openReplySheet() {
  const copy = Content.House.Reply;
  const note = /** @type {HTMLTextAreaElement} */ (createElement("textarea", "reply__text"));
  note.id = "ReplyText";
  note.placeholder = copy.Placeholder;
  note.maxLength = MaxLength;
  note.rows = 6;
  const send = /** @type {HTMLButtonElement} */ (createElement("button", "pill", copy.Send));
  send.type = "button";
  const status = createElement("p", "reply__status");
  status.setAttribute("role", "status");
  send.addEventListener("click", () => sendNote({ note, send, status }));
  const form = createElement("div", "reply");
  form.append(note, send, status);
  openSheet({ tag: Content.Side.Yours, title: copy.Title, children: [form] });
}

/**
 * @param {{ note: HTMLTextAreaElement, send: HTMLButtonElement, status: HTMLElement }} parts
 */
async function sendNote({ note, send, status }) {
  const text = note.value.trim();
  if (text === "") {
    note.focus();

    return;
  }

  send.disabled = true;
  try {
    await submitToForm(text);
    status.textContent = Content.House.Reply.Sent;
    note.value = "";
  } catch (error) {
    console.warn("Could not send the note:", error);
    status.textContent = Content.House.Reply.Failed;
  } finally {
    send.disabled = false;
  }
}

/**
 * Google Forms doesn't allow reading its reply from another site, so "no-cors" sends it
 * blind: a network failure still throws, which is the case worth telling her about.
 * @param {string} text
 */
async function submitToForm(text) {
  const { FormId, EntryId } = Content.ReplyForm;
  const body = new URLSearchParams({ [`entry.${EntryId}`]: text });
  await fetch(`${FormBaseUrl}${FormId}${FormSubmitPath}`, { method: "POST", mode: "no-cors", body });
}
