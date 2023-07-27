import React, { use, useEffect, useState } from "react";
import ButtonSpinner from "../LoadingSkeletons/ButtonSpinner";
import SingleNFT from "./SingleNFT";
import Collection from "./Collection";
import axios from "axios";
import MintModal from "./MintModal";
import { useAuthedProfile } from "../../context/UserContext";
import contractABI from "../../contracts/collectionContractABI";
import { contractBytecode } from "../../contracts/collectionContractBytecode";
import { ethers } from "ethers";
import router from "next/router";
import { submitToIpfs } from "../utils/utils";
import { ContractAbi, ContractAddress } from "../utils/constants";
import Web3 from "web3";

type Props = {
  user: any;
};

const MintComponent = ({ user }: Props) => {
  const [file, setFile] = useState(null);
  const [image, setImage] = useState<string>("");
  const [imageCollection, setImageCollection] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [loadingToDeploy, setLoadingToDeploy] = useState(false);
  const [isCollection, setIsCollection] = useState(false);
  const [collection, setCollection] = useState<any>(null);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const { setAuthedProfile } = useAuthedProfile();
  const authedProfile = user;
  const initialMintValues = {
    title: "",
    description: "",
    collectionId: 0,
    reservePrice: "",
  };
  const initialCollectionValues = {
    title: "",
    description: "",
    tokensymbol: "",
  };

  const [formValues, setFormValues] = useState(initialMintValues);
  const [formValuesCollection, setFormValuesCollection] = useState(
    initialCollectionValues
  );

  const handleChange = (e: any) => {
    const { value, name } = e.target;
    setFormValues({ ...formValues, [name]: value });
  };

  const handleChangeCollection = (e: any) => {
    const { value, name } = e.target;

    setFormValuesCollection({ ...formValuesCollection, [name]: value });
  };

  const handleImageChange = (e: any) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);

      setImage(url);
      setFile(file);
    }
  };
  const handleImageChangeCollection = (e: any) => {
    const file = e.target.files[0];

    if (file) {
      const url = URL.createObjectURL(file);

      setImageCollection(url);
      setFile(file);
    }
  };
  const handleMintType = () => {
    setIsCollection((prev) => !prev);
  };
  // Rehydrate the user's collection from server
  const refreshData = () => {
    router.replace(router.asPath);
  };

  // Minting NFT

  const mint = async () => {
    setLoading(true);
    let uploadUrl;
    let resolvedUrl;
    let imageUploadUrl;
    let contractAddress;
    let singleNFTData = {
      name: formValues.title,
      description: formValues.description,
      collectionId: collection?.id >= 0 ? collection.id : 0,
      image: file,
    };
    let collectionData = {
      collectionName: formValuesCollection.title,
      description: formValuesCollection.description,
      tokensymbol: formValuesCollection.tokensymbol,
      image: file,
    };
    let collectionImage = {
      file,
    };
    console.log(singleNFTData);

    // Deploy contract
    if (isCollection) {
      const tokenUrl = await submitToIpfs(collectionData);
      const provider = new ethers.providers.Web3Provider(
        (window as CustomWindow).ethereum as any
      );

      await (window as CustomWindow)?.ethereum?.request({
        method: "eth_requestAccounts",
      });
      const signer = provider.getSigner();

      const address = await signer.getAddress();

      try {
        setLoadingToDeploy(true);
        // Initialize the contract with the signer
        const contract = new ethers.Contract(
          ContractAddress,
          ContractAbi,
          signer
        );

        setLoading(false);
        // console.log(tokenUrl, collectionData.tokensymbol);

        const collectionCreatedTx = await contract.createCollection(
          tokenUrl,
          collectionData.tokensymbol
        );

        const collectionCreated = await collectionCreatedTx.wait();
        // console.log(collectionCreated);

        // Update user database
        setLoadingToDeploy(false);
      } catch (e) {
        console.log(e);
        alert("Something went wrong, please try again later.");
      }
    } else {
      // Mint NFT Contract
      const tokenUrl = await submitToIpfs(singleNFTData);
      const provider = new ethers.providers.Web3Provider(
        (window as CustomWindow).ethereum as any
      );

      await (window as CustomWindow)?.ethereum?.request({
        method: "eth_requestAccounts",
      });
      const signer = provider.getSigner();

      const address = await signer.getAddress();
      try {
        setLoadingToDeploy(true);
        // console.log(tokenUrl);

        // Initialize the contract with the signer
        const contract = new ethers.Contract(
          ContractAddress,
          ContractAbi,
          signer
        );

        setLoading(false);
        // console.log(singleNFTData.name, tokenUrl, formValues.reservePrice);

        // await contract.approveArtist(address);
        const approveTx = await contract.createListing(
          singleNFTData.collectionId,
          tokenUrl,
          Web3.utils.toWei(formValues.reservePrice, "ether")
        );
        // Wait for the transaction to be mined
        await approveTx.wait();

        // setLoading(false);
        isModalOpen();
      } catch (e) {
        console.log(e);

        alert("Something went wrong, please try again later.");
      }
    }
    setLoadingToDeploy(false);
    setLoading(false);
    setFormValues(initialMintValues);
    setFormValuesCollection(initialCollectionValues);
    setCollection("");
    setImage("");
    setImageCollection("");
    setFile(null);
  };

  // Modal
  const isModalOpen = () => {
    setModalOpen(true);
  };
  const isModalClosed = () => {
    setModalOpen(false);
  };
  console.log(formValues);

  return (
    <>
      <div className="flex w-screen  xl:max-w-[1600px] px-5 md:px-2 flex-col md:flex-row items-center md:items-start  mt-28  justify-center bg-black overflow-hidden">
        <div className="md:basis-1/2 mt-5 md:mt-0 md:p-2 w-full font-ibmPlex bold text-left md:m-4  text-sm ">
          <div className="font-bold">
            <p className="mb-4 ">Hello!</p>
            <p className="mb-4 ">
              We are really excited to list your artwork on our Web3
              marketplace.
            </p>
            <p className="mb-8 ">
              Please fill out all the information below so we can list your
              artwork in our marketplace!
            </p>
          </div>
          <div className="flex mb-4">
            <p className="uppercase mr-3">single image</p>
            <input
              value="SingleNFT"
              checked={!isCollection}
              onChange={handleMintType}
              className="mr-8 bg-green"
              type="radio"
            />
            <p className="uppercase mr-3">collection</p>
            <input
              value="Collection"
              checked={isCollection}
              onChange={handleMintType}
              className="mr-8 bg-green"
              type="radio"
            />
          </div>
          <p className="mb-4 text-[13px]">
            Please select if you would like us to list <br /> a singular image
            or a collection
          </p>
          <div className="hidden md:block">
            <button
              onClick={mint}
              type="submit"
              className="bg-blue text-green flex flex-col items-center mb-6 md:mb-0  border border-green w-full md:w-3/6 uppercase tracking-[10px] mt-1  bg-white bg-opacity-20 hover:bg-opacity-30 transition duration-300 ease-in-out font-semibold py-1 md:py-[1.2vh] md:px-[7vh] z-2 text-2xl md:text-xl  "
            >
              {loading ? (
                <>
                  <ButtonSpinner />
                  <p className="font-ibmPlex text-xs tracking-normal mt-1">
                    MetaMask will open to process your transaction
                  </p>
                </>
              ) : loadingToDeploy ? (
                <>
                  <ButtonSpinner />
                  <p className="font-ibmPlex text-xs tracking-normal mt-1">
                    Processing...
                  </p>
                </>
              ) : (
                <p className="font-compressed">Mint</p>
              )}
            </button>
            <p className="text-[10px] w-3/6">
              By pressing sumbit you agree to our terms and conditions laid out{" "}
              <button className="underline"> here </button>
            </p>
          </div>
        </div>
        <div className="md:basis-1/2 md:p-2 flex justify-center  md:items-start md:justify-end md:mx-4 w-full mt-8 md:mt-0">
          {!isCollection ? (
            <SingleNFT
              handleChange={handleChange}
              handleImageChange={handleImageChange}
              formValues={formValues}
              image={image}
              collections={authedProfile?.collections}
              collection={collection}
              setCollection={setCollection}
            />
          ) : (
            <Collection
              handleChangeCollection={handleChangeCollection}
              handleImageChangeCollection={handleImageChangeCollection}
              formValuesCollection={formValuesCollection}
              imageCollection={imageCollection}
            />
          )}
        </div>
        {/* Mobile */}
        <div className="w-full md:hidden my-6">
          <button
            onClick={mint}
            type="submit"
            className="bg-blue text-green font-compressed mb-6 md:mb-0  border border-green w-full md:w-3/6 uppercase tracking-[10px] mt-1  bg-white bg-opacity-20 hover:bg-opacity-30 transition duration-300 ease-in-out font-semibold py-1 md:py-[1.2vh] md:px-[7vh] z-2 text-2xl md:text-xl  "
          >
            {loading ? (
              <>
                <ButtonSpinner />
                <p className="font-ibmPlex text-xs tracking-normal mt-1">
                  MetaMask will open to process your transaction
                </p>
              </>
            ) : loadingToDeploy ? (
              <>
                <ButtonSpinner />
                <p className="font-ibmPlex text-xs tracking-normal mt-1">
                  Proccesing...
                </p>
              </>
            ) : (
              <p className="font-compressed">Mint</p>
            )}
          </button>
          <p className="text-[10px] text-left">
            By pressing sumbit you agree to our terms and conditions laid out{" "}
            <button className="underline"> here </button>
          </p>
        </div>
      </div>
      <MintModal isModalClosed={isModalClosed} modalOpen={modalOpen} />
    </>
  );
};

export default MintComponent;
