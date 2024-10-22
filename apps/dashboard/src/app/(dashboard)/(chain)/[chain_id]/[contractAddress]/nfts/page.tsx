import { notFound, redirect } from "next/navigation";
import { resolveFunctionSelectors } from "../../../../../../lib/selectors";
import { getContractPageParamsInfo } from "../_utils/getContractFromParams";
import { getContractPageMetadata } from "../_utils/getContractPageMetadata";
import { ContractNFTPage } from "./ContractNFTPage";

export default async function Page(props: {
  params: Promise<{
    contractAddress: string;
    chain_id: string;
  }>;
}) {
  const info = await getContractPageParamsInfo((await props.params));

  if (!info) {
    notFound();
  }

  const { contract } = info;
  const { supportedERCs } = await getContractPageMetadata(contract);

  if (!supportedERCs.isERC721 && !supportedERCs.isERC1155) {
    redirect(`/${(await props.params).chain_id}/${(await props.params).contractAddress}`);
  }

  const functionSelectors = await resolveFunctionSelectors(contract);

  return (
    <ContractNFTPage
      contract={contract}
      isErc721={supportedERCs.isERC721}
      functionSelectors={functionSelectors}
    />
  );
}
