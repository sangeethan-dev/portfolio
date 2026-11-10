/*
 * SplitText masks clip to the word's line box. Give each mask a little room
 * (cancelled out with negative margins, so layout doesn't move) so caps,
 * italic overhangs and descenders are never shaved off.
 */
export default function padMasks(split) {
  (split.masks || []).forEach((m) => {
    m.style.padding = "0.06em 0.08em 0.16em";
    m.style.margin = "-0.06em -0.08em -0.16em";
  });
}
