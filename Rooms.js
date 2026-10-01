// Layout of the walk-through. Positions are % of each photo, so they stay put at any size.
// Words live in Content.House; this file only says where things are and what they do.

export const RoomId = Object.freeze({
  Door: "Door",
  Entryway: "Entryway",
  LivingRoom: "LivingRoom",
  Kitchen: "Kitchen",
  Bedroom: "Bedroom",
  MyRoom: "MyRoom",
  Bathroom: "Bathroom",
  Fridge: "Fridge",
  Toilet: "Toilet",
});

/** What tapping a spot does; House.js maps each to a handler. */
export const ActionType = Object.freeze({
  Mirror: "Mirror",
  Window: "Window",
  Radio: "Radio",
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
 * @typedef {{ X: number, Y: number, W: number, H: number, Hinge: string, Clip?: string, Behind?: string }} LeafLayout
 *   a door panel in the photo, as % of it, that swings open before walking through.
 *   Clip is a CSS polygon for doors drawn in perspective; Behind is what shows through
 *   the doorway (the next room's photo when left out).
 * @typedef {{ Key: string, X: number, Y: number, Action: string, To?: string, Toast?: string, Leaf?: LeafLayout, Arrow?: string }} SpotLayout
 *   a spot with an Arrow is an exit to another room, drawn as a tag on the doorway
 * @typedef {{ Key: string, X: number, Y: number, W: number, Image?: string }} PropLayout
 *   something placed into the photo (left, top and width as % of it): a drawing from
 *   Props.js, or a cut-out photo when Image is set
 * @typedef {{ Id: string, Image: string, Width: number, Height: number, FocusX: number, Spots: SpotLayout[], Props?: PropLayout[] }} RoomLayout
 */

/** @type {Readonly<Record<string, RoomLayout>>} */
export const Rooms = Object.freeze({
  // Every room photo is one 1200×1440 shot from the same flat, so the rooms match.
  [RoomId.Entryway]: {
    Id: RoomId.Entryway,
    Image: "Assets/Rooms/Entryway.webp",
    Width: 1200,
    Height: 1440,
    FocusX: 52,
    Spots: [
      { Key: "Mirror", X: 37, Y: 45, Action: ActionType.Mirror },
      { Key: "Lamp", X: 37, Y: 20, Action: ActionType.Toast, Toast: "Lamp" },
      {
        Key: "ToLivingRoom",
        X: 68,
        Y: 50,
        Action: ActionType.Door,
        To: RoomId.LivingRoom,
        Arrow: ArrowType.Right,
        // the tall oak door on the right, hinged on its right edge
        Leaf: { X: 52.5, Y: 0, W: 38, H: 100, Hinge: HingeType.Right },
      },
    ],
  },
  [RoomId.LivingRoom]: {
    Id: RoomId.LivingRoom,
    Image: "Assets/Rooms/LivingRoom.webp",
    Width: 1200,
    Height: 1440,
    FocusX: 50,
    Props: [{ Key: "Radio", X: 48, Y: 69.5, W: 11 }],
    Spots: [
      { Key: "Window", X: 90, Y: 30, Action: ActionType.Window },
      { Key: "Sofa", X: 22, Y: 64, Action: ActionType.Sofa },
      { Key: "Radio", X: 53.5, Y: 75, Action: ActionType.Radio },
      { Key: "ToKitchen", X: 43, Y: 58, Action: ActionType.Walk, To: RoomId.Kitchen, Arrow: ArrowType.Ahead },
      { Key: "ToBedroom", X: 66, Y: 40, Action: ActionType.Walk, To: RoomId.Bedroom, Arrow: ArrowType.Right },
      { Key: "ToMyRoom", X: 66, Y: 48, Action: ActionType.Walk, To: RoomId.MyRoom, Arrow: ArrowType.Right },
      { Key: "ToBathroom", X: 31, Y: 40, Action: ActionType.Walk, To: RoomId.Bathroom, Arrow: ArrowType.Left },
      { Key: "ToEntryway", X: 50, Y: 90, Action: ActionType.WalkBack, To: RoomId.Entryway, Arrow: ArrowType.Behind },
    ],
  },
  [RoomId.Kitchen]: {
    Id: RoomId.Kitchen,
    Image: "Assets/Rooms/Kitchen.webp",
    Width: 1200,
    Height: 1440,
    FocusX: 48,
    Spots: [
      { Key: "Fridge", X: 42, Y: 56, Action: ActionType.Walk, To: RoomId.Fridge },
      { Key: "Stove", X: 80, Y: 75, Action: ActionType.Toast, Toast: "Stove" },
      { Key: "Sink", X: 79, Y: 62, Action: ActionType.Toast, Toast: "Sink" },
      { Key: "ToLivingRoom", X: 50, Y: 90, Action: ActionType.WalkBack, To: RoomId.LivingRoom, Arrow: ArrowType.Behind },
    ],
  },
  // her room: the letter's on her pillow, the guard dog sits on her bed
  [RoomId.Bedroom]: {
    Id: RoomId.Bedroom,
    Image: "Assets/Rooms/Bedroom.webp",
    Width: 1200,
    Height: 1440,
    FocusX: 50,
    Props: [{ Key: "GuardDog", X: 60, Y: 58.5, W: 12, Image: "Assets/Photos/GuardDogCutout.webp" }],
    Spots: [
      { Key: "Letter", X: 38, Y: 62, Action: ActionType.Letter },
      { Key: "GuardDog", X: 71, Y: 55, Action: ActionType.GuardDog },
      { Key: "Light", X: 14, Y: 51, Action: ActionType.LightsOut },
      { Key: "ToLivingRoom", X: 50, Y: 90, Action: ActionType.WalkBack, To: RoomId.LivingRoom, Arrow: ArrowType.Behind },
    ],
  },
  // my room, across the hall: same as hers, just pinker
  [RoomId.MyRoom]: {
    Id: RoomId.MyRoom,
    Image: "Assets/Rooms/MyRoom.webp",
    Width: 1200,
    Height: 1440,
    FocusX: 50,
    Spots: [
      { Key: "Blanket", X: 50, Y: 68, Action: ActionType.Toast, Toast: "Blanket" },
      { Key: "ToLivingRoom", X: 50, Y: 90, Action: ActionType.WalkBack, To: RoomId.LivingRoom, Arrow: ArrowType.Behind },
    ],
  },
  [RoomId.Bathroom]: {
    Id: RoomId.Bathroom,
    Image: "Assets/Rooms/Bathroom.webp",
    Width: 1200,
    Height: 1440,
    FocusX: 72,
    Spots: [
      {
        Key: "Toilet",
        X: 90,
        Y: 50,
        Action: ActionType.Door,
        To: RoomId.Toilet,
        // the dark glass door on the right, hinged on its right
        Leaf: { X: 85.3, Y: 15, W: 14.7, H: 70, Hinge: HingeType.Right, Behind: "Assets/Photos/Teeth01.webp" },
      },
      { Key: "Bathtub", X: 49, Y: 76, Action: ActionType.Toast, Toast: "Bathtub" },
      { Key: "ToLivingRoom", X: 50, Y: 90, Action: ActionType.WalkBack, To: RoomId.LivingRoom, Arrow: ArrowType.Behind },
    ],
  },
});
