// Every word on the site lives here, so edit this file for copy changes.

/**
 * @typedef {{ Flavour: string, Label: string, Title: string, Lines: string[] }} JarContent
 * @typedef {{ Note: string, Title: string, SpotifyPlaylistId: string }} MixtapeContent
 * @typedef {{ Src: string, Alt: string, Caption: string }} PhotoContent
 * @typedef {{ Text: string, Reference: string }} VerseContent
 */

export const FlavourType = Object.freeze({
  Strawberry: "Strawberry",
  Blueberry: "Blueberry",
  Lemon: "Lemon",
  Marmalade: "Marmalade",
  Raspberry: "Raspberry",
  Plum: "Plum",
});

export const Content = Object.freeze({
  Name: "Alyssa",
  Age: 24,
  BirthdayLabel: "01 · 10 · 2026",
  From: "Alyssa",

  /** Every word of the walk-through: the place we almost had back in uni. */
  House: {
    Intro: {
      Sign: "happy birthday, alyssa",
      Line: "imagine if we'd moved in together back in uni",
      Hint: "knock twice to come in",
    },
    Rooms: {
      Entryway: { Name: "entryway", Hint: "tap the mirror. the door on the right goes to the living room" },
      LivingRoom: { Name: "living room", Hint: "tap the sofa or the radio, or head to another room. swipe for the window" },
      Kitchen: { Name: "kitchen", Hint: "tap the fridge" },
      Door: { Name: "front door", Hint: "knock twice to come in" },
      Bedroom: { Name: "your room", Hint: "there's a letter on your pillow. turn off the light when you're ready for bed" },
      MyRoom: { Name: "my room", Hint: "same as yours, but pink. across the hall if you need me" },
      Bathroom: { Name: "bathroom", Hint: "the toilet's behind the glass door" },
      Toilet: { Name: "toilet", Hint: "" },
      Fridge: { Name: "fridge", HintClosed: "tap a photo or the chore chart, or the handles to open it", HintOpen: "only 3 jars made it in here. the other 3 are hiding around the flat. find them before they spoil!" },
      Lounge: { Name: "secret lounge", Hint: "you found it. tap the fireplace" },
    },
    Spots: {
      Mirror: "the mirror",
      Lamp: "the light",
      Window: "the window",
      Radio: "the radio",
      Sofa: "the sofa",
      Fridge: "the fridge",
      Stove: "the stove",
      Sink: "the sink",
      Letter: "a letter",
      GuardDog: "the guard dog",
      Light: "the light",
      Blanket: "my bed",
      ToMyRoom: "my room",
      Handle: "the handle",
      Crisper: "the crisper",
      ToLivingRoom: "living room",
      ToKitchen: "kitchen",
      ToBedroom: "your room",
      ToEntryway: "entryway",
      ToBathroom: "bathroom",
      Toilet: "the toilet",
      Mugs: "the mugs",
      Fireplace: "the fireplace",
      ToLounge: "???",
      Knock: "knock knock",
      Bathtub: "the bathtub",
    },
    Toasts: {
      Lamp: "left the light on for you ♡",
      Stove: "who's cooking tonight?",
      Sink: "i'll wash, you dry. deal",
      Blanket: "my bed. no stealing my blanket",
      Crisper: "my section. don't steal my food (jk)",
      Bathtub: "bubble bath sundays, obviously",
      Mugs: "matching mugs. yours says alyssa, mine says elyesa",
      JarFound: "found one! {found} of {total}, still fresh 🫙",
      AllJars: "you found every jar before they spoiled! something just opened in the living room…",
      Hey: "hey alyssaa, brushing teeth soon? 🪥",
    },
    Stickers: {
      Property: "property of Alyesa",
      Roomie: "hi roomie :)",
      RanOff: "the rest ran off! 🏃 find them before they spoil",
      ChoreChart: "chore chart",
      Freezer: "bingsu stash",
      Eggs: "we ran outta eggs!! 🥚",
    },
    /** Knock twice and the door opens. */
    Knock: { Hint: "knock twice", Second: "one more…" },

    /** The steamed-up mirror she wipes with her finger. */
    Mirror: { Wipe: "wipe the mirror ✋" },

    /** Taped to the fridge's freezer drawer. */
    ChoreChart: {
      Title: "Chore chart",
      Rows: [
        ["dishes", "i wash, you dry"],
        ["cooking", "whoever's hungrier"],
        ["taking out the trash", "rock paper scissors, best of 3"],
        ["buying bingsu", "both of us, always"],
        ["hogging the bathroom", "you (with love)"],
        ["making the bed", "lol"],
      ],
    },

    /** The secret room, unlocked by finding every jar. Rewrite these in your own words. */
    Lounge: {
      Title: "You found every jar",
      Lines: [
        "Of course you did. You've always been good at finding the sweet things, even when they're hiding.",
        "This is the room I'd keep just for us: blankets, the fireplace, our playlist on, and far too many snacks.",
        "Stay as long as you want. Happy birthday, roomie ♡",
      ],
    },

    JarCounter: "{found}/{total} jars",

    /** Until she's found a jar, the hints lead her to the fridge. */
    Mission: {
      Entryway: "your first mission's in the kitchen. head through to the living room →",
      LivingRoom: "first mission: go to the kitchen ↑ and check the fridge",
      Kitchen: "open the fridge. your mission's inside",
    },

    Reply: {
      Sticky: "leave me a note ✏️",
      Title: "Leave a note on the fridge",
      Placeholder: "write anything. i'll see it ♡",
      Send: "stick it on the fridge",
      Sent: "stuck on the fridge! i'll read it soon ♡",
      Failed: "that didn't go through. check your internet and try again?",
    },

    Install: {
      Ios: "for the full experience: tap Share, then “Add to Home Screen”, and open it from there",
      Android: "for the full experience: tap ⋮, then “Add to Home screen”, and open it from there",
      Prompt: "for the full experience, add it to your home screen",
      Button: "add to home screen",
      Dismiss: "not now",
    },
    LightsOut: {
      Made: "made with love for",
      Best: "best before: never",
      On: "turn the lights back on",
    },
    // Ways back always say where they go, e.g. "back to the living room".
    BackTo: "back to the",
    GuardDog: "Your guard dog is on night duty hehe 🐶 Don't worry, it'll scare the scaries away.",
  },

  /** Short handwritten-font lines for shared controls. */
  Ui: {
    SheetClose: "Close",
    TypedLetter: "read the typed version",
    VoiceNote: "a voice note from me",
    PlayIconBig: "▶",
    PauseIconBig: "❚❚",
    Seek: "Position in the voice note",
    Speed: "Playback speed",
    PlaySong: "▶ play our song",
    PauseSong: "❚❚ pause our song",
    EnterFullscreen: "Full screen",
    ExitFullscreen: "Exit full screen",
    PlayIcon: "♫",
    PauseIcon: "❚❚",
    PlayLabel: "Play our song",
    PauseLabel: "Pause our song",
    SpotifyLink: "the whole playlist on spotify ↗",
  },

  /** Pop-up titles for everything that isn't a jam jar. */
  SheetTitle: {
    Mirror: "What the mirror should show you",
    Window: "Morning light: you are so loved by God",
    Sofa: "Sit with me a sec",
    Letter: "A letter, left on your pillow",
    Photos: "Stuck on the fridge",
    GuardDog: "On night duty",
  },

  /** Which side each pop-up comes from, shown as its small label. */
  Side: {
    Yours: "about you",
    Mine: "from me",
  },

  /** "Her beautiful soul" notes, on the entryway mirror. */
  SoulNotes: [
    "You love God even at your lowest. You trust Him to guide you through, especially on the hard days. Every day I see your faith, I believe a little more.",
    "You make everyone feel like there's someone there for them, me included, even when you've got a lot on your plate.",
    "You give so much love that you deserve nothing less than the best back. Don't let anyone give you otherwise.",
    "You're the bravest person I know, and I'm proud of you every single day.",
    "You can turn any last-minute hangout into the most meaningful time spent.",
    "Thank you for being with me at my lowest. I hope I've been able to be there for yours too.",
  ],

  /** The longer note, shown when she sits on the sofa. */
  SoulClosing: [
    "I might be wrong, but it feels like you might be feeling alone right now. You don't really show it, or show that you're hurting even when you are. Maybe it's because you grew up so independent.",
    "But you never need to be ashamed of being hurt, or of feeling your feelings. I will never, ever judge you or shame you for it, and neither will any of your friends.",
    "Every time I think of you, I just feel so much love, because of how much love you've shown me. You're not alone. I'm always here for you, no matter what.",
    "I'm so happy and grateful that I got to watch you grow into the woman you are now, all the way from our college years. Thank you for being part of my life.",
  ],

  /** @type {JarContent[]} */
  Jars: [
    {
      Flavour: FlavourType.Strawberry,
      Label: "Things I love",
      Title: "Things I love about you",
      Lines: [
        "Your smile.",
        "Your eyes.",
        "Your laugh.",
        "Your happiness, which is honestly contagious.",
        "How easily you connect with people.",
        "How you always see the best in others.",
        "Your singing voice.",
      ],
    },
    {
      Flavour: FlavourType.Blueberry,
      Label: "Open when blue",
      Title: "Open when you're feeling blue",
      Lines: [
        "You might be feeling like everything is hopeless right now, like nothing you do seems to work. But genuinely, you've got this. You've got this like no one's ever gotten anything before.",
        "I'm always rooting for you, and I'll always have your back when times are tough. Tell me, and we can cry together or work it out together, whatever you want. I love you <3",
        "\"The Lord is close to the brokenhearted and saves those who are crushed in spirit.\" Psalm 34:18",
        "\"And we know that in all things God works for the good of those who love him.\" Romans 8:28. Nothing you go through is wasted.",
      ],
    },
    {
      Flavour: FlavourType.Lemon,
      Label: "Alyesa",
      Title: "Alyesa: est. forever",
      Lines: [
        "Sometimes someone calls me Alyssa and I think of you. Then I start yapping about you like a crazy person and they're like, why is she talking about herself? lmao",
        "I'm so glad I got to share the big life moments with you. Even when I'm not around much, you're always somewhere in the back of my mind.",
        "Being a long-distance bestie is hard, and I wish I could be there more. But distance has never changed a thing about where you stand with me.",
        "No matter what anyone says, you're always the best to me. Don't let anyone ever make you doubt that :>",
        "Alyesa 4eva <3",
      ],
    },
    {
      Flavour: FlavourType.Marmalade,
      Label: "Hopes for 24",
      Title: "Hopes for your 24th year",
      Lines: [
        "A year where you're loved the way you love, by yourself and by the people around you. And always, always by God.",
        "That God brings you peace and guidance in this new chapter of life.",
        "That you see yourself the way God sees you: as His precious child. Don't let no stinky ahh man make you feel any less.",
        "\"It is better to take refuge in the Lord than to trust in humans.\" Psalm 118:8. No man compares to Him.",
        "To more hangouts, more salmon runs and more worship nights together. Hugss!",
      ],
    },
    {
      Flavour: FlavourType.Raspberry,
      Label: "Open when unsure",
      Title: "Open when you feel like you're not enough",
      Lines: [
        "\"I praise you because I am fearfully and wonderfully made.\" Psalm 139:14",
        "How could you not be enough, when the God who created you knit you together piece by piece? (Psalm 139:13)",
        "Anyone who says otherwise is projecting, brother. They can go awayyyy. How could they say that about the most hardworking, resilient, beautiful, loving girl I've ever had the pleasure of meeting?",
        "You are enough, in the eyes of God and in the eyes of your true friends. Mwaks!",
      ],
    },
    {
      Flavour: FlavourType.Plum,
      Label: "Can't sleep",
      Title: "Open when you can't sleep",
      Lines: [
        "\"Cast all your anxiety on Him because He cares for you.\" 1 Peter 5:7",
        "And you've got a guard dog on night duty now hehe 🐶 Go check your room.",
        "Put on some worship songs, lie down and breathe slow. He's got you, even at 3am.",
        "Text me. I'm probably awake anyway.",
      ],
    },
  ],

  /** @type {PhotoContent[]} */
  Photos: [
    { Src: "Assets/Photos/Photo01.webp", Alt: "Alyssa smiling behind a matcha bingsu", Caption: "when bae is glowinggg sheeeshh" },
    { Src: "Assets/Photos/Photo03.webp", Alt: "Silly selfie lying on a bed", Caption: "me looking at bae" },
    { Src: "Assets/Photos/Photo04.webp", Alt: "The two of us throwing peace signs", Caption: "twinss" },
    { Src: "Assets/Photos/Photo06.webp", Alt: "The two of us grinning in a selfie on an outdoor ride", Caption: "otw to church camp!!" },
    { Src: "Assets/Photos/Photo07.webp", Alt: "A group selfie with a pouty face in the middle", Caption: "major throwback, ew there's a man haha" },
    { Src: "Assets/Photos/Photo08.webp", Alt: "Everyone piled on the sofa at a sleepover, laughing", Caption: "found this in the depths of my gallery" },
  ],

  WorshipPhoto: {
    Src: "Assets/Photos/Photo05.webp",
    Alt: "Worship night at Canaan Valley",
    Caption: "you at your most beautiful",
  },

  MainVerse: {
    Text: "With man this is impossible, but with God all things are possible.",
    Reference: "Matthew 19:26",
  },

  /** @type {VerseContent[]} */
  Verses: [
    { Text: "He will take great delight in you… He will rejoice over you with singing.", Reference: "Zephaniah 3:17" },
    { Text: "I have loved you with an everlasting love.", Reference: "Jeremiah 31:3" },
    { Text: "His mercies never come to an end; they are new every morning.", Reference: "Lamentations 3:22–23" },
    { Text: "God is within her, she will not fall; God will help her at break of day.", Reference: "Psalm 46:5" },
  ],

  /** Walking in on me in the toilet: my back at the sink, then me turning round mid-brush. */
  ToiletPhotos: [
    { Src: "Assets/Photos/Teeth01.webp", Alt: "Me at the bathroom sink, back to the door", Caption: "" },
    { Src: "Assets/Photos/Teeth02.webp", Alt: "Me turning round, mid-brush, toothbrush in mouth", Caption: "" },
  ],

  /** Where her fridge notes go: from the Google Form's pre-filled link,
   *  docs.google.com/forms/d/e/<FormId>/viewform?usp=pp_url&entry.<EntryId>=... */
  ReplyForm: {
    FormId: "1FAIpQLSdn4VAzU-BcTjwGGNLv56-TLS3Cw1SFB08K040loNo6SV4sVQ",
    EntryId: "362608031",
  },

  /** Voice notes from me, by where they play. */
  Voice: {
    Welcome: "Assets/Voice/Recording10.m4a",
    Toilet: "Assets/Voice/Recording11.m4a",
    Radio: "Assets/Voice/Recording12.m4a",
    Goodnight: "Assets/Voice/Recording13.m4a",
    Letter: "Assets/Voice/Recording14.m4a",
    // the lounge one only plays when she taps it
    Lounge: "Assets/Voice/Recording16.m4a",
  },

  /** Views out of the living-room window (Unsplash, free licence: Igor Savelev, Hans Reniers,
   *  Jason Hudson, Andris Gangis, Caroline Ross, Mike Enerio, Chanuwat Srithong, Darya Jum). */
  Views: {
    Day: [
      { Src: "Assets/Views/Day01.webp", Caption: "KL at dusk" },
      { Src: "Assets/Views/Day02.webp", Caption: "a very calm sea" },
      { Src: "Assets/Views/Day03.webp", Caption: "misty hills at sunrise" },
      { Src: "Assets/Views/Day04.webp", Caption: "sunset over the rooftops" },
      { Src: "Assets/Views/Day05.webp", Caption: "cherry blossoms" },
    ],
    Night: [
      { Src: "Assets/Views/Night01.webp", Caption: "Marina Bay at blue hour" },
      { Src: "Assets/Views/Night02.webp", Caption: "too many stars" },
      { Src: "Assets/Views/Night03.webp", Caption: "KL lights at night" },
    ],
  },

  /** Photo of the real plush, shown in the can't-sleep jar. @type {PhotoContent} */
  GuardDogPhoto: {
    Src: "Assets/Photos/GuardDog.webp",
    Alt: "The guard dog, a grey and tan plush, sitting on a blanket",
    Caption: "your guard dog, reporting for duty",
  },

  /** Plays (and loops) when she starts it from the radio or the play button. */
  BackgroundSong: {
    Src: "Assets/Audio/MiddleOfStartingOver.mp3",
  },

  /** @type {MixtapeContent} */
  Mixtape: {
    Title: "Now playing: The Middle of Starting Over",
    Note: "Because it's okay to start over, as many times as you need.",
    // From open.spotify.com/playlist/<id>. Track order is whatever the playlist has in Spotify.
    SpotifyPlaylistId: "0KTNBATgUZaGXLRViEWw8H",
  },

  // Photos of the handwritten letter, in page order. The typed transcript below folds away under them.
  /** @type {string[]} */
  LetterPages: ["Assets/Letter/Page01.webp", "Assets/Letter/Page02.webp"],

  // Typed transcript of the handwritten pages, shown under "read the typed version".
  Letter: [
    "To my other half,",
    "Happiest 24th birthday!! I wanted to make you something you could come back to whenever you need a li'l pick-me-up from yours truly hehe, coz I know I kinda go MIA sometimes (oopsie ^^).",
    "This year might not have been all that great. But I've watched you refuse to hold onto bitterness, keep pouring out the immense love & care you have for people, keep showing up for the ones you love, and STILL hold down a full-time job. It must've been so hard. I want you to know that I, and the people around you, do see you. We all see the effort you make, and how intentional you are in everything you put your mind to. I'm so, so proud of you, more than words can ever say.",
    "I'm sure God has also been guiding you in ways none of us can see. If there's one thing I'm grateful for, it's that He's been leading you through life, even when the path felt a bit precarious. He has a reason for everything, even for leading you into my life. I'm so glad to have met you.",
    "And just in case you don't know/think so, you've got this, even when you don't think you do. Whether it's God's help or the sheer willpower + character you have, we all believe in you ♡ I've watched you power through everything you've been handed, and honestly, sometimes when I'm down, I think of you and I feel a new strength.",
    "On the other hand, that also doesn't mean you have to be at your best all the time. It's okay not to be okay, it's human even. You don't have to prove anything to anyone. There is bound to be off days, days when you accidentally say the wrong thing, and days when it feels like no one seems to get what you're trying to say for some reason, etc. And it's still gonna be okay. Have a good stress cry (IDK if you know this about me but I love my stress cries haha) and let it allll out. You can talk to me, or someone else, or even not anyone at all if you don't feel like it. That's perfectly fine too. I just never want you to feel like you have to carry that pressure to constantly be at 100. It's okay to be at a 10.",
    "Everything is a part of your story, and it isn't finished yet. The best chapters of your life are still ahead, and I, for one, hope to be there for them.",
    "In the meantime, I'm always down to go for more salmon runs, more sleepovers, more yap sessions, basically anything that gets me more Alyssa time. Maybe we need to pick a specific day at least once a month :)",
  ],
  LetterSignOff: "Love, Elyesa",
});
