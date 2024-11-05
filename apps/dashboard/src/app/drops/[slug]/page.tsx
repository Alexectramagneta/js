import { getThirdwebClient } from "@/constants/thirdweb.server";
import { defineDashboardChain } from "lib/defineDashboardChain";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getContract, toTokens } from "thirdweb";
import { getContractMetadata } from "thirdweb/extensions/common";
import { getCurrencyMetadata } from "thirdweb/extensions/erc20";
import {
  getActiveClaimCondition as getActiveClaimCondition721,
  getNFT as getNFT721,
} from "thirdweb/extensions/erc721";
import {
  getActiveClaimCondition as getActiveClaimCondition1155,
  getNFT as getNFT1155,
} from "thirdweb/extensions/erc1155";
import { NftMint } from "./mint-ui";

type DropPageData = {
  slug: string;
  contractAddress: string;
  chainId: number;
  hideQuantitySelector?: boolean;
  hideMintToCustomAddress?: boolean;
  // If not defined, we will use the image of the NFT or contract's image
  thumbnail?: string;
  metadata: Metadata;
} & ({ type: "erc1155"; tokenId: bigint } | { type: "erc721" });

const DROP_PAGES: DropPageData[] = [
  {
    slug: "test",
    type: "erc1155",
    contractAddress: "0xBD9d7f15f3C850B35c30b8F9F698B511c20b7263",
    tokenId: 0n,
    chainId: 11155111,
    hideQuantitySelector: true,
    hideMintToCustomAddress: true,
    thumbnail: "/drops/zerion.mp4",
    metadata: {
      title: "Test mint page",
      description: "none",
    },
  },
  {
    slug: "zero-chain-announcement",
    type: "erc1155",
    contractAddress: "0x78264a0af02d894f2d9ae3e11E4a503b352CC437",
    tokenId: 0n,
    chainId: 543210,
    hideMintToCustomAddress: true,
    hideQuantitySelector: true,
    thumbnail: "/drops/zerion.mp4",
    metadata: {
      title: "ZERO x thirdweb",
      description:
        "This exclusive commemorative NFT marks the official launch of ZERϴ's mainnet and our exciting partnership with thirdweb. Own a piece of this milestone in blockchain history as we make onchain transactions free with zero.network",
      openGraph: {
        title: "ZERO x thirdweb",
        description:
          "This exclusive commemorative NFT marks the official launch of ZERϴ's mainnet and our exciting partnership with thirdweb. Own a piece of this milestone in blockchain history as we make onchain transactions free with zero.network",
      },
    },
  },

  // Add more chains here
];

export async function generateMetadata({
  params,
}: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const project = DROP_PAGES.find((p) => p.slug === slug);
  if (!project) {
    return notFound();
  }
  return project.metadata;
}

export default async function DropPage({
  params,
}: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  const project = DROP_PAGES.find((p) => p.slug === slug);

  if (!project) {
    return notFound();
  }
  // eslint-disable-next-line no-restricted-syntax
  const chain = defineDashboardChain(project.chainId, undefined);
  const client = getThirdwebClient();

  const contract = getContract({
    address: project.contractAddress,
    chain,
    client,
  });

  const [nft, claimCondition, contractMetadata] = await Promise.all([
    project.type === "erc1155"
      ? getNFT1155({ contract, tokenId: project.tokenId })
      : getNFT721({ contract, tokenId: 0n }),
    project.type === "erc1155"
      ? getActiveClaimCondition1155({
          contract,
          tokenId: project.tokenId,
        }).catch(() => undefined)
      : getActiveClaimCondition721({ contract }).catch(() => undefined),
    getContractMetadata({ contract }),
  ]);

  const thumbnail =
    project.thumbnail || nft.metadata.image || contractMetadata.image || "";

  const displayName = contractMetadata.name || nft.metadata.name || "";

  const description =
    typeof contractMetadata.description === "string" &&
    contractMetadata.description
      ? contractMetadata.description
      : nft.metadata.description || "";

  if (!claimCondition) {
    return (
      <NftMint
        contract={contract}
        displayName={displayName}
        thumbnail={thumbnail}
        description={description}
        {...project}
        noActiveClaimCondition
      />
    );
  }

  const currencyMetadata = claimCondition.currency
    ? await getCurrencyMetadata({
        contract: getContract({
          address: claimCondition.currency,
          chain,
          client,
        }),
      })
    : undefined;

  if (!currencyMetadata) {
    return notFound();
  }

  const pricePerToken = Number(
    toTokens(claimCondition.pricePerToken, currencyMetadata.decimals),
  );

  return (
    <NftMint
      contract={contract}
      displayName={displayName || ""}
      thumbnail={thumbnail}
      description={description || ""}
      currencySymbol={currencyMetadata.symbol}
      pricePerToken={pricePerToken}
      noActiveClaimCondition={false}
      quantityLimitPerWallet={claimCondition.quantityLimitPerWallet}
      {...project}
    />
  );
}
