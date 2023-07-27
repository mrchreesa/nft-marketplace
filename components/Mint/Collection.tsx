import React from "react";

type Props = {
  formValuesCollection: any;
  imageCollection: string;
  handleImageChangeCollection: any;
  handleChangeCollection: any;
};

const Collection = ({
  imageCollection,
  formValuesCollection,
  handleImageChangeCollection,
  handleChangeCollection,
}: Props) => {
  return (
    <div className="flex flex-col items-center justify-center w-full md:w-3/4 ">
      <input
        id="title1"
        placeholder="Collection Title"
        type="text"
        name="title"
        value={formValuesCollection.title}
        onChange={handleChangeCollection}
        className="w-full h-16 mt-3 placeholder:text-sm border-green border pl-5 cursor-pointer font-ibmPlex text-green  dark:bg-neutral-800 focus:bg-neutral-700 focus:outline-none transition duration-300 ease-in-out"
      />

      <textarea
        id="description1"
        name="description"
        placeholder="Collection Description"
        // type="text"
        value={formValuesCollection.description}
        onChange={handleChangeCollection}
        className="w-full h-20 mt-3 mb-3 placeholder:text-sm border-green border pl-5 pt-2 cursor-pointer font-ibmPlex text-green  dark:bg-neutral-800  focus:bg-neutral-700 focus:outline-none transition duration-300 ease-in-out"
      />
      <p className="text-left text-sm w-full pl-5 mb-1 text-neutral-400 font-ibmPlex">
        Logo Image
      </p>
      <label
        htmlFor="dropzone-file"
        className="flex flex-col items-center  justify-center w-full h-80 border-green border cursor-pointer bg-gray-50 dark:hover:bg-neutral-700 dark:bg-neutral-800 hover:bg-gray-100 transition duration-300 ease-in-out "
      >
        {imageCollection ? (
          <img
            src={imageCollection}
            alt="nft"
            className="object-cover w-fit inherit p-1"
          />
        ) : (
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <svg
              aria-hidden="true"
              className="w-10 h-10 mb-3 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
              ></path>
            </svg>
            <p className="mb-2 text-sm font-ibmPlex text-gray-500 dark:text-gray-400">
              <span className="font-semibold ">Click to upload</span> or drag
              and drop
            </p>
          </div>
        )}{" "}
        <input
          id="dropzone-file"
          type="file"
          className="hidden"
          onChange={handleImageChangeCollection}
        />
      </label>
      <p className="text-left w-full pl-5 mt-3 text-neutral-400 font-ibmPlex">
        Token Symbol
      </p>
      <input
        id="totalsuply"
        placeholder="ENS"
        type="text"
        name="tokensymbol"
        value={formValuesCollection.tokensymbol}
        onChange={handleChangeCollection}
        className="w-full h-16 mt-1 border-green border placeholder:text-sm pl-5 cursor-pointer font-ibmPlex text-green  dark:bg-neutral-800 focus:bg-neutral-700 focus:outline-none transition duration-300 ease-in-out"
      />
    </div>
  );
};

export default Collection;
