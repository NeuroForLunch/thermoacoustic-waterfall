'use strict';

define([], () => {
  const exports = {};

  // webkitAudioContext required for Safari as of version 10.1
  const AudioContext = (window.AudioContext || window.webkitAudioContext);
  exports.AudioContext = AudioContext;

  // Given a maximum acceptable delay, calculate the largest power-of-two buffer size which does not result in more than that delay.
  function delayToBufferSize(sampleRate, maxDelayInSeconds) {
    var maxBufferSize = sampleRate * maxDelayInSeconds;
    var powerOfTwoBufferSize = 1 << Math.floor(Math.log(maxBufferSize) / Math.LN2);
    // Size limits defined by the Web Audio API specification.
    powerOfTwoBufferSize = Math.max(256, Math.min(16384, powerOfTwoBufferSize));
    return powerOfTwoBufferSize;
  }
  exports.delayToBufferSize = delayToBufferSize;

  return Object.freeze(exports);
});
