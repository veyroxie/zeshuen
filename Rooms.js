// Layout of the walk-through. Positions are % of each photo, so they stay put at any size.
// Words live in Content.House; this file only says where things are and what they do.

export const RoomId = Object.freeze({
  Door: "Door",
  Entryway: "Entryway",
  LivingRoom: "LivingRoom",
  Kitchen: "Kitchen",
  Bedroom: "Bedroom",
  Fridge: "Fridge",
});

/** What tapping a spot does; House.js maps each to a handler. */
export const ActionType = Object.freeze({
  Mirror: "Mirror",
  Window: "Window",
  Piano: "Piano",
  Sofa: "Sofa",
  Letter: "Letter",
  GuardDog: "GuardDog",
  LightsOut: "LightsOut",
  Toast: "Toast",
  Walk: "Walk",
});

/**
 * @typedef {{ Key: string, X: number, Y: number, Action: string, To?: string, Toast?: string }} SpotLayout
 * @typedef {{ Id: string, Image: string, Width: number, Height: number, FocusX: number, Spots: SpotLayout[] }} RoomLayout
 */

/** The rooms you can walk between, in the order the nav shows them. */
export const NavRooms = Object.freeze([RoomId.Entryway, RoomId.LivingRoom, RoomId.Kitchen, RoomId.Bedroom]);

/** @type {Readonly<Record<string, RoomLayout>>} */
export const Rooms = Object.freeze({
  [RoomId.Entryway]: {
    Id: RoomId.Entryway,
    Image: "Assets/Rooms/Entryway.webp",
    Width: 735,
    Height: 919,
    FocusX: 60,
    Spots: [
      { Key: "Mirror", X: 65, Y: 21, Action: ActionType.Mirror },
      { Key: "Lamp", X: 83, Y: 45, Action: ActionType.Toast, Toast: "Lamp" },
      { Key: "Shoes", X: 58, Y: 69, Action: ActionType.Toast, Toast: "Shoes" },
    ],
  },
  [RoomId.LivingRoom]: {
    Id: RoomId.LivingRoom,
    Image: "Assets/Rooms/LivingRoom.webp",
    Width: 1024,
    Height: 683,
    FocusX: 55,
    Spots: [
      { Key: "Window", X: 89, Y: 36, Action: ActionType.Window },
      { Key: "Piano", X: 58, Y: 58, Action: ActionType.Piano },
      { Key: "Sofa", X: 44, Y: 70, Action: ActionType.Sofa },
    ],
  },
  [RoomId.Kitchen]: {
    Id: RoomId.Kitchen,
    Image: "Assets/Rooms/Kitchen.webp",
    Width: 236,
    Height: 299,
    FocusX: 35,
    Spots: [
      { Key: "Fridge", X: 12, Y: 50, Action: ActionType.Walk, To: RoomId.Fridge },
      { Key: "Stove", X: 38, Y: 49, Action: ActionType.Toast, Toast: "Stove" },
      { Key: "Bar", X: 80, Y: 78, Action: ActionType.Toast, Toast: "Bar" },
    ],
  },
  [RoomId.Bedroom]: {
    Id: RoomId.Bedroom,
    Image: "Assets/Rooms/Bedroom.webp",
    Width: 399,
    Height: 501,
    FocusX: 45,
    Spots: [
      { Key: "Letter", X: 24, Y: 61, Action: ActionType.Letter },
      { Key: "GuardDog", X: 50, Y: 68, Action: ActionType.GuardDog },
      { Key: "Blanket", X: 78, Y: 74, Action: ActionType.Toast, Toast: "Blanket" },
      { Key: "Light", X: 46, Y: 10, Action: ActionType.LightsOut },
    ],
  },
});
