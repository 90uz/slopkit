(function (global) {
    const fullSupport = [
        "9.00", "9.05", "9.20", "9.40", "9.60",
        "10.00", "10.01", "10.20", "10.40", "10.60",
        "11.00", "11.20", "11.40", "11.60",
        "12.00", "13.00"
    ];
    const notifyOnlySupport = ["13.20", "13.40", "13.60"];

    function normalizeFirmwareVersion(firmware) {
        const match = /^(\d+)\.(\d+)$/.exec(String(firmware || "").trim());
        if (!match) return "";
        return `${match[1]}.${match[2].padStart(2, "0")}`;
    }

    function firmwareStateFromVersion(firmware) {
        const normalized = normalizeFirmwareVersion(firmware);
        if (!normalized) return "unknown";
        if (fullSupport.includes(normalized)) return "full";
        if (notifyOnlySupport.includes(normalized)) return "notify";
        return "unsupported";
    }

    global.SlopkitCompatibility = {
        fullSupport,
        notifyOnlySupport,
        notifySupport: fullSupport.concat(notifyOnlySupport),
        normalizeFirmwareVersion,
        firmwareStateFromVersion,
        texts: {
            supportMatrix: "Firmware support: 9.00-13.00 = jailbreak + ELF loader + sender | 9.00-13.60 = notify launcher | others = unsupported.",
            notifyAvailability: "Notify profiles are available through 13.60 for compatibility and validation flows.",
            notifyReadiness: "Confirmed readiness is narrower: 13.40+ remains validation-focused and should be treated as compatibility testing until it is verified."
        }
    };
})(window);
