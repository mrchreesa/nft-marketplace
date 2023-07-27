import React from "react";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { marketplaceContractAddress } from "../../addresses";
import styles from "../../styles/Home.module.css";
import profile from "../../assets/PROFILE.png";
import Image from "next/image";
import Link from "next/link";

import { ethers } from "ethers";
import { ContractAbi, ContractAddress } from "../utils/constants";
import { fetchListing } from "../utils/utils";
import MakeOfferModal from "./MakeOfferModal";
const { BigNumber } = require("ethers");

type Props = {};

const CollectedNftComponent = (props: Props) => {
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [listing, setListing] = useState<any>(null);
  // Next JS Router hook to redirect to other pages and to grab the query from the URL (listingId)
  const router = useRouter();

  // De-construct listingId out of the router.query.
  // This means that if the user visits /listing/0 then the listingId will be 0.
  // If the user visits /listing/1 then the listingId will be 1.
  const listingId = router.query.collectedNftId;
  // console.log(listingId);

  const fetchlisting = async () => {
    const provider = new ethers.providers.Web3Provider(
      (window as CustomWindow).ethereum as any
    );

    if (listingId) {
      await (window as CustomWindow)?.ethereum?.request({
        method: "eth_requestAccounts",
      });
      const signer = provider.getSigner();

      const contract = new ethers.Contract(
        ContractAddress,
        ContractAbi,
        signer
      );
      const id = Number(listingId);
      const listingTx = await contract.fetchNFT(id);
      // console.log(listingTx)
      const res = await fetchListing({ contract, listingTx });
      // Get the latest block number
      const toBlock = await provider.getBlockNumber();
      const fromBlock = 0;
      const tokenId = BigNumber.from(listingId);
      setListing(res);
    }
  };
  useEffect(() => {
    if (typeof window !== "undefined") {
      fetchlisting();
    }
  }, []);
  console.log(listing);
  // Modal Place Bid
  const isModalOpen = () => {
    setModalOpen(true);
  };
  const isModalClosed = () => {
    setModalOpen(false);
  };

  if (listing) {
    return (
      <>
        <div className="flex flex-col realtive h-full items-center container lg:w-[98dvw]  mt-[6.5rem]  overflow-x-hidden justify-between">
          <div className="flex justify-center realtive w-3/4">
            <div className="absolute translate-x-[100%] lg:translate-x-1 lg:right-[70%] xl:translate-x-0 xl:right-1/2  left-0 hidden md:block ">
              <Link
                href="/"
                className="font-ibmPlex cursor-pointer uppercase font-bold text-green text-xs -z-10"
              >
                {"<<<"} Back
              </Link>
            </div>
            <div className="flex flex-col h-full items-center justify-center">
              <div className="w-full lg:w-max">
                <div className=" min-w-[350px]  lg:max-w-[50vw] cursor-pointer">
                  <Image
                    src={listing?.image}
                    alt={listing?.title as string}
                    width={400}
                    height={600}
                    className="w-full mb-2 object-contain cursor-pointer"
                  />{" "}
                  <div className="flex flex-col font-ibmPlex mb-4 uppercase text-xs text-[#e4e8eb] ">
                    <div className=" flex mt-4">
                      <div className="">
                        <p>{listing?.title}</p>
                      </div>
                      <div className="flex grow"></div>
                      <div className=" flex text-left">
                        {" "}
                        <p className="pr-6 ">
                          Bought <br /> For
                        </p>
                        <p className="font-bold ">
                          {listing.price} <br /> ETH
                        </p>
                      </div>
                    </div>

                    <div className=" flex mt-3">
                      <div className="font-bold flex">
                        <b>
                          {/* {listing.seller?.slice(0, 6) +
                            "..." +
                            listing.seller?.slice(36, 40)} */}
                        </b>
                      </div>

                      <div className="flex grow"></div>
                      {/* <div className=" flex text-left">
                        {" "}
                        <p className="pr-6 ">
                          Current <br /> Bid
                        </p>
                        <p className="font-bold text-green">
                          {listing.Bid} <br /> ETH
                        </p>
                      </div> */}
                    </div>
                    <div className=" flex mt-3">
                      <div className="flex grow"></div>
                      <div className="w-full flex font-bold text-green uppercase">
                        <button
                          className=" text-green font-xCompressed  w-full border border-green uppercase tracking-[8px] py-1 bg-white bg-opacity-20 hover:bg-opacity-30 font-semibold text-xl  "
                          onClick={isModalOpen}
                        >
                          Make Offer
                        </button>
                      </div>
                      <div className="flex grow"></div>
                    </div>
                  </div>
                </div>
                {/* <div className="font-ibmPlex w-full md:min-w-1 flex items-center justify-between">
                  <button
                    className=" text-green font-xCompressed  w-full border border-green uppercase tracking-[8px] py-1 bg-white bg-opacity-20 hover:bg-opacity-30 font-semibold text-xl  "
                    onClick={isModalOpen}
                  >
                    {
                      listing.timeElapse ?
                        listing.sold ?
                          "ENDED"
                          :
                          "END NOW"
                        :
                        "place bid"
                    }
                  </button>
                </div> */}
              </div>
              <div className="font-ibmPlex bold text-center w-full   mt-10 pb-10 border-b leading-5 text-xs">
                <p className="md:w-[50vw]">{listing?.description}</p>
              </div>
              <div className="flex w-full mt-6 mb-10 font-ibmPlex text-xs">
                <div className="flex flex-1/2 flex-col w-1/2 items-start">
                  <button className="text-green mb-4">
                    SHARE AND EARN 1% {">>"}
                  </button>
                  <button className="mb-4">VIEW ON ETHERSCAN {">"}</button>
                  <button className="mb-4">VIEW METADATA {">"}</button>
                  <button className="mb-4">VIEW ON IPFS {">"}</button>
                </div>
                <div className="flex-1/2  w-1/2">
                  <p className="text-left mb-2">HISTORY</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <MakeOfferModal
          listing={listing}
          isModalClosed={isModalClosed}
          modalOpen={modalOpen}
          listingId={listingId}
        />
      </>
    );
  }
};
export default CollectedNftComponent;
