"use client";

/*
 * Tiny signal so intro animations wait for the preloader curtain.
 * onPreloaderDone(cb) runs cb immediately if the preloader already finished.
 */
let done = false;
const waiting = new Set();

export function markPreloaderDone() {
  if (done) return;
  done = true;
  waiting.forEach((cb) => cb());
  waiting.clear();
}

export function onPreloaderDone(cb) {
  if (done) {
    cb();
    return () => {};
  }
  waiting.add(cb);
  return () => waiting.delete(cb);
}
