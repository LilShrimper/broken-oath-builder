# Broken Oath Damage Sim

A fan-made damage calculator for the **Broken Oath** playtest. It reads your character's save and
your own game install, then shows your skill's DPS, finds the best support gems, and compares
setups. Everything runs in your browser; nothing is uploaded.

**Open it:** the GitHub Pages link for this repository.

## How to use

1. **Point it at your game (first visit only).** Click *Pick the Data folder* and choose
   `BrokenOath\Data` inside your game folder (Steam: right-click the game › Manage › Browse local
   files). The page reads the skills, items and passive tree from your own copy, so it always
   matches your patch. After a game patch, click *Update game data*.
2. **Load your character.** Click *Load save file* (or drag the file onto the page) and pick your
   `BO_Char_*.sav` from `%LOCALAPPDATA%\BrokenOath\Saved\SaveGames\<number>\`. Files ending in
   `_bak` are older backups. The game autosaves while you play, so the newest file is current.
3. **Or paste a build code** from the passive tree's copy button (starts with `BO1.`). Codes carry
   the tree, skills, supports, Dragonling and gear bases but not rolled item stats, so numbers for
   rare-heavy gear read low. A save is exact.
4. Pick a skill, then use **Find best supports**, **Pin as baseline** and **What helps most**.
5. Open the **Skill tree** tab to see your passive tree with every node's DPS value for that skill
   (heat map, hover, and a best-next-picks list). Click nodes to try changes; *Copy build code*
   gives a code you can follow in game.

## Accuracy

Formulas follow the game's tooltips and data notes. They were checked against the game for Death
Coil, Unholy Void and a Channel Conduit Judgement build; other skills use the same rules but were
not checked one by one. If the sheet's *Skill panel DPS* differs a lot from your in-game skill
panel, the skill likely has a mechanic the sheet does not model yet.

## Not included

This repository contains no game files. The page only reads the data from your own install, in
your browser.

Not affiliated with the developers of Broken Oath.
