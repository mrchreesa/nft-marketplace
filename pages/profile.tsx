import React from "react";
import ProfileComponent from "../components/Profile/ProfileComponent";
import { getCookie } from "cookies-next";
import connectDB from "../lib/connectDB";
import Users from "../model/users";
import useAuthedProfile from "../context/UserContext";
import { ContractAbi, ContractAddress } from "../components/utils/constants";
import { ethers } from "ethers";
import { fetchListings } from "../components/utils/utils";

type Props = {
  user: any;
  collectedNfts: any[];
  listedNfts: any[];
  soldNfts: any[];
};

const Profile = ({ user, collectedNfts, listedNfts, soldNfts }: Props) => {
  // const { setAuthedProfile, authedProfile } = useAuthedProfile();
  // React.useEffect(() => {
  //   setAuthedProfile(user);
  // }, [user]);
  return (
    <ProfileComponent
      authedProfile={user}
      collectedNfts={collectedNfts}
      listedNfts={listedNfts}
      soldNfts={soldNfts}
    />
  );
};
export const getServerSideProps = async ({ req, res }: any) => {
  let auth = getCookie("auth", { req, res });
  await connectDB();
  const json = await Users.findOne({ address: auth });
  let user = JSON.parse(JSON.stringify(json));
  // console.log(user);

  // NFT Fetch
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
  let soldNfts: any[] = [];
  if (userNfts) {
    userNfts.forEach((nft: any, index: number) => {
      if (nft.seller === nft.owner) {
        collectedNfts.push(nft);
      } else {
        listedNfts.push(nft);
      }
    });
    userNfts.forEach((nft: any, index: number) => {
      if (nft.sold) {
        soldNfts.push(nft);
      }
    });
  }

  if (!auth) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  } else {
    return {
      props: {
        user,
        listedNfts: listedNfts || null,
        collectedNfts: collectedNfts || null,
        soldNfts: soldNfts || null,
      },
    };
  }
};

export default Profile;
