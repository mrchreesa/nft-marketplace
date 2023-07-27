import { useEffect, useState, FunctionComponent, use } from "react";
import Router from "next/router";
import Image from "next/image";
import { Interface } from "ethers/lib/utils";
import Link from "next/link";
import profile from "../assets/PROFILE.png";
import avatar from "../assets/avatar.gif";
import ribbon from "../assets/ribbon.png";
import send from "../assets/send.png";
import axios from "axios";
import { get } from "http";
import Countdown from "react-countdown";

type Props = {
  listing: object | any;
  setLoading: Function;
  users: object | any;
  index: number;
};
const NFTCard: FunctionComponent<Props> = ({
  listing,
  setLoading,
  users,
  index,
}) => {
  const [isListed, setIsListed] = useState(false);
  const [price, setPrice] = useState(0);

  const handleSaveToProfile = () => {
    setLoading(true);
    const data = {
      nft: listing,
      address: user.address, //remeber to change this to the normal address
    };
    axios
      .post("/api/saveNft", data)
      .then((res) => {
        console.log(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
    setLoading(false);
  };
  console.log(listing);
  let artistNameOrAddress;
  let artistProfilePic: any;
  let user: any;
  const getArtist = () => {
    user = users.find((user: any) => user.address === listing.seller);
    artistNameOrAddress = user
      ? user.username
      : listing.seller
          .slice(0, 3)
          .concat("...")
          .concat(listing.seller.slice(-4));
    artistProfilePic = user?.profilePicture ? user.profilePicture : avatar;
  };
  getArtist();

  // Countdown
  // Random component
  const Completionist = () => <span>Auction Ended</span>;
  const timeLeft = Number(listing.endTime);
  console.log(timeLeft);

  // Renderer callback with condition
  const renderer = ({ hours, minutes, seconds, completed }: any) => {
    if (completed) {
      // Render a complete state
      return <Completionist />;
    } else {
      // Render a countdown
      return (
        <span>
          Ends In <span className="mr-4" /> {hours}H {minutes}M {seconds}S
        </span>
      );
    }
  };
  return (
    <>
      {listing ? (
        <div className="flex flex-col h-full px-4 md:px-0 overflow-hidden justify-between ">
          <div className="flex flex-col h-full">
            {/* <div className="flex grow"></div> */}
            <div
              onClick={() => {
                Router.push({
                  pathname: `/listing/${listing.id}`,
                });
              }}
              className=" overflow-hidden h-full flex min-h-[370px] max-h-[450px]  xl:max-h-[580px] justify-center items-center mb-3"
            >
              <Image
                src={listing?.image}
                alt={listing?.title}
                width={400}
                height={400}
                className="w-full  object-cover cursor-pointer"
              />
            </div>

            <div className="flex flex-col font-ibmPlex mb-16 uppercase text-xs text-[#e4e8eb] ">
              <div className=" flex ">
                <div className="">
                  <p>{listing?.title}</p>
                </div>
                <div className="flex grow"></div>
                <div className=" flex text-left">
                  {" "}
                  <p className="pr-6 ">
                    Reserve <br /> Price
                  </p>
                  <p className="font-bold ">
                    {listing?.price} <br /> ETH
                  </p>
                </div>
              </div>

              <div className=" flex mt-3">
                BY @
                <div
                  onClick={() => {
                    Router.push({
                      pathname: `user/${user?._id}`,
                    });
                  }}
                  className="font-bold flex cursor-pointer"
                >
                  <p>{artistNameOrAddress}</p>
                  <Image
                    className="ml-3 -mt-1 h-6 cursor-pointer object-cover rounded-full"
                    src={artistProfilePic}
                    height={0}
                    width={25}
                    alt={""}
                  />
                </div>
                <div className="flex grow"></div>
                <div className=" flex text-left">
                  {" "}
                  <p className="pr-6 ">
                    Current <br /> Bid
                  </p>
                  <p className="font-bold text-green">
                    {listing.Bid} <br /> ETH
                  </p>
                </div>
              </div>
              <div className=" flex mt-3">
                <button
                  onClick={handleSaveToProfile}
                  className="font-bold flex"
                >
                  <Image
                    className=" h-5"
                    src={ribbon}
                    height={10}
                    width={20}
                    alt={""}
                  />
                </button>

                <div className="flex grow"></div>
                <div className=" flex font-bold text-green">
                  {listing.timeElapse ? (
                    <>
                      <p className="pr-5">Auction ended</p>
                    </>
                  ) : (
                    <>
                      {listing.endTime != 0 || listing.endTime != "" ? (
                        <Countdown
                          date={Date.now() + timeLeft * 1000}
                          renderer={renderer}
                        />
                      ) : (
                        <p className="pr-5"> place bid</p>
                      )}
                    </>
                  )}
                </div>
                <div className="flex grow"></div>

                <div className="font-bold flex">
                  <Image
                    className="ml-3 h-5"
                    src={send}
                    height={10}
                    width={20}
                    alt={""}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
};
export default NFTCard;
