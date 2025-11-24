import { beginCell, Address } from '@ton/core';

// Address from environment variable
export const SESSION_MANAGER_ADDRESS =
  process.env.NEXT_PUBLIC_SESSION_MANAGER_ADDRESS ||
  'EQDu3ep204NLbW9CFAAcpj5qiRGPCj2R5vxzID4LSeSL_Ae0';

// Opcodes from compiled Tact contract
// Found in: SmartContract/build/SessionManager/SessionManager_SessionManager.ts line 836
export const Opcodes = {
  StartSession: 480744981, // 0x1CA7C615 - Correct Opcode from build artifacts
};

/**
 * TEMPORARY WORKAROUND: Convert UUID string to uint32 for contract
 *
 * The database uses UUID strings for node IDs, but the smart contract
 * expects uint32 integers. This function deterministically converts
 * a UUID to a uint32 by hashing it.
 *
 * NOTE: This is a hackathon demo workaround. For production, the database
 * should use integer node IDs that match the contract's uint32 type.
 *
 * @param uuid - Node UUID string (e.g., "79e4b81b-4694-4cad-bd5b-0c9a44b6c3bb")
 * @returns uint32 number for contract (0 to 4294967295)
 */
export function uuidToContractId(uuid: string): number {
  // Remove dashes and take last 8 hex characters
  const hex = uuid.replace(/-/g, '').slice(-8);
  // Convert hex to number and ensure it's within uint32 range
  return parseInt(hex, 16) >>> 0; // >>> 0 ensures unsigned 32-bit
}

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
