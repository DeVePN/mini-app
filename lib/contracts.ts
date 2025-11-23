import { beginCell, Address } from '@ton/core';

// Address from environment variable
export const SESSION_MANAGER_ADDRESS = process.env.NEXT_PUBLIC_SESSION_MANAGER_ADDRESS || 'EQD__________________________________________0';

export const Opcodes = {
    StartSession: 0x12345678, // We need to calculate the actual opcode or use a fixed one if defined in Tact (Tact generates them based on message name)
    // For Tact, it's a CRC32 of the message name "StartSession" usually, but let's check if we can just use a comment or if we need the exact TL-B.
    // Tact messages are usually: [32-bit opcode][body]
};

// Helper to calculate Tact opcode (CRC32 of "StartSession")
// Since we can't easily import the Tact compiler output here, we might need to rely on the user providing the wrapper or just use a simple transfer with comment if the contract supports it.
// Looking at the contract: receive(msg: StartSession). It expects a typed message.
// We need the opcode. 

// For now, let's assume we will use a simple comment "StartSession" if the contract supported it, but it doesn't.
// It strictly expects `StartSession` struct.
// We need to know the opcode for `StartSession`.
