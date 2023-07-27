import Image, { StaticImageData } from "next/image";
import React, { useEffect, useState } from "react";
import { useStorageUpload } from "@thirdweb-dev/react";
import banner from "../../assets/banner.png";
import profile from "../../assets/profile-2.png";
import avatar from "../../assets/avatar.gif";
import star from "../../assets/Star-PNG-Images.png";
import AvatarEditor from "react-avatar-editor";
import { useAuthedProfile } from "../../context/UserContext";
import nft1 from "../../assets/nft-1.jpeg";
import nft2 from "../../assets/nft-2.jpeg";
import Link from "next/link";
import axios from "axios";
import Username from "./Username";
import Bio from "./Bio";
import Router from "next/router";
import router from "next/router";
import AdminLoginButton from "./AdminLoginButton";
import Banner from "./Banner";
import { ethers } from "ethers";
import { ContractAbi, ContractAddress } from "../utils/constants";

type Props = {
  cropperOpen: boolean;
  img: any;
  croppedImg: string | StaticImageData;
};

const ProfileComponent = ({
  authedProfile,
  collectedNfts,
  listedNfts,
  soldNfts,
}: any) => {
  const [loading, setLoading] = React.useState<boolean>(false);
  const [editor, setEditor] = React.useState<any>(null);

  const { setAuthedProfile } = useAuthedProfile();
  let { isArtist } = authedProfile;

  console.log(authedProfile);

  const [picture, setPicture] = useState<Props>({
    cropperOpen: false,
    img: null,
    croppedImg: profile,
  });
  const [bannerPicture, setBannerPicture] = useState<Props>({
    cropperOpen: false,
    img: null,
    croppedImg: banner,
  });
  const [file, setFile] = useState(null);

  const { mutateAsync: upload } = useStorageUpload();

  const handleCancel = () => {
    setPicture({
      ...picture,
      cropperOpen: false,
    });
  };
  const setEditorRef = (editor: any) => setEditor(editor);

  // Rehydrate data from server
  const refreshData = () => {
    router.replace(router.asPath);
  };

  const uploadToIpfs = async (image: any) => {
    setLoading(true);
    if (image == picture) {
      const uploadUrl = await upload({
        data: [file],
        options: { uploadWithGatewayUrl: true, uploadWithoutDirectory: true },
      });

      if (uploadUrl) {
        axios
          .post("/api/updateProfile", {
            address: authedProfile.address,
            imgUrl: uploadUrl[0],
          })
          .then((response) => {
            setAuthedProfile(response.data);
            refreshData();
          })
          .catch((err: any) => {
            console.log(err);
          })
          .finally(() => setLoading(false));
      }
    } else if (image == bannerPicture) {
      const bannerUploadUrl = await upload({
        data: [file],
        options: { uploadWithGatewayUrl: true, uploadWithoutDirectory: true },
      });

      if (bannerUploadUrl) {
        axios
          .post("/api/updateProfile", {
            address: authedProfile.address,
            bannerImgUrl: bannerUploadUrl[0],
          })
          .then((response) => {
            setAuthedProfile(response.data);
            refreshData();
          })
          .catch((err: any) => {
            console.log(err);
          })
          .finally(() => setLoading(false));
      }
    }
  };

  const handleSave = (e: any) => {
    const croppedImg = picture.img;

    setPicture({
      ...picture,
      img: null,
      cropperOpen: false,
      croppedImg: croppedImg,
    });

    uploadToIpfs(picture);
  };

  const handleFileChange = (e: any) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);

      setPicture({
        ...picture,
        img: url,
      });
      setFile(file);
    }
  };
  const handleOpenCropper = () => {
    setPicture({
      ...picture,

      cropperOpen: true,
    });
  };

  const accept = async () => {
    // try {
    //   // bidAmount // The offer amount the user entered
    //   if (typeof window !== "undefined") {
    //     const provider = new ethers.providers.Web3Provider(
    //       (window as CustomWindow).ethereum as any
    //     );
    //     await (window as CustomWindow)?.ethereum?.request({
    //       method: "eth_requestAccounts",
    //     });
    //     const signer = provider.getSigner();
    //     const contract = new ethers.Contract(
    //       ContractAddress,
    //       ContractAbi,
    //       signer
    //     );
    //     const id = Number(1);
    //     // Call the contract method with value
    //     const listingTx = await contract.acceptOffer(1, authedProfile.address);
    //     // isModalClosed();
    //     console.log(listingTx);
    //   }
    // } catch (error) {
    //   console.error(error);
    //   alert(error);
    // }
  };

  return (
    <div
      className={`flex flex-col w-full max-w-[1590px]  px-4 md:px-3 lg:px-6 mt-20 md:mt-24  bg-black overflow-hidden ${
        loading && `cursor-progress`
      }`}
    >
      <div className="flex flex-col w-full overflow-hidden font-ibmPlex ">
        <Banner
          authedProfile={authedProfile}
          setBannerPicture={setBannerPicture}
          bannerPicture={bannerPicture}
          handleFileChange={handleFileChange}
          setEditor={setEditor}
          setFile={setFile}
          uploadToIpfs={uploadToIpfs}
        />
        <div className="flex w-full -mt-4">
          <label
            className="cursor-pointer"
            htmlFor="input-profile"
            onClick={handleOpenCropper}
          >
            <Image
              className="border border-green rounded-full hover:brightness-125 bg-black z-10 object-center object-cover aspect-square"
              src={
                authedProfile
                  ? authedProfile?.profilePicture !== ""
                    ? authedProfile?.profilePicture
                    : avatar
                  : avatar
              }
              width={70}
              height={70}
              alt="profile"
            />
          </label>
          {isArtist ? (
            <>
              <Image
                className="ml-4 mb-1 h-5 self-center"
                src={star}
                width={20}
                height={10}
                alt="star"
              />
              <p className="text-xs pl-1 font-bold tracking-wider self-center">
                ARTIST
              </p>{" "}
            </>
          ) : null}
        </div>
        <div className="w-fit border border-green flex flex-col align-center">
          {picture.cropperOpen && (
            <div className="flex flex-col items-center">
              <input
                id="input-profile"
                className="text-xs hidden"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
              />
              {picture.img && (
                <>
                  <AvatarEditor
                    ref={setEditorRef}
                    image={picture.img}
                    width={200}
                    height={200}
                    border={50}
                    borderRadius={100}
                    color={[1, 1, 1, 0.5]} // RGBA
                    rotate={0}
                    scale={1}
                  />

                  <div className="flex w-full justify-around">
                    <button
                      className=" text-green font-compressed uppercase border border-green tracking-[6px] w-[40%] my-2 bg-white bg-opacity-20 hover:bg-opacity-40 font-semibold "
                      onClick={handleSave}
                    >
                      Save
                    </button>
                    <button
                      className=" text-green font-xxCompressed uppercase border border-green tracking-[6px] w-[40%] my-2 bg-white bg-opacity-20 hover:bg-opacity-40 font-semibold "
                      onClick={handleCancel}
                    >
                      Cancel
                    </button>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
        <div className="flex flex-col w-full mt-4 text-left text-xs">
          {/* Username */}
          <Username
            authedProfile={authedProfile}
            loading={loading}
            setLoading={setLoading}
          />
          <Bio
            authedProfile={authedProfile}
            loading={loading}
            setLoading={setLoading}
          />
        </div>
        {authedProfile?.admin ? (
          <AdminLoginButton authedProfile={authedProfile} />
        ) : null}
        {isArtist ? ( // if artist
          <div className="flex  flex-col-reverse md:flex-col">
            <div className="flex md:mt-5 h-full flex-wrap">
              <div className="flex flex-col mr-10 w-16">
                <h1 className="text-green font-xxCompressed -mb-2 text-8xl  lg:text-9xl text-center">
                  {listedNfts?.length}
                </h1>
                <p className="text-xs">
                  TOTAL
                  <br /> LISTED
                </p>
              </div>
              <div className="flex flex-col mr-10 w-16">
                <h1 className="text-green font-xxCompressed -mb-2 text-8xl lg:text-9xl text-center">
                  0
                </h1>
                <p className="text-xs">
                  TOTAL
                  <br /> SOLD
                </p>
              </div>
              <div className="flex grow md:hidden"></div>

              <div className="flex flex-col items-end md:items-center mr-2 md:mr-10 w-16">
                <h1 className="text-green font-xxCompressed -mb-2 text-8xl lg:text-9xl text-center">
                  0.0
                </h1>
                <p className="text-xs">
                  PROFIT
                  <br /> IN ETH
                </p>
              </div>
              <div className="basis-full h-0"></div>
              <div className="flex flex-col mr-10 w-16">
                <h1 className="text-green font-xxCompressed -mb-2 text-8xl lg:text-9xl text-center">
                  {collectedNfts?.length}
                </h1>

                <p className="text-xs">
                  TOTAL
                  <br /> COLLECTED
                </p>
              </div>
              <div className="flex flex-col mr-10 w-16">
                <h1 className="text-green font-xxCompressed -mb-2 text-8xl lg:text-9xl text-center">
                  0
                </h1>
                <p className="text-xs">
                  TOTAL
                  <br /> FLIPPED
                </p>
              </div>
              <div className="flex grow md:hidden"></div>
              <div className="flex flex-col mr-2 md:mr-10 w-16 items-end md:items-center">
                <h1 className="text-green font-xxCompressed -mb-2 text-8xl lg:text-9xl text-center">
                  0.0
                </h1>
                <p className="text-xs">
                  P/L
                  <br /> IN ETH
                </p>
              </div>
            </div>
            <div className="flex overflow-hidden md:w-[60%]">
              <Link
                href="/profile/mint"
                className=" text-green font-xCompressed w-full  font-bold border border-green tracking-[10px] md:tracking-[12px] lg:w-[40%] mt-8 mb-5 md:my-10 bg-white bg-opacity-20 hover:bg-opacity-40 py-1 lg:py-[1.2vh] text-2xl  "
              >
                LIST NEW
              </Link>
            </div>{" "}
          </div>
        ) : null}
        <div className="flex flex-col font-ibmPlex mt-10 md:mt-4 text-left">
          {isArtist ? (
            <>
              <h3 className="font-bold">LISTED</h3>
              <div className="grid grid-cols-2 lg:grid-cols-4  items-stretch gap-10 md:gap-4 mb-10 mt-4">
                {/* Listed  */}
                {listedNfts.length ? (
                  listedNfts.map(
                    (nft: any, index: React.Key | null | undefined) => (
                      <div
                        className="flex md: flex-col h-full items-start w-max "
                        key={index}
                      >
                        <div
                          className="cursor-pointer"
                          onClick={() => {
                            Router.push({
                              pathname: `/listing/${nft.id}`,
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
                                Reserve NOt
                                <br /> met
                              </p>
                              <div className="flex grow"></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  )
                ) : (
                  <p className="text-red-600 text-xs">
                    You currently have no listed items
                  </p>
                )}
              </div>
              {/* SOLD */}
              <div className="flex flex-col">
                <h3 className="font-bold">SOLD</h3>

                <div className="grid grid-cols-2 lg:grid-cols-4 items-stretch gap-4 mb-10 mt-4">
                  {/* nft 1 */}
                  {soldNfts.length ? (
                    soldNfts?.map(
                      (nft: any, index: React.Key | null | undefined) => (
                        <div
                          className="grid grid-cols-2 lg:grid-cols-4 items-stretch gap-4 mb-10 mt-4"
                          key={index}
                        >
                          <div className="flex  flex-col h-full items-start w-auto ">
                            <div
                              className="cursor-pointer"
                              // onClick={() => {
                              //   Router.push({
                              //     pathname: `/user/${router.query.slug}/${nft.id}`,
                              //   });
                              // }}
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
                                    Sold <br /> For
                                  </p>
                                  <div className="flex grow"></div>
                                  <p className="font-bold text-green">
                                    {nft.price} <br /> ETH
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )
                    )
                  ) : (
                    <p className="text-red-600 text-xs">
                      You currently have no saved items
                    </p>
                  )}
                </div>
              </div>
              {/* COLLECTION */}
              <div className="flex flex-col">
                <h3 className="font-bold">COLLECTION</h3>

                <div className="grid grid-cols-2 lg:grid-cols-4 items-stretch gap-4 mb-10 mt-4">
                  {/* nft 1 */}
                  {collectedNfts.length ? (
                    collectedNfts.map(
                      (nft: any, index: React.Key | null | undefined) => (
                        <div
                          className="grid grid-cols-2 lg:grid-cols-4 items-stretch gap-4 mb-10 mt-4"
                          key={index}
                        >
                          <div className="flex  flex-col h-full items-start w-auto ">
                            <div
                              className="cursor-pointer"
                              // onClick={() => {
                              //   Router.push({
                              //     pathname: `/user/${router.query.slug}/${nft.id}`,
                              //   });
                              // }}
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
                              <button onClick={accept}>Accept Offer</button>
                            </div>
                          </div>
                        </div>
                      )
                    )
                  ) : (
                    <p className="text-red-600 text-xs">
                      You currently have no collected items
                    </p>
                  )}
                </div>
              </div>
            </>
          ) : null}
          {/* SAVED */}

          <div className="flex flex-col">
            <h3 className="font-bold">SAVED</h3>

            <div className="grid grid-cols-2 lg:grid-cols-4 items-stretch gap-4 mb-10 mt-4">
              {authedProfile?.savedNfts.length ? (
                authedProfile?.savedNfts.map((nft: any) => (
                  <div
                    key={nft.id}
                    className="flex  flex-col h-full items-start w-max "
                  >
                    <div
                      onClick={() => {
                        Router.push({
                          pathname: `/listing/${nft.id}`,
                        });
                      }}
                      className="cursor-pointer"
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
                            Reserve <br /> Price
                          </p>
                          <div className="flex grow"></div>
                          <p className="font-bold ">
                            1.1 <br /> ETH
                          </p>
                        </div>
                      </div>

                      <div className=" flex mt-3  ">
                        <div className=" flex w-full">
                          {" "}
                          <p className="pr-6  ">
                            Current <br /> Bid
                          </p>
                          <div className="flex grow"></div>
                          <p className="font-bold text-green">
                            2.5 <br /> ETH
                          </p>
                        </div>
                      </div>
                      <div className=" flex mt-3">
                        <div className="flex grow"></div>
                        <div className=" flex font-bold text-green">
                          {" "}
                          <p className="pr-5">ENDS IN</p> <p> 10H 22M 09S</p>
                        </div>
                        <div className="flex grow"></div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-red-600 text-xs">
                  You currently have no saved items
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileComponent;
