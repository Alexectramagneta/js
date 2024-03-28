import type { AbiParameterToPrimitiveType } from "abitype";
import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { encodeAbiParameters } from "../../../../../utils/abi/encodeAbiParameters.js";
import { decodeAbiParameters } from "viem";
import type { Hex } from "../../../../../utils/encoding/hex.js";

/**
 * Represents the parameters for the "totalSupply" function.
 */
export type TotalSupplyParams = {
  id: AbiParameterToPrimitiveType<{ type: "uint256"; name: "id" }>;
};

const FN_SELECTOR = "0xbd85b039" as const;
const FN_INPUTS = [
  {
    type: "uint256",
    name: "id",
  },
] as const;
const FN_OUTPUTS = [
  {
    type: "uint256",
  },
] as const;

/**
 * Encodes the parameters for the "totalSupply" function.
 * @param options - The options for the totalSupply function.
 * @returns The encoded ABI parameters.
 * @extension ERC1155
 * @example
 * ```
 * import { encodeTotalSupplyParams } "thirdweb/extensions/erc1155";
 * const result = encodeTotalSupplyParams({
 *  id: ...,
 * });
 * ```
 */
export function encodeTotalSupplyParams(options: TotalSupplyParams) {
  return encodeAbiParameters(FN_INPUTS, [options.id]);
}

/**
 * Decodes the result of the totalSupply function call.
 * @param result - The hexadecimal result to decode.
 * @returns The decoded result as per the FN_OUTPUTS definition.
 * @extension ERC1155
 * @example
 * ```
 * import { decodeTotalSupplyResult } from "thirdweb/extensions/erc1155";
 * const result = decodeTotalSupplyResult("...");
 * ```
 */
export function decodeTotalSupplyResult(result: Hex) {
  return decodeAbiParameters(FN_OUTPUTS, result)[0];
}

/**
 * Calls the "totalSupply" function on the contract.
 * @param options - The options for the totalSupply function.
 * @returns The parsed result of the function call.
 * @extension ERC1155
 * @example
 * ```
 * import { totalSupply } from "thirdweb/extensions/erc1155";
 *
 * const result = await totalSupply({
 *  id: ...,
 * });
 *
 * ```
 */
export async function totalSupply(
  options: BaseTransactionOptions<TotalSupplyParams>,
) {
  return readContract({
    contract: options.contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
    params: [options.id],
  });
}