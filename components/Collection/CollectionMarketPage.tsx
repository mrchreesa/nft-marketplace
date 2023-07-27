import React,{useState,useEffect} from "react";
import { motion, AnimatePresence } from "framer-motion";
import CollectionCard from "./CollectionCard";
import { collectionContractAddress } from "../../addresses";
import {ethers} from "ethers"
import { ContractAbi, ContractAddress } from "../utils/constants";
import { fetchcontractListings } from "../utils/utils";
type Props = {};


const CollectionMarketPage = (props: Props) => {
  const [listings,setListings] = useState<any>([]);
  // const { contract } = useContract(collectionContractAddress);
  const fetchlisting = async ( ) =>{
    const provider = new ethers.providers.Web3Provider(
       (window as CustomWindow).ethereum as any
    );

    await  (window as CustomWindow)?.ethereum?.request({ method: "eth_requestAccounts" });
    const signer = provider.getSigner();

    const contract = new ethers.Contract(ContractAddress, ContractAbi, signer);
      
    const collectionTx = await contract.fetchMyCollections();
    console.log(collectionTx)
   const res = await fetchcontractListings(collectionTx);
   setListings(res);
  }
  useEffect(() => {
    if(typeof window !== "undefined"){
      fetchlisting();
    }
  }, []);
  // const listings = [
  //   {
  //     metadata: {
  //       name: "Summer",
  //       description: "Summer",
  //       image:
  //         "https://ipfs-2.thirdwebcdn.com/ipfs/QmUa1iYsovhEPscsx79zWNK9bH7GBH61H2rbhpv9zKeHNC/collection1.png",
  //       external_url: "",
  //       background_color: "",
  //     },
  //     assetContractAddress: "0x8a4b29d9921C5Da3C737e63a6B334C4867BfF31E",
  //     currencyContractAddress: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
  //     id: "0",

  //     sellerAddress: "0x2E1b9630fB5b099625d45d8f7f4B382e49393394",

  //     type: 0,
  //   },
  // ];

  return (
    <AnimatePresence>
      <div className="grid grid-cols-1   sm:grid-cols-2 md:grid-cols-3 gap-10 md:mx-4 lg:mx-8 mb-10">
        {listings?.map((listing : any, index : any) => (
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
              <CollectionCard key={index} listing={listing} />
            </>
          </motion.div>
        ))}
      </div>
    </AnimatePresence>
  );
};

export default CollectionMarketPage;
