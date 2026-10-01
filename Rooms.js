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

/** Which way an exit tag points: where that room is from here. */
export const ArrowType = Object.freeze({ Left: "←", Right: "→", Ahead: "↑", Behind: "↓" });

/** Which edge a door swings on. */
export const HingeType = Object.freeze({ Left: "Left", Right: "Right" });

/**
 * @typedef {{ X: number, Y: number, W: number, H: number, Hinge: string }} LeafLayout
 *   a door panel in the photo, as % of it, that swings open before walking through
 * @typedef {{ Key: string, X: number, Y: number, Action: string, To?: string, Toast?: string, Leaf?: LeafLayout, Arrow?: string }} SpotLayout
 *   a spot with an Arrow is an exit to another room, drawn as a tag on the doorway
 * @typedef {{ Id: string, Image: string, Width: number, Height: number, FocusX: number, Spots: SpotLayout[] }} RoomLayout
 */

/** @type {Readonly<Record<string, RoomLayout>>} */
export const Rooms = Object.freeze({
  [RoomId.Entryway]: {
    Id: RoomId.Entryway,
    Image: "Assets/Rooms/Entryway.webp",
    Width: 735,
    Height: 919,
    FocusX: 36,
    Spots: [
      { Key: "Mirror", X: 58, Y: 22, Action: ActionType.Mirror },
      { Key: "Lamp", X: 83, Y: 45, Action: ActionType.Toast, Toast: "Lamp" },
      { Key: "Shoes", X: 58, Y: 69, Action: ActionType.Toast, Toast: "Shoes" },
      {
        Key: "ToLivingRoom",
        X: 20,
        Y: 43,
        Action: ActionType.Door,
        To: RoomId.LivingRoom,
        Arrow: ArrowType.Left,
        Leaf: { X: 0, Y: 0, W: 9, H: 79.4, Hinge: HingeType.Left },
      },
    ],
  },
  [RoomId.LivingRoom]: {
    Id: RoomId.LivingRoom,
    Image: "Assets/Rooms/LivingRoom.webp",
    Width: 1024,
    Height: 683,
    FocusX: 38,
    Spots: [
      { Key: "Window", X: 89, Y: 36, Action: ActionType.Window },
      { Key: "Piano", X: 58, Y: 58, Action: ActionType.Piano },
      { Key: "Sofa", X: 44, Y: 70, Action: ActionType.Sofa },
      { Key: "ToKitchen", X: 12, Y: 60, Action: ActionType.Walk, To: RoomId.Kitchen, Arrow: ArrowType.Left },
      { Key: "ToBedroom", X: 29, Y: 44, Action: ActionType.Walk, To: RoomId.Bedroom, Arrow: ArrowType.Ahead },
      { Key: "ToEntryway", X: 50, Y: 90, Action: ActionType.WalkBack, To: RoomId.Entryway, Arrow: ArrowType.Behind },
    ],
  },
  [RoomId.Kitchen]: {
    Id: RoomId.Kitchen,
    Image: "Assets/Rooms/Kitchen.webp",
    Width: 665,
    Height: 619,
    FocusX: 24,
    Spots: [
      { Key: "Fridge", X: 9, Y: 52, Action: ActionType.Walk, To: RoomId.Fridge },
      { Key: "Stove", X: 50, Y: 54, Action: ActionType.Toast, Toast: "Stove" },
      { Key: "Sink", X: 83, Y: 56, Action: ActionType.Toast, Toast: "Sink" },
      { Key: "ToLivingRoom", X: 50, Y: 90, Action: ActionType.WalkBack, To: RoomId.LivingRoom, Arrow: ArrowType.Behind },
    ],
  },
  [RoomId.Bedroom]: {
    Id: RoomId.Bedroom,
    Image: "Assets/Rooms/Bedroom.webp",
    Width: 1600,
    Height: 1456,
    FocusX: 46,
    Spots: [
      { Key: "Letter", X: 28, Y: 62, Action: ActionType.Letter },
      { Key: "GuardDog", X: 49, Y: 66, Action: ActionType.GuardDog },
      { Key: "Blanket", X: 74, Y: 75, Action: ActionType.Toast, Toast: "Blanket" },
      { Key: "Light", X: 49, Y: 50, Action: ActionType.LightsOut },
      { Key: "ToLivingRoom", X: 50, Y: 90, Action: ActionType.WalkBack, To: RoomId.LivingRoom, Arrow: ArrowType.Behind },
    ],
  },
});
