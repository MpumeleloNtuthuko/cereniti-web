export type Question = {
  id: string;
  module: 'visual' | 'situational' | 'integrity' | 'technical' | 'behavioral';
  type: 'single-choice' | 'multi-select' | 'text';
  text: string;
  image_url?: string;
  options?: { id: string; text: string; isCorrect: boolean }[];
  keywords?: string[]; // For text analysis
};

export const ASSESSMENT_QUESTIONS: Question[] = [
  // ============================================================
  // MODULE A: VISUAL PRECISION (The Eye)
  // ============================================================
  {
    id: 'v1',
    module: 'visual',
    type: 'text',
    text: 'Analyze the image provided below. There is a subtle disorder in the room setup. Describe exactly what is wrong in your own words.',
    image_url: '/assessment/messy-bed.jpg',
    keywords: ['chair', 'angle', 'straight', 'align', 'tuck', 'parallel', 'legs']
  },
  {
    id: 'v2',
    module: 'visual',
    type: 'single-choice',
    text: 'You enter a bathroom to begin the "Restoration Protocol". Which of the following details requires the most immediate forensic attention?',
    options: [
      { id: 'a', text: 'The mirror has a fingerprint.', isCorrect: false },
      { id: 'b', text: 'The towels are not folded in thirds.', isCorrect: false },
      { id: 'c', text: 'Yellow discoloration in the grout lines near the drain.', isCorrect: true },
      { id: 'd', text: 'The bath mat is slightly crooked.', isCorrect: false },
      { id: 'e', text: 'The soap dispenser is half full.', isCorrect: false },
      { id: 'f', text: 'The window is closed.', isCorrect: false },
    ]
  },
  
  // ============================================================
  // MODULE B: SITUATIONAL INTELLIGENCE (The Vibe)
  // ============================================================
  {
    id: 's1',
    module: 'situational',
    type: 'multi-select', // Choose 2
    text: 'You are cleaning the Master Suite. The client enters, clearly stressed and on a phone call, looking for a file. Choose the TWO best actions.',
    options: [
      { id: 'a', text: 'Ask them what they are looking for to help.', isCorrect: false },
      { id: 'b', text: 'Immediately stop cleaning, step out of the room, and wait invisibly in the hallway.', isCorrect: true },
      { id: 'c', text: 'Continue cleaning quietly to not waste time.', isCorrect: false },
      { id: 'd', text: 'Apologize loudly for being in the way.', isCorrect: false },
      { id: 'e', text: 'Once they leave, ensure the room is exactly as they left it, only cleaner.', isCorrect: true },
      { id: 'f', text: 'Ask if they would like a cup of tea.', isCorrect: false }, // Too intrusive
    ]
  },
  {
    id: 's2',
    module: 'situational',
    type: 'single-choice',
    text: 'A client offers you a cash tip directly, bypassing the app. They say "Let\'s keep this between us." What is the protocol?',
    options: [
      { id: 'a', text: 'Accept it with thanks and say nothing.', isCorrect: false },
      { id: 'b', text: 'Refuse it as it is against policy.', isCorrect: false },
      { id: 'c', text: 'Accept it graciously, but report it to Cereniti Admin for transparency.', isCorrect: true },
      { id: 'd', text: 'Ask them to put it on the app instead.', isCorrect: false },
      { id: 'e', text: 'Accept it and share it with the team.', isCorrect: false },
      { id: 'f', text: 'Refuse and report the client.', isCorrect: false },
    ]
  },

  // ============================================================
  // MODULE C: INTEGRITY & ETHICS (The Trust - Consistency Checks)
  // ============================================================
  {
    id: 'i1',
    module: 'integrity',
    type: 'single-choice',
    text: 'You are dusting a high shelf. A small, seemingly inexpensive ornament falls and chips. The client is away on holiday. What do you do?',
    options: [
      { id: 'a', text: 'Glue it back together carefully; they won\'t notice.', isCorrect: false },
      { id: 'b', text: 'Throw it away and pretend it was never there.', isCorrect: false },
      { id: 'c', text: 'Place it back on the shelf with the broken side facing back.', isCorrect: false },
      { id: 'd', text: 'Photograph it, message Admin immediately, and leave a handwritten apology note next to the item.', isCorrect: true },
      { id: 'e', text: 'Wait until they return to tell them in person.', isCorrect: false },
      { id: 'f', text: 'Buy a replacement yourself before they return.', isCorrect: false },
    ]
  },
  {
    id: 'i2',
    module: 'integrity',
    type: 'single-choice',
    text: 'While vacuuming under a bed, you find a diamond earring. It looks covered in dust and possibly lost for months. What do you do?',
    options: [
      { id: 'a', text: 'Put it in your pocket to keep it safe.', isCorrect: false },
      { id: 'b', text: 'Place it prominently on the bedside pedestal on a tissue.', isCorrect: true },
      { id: 'c', text: 'Leave it there; it\'s not your place to move valuables.', isCorrect: false },
      { id: 'd', text: 'Give it to the domestic worker if one is present.', isCorrect: false },
      { id: 'e', text: 'Take it to the Admin office.', isCorrect: false },
      { id: 'f', text: 'Throw it away; it looks like costume jewelry.', isCorrect: false },
    ]
  },
  // CONSISTENCY TRAP: Checking consistency with Q(i1)
  {
    id: 'i3',
    module: 'integrity',
    type: 'single-choice',
    text: 'A fellow Specialist on a team job accidentally scratches a wooden floor. They ask you not to say anything because "it is barely visible." How do you proceed?',
    options: [
      { id: 'a', text: 'Agree to stay silent to protect your colleague.', isCorrect: false },
      { id: 'b', text: 'Tell the client immediately in front of the colleague.', isCorrect: false },
      { id: 'c', text: 'Privately tell the colleague to report it, and if they don\'t, report it yourself.', isCorrect: true },
      { id: 'd', text: 'Try to buff it out with oil and hope for the best.', isCorrect: false },
      { id: 'e', text: 'Ignore it; it\'s not your responsibility.', isCorrect: false },
      { id: 'f', text: 'Threaten to report them unless they share their tip.', isCorrect: false },
    ]
  },

  // ============================================================
  // MODULE D: TECHNICAL KNOWLEDGE (The Science)
  // ============================================================
  {
    id: 't1',
    module: 'technical',
    type: 'single-choice',
    text: 'You encounter unsealed Travertine stone in a shower. Which chemical is strictly FORBIDDEN?',
    options: [
      { id: 'a', text: 'Water.', isCorrect: false },
      { id: 'b', text: 'Acid-based descaler (like Vinegar or Viakal).', isCorrect: true }, // Acid eats stone
      { id: 'c', text: 'Neutral pH floor cleaner.', isCorrect: false },
      { id: 'd', text: 'Microfiber cloth.', isCorrect: false },
      { id: 'e', text: 'Soft bristle brush.', isCorrect: false },
      { id: 'f', text: 'Steam.', isCorrect: false },
    ]
  },
  {
    id: 't2',
    module: 'technical',
    type: 'multi-select', // Choose 2
    text: 'Which TWO colors of microfiber cloths are typically used for Toilets/Bathrooms vs Kitchens to prevent cross-contamination?',
    options: [
      { id: 'a', text: 'Red for Toilets/Bathrooms', isCorrect: true },
      { id: 'b', text: 'Blue for Toilets/Bathrooms', isCorrect: false },
      { id: 'c', text: 'Green for Kitchens', isCorrect: true },
      { id: 'd', text: 'Yellow for Kitchens', isCorrect: false },
      { id: 'e', text: 'White for everything', isCorrect: false },
      { id: 'f', text: 'Black for floors', isCorrect: false },
    ]
  },
  {
    id: 't3',
    module: 'technical',
    type: 'text',
    text: 'You see a "Water Ring" mark on a wooden coffee table. Describe the step-by-step method to remove it without damaging the varnish.',
    keywords: ['dry', 'iron', 'cloth', 'mayonnaise', 'ash', 'heat', 'moisture']
  },

  // ============================================================
  // MODULE E: BEHAVIORAL (The Drive)
  // ============================================================
  {
    id: 'b1',
    module: 'behavioral',
    type: 'single-choice',
    text: 'You arrive at a client\'s home, but the gate code provided does not work. The client is not answering their phone. You have waited 15 minutes. What is the protocol?',
    options: [
      { id: 'a', text: 'Leave and go to the next job.', isCorrect: false },
      { id: 'b', text: 'Keep calling the client repeatedly.', isCorrect: false },
      { id: 'c', text: 'Contact Cereniti Ops Support immediately for a secondary contact or instruction.', isCorrect: true },
      { id: 'd', text: 'Jump the fence.', isCorrect: false },
      { id: 'e', text: 'Honk the horn until someone opens.', isCorrect: false },
      { id: 'f', text: 'Ask the neighbors for the code.', isCorrect: false },
    ]
  },
  // ============================================================
  // CONTINUATION OF MODULE E: BEHAVIORAL
  // ============================================================
  {
    id: 'b2',
    module: 'behavioral',
    type: 'single-choice',
    text: 'Your scheduled shift ends at 16:00. At 15:55, you realize the Master Bedroom is only 85% complete due to an earlier delay. What is the correct Cereniti standard?',
    options: [
      { id: 'a', text: 'Rush to finish everything, sacrificing a few small details.', isCorrect: false },
      { id: 'b', text: 'Leave at 16:00 exactly; overtime is not authorized.', isCorrect: false },
      { id: 'c', text: 'Stay until the job is completed to standard, then notify Ops of the overtime.', isCorrect: true },
      { id: 'd', text: 'Skip the vacuuming but make the bed perfectly.', isCorrect: false },
      { id: 'e', text: 'Ask the client if they want you to stay or leave.', isCorrect: false }, // Unprofessional to put burden on client
      { id: 'f', text: 'Clean it quickly and hide the unfinished parts.', isCorrect: false },
    ]
  },
  {
    id: 'b3',
    module: 'behavioral',
    type: 'single-choice',
    text: 'A client accuses you of stealing a watch. You know for a fact you did not take it. How do you react in the moment?',
    options: [
      { id: 'a', text: 'Deny it angrily and threaten to sue for defamation.', isCorrect: false },
      { id: 'b', text: 'Immediately offer to have your bag and car searched, and call Cereniti Admin.', isCorrect: true },
      { id: 'c', text: 'Ignore them and keep cleaning.', isCorrect: false },
      { id: 'd', text: 'Tell them to check their other staff members.', isCorrect: false },
      { id: 'e', text: 'Apologize and say you might have moved it by mistake.', isCorrect: false }, // Never admit guilt if innocent
      { id: 'f', text: 'Walk off the job site immediately.', isCorrect: false },
    ]
  },

  // ============================================================
  // ROUND 2: VISUAL PRECISION (Complex)
  // ============================================================
  {
    id: 'v3',
    module: 'visual',
    type: 'single-choice',
    text: 'Analyze the provided image of the Luxury Bedroom. There is a logical error in the reflection or layout. What is it?',
    image_url: '/assessment/luxuryBed.jpg', 
    options: [
      { id: 'a', text: 'The rug is not centered under the bed.', isCorrect: false },
      { id: 'b', text: 'The mirror reflects a window, but it is positioned opposite the bed.', isCorrect: true },
      { id: 'c', text: 'The chandelier is missing a lightbulb.', isCorrect: false },
      { id: 'd', text: 'The curtains are uneven lengths.', isCorrect: false },
      { id: 'e', text: 'The pillows are stacked in the wrong order.', isCorrect: false },
      { id: 'f', text: 'There are no power outlets visible.', isCorrect: false },
    ]
  },

  // ============================================================
  // ROUND 2: TECHNICAL (Safety & Materials)
  // ============================================================
  {
    id: 't4',
    module: 'technical',
    type: 'single-choice',
    text: 'You are cleaning a large 85-inch OLED TV screen. It has greasy fingerprints. Which method is correct?',
    options: [
      { id: 'a', text: 'Spray Windex/Glass Cleaner directly on the screen.', isCorrect: false },
      { id: 'b', text: 'Use a paper towel and tap water.', isCorrect: false },
      { id: 'c', text: 'Use a dry, clean optical microfiber cloth; use a tiny amount of distilled water on the cloth only if necessary.', isCorrect: true },
      { id: 'd', text: 'Use a soapy sponge followed by a dry cloth.', isCorrect: false },
      { id: 'e', text: 'Spray an alcohol-based sanitizer to kill germs.', isCorrect: false },
      { id: 'f', text: 'Buff it vigorously with a cotton towel.', isCorrect: false },
    ]
  },
  {
    id: 't5',
    module: 'technical',
    type: 'single-choice',
    text: 'SAFETY CRITICAL: You run out of toilet cleaner and decide to mix chemicals. Which combination creates deadly Chloramine gas?',
    options: [
      { id: 'a', text: 'Baking Soda and Vinegar.', isCorrect: false },
      { id: 'b', text: 'Dish Soap and Water.', isCorrect: false },
      { id: 'c', text: 'Bleach and Ammonia (or Urine).', isCorrect: true },
      { id: 'd', text: 'Floor Cleaner and Pine Gel.', isCorrect: false },
      { id: 'e', text: 'Laundry Detergent and Fabric Softener.', isCorrect: false },
      { id: 'f', text: 'Alcohol and Water.', isCorrect: false },
    ]
  },

  // ============================================================
  // ROUND 2: INTEGRITY (Consistency Traps)
  // ============================================================
  // CONSISTENCY TRAP: Checks consistency with Q(s2) about policies/gifts
  {
    id: 'i4',
    module: 'integrity',
    type: 'single-choice',
    text: 'A wealthy client gives you a designer handbag they "don\'t want anymore." It is worth R15 000+. They insist you take it home. What do you do?',
    options: [
      { id: 'a', text: 'Take it home, it is a personal gift.', isCorrect: false },
      { id: 'b', text: 'Refuse it, as it might be a trap.', isCorrect: false },
      { id: 'c', text: 'Accept it, but immediately declare it to Cereniti Management for approval/logging.', isCorrect: true },
      { id: 'd', text: 'Take it and sell it online.', isCorrect: false },
      { id: 'e', text: 'Take it and give it to your manager as a bribe.', isCorrect: false },
      { id: 'f', text: 'Tell the client you prefer cash.', isCorrect: false },
    ]
  },
  {
    id: 'i5',
    module: 'integrity',
    type: 'single-choice',
    text: 'You are given the alarm code for a regular client\'s home. Where do you store this number?',
    options: [
      { id: 'a', text: 'Write it in the Notes app on your phone.', isCorrect: false },
      { id: 'b', text: 'Write it on a piece of paper in your wallet.', isCorrect: false },
      { id: 'c', text: 'It should only be viewed via the secure Cereniti App and never written down physically.', isCorrect: true },
      { id: 'd', text: 'Text it to your partner in case of emergency.', isCorrect: false },
      { id: 'e', text: 'Write it on your hand before entering.', isCorrect: false },
      { id: 'f', text: 'Save it as a contact named "Client House".', isCorrect: false },
    ]
  },

  // ============================================================
  // ROUND 2: SITUATIONAL (Advanced)
  // ============================================================
  {
    id: 's3',
    module: 'situational',
    type: 'multi-select', // Choose 2
    text: 'You accidentally knock over a vase of water onto a white Persian rug. The vase did not break, but the water is soaking in. Choose the TWO correct immediate steps.',
    options: [
      { id: 'a', text: 'Rub the spot vigorously with a towel to dry it.', isCorrect: false }, // Rubbing destroys fibers
      { id: 'b', text: 'Firmly blot the liquid with a clean, dry white towel to absorb moisture.', isCorrect: true },
      { id: 'c', text: 'Pour hot water on it to dilute the spill.', isCorrect: false },
      { id: 'd', text: 'Use a hairdryer on the "Hot" setting immediately.', isCorrect: false },
      { id: 'e', text: 'Notify the client or Admin immediately regarding the potential water damage.', isCorrect: true },
      { id: 'f', text: 'Flip the rug over to hide the wet spot.', isCorrect: false },
    ]
  },
  {
    id: 's4',
    module: 'situational',
    type: 'single-choice',
    text: 'You arrive at a home and the family dog is barking aggressively and not crated, preventing you from entering the kitchen. The owner is not home.',
    options: [
      { id: 'a', text: 'Enter quickly and close the door behind you.', isCorrect: false },
      { id: 'b', text: 'Yell at the dog to show dominance.', isCorrect: false },
      { id: 'c', text: 'Do not enter the specific room; clean other areas and call Ops Support to contact the owner.', isCorrect: true },
      { id: 'd', text: 'Feed the dog a treat from the fridge to calm it.', isCorrect: false }, // Never feed client pets
      { id: 'e', text: 'Skip the house entirely and leave.', isCorrect: false },
      { id: 'f', text: 'Hit the dog with a broom if it comes close.', isCorrect: false },
    ]
  }
];