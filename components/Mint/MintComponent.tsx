import React, { use, useEffect, useState } from "react";
import ButtonSpinner from "../LoadingSkeletons/ButtonSpinner";
import { ThirdwebStorage } from "@thirdweb-dev/storage";
import {
  useStorageUpload,
  useNFTBalance,
  useContract,
  useTotalCount,
  useAddress,
  useOwnedNFTs,
} from "@thirdweb-dev/react";
import SingleNFT from "./SingleNFT";
import Collection from "./Collection";
import axios from "axios";
import { Alchemy, Network } from "alchemy-sdk";
import MintModal from "./MintModal";
import { useAuthedProfile } from "../../context/UserContext";
import contractABI from "../../contracts/collectionContractABI";
import { contractBytecode } from "../../contracts/collectionContractBytecode";
import { ethers } from "ethers";


type Props = {};

const MintComponent = (props: Props) => {
  const [file, setFile] = useState(null);
  const [image, setImage] = useState<string>("");
  const [imageCollection, setImageCollection] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [isCollection, setIsCollection] = useState(false);
  const [collection, setCollection] = useState<any>(null);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const { authedProfile, setAuthedProfile } = useAuthedProfile();

  const initialMintValues = {
    title: "",
    description: "",
    reservePrice: "",
  };
  const initialCollectionValues = {
    title: "",
    description: "",
    token: "",
  };

  const [formValues, setFormValues] = useState(initialMintValues);
  const [formValuesCollection, setFormValuesCollection] = useState(
    initialCollectionValues
  );

  const address = useAddress();
  // Change the testnet to mainnet when ready
  // const baseURL = `https://eth-goerli.g.alchemy.com/v2/ORQVzR0fGO4AXjBvx-DUPmKFGWvkgiya/getNFTs`;

  const storage = new ThirdwebStorage();
  // const { mutateAsync: upload } = useStorageUpload();

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
      collectionContract: collection?.contractAddress,
      image: file,
    };
    let collectionData = {
      collectionName: formValuesCollection.title,
      description: formValuesCollection.description,
      token: formValuesCollection.token,
    };
    let collectionImage = {
      file,
    };
    //Upload to IPFS
    {
      if (!isCollection) {
        // Upload single NFT IPFS
        try {
          (uploadUrl = await storage.upload(singleNFTData)),
            (resolvedUrl = await storage.resolveScheme(uploadUrl));
        } catch (e) {
          console.log(e);
          alert("Something went wrong, please try again later.");
        }
      } else {
        // Upload collection IPFS
        try {
          (uploadUrl = await storage.upload(collectionData)),
            (resolvedUrl = await storage.resolveScheme(uploadUrl)),
            (imageUploadUrl = await storage.upload(collectionImage));
          // isModalOpen();
        } catch (e) {
          console.log(e);
          alert("Something went wrong, please try again later.");
        }
      }
      // Deploy contract
      if (isCollection) {
        const provider = new ethers.providers.Web3Provider(
          window.ethereum as any
        );

        await window?.ethereum?.request({ method: "eth_requestAccounts" });
        const signer = provider.getSigner();
        // Deploy the new contract
        const factory = new ethers.ContractFactory(
          contractABI,
          contractBytecode,
          signer
        );
        const contract = await factory.deploy(
          formValuesCollection.title,
          formValuesCollection.token
        );
        await contract.deployed();
        contractAddress = contract.address;
      } else {
        // Mint NFT Contract
        const provider = new ethers.providers.Web3Provider(
          window.ethereum as any
        );
        await window?.ethereum?.request({ method: "eth_requestAccounts" });
        const signer = provider.getSigner();
        const currentContract = new ethers.Contract(
          collection?.contractAddress,
          contractABI,
          signer
        );
        const tx = await currentContract.mintNFT(uploadUrl);
        await tx.wait();
    setLoading(false);
    alert(`IPFS Link: ${uploadUrl}`);
      }

      // Update user database
      axios
        .post("/api/addCollection", {
          collectionName: formValuesCollection.title,
          contractAddress,
          collectionLogo: imageUploadUrl,
          address,
        })
        .then((res) => {
          console.log(res.data);
          setAuthedProfile(res.data);
        })
        .catch((err) => {
          console.log(err);
        });
    }

    setLoading(false);
    setFormValues(initialMintValues);
    setFormValuesCollection(initialCollectionValues);
    setCollection("");
    setImage("");
    setImageCollection("");
    setFile(null);

    console.log(uploadUrl);
  };

  // Modal
  const isModalOpen = () => {
    setModalOpen(true);
  };
  const isModalClosed = () => {
    setModalOpen(false);
  };

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
              className="bg-blue text-green flex flex-col items-center font-compressed mb-6 md:mb-0  border border-green w-full md:w-3/6 uppercase tracking-[10px] mt-1  bg-white bg-opacity-20 hover:bg-opacity-30 transition duration-300 ease-in-out font-semibold py-1 md:py-[1.2vh] md:px-[7vh] z-2 text-2xl md:text-xl  "
            >
              {loading ? <ButtonSpinner /> : "Mint"}
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
            type="submit"
            className="bg-blue text-green font-compressed mb-6 md:mb-0  border border-green w-full md:w-3/6 uppercase tracking-[10px] mt-1  bg-white bg-opacity-20 hover:bg-opacity-30 transition duration-300 ease-in-out font-semibold py-1 md:py-[1.2vh] md:px-[7vh] z-2 text-2xl md:text-xl  "
          >
            {loading ? <ButtonSpinner /> : "Mint"}
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
