function generateTrxId() {
    const prefix = "TRX";
    const timestamp = Date.now();
    const rand = Math.random().toString(36).substring(2, 8).toUpperCase();
    return `${prefix}-${timestamp}-${rand}`;
};

module.exports = { generateTrxId }