# Everything Presence mmWave configurator, patched to also list the DIY LD2450
# boards in this repo. See allow-extra-devices.js for what the patch does and
# why the device metadata is deliberately left alone.
#
# Pin BASE_IMAGE to a release tag for reproducible rebuilds.
ARG BASE_IMAGE=everythingsmarthome/everything-presence-mmwave-configurator:latest
FROM ${BASE_IMAGE}

ARG TARGET=/app/backend/dist/domain/everythingPresenceDevices.js

COPY allow-extra-devices.js verify-patch.js /tmp/

# Appending an override only works while the module still exports the filter
# under these names, so assert the shape before touching it: a silent no-op
# here would be indistinguishable from "my devices are still missing".
RUN set -eu; \
    grep -q 'MANUFACTURER_FILTERS' "${TARGET}"; \
    grep -q 'exports.filterEverythingPresenceDevices' "${TARGET}"; \
    grep -q 'exports.isEverythingPresenceManufacturer' "${TARGET}"; \
    if grep -q 'extra-presence-devices-v1' "${TARGET}"; then \
        echo 'base image already carries this patch; drop the override' >&2; \
        exit 1; \
    fi; \
    cat /tmp/allow-extra-devices.js >> "${TARGET}"; \
    node --check "${TARGET}"; \
    EXTRA_PRESENCE_DEVICES='Patched Device,patched-node' node /tmp/verify-patch.js "${TARGET}"; \
    rm /tmp/allow-extra-devices.js /tmp/verify-patch.js
