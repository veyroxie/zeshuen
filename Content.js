// Every word on the site lives here, so edit this file for copy changes.
// Anything marked TODO is a placeholder waiting on the real caption or letter.

/**
 * @typedef {{ Flavour: string, Label: string, Title: string, Lines: string[] }} JarContent
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
  FullName: "Alyssa Teoh Ze Shuen",
  ShipName: "Alyesa",
  Age: 24,
  BirthdayLabel: "01 · 10 · 2026",
  From: "Alyssa",

  /** "Her beautiful soul" note cards. */
  SoulNotes: [
    "You love God even at your lowest. You trust Him to guide you through, especially on the hard days. Every day I see your faith, I believe a little more.",
    "You make everyone feel like there's someone there for them, me included, even when you've got a lot on your plate.",
    "You give so much love that you deserve nothing less than the best back. Don't let anyone give you otherwise.",
    "You're the bravest person I know, and I'm proud of you every single day.",
    "You can turn any last-minute hangout into the most meaningful time spent.",
    "Thank you for being with me at my lowest. I hope I've been able to be there for yours too.",
  ],

  /** The longer note that closes the soul section, shown full width. */
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
        "I'm giving you a guard dog hehe 🐶 Don't worry, it'll scare the scaries away.",
        "Put on Jireh, lie down, breathe slow.",
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

  Song: {
    Title: "The Middle of Starting Over",
    Artist: "Sabrina Carpenter",
    Note: "Because it's okay to start over, as many times as you need.",
    Url: "https://www.youtube.com/watch?v=4Dlkyl6SyQM",
  },

  Letter: [
    "To my other half,",
    "Happiest 24th birthday!! I wanted to make you something you could come back to whenever you need a li'l pick-me-up from yours truly hehe, 'cause I kinda go MIA sometimes D: oopsie.",
    "This year might not have been all that great. But I've watched you refuse to hold on to bitterness, keep pouring out the immense love and care you have for people, keep showing up for the ones you love, and still hold down a full-time job. It must have been so hard. I want you to know that the people around you do see you. They see the effort you make, and how intentional you are in everything you do. I'm so, so proud of you, more than words can say.",
    "I'm sure God has been guiding you in ways none of us can see. If there's one thing I'm grateful for, it's that He's been leading you through life, even when the path felt a bit precarious. He has a reason for everything, just like there was a reason He led you into my life.",
    "And here's the thing: you've got this, even when you don't think you do. Whether it's God's help or the sheer willpower and character you have, we all believe in you <3 I've watched you power through everything you've been handed, and honestly, sometimes when I'm down, I think of you and feel inspired.",
    "But that doesn't mean you have to be at your best all the time. It's okay to not be okay. In fact, it's human. You don't have to prove anything to anyone. There will be off days. There will be days you say the wrong thing, and days when no one seems to get what you're trying to say. And it's still going to be okay. Have a good stress cry (you know I love my stress cries hehe) and let it all out. You can talk to me about it, or not, if you don't feel like it. That's okay too. I just never want you to feel like you have to carry that pressure. It's all part of your story, and it isn't finished yet. The best chapters of your life are still ahead, and I hope to be there for them.",
    "In the meantime, while you're off on your superhero journey, I'll be right here. Always. I'm always down for more salmon runs, more sleepovers and more yap sessions. Always :>",
  ],
  LetterSignOff: "Love, Elyesa",
});
