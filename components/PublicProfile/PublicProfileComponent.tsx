import Image from "next/image";
import React, { useEffect, useState } from "react";
import banner from "../../assets/banner.png";
import profile from "../../assets/profile-2.png";
import star from "../../assets/Star-PNG-Images.png";
import { useAuthedProfile } from "../../context/UserContext";
import nft1 from "../../assets/nft-1.jpeg";
import nft2 from "../../assets/nft-2.jpeg";
import Link from "next/link";
import { ContractAbi, ContractAddress } from "../utils/constants";
import { ethers } from "ethers";
import { fetchListings } from "../utils/utils";
import Router, { useRouter } from "next/router";

type Props = {
  user: any;
  collectedNfts: any[];
  listedNfts: any[];
};

const PublicProfileComponent = ({ user, collectedNfts, listedNfts }: Props) => {
  const [loading, setLoading] = React.useState<boolean>(false);
  const { setAuthedProfile, authedProfile } = useAuthedProfile();
  const router = useRouter();
  // console.log(user);

  // const nftFetch = async () => {
  //   const provider = new ethers.providers.Web3Provider(
  //     (window as CustomWindow).ethereum as any
  //   );

  //   await (window as CustomWindow)?.ethereum?.request({
  //     method: "eth_requestAccounts",
  //   });
  //   const signer = provider.getSigner();
  //   const contract = new ethers.Contract(ContractAddress, ContractAbi, signer);

  //   const listingTx = await contract.filterNftByAddress(user?.address);

  //   const res = await fetchListings({ contract, listingTx });

  //   setUserNfts(res);
  // };

  // useEffect(() => {
  //   if (user) {
  //     nftFetch();
  //   }
  // }, [user]);

  return (
    <div
      className={`flex flex-col w-full max-w-[1590px] px-4 md:px-3 lg:px-6 mt-20 md:mt-24  bg-black overflow-hidden ${
        loading && `cursor-progress`
      }`}
    >
      <div className="flex flex-col w-full font-ibmPlex ">
        <label className="" htmlFor="input-banner">
          <Image
            src={user?.bannerPicture || banner}
            width={1600}
            height={200}
            alt="banner"
            className="h-[12vh] md:h-[14vh]  object-cover   z-0"
          />
        </label>

        <div className="flex w-full -mt-4">
          <label className="" htmlFor="input-profile">
            <Image
              className="border border-green rounded-full  bg-black z-10 object-center object-cover aspect-square"
              src={user?.profilePicture}
              width={70}
              height={70}
              alt="profile"
            />
          </label>
          <Image
            className="ml-4 mb-1 h-5 self-center"
            src={star}
            width={20}
            height={10}
            alt="star"
          />
          <p className="text-xs pl-1 font-bold tracking-wider self-center">
            ARTIST
          </p>
        </div>

        <div className="flex flex-col w-full mt-4 text-left text-xs">
          <h1 className="text-2xl mb-1 font-bold">{user?.username}</h1>
          <p>{user?.bio}</p>
        </div>
        <div className="flex  flex-col-reverse md:flex-col">
          <div className="flex flex-col font-ibmPlex mt-10 text-left">
            <h3 className="font-bold">LISTED</h3>
            <div className="grid grid-cols-2 lg:grid-cols-4  items-stretch gap-10 md:gap-4 mb-10 mt-4">
              {/* NFT 1  */}
              {listedNfts.map(
                (nft: any, index: React.Key | null | undefined) => (
                  <div
                    className="flex md: flex-col h-full items-start w-max "
                    key={index}
                  >
                    <div className="">
                      <Image
                        src={nft.image}
                        alt="nft7"
                        width={150}
                        height={200}
                        className="max-h-[220px] md:max-h-[300px] w-[41vw] md:w-full md:min-w-[230px] mb-2 object-cover"
                      />{" "}
                    </div>
                    <div className="flex flex-col w-full md:min-w-[230px] font-ibmPlex mb-4 uppercase text-xs text-[#e4e8eb] ">
                      <div className=" flex ">
                        <div className=" flex w-full">
                          {" "}
                          <p className="pr-6 ">
                            Reserve NOt
                            <br /> met
                          </p>
                          <div className="flex grow"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              )}
            </div>
            {/* COLLECTED */}

            <div className="flex flex-col">
              <h3 className="font-bold">COLLECTED</h3>
              <div className="grid grid-cols-2 lg:grid-cols-4  items-stretch gap-10 md:gap-4 mb-10 mt-4">
                {collectedNfts.map(
                  (nft: any, index: React.Key | null | undefined) => (
                    <div
                      className="grid grid-cols-2 lg:grid-cols-4 items-stretch gap-4 mb-10 mt-4"
                      key={index}
                    >
                      <div className="flex  flex-col h-full items-start w-auto ">
                        <div
                          className="cursor-pointer"
                          onClick={() => {
                            Router.push({
                              pathname: `/user/${router.query.slug}/${nft.id}`,
                            });
                          }}
                        >
                          <Image
                            src={nft.image}
                            alt="nft7"
                            width={150}
                            height={200}
                            className="max-h-[220px] md:max-h-[300px] w-[41vw] md:w-full md:min-w-[230px] mb-2 object-cover"
                          />{" "}
                        </div>
                        <div className="flex flex-col w-full md:min-w-[230px] font-ibmPlex mb-4 uppercase text-xs text-[#e4e8eb] ">
                          <div className=" flex ">
                            <div className=" flex w-full">
                              {" "}
                              <p className="pr-6 ">
                                Bought <br /> For
                              </p>
                              <div className="flex grow"></div>
                              <p className="font-bold text-green">
                                1.1 <br /> ETH
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PublicProfileComponent;
