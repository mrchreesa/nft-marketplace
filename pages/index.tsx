import type { NextPage } from "next";
import Link from "next/link";
import {
  MediaRenderer,
  useActiveListings,
  useContract,
  useAddress,
} from "@thirdweb-dev/react";
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

const Home: NextPage = ({ user }: any) => {
  const [isCollection, setIsCollection] = useState(false);
  const [loading, setLoading] = useState(false);
  const { contract: marketplace } = useContract(
    marketplaceContractAddress,
    "marketplace"
  );
  const { data: listings, isLoading: loadingListings } =
    useActiveListings(marketplace);
  const { authedProfile, setAuthedProfile } = useAuthedProfile();

  // useEffect(() => {
  //   if (user) {
  //     setAuthedProfile(user);
  //   }
  // }, [user]);

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
                      {listings?.map((listing, index) => (
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

  return { props: { user } };
};

export default Home;
