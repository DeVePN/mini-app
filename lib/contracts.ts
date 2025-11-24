import { beginCell, Address } from '@ton/core';

// Address from environment variable
export const SESSION_MANAGER_ADDRESS =
  process.env.NEXT_PUBLIC_SESSION_MANAGER_ADDRESS ||
  'EQDu3ep204NLbW9CFAAcpj5qiRGPCj2R5vxzID4LSeSL_Ae0';

// Opcodes from compiled Tact contract
// Found in: SmartContract/build/SessionManager/SessionManager_SessionManager.ts line 836
export const Opcodes = {
  StartSession: 0x1CAB8E95, // 480744981 decimal - CRC32 of "StartSession"
};

/**
 * Helper to build StartSession message body
 * Message structure: [32-bit opcode][32-bit nodeId]
 * Note: No QueryID field - contract doesn't expect it
 */
export function buildStartSessionMessage(nodeId: number) {
  return beginCell()
    .storeUint(Opcodes.StartSession, 32) // OpCode
    .storeUint(nodeId, 32) // nodeId as uint32
    .endCell();
}
