import type { NextPage } from "next";
import Link from "next/link";
import { useEffect, useState } from "react";
import { marketplaceContractAddress } from "../addresses";
import { motion, AnimatePresence } from "framer-motion";
import { useAuthedProfile } from "../context/UserContext";

import NFTCard from "../components/NFTCard";
import NFTCardSkeleton from "../components/LoadingSkeletons/NFTCardSkeleton";
import CollectionMarketPage from "../components/Collection/CollectionMarketPage";
import { getCookie } from "cookies-next";
import Users from "../model/users";
import connectDB from "../lib/connectDB";
import { ethers } from "ethers";
import { ContractAbi, ContractAddress } from "../components/utils/constants";
import { fetchListings } from "../components/utils/utils";

const Home: NextPage = ({ user, users, listings }: any) => {
  const [isCollection, setIsCollection] = useState(false);
  const [loading, setLoading] = useState(false);
  // const [listings, setListings] = useState<any>([]);
  const [loadingListings, setLoadingListings] = useState(false);
  const { authedProfile, setAuthedProfile } = useAuthedProfile();
  // console.log(listings);

  // const fetchlisting = async () => {
  //   if (typeof window.ethereum !== "undefined") {
  //     const provider = new ethers.providers.Web3Provider(
  //       window.ethereum as any
  //     );

  //     await window?.ethereum?.request({ method: "eth_requestAccounts" });
  //     const signer = provider.getSigner();

  //     const contract = new ethers.Contract(
  //       ContractAddress,
  //       ContractAbi,
  //       signer
  //     );

  //     const listingTx = await contract.fetchListingItem();
  //     // console.log(listingTx)
  //     const res = await fetchListings({ contract, listingTx });
  //     setListings(res);
  //     setLoadingListings(false);
  //     console.log(res);
  //   }
  //   //  setMenuItems(res);
  // };
  useEffect(() => {
    if (user) {
      setAuthedProfile(user);
    }
    // if (typeof window !== "undefined") {
    //   fetchlisting();
    // }
  }, [user]);

  return (
    <>
      {/* Content */}
      <div
        className={`flex w-screen overflow-hidden mt-24 max-w-[1600px] flex-col items-center content-center ${
          loading && `cursor-progress`
        }`}
      >
        <AnimatePresence>
          <div className="mb-5 w-full px-1 lg:px-0">
            {
              // If the listings are loading, show a loading skeleton
              loadingListings ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:mx-10 mb-10">
                  <NFTCardSkeleton />

                  <NFTCardSkeleton />

                  <NFTCardSkeleton />
                </div>
              ) : (
                // Otherwise, show the listings
                <>
                  <div className="flex font-ibmPlex text-xs mx-4 lg:mx-8 mb-5">
                    <button
                      onClick={() => setIsCollection(false)}
                      className={`${
                        !isCollection ? "border-b-white" : ""
                      }  mr-10 hover:border-b-white focus:border-b-white border-b border-b-transparent transition-all duration-200`}
                    >
                      ALL
                    </button>
                    <button
                      onClick={() => setIsCollection(true)}
                      className={`${
                        isCollection ? "border-b-white" : ""
                      } mr-10 hover:border-b-white focus:border-b-white border-b border-b-transparent transition-all duration-200`}
                    >
                      COLLECTIONS{" "}
                    </button>
                  </div>
                  {!isCollection ? (
                    <div className="grid grid-cols-1   sm:grid-cols-2 md:grid-cols-3 gap-10 md:mx-4 lg:mx-8 mb-10">
                      {listings?.map((listing: any, index: number) => (
                        <motion.div
                          key={index}
                          initial={{ y: 80, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          transition={{ delay: index * 0.1 + 0.4 }}
                          exit={{
                            opacity: 0,
                            y: 90,
                            transition: {
                              ease: "easeInOut",
                              delay: 1,
                            },
                          }}
                        >
                          <>
                            <NFTCard
                              key={index}
                              listing={listing}
                              setLoading={setLoading}
                              users={users}
                              index={index}
                            />
                          </>
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <CollectionMarketPage />
                  )}
                </>
              )
            }
          </div>
        </AnimatePresence>
      </div>
    </>
  );
};

export const getServerSideProps = async ({ req, res }: any) => {
  let auth = getCookie("auth", { req, res });

  await connectDB();
  const json = await Users.findOne({ address: auth });
  let user = JSON.parse(JSON.stringify(json));
  const jsonUsers = await Users.find({});
  let users = JSON.parse(JSON.stringify(jsonUsers));

  // NFT fetch
  const nftFetch = async () => {
    const provider = new ethers.providers.JsonRpcProvider(
      process.env.NEXT_APP_INFURA_ID
    );

    const contract = new ethers.Contract(
      ContractAddress,
      ContractAbi,
      provider
    );

    const listingTx = await contract.fetchListingItem();

    const res = await fetchListings({ contract, listingTx });
    // console.log(res);

    return res;
  };
  let listings = await nftFetch();

  return { props: { user, users, listings } };
};

export default Home;
