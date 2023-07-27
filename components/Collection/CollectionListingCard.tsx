import Router from "next/router";
import React from "react";
import profile from "../../assets/PROFILE.png";
import Image from "next/image";

type Props = {
  listing: any;
  isModalOpen: () => void;
  isModalOpenEnlargeNFT: () => void;
  setBidListing: (listing: any) => void;
};

const CollectionListingCard = ({
  listing,
  isModalOpen,
  isModalOpenEnlargeNFT,
  setBidListing,
}: Props) => {
  return (
    <div className="flex flex-col h-full px-4 md:px-0 overflow-hidden justify-between">
      <div className="flex flex-col h-full">
        <Image
          src={listing?.image as string}
          alt={listing?.title as string}
          width={400}
          height={600}
          className="w-full mb-2 object-contain cursor-pointer"
          // onClick={isModalOpenEnlargeNFT}
          onClick={() => {
            Router.push({
              pathname: `/listing/${listing.id}`,
            });
          }}
        />{" "}
        <div className="flex flex-col font-ibmPlex mb-6 uppercase text-xs text-[#e4e8eb] ">
          <div className=" flex ">
            <div className="">
              <p>{listing?.title}</p>
            </div>
            <div className="flex grow"></div>
            <div className=" flex text-left">
              {" "}
              <p className="pr-3 ">
                Reserve <br /> Price
              </p>
              <p className="font-bold text-green w-[22px]">
                {listing.price}
                <br /> ETH
              </p>
            </div>
          </div>

          <div className=" flex mt-3">
            <div
              onClick={() => {
                Router.push({
                  pathname: `/user/1`,
                });
              }}
              className="font-bold flex cursor-pointer"
            >
              <p>
                BY @{" "}
                {listing.seller
                  .slice(0, 3)
                  .concat("...")
                  .concat(listing.seller.slice(-4))}
              </p>
              <Image
                className="ml-3 h-5"
                src={profile}
                height={10}
                width={20}
                alt={""}
              />
            </div>

            <div className="flex grow"></div>
            <div className=" flex text-left">
              {" "}
              <p className="pr-3 ">
                Current <br /> Bid
              </p>
              <p className="font-bold w-[22px]">{listing.Bid}</p>
            </div>
          </div>
          <div className=" flex mt-3">
            <div className="flex grow"></div>
            <div className=" flex font-bold text-green">
              {" "}
              {listing.timeElapse ? (
                <>
                  <p className="pr-5">ENDS IN</p> <p> {listing?.time}</p>
                </>
              ) : (
                <p className="pr-5">
                  {listing.endTime != 0 ? listing.endTime : "reserve not met"}
                </p>
              )}
            </div>
            <div className="flex grow"></div>
          </div>
        </div>
      </div>
      <div className="font-ibmPlex w-full md:min-w-1 flex items-center justify-between">
        <button
          className=" text-green font-xCompressed  w-full border border-green uppercase tracking-[8px] py-1 bg-white bg-opacity-20 hover:bg-opacity-30 font-semibold text-xl  "
          onClick={() => {
            isModalOpen();
            setBidListing(listing);
          }}
        >
          PLACE BID
        </button>
      </div>
    </div>
  );
};

export default CollectionListingCard;
