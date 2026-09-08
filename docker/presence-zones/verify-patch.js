/*
 * Build-time self-test for the allow-extra-devices patch.
 *
 * Runs against the patched module inside the image so a broken or silently
 * ineffective patch fails `docker build` instead of showing up later as
 * "my devices still aren't listed". Expects EXTRA_PRESENCE_DEVICES to name
 * the fixture device below.
 */

const target = process.argv[2];
if (!target) {
  throw new Error('usage: verify-patch.js <path to everythingPresenceDevices.js>');
}

const patched = require(target);

const devices = [
  { id: 'genuine', name: 'Real EPL', manufacturer: 'EverythingSmartTechnology' },
  { id: 'unrelated', name: 'Some Lamp', manufacturer: 'Espressif' },
  { id: 'diy-by-name', name: 'Patched Device', manufacturer: 'Espressif' },
  { id: 'diy-by-node-name', name: 'Other', manufacturer: '', identifiers: [['esphome', 'patched-node']] },
];

const actual = patched.filterEverythingPresenceDevices(devices).map((device) => device.id).sort();
const expected = ['diy-by-name', 'diy-by-node-name', 'genuine'];

if (JSON.stringify(actual) !== JSON.stringify(expected)) {
  throw new Error(`patch self-test failed: expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`);
}

console.log('patch self-test passed: genuine devices kept, allow-listed devices admitted, others dropped');
