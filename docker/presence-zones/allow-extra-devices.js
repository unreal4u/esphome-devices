
/* ---------------------------------------------------------------------------
 * Local patch: admit DIY LD2450 devices (marker: extra-presence-devices-v1)
 *
 * Upstream lists a device only when Home Assistant reports its manufacturer as
 * EverythingSmartTechnology, so home-built boards running the LD2450 package
 * are dropped before any entity logic runs. This wraps the exported filter to
 * also admit devices named in EXTRA_PRESENCE_DEVICES (comma separated; each
 * entry may be a device id, a device name, or an ESPHome node name).
 *
 * The real manufacturer and model are deliberately left untouched. Profile
 * selection matches on which entities exist rather than on the model string,
 * so the zone editor works unchanged, while the firmware installer still
 * refuses these devices because no product index matches their model.
 * ------------------------------------------------------------------------- */

const EXTRA_PRESENCE_DEVICES = (process.env.EXTRA_PRESENCE_DEVICES || '')
  .split(',')
  .map((entry) => entry.trim().toLowerCase())
  .filter((entry) => entry.length > 0);

/**
 * Every string this device could plausibly be referred to by. The filter is
 * called with two shapes: the raw Home Assistant registry entry and a mapped
 * summary, so both `name_by_user` and `name` are considered.
 */
const extraDeviceAliases = (device) => {
  const aliases = [device.id, device.name_by_user, device.name];
  for (const identifier of device.identifiers ?? []) {
    if (Array.isArray(identifier)) {
      aliases.push(identifier[1]);
    }
  }
  return aliases
    .filter((alias) => typeof alias === 'string' && alias.length > 0)
    .map((alias) => alias.toLowerCase());
};

const isExtraPresenceDevice = (device) => EXTRA_PRESENCE_DEVICES.length > 0
  && extraDeviceAliases(device).some((alias) => EXTRA_PRESENCE_DEVICES.includes(alias));

exports.isExtraPresenceDevice = isExtraPresenceDevice;

exports.filterEverythingPresenceDevices = (devices) => devices.filter(
  (device) => exports.isEverythingPresenceManufacturer(device.manufacturer)
    || isExtraPresenceDevice(device),
);

if (EXTRA_PRESENCE_DEVICES.length > 0) {
  console.log(
    '[extra-presence-devices] also accepting devices matching: %s',
    EXTRA_PRESENCE_DEVICES.join(', '),
  );
}
