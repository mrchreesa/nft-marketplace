import React from "react";
import Image from "next/image";
import AvatarEditor from "react-avatar-editor";
import banner from "../../assets/banner.png";

type Props = {
  authedProfile: any;
  setBannerPicture: React.Dispatch<React.SetStateAction<any>>;
  bannerPicture: any;
  setFile: React.Dispatch<React.SetStateAction<any>>;
  uploadToIpfs: (bannerPicture: any) => void;
  setEditor: React.Dispatch<React.SetStateAction<any>>;
  handleFileChange: (e: any) => void;
};

const Banner = ({
  authedProfile,
  setBannerPicture,
  setEditor,
  bannerPicture,
  uploadToIpfs,
  setFile,
}: Props) => {
  // Banner image upload
  const handleCancelBanner = () => {
    setBannerPicture({
      ...bannerPicture,
      img: null,
      cropperOpen: false,
    });
  };
  const setEditorRefBanner = (editor: any) => setEditor(editor);

  const handleSaveBanner = () => {
    const croppedImg = bannerPicture.img;
    setBannerPicture({
      ...bannerPicture,
      img: null,
      cropperOpen: false,
      croppedImg: croppedImg,
    });

    uploadToIpfs(bannerPicture);
  };

  const handleFileChangeBanner = (e: any) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      console.log(url);
      setBannerPicture({
        ...bannerPicture,
        img: url,
      });
      setFile(file);
    }
  };
  const handleOpenCropperBanner = () => {
    setBannerPicture({
      ...bannerPicture,
      cropperOpen: true,
    });
  };
  // console.log(authedProfile.bannerPicture);

  return (
    <>
      <label
        className="cursor-pointer"
        htmlFor="input-banner"
        onClick={handleOpenCropperBanner}
      >
        <Image
          src={
            authedProfile.bannerPicture == ""
              ? banner
              : authedProfile?.bannerPicture
          }
          width={1600}
          height={200}
          alt="banner"
          className="h-[12vh] md:h-[14vh]  object-cover  overflow-hidden z-0 border border-transparent hover:border-green"
        />
        <input
          id="input-banner"
          className="text-xs hidden"
          type="file"
          accept="image/*"
          onChange={handleFileChangeBanner}
        />
      </label>
      <div className="w-fit border border-green overflow-hidden flex flex-col align-center">
        {bannerPicture.cropperOpen && (
          <div className="flex flex-col items-center">
            {/* <input
                className="text-xs"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
              /> */}
            {bannerPicture.img && (
              <>
                <AvatarEditor
                  className="w-screen"
                  ref={setEditorRefBanner}
                  image={bannerPicture.img}
                  width={300}
                  height={50}
                  border={50}
                  color={[1, 1, 1, 0.5]} // RGBA
                  rotate={0}
                  scale={1}
                />

                <div className="flex w-full justify-around">
                  <button
                    className=" text-green font-compressed uppercase border border-green tracking-[6px] w-[40%] my-2 bg-white bg-opacity-20 hover:bg-opacity-40 font-semibold "
                    onClick={handleSaveBanner}
                  >
                    Save
                  </button>
                  <button
                    className=" text-green font-xxCompressed uppercase border border-green tracking-[6px] w-[40%] my-2 bg-white bg-opacity-20 hover:bg-opacity-40 font-semibold "
                    onClick={handleCancelBanner}
                  >
                    Cancel
                  </button>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default Banner;
