# Broken Oath Builder

A fan-made build planner and damage calculator for the **Broken Oath** playtest, in the spirit of Path of Building. It reads your character's save and
your own game install, then shows your skill's DPS, finds the best support gems, and compares
setups. Everything runs in your browser; nothing is uploaded. The page counts anonymous visits with
GoatCounter (no cookies, no personal data, never your files).

**Open it:** the GitHub Pages link for this repository.

## How to use

1. **Point it at your game (first visit only).** Click *Pick the Data folder* and choose
   `BrokenOath\Data` inside your game folder (Steam: right-click the game › Manage › Browse local
   files). The page reads the skills, items and passive tree from your own copy, so it always
   matches your patch. After a game patch, click *Update game data*.
2. **Load your characters.** Click *Copy save path*, then *Load saves folder*. In the picker, click the
   address bar, paste (Ctrl+V), press Enter and choose *Select Folder*. Every character in
   `%LOCALAPPDATA%\BrokenOath\Saved\SaveGames` is loaded (backups skipped) and stays in your browser
   after a refresh. After you play, click *Reload saves* and pick the same folder. You can also drag
   the folder or a single `BO_Char_*.sav` onto the page.
3. **Or paste a build code** from the passive tree's copy button (starts with `BO1.`). Codes carry
   the tree, skills, supports, Dragonling and gear bases but not rolled item stats, so numbers for
   rare-heavy gear read low. A save is exact.
4. Pick a skill. The Supports card shows every support that fits it: click one to socket it or take it out,
   and pin the ones you want to keep while **Find best supports** fills the other sockets. Then use
   **Pin as baseline** and **What helps most**. The skill list also has
   skills you don't own yet (at the gem level your character could use). A spell with Cast on Crit shows a picker
   for the attack whose crits cast it; the sheet then counts one cast per attack volley that crits (crit is rolled
   once per volley; at most one per 0.15 s, 25% less damage). This rate matched a Ranger's game log.
   Shock (from the game's own formula and the enemy's life), Executioner (counted over a whole fight) and
   mana are counted too: the Hits & speed card shows mana spent against mana gained a second, how long it
   lasts after Vow and Herald reservations, and *Only setups my mana can sustain* limits the support search
   to setups that won't run you dry within a minute of nonstop use.
5. **Check it against your fights:** click *Load game log* and pick
   `%LOCALAPPDATA%\BrokenOath\Saved\Logs\BrokenOath.log`. The page compares the sheet with your real
   Guardian kills (boss life ÷ fight time), your cast rate and damage per cast, and can use your
   measured cast rate. The log is read in your browser only. *Send a check report* opens a GitHub
   issue with just the numbers (no names, no IDs) so the sim can be improved; you see and can edit it
   before posting. It includes what the log knew about each fight (time the Guardian was away, damage lost at its
   held life marks, volleys on target, boss hits, ailment totals), so it can be checked without your log.
6. Open the **Skill tree** tab to see your passive tree with every node's DPS value for that skill
   (heat map, hover, and a best-next-picks list). Click nodes to try changes; *Copy build code*
   gives a code you can follow in game. **Optimize tree** takes your main damage skill and moves
   the same number of points to where that skill gains the most: it fixes long or dead-end paths
   and swaps weak picks for strong ones nearby. It shows the changes on the tree (green take, red
   refund) for you to apply or dismiss. Keystones, jewel sockets, trigger nodes and (by default)
   notables with no damage lines stay where they are; new keystones only if you allow them.
   **Plan next points** (box defaults to your unspent points) lists where your next points should go, in
   order and with their paths, without refunding anything. Channel Conduit builds keep their channel
   a little slower than the cast interval so a new point never halves your casts.
7. **Plan a build** on the **Build** tab: copy a loaded character into a plan, or start an empty one
   with a class and level. Change the level, skills and gem levels, supports, skill bar, gear (base,
   rarity, affixes with tier and value, uniques with a roll slider, runes) and idols; spend points on
   the Skill tree tab. The Damage tab shows the result as you go, and support or gem level changes
   made there also go into the plan. Plans stay in your browser. *Copy plan code* gives a `BOP1.`
   code with everything in it, rolled gear included; paste it into the code box to open it in any
   browser. Your saved characters are never changed.

## Accuracy

Formulas follow the game's tooltips and data notes. They were checked against the game for Death
Coil, Unholy Void and a Channel Conduit Judgement build, and Split Shot, Rain of Arrows, Ballista and Lightning Arrow on a Ranger; other skills use the same rules but were
not checked one by one. If the sheet's *Skill panel DPS* differs a lot from your in-game skill
panel, the skill likely has a mechanic the sheet does not model yet.

## Not included

This repository contains no game files. The page only reads the data from your own install, in
your browser.

Not affiliated with the developers of Broken Oath.
