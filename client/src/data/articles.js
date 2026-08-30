// Each article's `blocks` array drives the generic renderer in ArticlePage.jsx.
// Block types: { type: "p", text } | { type: "heading", id, text } | { type: "list", items: [{ strong?, text }] }
// coverImage points at real S3 job photos already uploaded for the matching service —
// no stock/placeholder imagery.

const S3 = "https://stagfencing-media.s3.ap-southeast-2.amazonaws.com";

export const ARTICLES = [
  {
    slug: "how-to-choose-the-right-fence",
    title: "How to choose the right fence for your Perth property",
    tag: "Buying Guide",
    date: "13 Feb 2026",
    readTime: "7 min read",
    excerpt:
      "Start with the job the fence has to do, match the material to WA conditions, then set a budget. A practical walk-through, with real per-metre costs and what actually has to comply.",
    coverImage: `${S3}/site/1788033327236-4a27441ddcb079d5.png`,
    coverAlt: "Finished Colorbond fence around a Perth home",
    toc: [
      { id: "start-with-the-job", label: "Start with the job, not the material" },
      { id: "match-the-material", label: "Match the material to WA conditions" },
      { id: "what-it-costs", label: "What fencing actually costs in Perth" },
    ],
    blocks: [
      { type: "heading", id: "start-with-the-job", text: "Start with the job, not the material" },
      {
        type: "p",
        text: "Most fencing decisions go wrong at the same point: people pick a material before they've decided what the fence is actually for. Colour, style and budget all follow from the job — so name the job first.",
      },
      { type: "p", text: "Almost every fence in Perth is doing one of these primary jobs:" },
      {
        type: "list",
        items: [
          { strong: "Privacy", text: "— screening a yard from neighbours and the street. Drives height and solidity." },
          { strong: "Pool safety", text: "— a compliant barrier around a pool. This one isn't a preference, it's the law." },
          { strong: "Security", text: "— a genuine deterrent to entry. Drives height, top rail and footholds." },
          { strong: "Kerb appeal", text: "— a front feature that suits the house. Drives style over pure function." },
          { strong: "Containment", text: "— keeping kids or pets safe in." },
        ],
      },
      {
        type: "p",
        text: "A fence can do several of these at once, but it's usually one priority. Get that straight and later choices — material, height, gates — narrow on their own.",
      },
      { type: "heading", id: "match-the-material", text: "Match the material to WA conditions" },
      {
        type: "p",
        text: "Perth throws sun, coastal salt and reactive clay at a fence. The material that lasts on your block depends as much on where you are as what you like the look of. Coastal suburbs punish unpainted steel, timber moves with the seasons, and powder-coated aluminium and Colorbond handle the climate with the least fuss.",
      },
      {
        type: "p",
        text: "If you're near the coast, ask specifically about salt-rated hardware — it's the fittings that fail first, not the panels.",
      },
      { type: "heading", id: "what-it-costs", text: "What fencing actually costs in Perth" },
      {
        type: "p",
        text: "Prices move with length, height and how much site prep is involved, but as a rough per-metre guide, supplied and installed (prices exclude GST):",
      },
      {
        type: "list",
        items: [
          { strong: "Colorbond", text: "— from $100 per lineal metre" },
          { strong: "Aluminium slat", text: "— from $190 per lineal metre" },
          { strong: "Security fencing (chainmesh/garrison)", text: "— from $30 per lineal metre" },
          { strong: "Frameless glass pool fencing", text: "— from $330 per lineal metre" },
        ],
      },
      {
        type: "p",
        text: "Sloping blocks, retaining work, and gate automation all add to the base rate — that's why we quote on-site rather than over the phone.",
      },
    ],
  },
  {
    slug: "5-popular-fence-styles-1",
    title: "Colorbond vs Aluminium Slat: Which Suits Your Perth Yard?",
    tag: "Comparison",
    date: "18 Mar 2026",
    readTime: "6 min read",
    excerpt:
      "The two most-quoted fences in Perth solve different problems. Here's how to tell which one actually fits your yard, your budget and your neighbours.",
    coverImage: `${S3}/colorbond-fencing/1788036166839-6cb21d9f4b537eeb.jpg`,
    coverAlt: "Charcoal Colorbond fence on a limestone plinth",
    toc: [
      { id: "the-case-for-colorbond", label: "The case for Colorbond" },
      { id: "the-case-for-slat", label: "The case for aluminium slat" },
      { id: "price-and-upkeep", label: "Price and upkeep, side by side" },
    ],
    blocks: [
      { type: "heading", id: "the-case-for-colorbond", text: "The case for Colorbond" },
      {
        type: "p",
        text: "Colorbond is still the default boundary fence across Perth, and for good reason. It's a solid steel sheet — no gaps, no sightlines through it — so it does privacy and noise-dampening better than anything else at this price. It comes in 22 standard colours, so matching an existing fence or a neighbour's side is usually straightforward. It won't warp, rot or get eaten by termites, and a straight run goes up fast because there's no cutting-to-fit like there is with timber palings.",
      },
      {
        type: "p",
        text: "Where it comes up short: it's a flat, closed surface, so a long unbroken run can look plain, and on a very exposed or windy block a taller Colorbond fence needs proper post engineering to stay put.",
      },
      { type: "heading", id: "the-case-for-slat", text: "The case for aluminium slat" },
      {
        type: "p",
        text: "Aluminium slat fencing is the fence people choose when they want privacy without the yard feeling boxed in. Horizontal or vertical blades in 38mm, 65mm or 100mm widths let air and light through while still blocking a direct line of sight — good for narrow side yards or anywhere a solid wall would feel heavy. It's powder-coated aluminium, so it's rust-free even close to the coast, and it comes in Colorbond-matched colours or a timber-look wood grain if you want warmth without real timber's maintenance.",
      },
      {
        type: "p",
        text: "It costs more than Colorbond per metre, and depending on blade spacing it can still allow a partial sightline through — worth checking if total privacy is the goal.",
      },
      { type: "heading", id: "price-and-upkeep", text: "Price and upkeep, side by side" },
      {
        type: "list",
        items: [
          { strong: "Colorbond", text: "— from $100 per lineal metre, essentially zero maintenance, full privacy." },
          {
            strong: "Aluminium slat",
            text: "— from $190 per lineal metre, essentially zero maintenance, adjustable privacy via blade width and gap.",
          },
        ],
      },
      {
        type: "p",
        text: "In practice, plenty of Perth homes use both: Colorbond on the boundary lines that need full privacy, and slat panels closer to the house or on a feature side where airflow and a lighter look matter more. We'll walk the block with you and point out where each one earns its keep before you commit to either.",
      },
    ],
  },
  {
    slug: "5-popular-fence-styles-2",
    title: "5 Popular Fence Styles for Perth Homes",
    tag: "Instructions",
    date: "18 Mar 2026",
    readTime: "7 min read",
    excerpt:
      "From boundary Colorbond to frameless pool glass, these are the five fence types we quote most often across Perth — and what each one is actually good at.",
    coverImage: `${S3}/gallery/aluminium-slat-fencing-perth/1787905409260-9f458498f2ac1bf4.jpg`,
    coverAlt: "Aluminium slat privacy fencing installed in Perth",
    toc: [
      { id: "colorbond", label: "1. Colorbond boundary fencing" },
      { id: "aluminium-slat", label: "2. Aluminium slat fencing" },
      { id: "frameless-glass", label: "3. Frameless glass pool fencing" },
      { id: "security-fencing", label: "4. Garrison & chainmesh security fencing" },
      { id: "pvc-fencing", label: "5. PVC fencing" },
    ],
    blocks: [
      {
        type: "p",
        text: "Every yard is different, but most Perth fencing jobs land on one of these five. Here's what each is built for.",
      },
      { type: "heading", id: "colorbond", text: "1. Colorbond boundary fencing" },
      {
        type: "p",
        text: "The standard boundary fence across WA — steel sheet panels in 22 colours, no gaps, no maintenance. From $100 per lineal metre, supplied and installed, and the fastest of the five to get up on a straight run.",
      },
      { type: "heading", id: "aluminium-slat", text: "2. Aluminium slat fencing" },
      {
        type: "p",
        text: "Horizontal or vertical blades that let light and air through while still screening the yard — a popular pick for front fences and pool surrounds where a solid wall would feel too heavy. From $190 per lineal metre.",
      },
      { type: "heading", id: "frameless-glass", text: "3. Frameless glass pool fencing" },
      {
        type: "p",
        text: "Spigot-fixed glass panels with no visible frame — the fence that disappears so the pool and the yard read as one space. It's compliant with AS 1926.1 out of the box and needs almost no upkeep beyond the odd wipe-down. From $330 per lineal metre.",
      },
      { type: "heading", id: "security-fencing", text: "4. Garrison & chainmesh security fencing" },
      {
        type: "p",
        text: "For acreage, commercial sites and anywhere the fence needs to genuinely keep people out rather than just mark a line, garrison and chainmesh are the two workhorses. Garrison gives a solid, tamper-resistant panel; chainmesh is the faster, budget option for large perimeters. Both start from $30 per lineal metre.",
      },
      { type: "heading", id: "pvc-fencing", text: "5. PVC fencing" },
      {
        type: "p",
        text: "PVC picket and privacy panels are the low-maintenance alternative to painted timber — no rot, no repainting, and a consistent white or colour finish that holds up in full sun. A good fit for front fences where the timber look is wanted without the upkeep.",
      },
      {
        type: "p",
        text: "Most Perth properties end up with a mix of two or three of these — one for the boundary, another for the pool, maybe a slat or PVC front fence for street appeal. We quote each section on its own merits rather than pushing one material for the whole block.",
      },
    ],
  },
  {
    slug: "5-popular-fence-styles-3",
    title: "Limestone vs Post & Panel: Choosing the Right Retaining Wall",
    tag: "Guides",
    date: "18 Mar 2026",
    readTime: "6 min read",
    excerpt:
      "Sloping blocks are common across Perth's sandy soils. Here's how limestone block and post & panel retaining walls compare, and how to know which one your block needs.",
    coverImage: `${S3}/gallery/limestone-retaining/1787905489749-911e439c58925df6.jpg`,
    coverAlt: "Limestone block retaining wall on a Perth property",
    toc: [
      { id: "why-retain-at-all", label: "Why Perth blocks need retaining at all" },
      { id: "limestone-block", label: "Limestone block walls" },
      { id: "post-and-panel", label: "Post & panel walls" },
      { id: "who-pays", label: "Who actually pays for it" },
    ],
    blocks: [
      { type: "heading", id: "why-retain-at-all", text: "Why Perth blocks need retaining at all" },
      {
        type: "p",
        text: "Perth's sandy soil doesn't hold a slope on its own — any change in level over about 300mm generally needs a retaining wall to stop the higher side sliding, slumping or eroding onto the lower side over time. It's also usually the step that has to happen before a boundary fence can go up on a sloping line, since the fence needs a level, engineered base to sit on.",
      },
      { type: "heading", id: "limestone-block", text: "Limestone block walls" },
      {
        type: "p",
        text: "Limestone is the traditional Perth retaining material — natural cream block, sometimes with a rendered or capped finish, built to engineered height with proper drainage behind it. It suits front-of-house walls and garden terracing where the look matters as much as the function, and it ages well in the WA climate. From $190 per square metre of wall face.",
      },
      { type: "heading", id: "post-and-panel", text: "Post & panel walls" },
      {
        type: "p",
        text: "Post & panel uses concrete sleepers — plain or sandstone-look — dropped into galvanised steel posts. It's faster to install than block, handles taller walls without ballooning in price, and the powder-coated posts can be colour-matched to a Colorbond fence sitting on top of it. It's the more practical choice for side and rear boundaries where function matters more than street-facing looks. From $240 per square metre.",
      },
      { type: "heading", id: "who-pays", text: "Who actually pays for it" },
      {
        type: "p",
        text: "This is the question we get asked most. Retaining walls aren't covered by WA's Dividing Fences Act the way boundary fences are — responsibility generally comes down to who benefits from the wall (usually whoever created the level change), not a 50/50 split by default. We'll walk the site with you, explain where your wall sits on that, and give a fixed written quote either way.",
      },
    ],
  },
  {
    slug: "colorbond-fence-cost-perth",
    title: "How Much Does A Colorbond Fence Cost in Perth?",
    tag: "Pricing",
    date: "25 Mar 2026",
    readTime: "5 min read",
    excerpt:
      "A straight answer on Colorbond pricing in Perth — what moves the number, what's included, and why two quotes for the same fence can look different.",
    coverImage: `${S3}/colorbond-fencing/1788036174542-92d90e01f0e10dae.jpg`,
    coverAlt: "Cream Colorbond fence along a paved path",
    toc: [
      { id: "base-price", label: "The base price" },
      { id: "what-moves-it", label: "What moves the price up" },
      { id: "whats-included", label: "What should be included" },
    ],
    blocks: [
      { type: "heading", id: "base-price", text: "The base price" },
      {
        type: "p",
        text: "A standard 1.8m Colorbond boundary fence in Perth starts from $100 per lineal metre, supplied and installed, plus GST. That base figure assumes flat, clear access and a straightforward straight run — most quotes end up somewhere above that once the site is factored in.",
      },
      { type: "heading", id: "what-moves-it", text: "What moves the price up" },
      {
        type: "list",
        items: [
          { strong: "Height", text: "— taller fences need heavier posts and more steel, and cost more per metre than a standard 1.8m run." },
          { strong: "Access", text: "— if a rear or side fence can't be reached by vehicle, materials have to be carried in, which adds labour time." },
          { strong: "Old fence removal", text: "— pulling out and disposing of an existing fence (including asbestos super-six, which needs a licensed removalist) is priced separately." },
          { strong: "Ground conditions", text: "— rock, tree roots or a sloping line that needs stepped panels or a retaining wall first all add to the base rate." },
          { strong: "Gates", text: "— a pedestrian or vehicle gate is priced on top of the lineal-metre rate, not included in it." },
        ],
      },
      { type: "heading", id: "whats-included", text: "What should be included" },
      {
        type: "p",
        text: "A proper Colorbond quote should have posts cemented in (not just driven), your choice from the full 22-colour Colorbond range, and a fixed price that doesn't move once the site's been measured. We quote most jobs the same day we measure, and every quote excludes GST until the written quote stage, where it's added and shown separately — so the number you're comparing against other quotes is the real one.",
      },
    ],
  },
  {
    slug: "council-approval-new-fence",
    title: "Do You Need Council Approval For A New Fence?",
    tag: "Guides",
    date: "02 Apr 2026",
    readTime: "6 min read",
    excerpt:
      "Most standard boundary fences in WA don't need a council permit — but there are specific exceptions worth knowing before you start.",
    coverImage: `${S3}/gallery/garrison-fencing/1787905689684-d32319398d3487df.jpg`,
    coverAlt: "Boundary security fence installed on a Perth property",
    toc: [
      { id: "the-general-rule", label: "The general rule" },
      { id: "when-you-do-need-approval", label: "When you do need approval" },
      { id: "the-dividing-fences-act", label: "The Dividing Fences Act and who pays" },
    ],
    blocks: [
      { type: "heading", id: "the-general-rule", text: "The general rule" },
      {
        type: "p",
        text: "In most WA local government areas, a standard dividing fence up to 1.8m high — Colorbond, timber paling, aluminium slat — doesn't need a building permit. It's treated as exempt development under the Building Act, as long as it sits on the boundary line and isn't a retaining or structural wall.",
      },
      { type: "heading", id: "when-you-do-need-approval", text: "When you do need approval" },
      {
        type: "list",
        items: [
          { strong: "Height over 1.8m", text: "— fences taller than the standard height, especially street-facing ones, can trigger local planning rules." },
          { strong: "Front fences", text: "— many councils cap front fence height and solidity (how much you can see through) differently from side and rear boundaries." },
          { strong: "Retaining walls", text: "— any retaining wall over roughly 500mm–1m, depending on the council, generally needs an engineer's design and a permit before it's built." },
          { strong: "Pool fencing", text: "— always requires a compliance certificate to AS 1926.1, regardless of council permit rules, before the pool can be used." },
          { strong: "Heritage areas and special zones", text: "— some suburbs have additional design controls on fence style and materials." },
        ],
      },
      {
        type: "p",
        text: "Rules vary by local government area, so the honest answer is always \"check with your council\" — but as your installer, we know the common thresholds and will flag it during the on-site measure if your job looks likely to need one.",
      },
      { type: "heading", id: "the-dividing-fences-act", text: "The Dividing Fences Act and who pays" },
      {
        type: "p",
        text: "Separate from council approval, WA's Dividing Fences Act 1961 sets out that neighbours sharing a boundary generally split the cost of a standard dividing fence equally, for a fence of \"sufficient\" standard — not necessarily the premium option one side might want. Retaining walls sit outside this Act entirely, and cost responsibility there comes down to who benefits from the level change rather than an automatic 50/50 split.",
      },
      {
        type: "p",
        text: "If a shared-cost conversation with a neighbour is part of your project, we can provide an itemised written quote that makes the fence spec and price clear for both sides.",
      },
    ],
  },
  {
    slug: "asbestos-fence-removal-guide",
    title: "Asbestos Fence Removal: What Perth Homeowners Should Know",
    tag: "Safety",
    date: "10 Apr 2026",
    readTime: "8 min read",
    excerpt:
      "Old \"super six\" asbestos fences are still common across older Perth suburbs. Here's how safe, legal removal actually works, and why it can't be a DIY job.",
    coverImage: `${S3}/home-services/1788014158703-715b271101e641ea.png`,
    coverAlt: "Asbestos fence removal and replacement, Perth",
    toc: [
      { id: "how-to-tell", label: "How to tell if your fence is asbestos" },
      { id: "why-it-cant-be-diy", label: "Why it can't be a DIY job" },
      { id: "how-removal-works", label: "How licensed removal actually works" },
      { id: "same-day-replacement", label: "Replacing it the same day" },
    ],
    blocks: [
      { type: "heading", id: "how-to-tell", text: "How to tell if your fence is asbestos" },
      {
        type: "p",
        text: "\"Super six\" corrugated cement sheet fencing was the standard boundary fence across Perth from the 1950s through to the late 1980s, and a lot of it is still standing. It's grey or painted cement sheet with a corrugated profile, usually showing its age with chalky surface weathering, hairline cracks, or moss. If your fence matches that description and the house was built before 1990, it's worth assuming it's asbestos until tested.",
      },
      { type: "heading", id: "why-it-cant-be-diy", text: "Why it can't be a DIY job" },
      {
        type: "p",
        text: "Undamaged asbestos sheet is generally low-risk left alone — the danger is in disturbing it. Cutting, breaking, pressure-washing or even dragging old sheets across concrete releases fibres into the air, and those fibres don't settle or break down; once inhaled, they stay in the lungs. WA law requires a licensed asbestos removalist for anything beyond a very small, tightly defined amount of bonded asbestos material, and unlicensed removal carries real fines on top of the health risk.",
      },
      { type: "heading", id: "how-removal-works", text: "How licensed removal actually works" },
      {
        type: "p",
        text: "A proper removal starts with wetting the sheets down to stop fibres becoming airborne, then hand-lifting each panel — never breaking or dropping them — and double-wrapping them in marked asbestos disposal bags on site. The waste then goes to a licensed disposal facility, with receipts supplied as proof of correct handling. Our crew holds WA government asbestos removal licence WR394 and does this work ourselves rather than subcontracting it out, so the same people who remove the fence are the ones accountable for how it's done.",
      },
      {
        type: "list",
        items: [
          { strong: "Wet down", text: "— sheets are dampened before any handling starts, to suppress fibre release." },
          { strong: "Hand-lifted, not broken", text: "— panels come out whole wherever possible." },
          { strong: "Double-wrapped", text: "— each sheet is sealed in marked asbestos waste bags on site." },
          { strong: "Licensed disposal", text: "— waste goes to an approved facility, with disposal receipts supplied." },
          { strong: "Site cleared", text: "— the area is raked and visually checked before we consider the job done." },
        ],
      },
      { type: "heading", id: "same-day-replacement", text: "Replacing it the same day" },
      {
        type: "p",
        text: "Because we do both the removal and the new fence ourselves, a new Colorbond fence can go up the same visit the old asbestos sheet comes down — no gap where the yard is exposed, and no coordinating between two separate contractors. Removal starts from $80 per lineal metre, and we can add a soil test or an independent air monitoring and clearance report as well, if you want that extra paperwork for a sale or peace of mind.",
      },
    ],
  },
];
