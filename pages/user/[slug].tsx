import React from "react";
import PublicProfileComponent from "../../components/PublicProfile/PublicProfileComponent";
import Users from "../../model/users";
import connectDB from "../../lib/connectDB";
import { ContractAbi, ContractAddress } from "../../components/utils/constants";
import { ethers } from "ethers";
import { fetchListings } from "../../components/utils/utils";
type Props = {};

const PublicProfile = ({ user, collectedNfts, listedNfts }: any) => {
  return (
    <PublicProfileComponent
      user={user}
      collectedNfts={collectedNfts}
      listedNfts={listedNfts}
    />
  );
};
export const getServerSideProps = async (pageContext: {
  query: { slug: any };
}) => {
  const pageSlug = pageContext.query.slug;

  let json = await Users.findById({ _id: pageSlug });

  let user = JSON.parse(JSON.stringify(json));

  const nftFetch = async () => {
    const provider = new ethers.providers.JsonRpcProvider(
      process.env.NEXT_APP_INFURA_ID
    );

    const contract = new ethers.Contract(
      ContractAddress,
      ContractAbi,
      provider
    );

    const listingTx = await contract.filterNftByAddress(user?.address);

    const res = await fetchListings({ contract, listingTx });
    // console.log(res);

    return res;
  };
  let userNfts = await nftFetch();
  let listedNfts: any[] = [];
  let collectedNfts: any[] = [];
  if (userNfts) {
    userNfts.forEach((nft: any, index: number) => {
      if (nft.seller === nft.owner) {
        collectedNfts.push(nft);
      } else {
        listedNfts.push(nft);
      }
    });
  }

  return {
    props: {
      user,
      listedNfts: listedNfts || null,
      collectedNfts: collectedNfts || null,
    },
  };
};
export default PublicProfile;
