import type { NextPage } from "next";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { marketplaceContractAddress } from "../../addresses";
import Router from "next/router";
import profile from "../../assets/PROFILE.png";
import Image from "next/image";
import styles from "../../styles/Home.module.css";
import { ethers } from "ethers";
import { ContractAbi, ContractAddress } from "../utils/constants";
import { fetchListings, fetCollection } from "../utils/utils";

import Link from "next/link";
import CollectionListingCard from "./CollectionListingCard";
import CollPlaceBidModal from "./CollPlaceBidModal";
import CollEnlargeNFTModal from "./CollEnlargeNFTModal";

type Props = {
  listing: any;
};

const CollectionListing = (props: Props) => {
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [modalOpenEnlargeNFT, setModalOpenEnlargeNFT] =
    useState<boolean>(false);
  const [bidAmount, setBidAmount] = useState<string>("");
  // Hooks to detect user is on the right network and switch them if they are not

  const [listing, setListing] = useState<any>(null);
  const [listings, setListings] = useState<any>(null);
  const [bidListing, setBidListing] = useState<any>(null);

  const router = useRouter();
  const { collectionId } = router.query as { collectionId: string };

  async function createBidOrOffer(listingId: any) {
    try {
      // bidAmount // The offer amount the user entered
      if (typeof window !== "undefined") {
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
          const valueToSend = ethers.utils.parseEther(bidAmount); // Example: sending 1 Ether

          // Call the contract method with value
          const listingTx = await contract.bid(id, { value: valueToSend });
          isModalClosed();
        }
      }
    } catch (error) {
      console.error(error);
      alert(error);
    }
  }

  async function makeOffer(listingId: any) {
    try {
      // bidAmount // The offer amount the user entered
      if (typeof window !== "undefined") {
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
          const valueToSend = ethers.utils.parseEther(bidAmount); // Example: sending 1 Ether

          // Call the contract method with value
          const listingTx = await contract.makeOffer(id, {
            value: valueToSend,
          });
          isModalClosed();
        }
      }
    } catch (error) {
      console.error(error);
      alert(error);
    }
  }

  const isModalOpen = () => {
    setModalOpen(true);
  };
  const isModalClosed = () => {
    setModalOpen(false);
  };

  // Modal Enlarge NFT
  const isModalOpenEnlargeNFT = () => {
    setModalOpenEnlargeNFT(true);
  };
  const isModalClosedEnlargeNFT = () => {
    setModalOpenEnlargeNFT(false);
  };

  const fetchlisting = async () => {
    const provider = new ethers.providers.Web3Provider(
      (window as CustomWindow).ethereum as any
    );

    if (collectionId) {
      await (window as CustomWindow)?.ethereum?.request({
        method: "eth_requestAccounts",
      });
      const signer = provider.getSigner();

      const contract = new ethers.Contract(
        ContractAddress,
        ContractAbi,
        signer
      );
      const id = Number(collectionId);
      // const listingTx = await contract.fetchNFT(id);
      // console.log(listingTx)
      const collectionTx = await contract.fetchCollection(id);
      const listingTx = await contract.fetchCollectionNFTs(collectionTx.id);
      console.log(collectionTx, listingTx);
      const listings = await fetchListings({ contract, listingTx });
      const collection = await fetCollection(collectionTx);
      console.log(collection, listings);

      // console.log(collection,listings,listingTx);
      setListing(collection);
      setListings(listings);
      // making a function to get both the collection data and nfts

      //  console.log(res);
      //  setMenuItems(res);
    }
  };
  useEffect(() => {
    if (typeof window !== "undefined") {
      fetchlisting();
    }
  }, []);
  console.log(listing);

  return (
    <>
      <div className="flex flex-col realtive h-full items-center container lg:w-[98dvw]  mt-[6.5rem]  overflow-x-hidden justify-between">
        <div className="flex justify-center realtive w-full md:w-3/4">
          {/* <div className="absolute translate-x-[100%] lg:translate-x-1 lg:right-[70%] xl:translate-x-0 xl:right-1/2  left-0 hidden md:block ">
            <Link
              href="/"
              className="font-ibmPlex cursor-pointer uppercase font-bold text-green text-xs z-1 absolute translate-x-[100%] lg:translate-x-1 lg:right-[70%] xl:translate-x-0 xl:right-1/2  left-0 hidden md:block -z-10"
            >
              {"<<<"} Back
            </Link>
          </div> */}
          <div className="flex flex-col h-full items-center justify-center">
            <div className="flex flex-col h-full items-center justify-center font-ibmPlex">
              <Image
                src={listing?.image as string}
                alt={listing?.title as string}
                width={400}
                height={600}
                className="w-full max-w-[250px] mt-4 object-contain rounded-[200px]"
                // onClick={isModalOpenEnlargeNFT}
              />{" "}
              <h1 className="italic mt-2 text-xl">{listing?.title}</h1>
              <div className="flex text-xs mt-2">
                COLLECTION BY{" "}
                <div
                  onClick={() => {
                    Router.push({
                      pathname: `/user/1`,
                    });
                  }}
                  className="font-bold pl-2 flex cursor-pointer"
                >
                  <p>
                    {" "}
                    @
                    {listing?.creator
                      ?.slice(0, 3)
                      .concat("...")
                      .concat(listing.creator.slice(-4))}
                  </p>
                  <Image
                    className="ml-3 h-5"
                    src={profile}
                    height={10}
                    width={20}
                    alt={""}
                  />
                </div>
              </div>
            </div>
            <div className="font-ibmPlex bold text-center w-full   mt-10 pb-10  leading-5 text-xs">
              <p className="mx-4 md:mx-0">{listing?.description as string}</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 w-full gap-14 sm:mx-8 mb-10">
              {listings &&
                listings.map((listing: any, index: number) => (
                  <CollectionListingCard
                    isModalOpenEnlargeNFT={isModalOpenEnlargeNFT}
                    isModalOpen={isModalOpen}
                    setBidListing={setBidListing}
                    listing={listing}
                    key={index}
                  />
                ))}
              {/*             
              <CollectionListingCard
                isModalOpenEnlargeNFT={isModalOpenEnlargeNFT}
                isModalOpen={isModalOpen}
                listing={listing}
              /> */}
            </div>
            <div className="flex w-full mt-6 mb-10 font-ibmPlex border-t pt-5 text-xs px-4 pd:mx-0">
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
                <div className="flex  justify-between text-left">
                  <Image
                    src={profile}
                    width={30}
                    height={10}
                    alt="profile picture"
                    className="hidden md:block h-fit"
                  />
                  <p className="md:pl-4 w-1/2 md:w-full">
                    Bid placed by <span className="font-bold"> @Josh90</span>{" "}
                    <br /> Jan 15, 2023 at 7.31pm
                  </p>
                  <div className="flex flex-grow"></div>
                  <p className="font-bold text-green">
                    2.5 <br /> ETH
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <CollPlaceBidModal
        bidAmount={bidAmount}
        setBidAmount={setBidAmount}
        listing={bidListing}
        isModalClosed={isModalClosed}
        modalOpen={modalOpen}
        createBidOrOffer={createBidOrOffer}
        makeOffer={makeOffer}
      />
      <CollEnlargeNFTModal
        isModalClosedEnlargeNFT={isModalClosedEnlargeNFT}
        modalOpenEnlargeNFT={modalOpenEnlargeNFT}
        listing={bidListing}
      />
    </>
  );
};

export default CollectionListing;
