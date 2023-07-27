import React, { FunctionComponent } from "react";
import Modal from "react-modal";
import Image from "next/image";

type Props = {
  modalOpenEnlargeNFT: boolean;
  isModalClosedEnlargeNFT: () => void;
  listing: object | any;
};

const EnlargeNFTModal: FunctionComponent<Props> = ({
  modalOpenEnlargeNFT,
  isModalClosedEnlargeNFT,
  listing,
}) => {
  const customStyles = {
    overlay: {
      backgroundColor: "rgb(25, 25, 25, 0.85)",
    },
    content: {
      zIndex: "20",
      top: "50%",
      left: "50%",
      border: "none",
      right: "auto",
      bottom: "auto",
      display: "flex",
      justifyContent: "center",
      backgroundColor: "black",
      marginRight: "-50%",
      borderRadius: "10px",
      transform: "translate(-50%, -50%)",
    },
  };
  return (
    <div>
      {" "}
      <Modal
        style={customStyles}
        isOpen={modalOpenEnlargeNFT}
        onRequestClose={isModalClosedEnlargeNFT}
        ariaHideApp={false}
      >
        <>
          {listing ? (
            <div className="relative flex max-h-[95vh] pt-4 flex-col z-12 text-ibmPlex h-full w-full   mx-5 overflow-hidden justify-between">
              <button
                onClick={isModalClosedEnlargeNFT}
                className="fixed right-4 top-2 p-3 font-ibmPlex"
              >
                <div className="w-5 border absolute rotate-45"></div>
                <div className="w-5 border absolute -rotate-45"></div>
              </button>

              <div className="flex flex-col h-full">
                {listing ? (
                  <div className=" overflow-hidden h-full flex justify-center items-center mb-3">
                    <Image
                      src={listing?.image}
                      alt={listing?.title}
                      width={400}
                      height={600}
                      className="w-max h-full min-h-[250px] object-contain"
                    />
                  </div>
                ) : (
                  <div className=" overflow-hidden h-full flex justify-center items-center mb-3">
                    <div className="relative w-24 h-24 animate-spin rounded-full bg-gradient-to-r from-black via-blue-500 to-green ">
                      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-20 h-20 bg-black rounded-full "></div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : null}
        </>
      </Modal>
    </div>
  );
};

export default EnlargeNFTModal;
