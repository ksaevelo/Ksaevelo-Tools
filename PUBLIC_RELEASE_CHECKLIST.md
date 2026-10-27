# Ksaevelo Tools v0.0.1 — Public release checklist

## Required before publishing

- [ ] Test the packaged ZIP **inside After Effects 2020** on Windows (not only in a standalone browser).
- [ ] Test the same ZIP on a second supported AE version, ideally 2024/2025/2026.
- [ ] Confirm Home/Tools/Graphs/Settings navigation, all themes, stopwatch, sticky notes, and support links.
- [ ] Confirm that all 22 buttons inside Tools > **ksaevelo's 3d presets/materials** create the intended 3D rig and that the controller works; test both with and without selected footage.
- [ ] Test presets on correctly selected layers; document required third-party effects and any versions that cannot load a specific preset.
- [ ] Test easing and the custom graph on properties with 2D and 3D values and multiple keyframes; use a duplicate composition so testing cannot damage a project.
- [ ] Verify you have permission to **publicly redistribute each bundled `.ffx` asset**. Being free does not automatically grant permission to distribute another creator's preset.
- [ ] Remove/archive the previous `v1.0.0` and `v1.0.2` **test** GitHub releases (and relevant tags if necessary), or otherwise ensure they do not outrank `v0.0.1` for the GitHub `/releases/latest` API. Those older *tag numbers* are higher than `v0.0.1` even though their release dates are earlier.
- [ ] Publish a **normal** GitHub Release (not a prerelease), tag `v0.0.1`, title `Ksaevelo Tools v0.0.1` and attach the final ZIP as a binary download.
- [ ] Verify <https://api.github.com/repos/ksaevelo/Ksaevelo-Tools/releases/latest> returns `tag_name: v0.0.1` before calling update behavior correct.
- [ ] Use a clean install with no previous `Ksaevelo Tools` folder left installed; check the Settings version shows `v0.0.1`.
- [ ] For future update-testing, release `v0.0.2` to verify notification; don't publish a fake higher public version.

## Important distribution notes

- This ZIP is **not digitally signed** as a ZXP. Manual CEP installation can require Adobe-recognized signing or local developer settings.
- The public can extract all ZIP contents, including bundled presets and project code. Check licenses/permission first.
- Do not claim the extension is certified/tested on **all AE 2020+ releases** until tested on those versions.
- Keep `com.ksaevelo.tools.panel` unchanged between upgrades so users retain the panel's identity. Only change numeric versions for new releases.
