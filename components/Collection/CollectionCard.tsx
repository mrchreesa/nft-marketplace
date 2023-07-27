import { useEffect, useState, FunctionComponent } from "react";
import Router from "next/router";
import Image from "next/image";
import { Interface } from "ethers/lib/utils";
import Link from "next/link";
import profile from "../../assets/PROFILE.png";
import ribbon from "../../assets/ribbon.png";
import send from "../../assets/send.png";

type Props = {
  listing: any;
};
const CollectionCard: FunctionComponent<Props> = ({ listing }) => {
  const [isListed, setIsListed] = useState(false);
  const [price, setPrice] = useState(0);

  // useEffect(() => {
  //   const listing = listings.find(
  //     (listing: any) => listing.asset.id === nftItem.id
  //   );
  //   if (Boolean(listing)) {
  //     setIsListed(true);
  //     setPrice(listing.buyoutCurrencyValuePerToken.displayValue);
  //   }
  // }, [listings, nftItem]);

  return (
    <>
      {listing ? (
        <div className="flex flex-col h-full px-4 md:px-0 overflow-hidden justify-between">
          <div className="flex flex-col h-full">
            {/* <div className="flex grow"></div> */}
            <div
              onClick={() => {
                Router.push({
                  pathname: `/collection/${listing.id}`,
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
                  {/* <p>{listing?.description}</p> */}
                </div>
                <div className="flex grow"></div>
                <div className=" flex text-left">
                  {" "}
                  {/* <p className="pr-[1.25rem]">
                  Token <br /> symbol
                  </p>
                  <p className="font-bold text-green">
                  {listing?.Tokensymbol}
                  </p> */}
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
                  <p>BY @
                  {listing.creator
                      .slice(0, 3)
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

                <div className="flex grow"></div>
                <div className=" flex text-left">
                  {" "}
                  <p className="pr-[1.25rem]">
                  Token <br /> symbol
                  </p>
                  <p className="font-bold text-green">
                  {listing?.Tokensymbol}
                  </p>
                </div>
              </div>
              <div className=" flex mt-3">
                <div className="font-bold flex">
                  <Image
                    className=" h-5"
                    src={ribbon}
                    height={10}
                    width={20}
                    alt={""}
                  />
                </div>

                <div className="flex grow"></div>
                <div className=" flex font-bold text-green">
                  {" "}
                  {/* <p className="pr-5">ENDS IN</p> <p> 10H 22M 09S</p> */}
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
export default CollectionCard;
