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
  WalkBack: "WalkBack",
  Door: "Door",
});

/** Which edge a door swings on. */
export const HingeType = Object.freeze({ Left: "Left", Right: "Right" });

/**
 * @typedef {{ X: number, Y: number, W: number, H: number, Hinge: string }} LeafLayout
 *   a door panel in the photo, as % of it, that swings open before walking through
 * @typedef {{ Key: string, X: number, Y: number, Action: string, To?: string, Toast?: string, Leaf?: LeafLayout }} SpotLayout
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
      {
        Key: "ToLivingRoom",
        X: 6,
        Y: 43,
        Action: ActionType.Door,
        To: RoomId.LivingRoom,
        Leaf: { X: 0, Y: 0, W: 9, H: 79.4, Hinge: HingeType.Left },
      },
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
      { Key: "ToKitchen", X: 12, Y: 60, Action: ActionType.Walk, To: RoomId.Kitchen },
      { Key: "ToBedroom", X: 29, Y: 44, Action: ActionType.Walk, To: RoomId.Bedroom },
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
      { Key: "ToLivingRoom", X: 50, Y: 90, Action: ActionType.WalkBack, To: RoomId.LivingRoom },
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
      { Key: "ToLivingRoom", X: 50, Y: 84, Action: ActionType.WalkBack, To: RoomId.LivingRoom },
    ],
  },
});
