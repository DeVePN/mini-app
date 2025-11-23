// Simple CRC32 implementation for Tact opcode calculation
function crc32(str) {
    let crc = -1;
    for (let i = 0; i < str.length; i++) {
        let c = str.charCodeAt(i);
        for (let j = 0; j < 8; j++) {
            if ((crc ^ c) & 1) {
                crc = (crc >>> 1) ^ 0xedb88320;
            } else {
                crc = (crc >>> 1);
            }
            c = c >>> 1;
        }
    }
    return (crc ^ -1) >>> 0;
}

// Tact opcode is typically crc32(message_name) | 0x80000000 if it's a query, but for internal messages it might be different.
// Actually, for `receive(msg: StartSession)`, the opcode is `crc32("StartSession")`? 
// No, Tact uses the TL-B schema. 
// Let's try to find the exact string Tact uses. 
// It is usually "StartSession{nodeId:uint32}".
console.log('Opcode attempt 1:', crc32('StartSession'));
