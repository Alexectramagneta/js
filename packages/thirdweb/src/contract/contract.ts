import type { Abi } from "abitype";
import type { Chain } from "../chains/types.js";
import type { ThirdwebClient } from "../client/client.js";
import { isAddress } from "../utils/address.js";

/**
 * @contract
 */
export type ContractOptions<abi extends Abi = []> = {
  client: ThirdwebClient;
  address: string;
  chain: Chain;
  readonly abi?: abi;
};

/**
 * @contract
 */
export type ThirdwebContract<abi extends Abi = []> = Readonly<
  ContractOptions<abi>
>;

/**
 * Creates a Thirdweb contract by combining the Thirdweb client and contract options.
 * @param options - The options for creating the contract.
 * @returns The Thirdweb contract.
 * @example
 * ```ts
 * import { createThirdwebClient, getContract } from "thirdweb";
 * import { sepolia } from "thirdweb/chains";
 *
 * const client = createThirdwebClient({ clientId: "..." });
 * const contract = getContract({
 *  client,
 *  chain: sepolia,
 *  address: "0x123...",
 *  // optional ABI
 *  abi: [...],
 * });
 * ```
 * @contract
 */
export function getContract<const abi extends Abi = []>(
  options: ContractOptions<abi>,
): ThirdwebContract<abi> {
  if (!options.client) {
    throw new Error(
      `getContract validation error - invalid client: ${options.client}`,
    );
  }
  if (!isAddress(options.address)) {
    throw new Error(
      `getContract validation error - invalid address: ${options.address}`,
    );
  }
  if (!options.chain || !options.chain.id) {
    throw new Error(
      `getContract validation error - invalid chain: ${options.chain}`,
    );
  }
  return options;
}
