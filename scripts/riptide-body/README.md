# Riptide body model

Builds `public/riptide/body.bin`, the figure in the Riptide body map
(`src/components/Riptide/BodyMap/BodyScene.js`).

Source: the MakeHuman base mesh, skeleton, weights and macro targets, all
released as CC0 (https://github.com/makehumancommunity/makehuman, under
`makehuman/data`). Download into a folder of your choice:

- `3dobjs/base.obj`
- `rigs/default.mhskel`, `rigs/default_weights.mhw`
- `targets/macrodetails/{caucasian,african,asian}-male-young.target`
- `targets/macrodetails/universal-male-young-maxmuscle-averageweight.target`

Then:

    node scripts/riptide-body/build.mjs <download-dir> public/riptide/body.bin [preview-prefix] [armDown=26] [armBack=12] [foreBack=16]

What it does: applies an average young adult male shape, lowers the arms with
the MakeHuman skin weights, keeps the skin and eyes, applies one Catmull-Clark
subdivision, scales the figure to 3.56 units tall with its feet on y = 0, bakes
per-vertex ambient occlusion, and packs int16 positions, uint16 indices and
uint8 AO. It also prints pain-marker positions raycast onto the skin; copy them
into `bodyMap.regions[].pos` in `src/content/riptide.js` if the body changes.
With a preview prefix it also writes PNG front, side and back views.
