import { useState } from "react";

const CreateNFT: React.FC = () => {
  return (
    <div className="w-10/12 h-screen">
      <div className="grid grid-flow-row grid-cols-2 mt-5 auto-rows-max gap-x-4 gap-y-8">
        <div className="text-4xl font-semibold leading-7 text-slate-800">
          Create a NFT
        </div>
        <div className="col-start-1">
          <label
            htmlFor="image"
            className="block pb-4 text-xl font-medium leading-6 text-slate-700"
          >
            Upload an Image, Video, Audio or 3D model
          </label>
          <div className="flex justify-center px-6 py-10 mt-2 border-2 border-dotted border-slate-700 rounded-xl">
            <div className="text-center">
              <div className="flex justify-center mt-4 text-sm leading-6 text-gray-600">
                <label
                  htmlFor="file-upload"
                  className="relative font-semibold bg-white rounded-md cursor-pointer text-primary focus-within:outline-none focus-within:ring-0 focus-within:ring-slate-700 focus-within:ring-offset-2 hover:text-slate-700"
                >
                  <span>Upload a file</span>
                  <input
                    id="file-upload"
                    name="file-upload"
                    type="file"
                    className="sr-only"
                  />
                </label>
              </div>
              <p className="text-xs leading-5 text-gray-600">
                PNG, JPG, GIF up to 10MB
              </p>
            </div>
          </div>
        </div>
        <div className="flex flex-col h-full col-start-2 row-span-4">
          <span className="block pb-4 text-xl font-medium leading-6 text-slate-700">
            Preview
          </span>
          <div className="flex items-center justify-center h-full px-6 py-20 mt-2 border-2 border-dotted border-slate-700 rounded-xl">
            <div className="relative block">
              <span className="text-xl font-normal leading-6 text-slate-700">
                Upload files to see a preview
              </span>
            </div>
          </div>
        </div>
        <div className="col-start-1">
          <label
            htmlFor="name"
            className="block pb-4 text-xl font-medium leading-6 text-slate-700"
          >
            Name
          </label>
          <div className="flex rounded-md shadow-sm ring-2 ring-inset ring-slate-600 focus-within:ring-2 focus-visible:outline-none focus-within:ring-inset focus-within:ring-primary sm:max-w-full">
            <input
              type="text"
              name="name"
              id="name"
              autoComplete="name"
              className="block flex-1 border-0 bg-transparent py-1.5 pl-3 text-slate-700 focus-visible:outline-none placeholder:text-slate-500 focus:ring-0 sm:text-sm sm:leading-6"
              placeholder="Koncept Kitten #3"
            />
          </div>
        </div>
        <div className="col-start-1 row-start-4">
          <label
            htmlFor="description"
            className="block w-full pb-4 text-xl font-medium leading-6 text-slate-700"
          >
            Description
          </label>
          <div>
            <textarea
              name="name"
              id="name"
              rows={3}
              autoComplete="name"
              className="block w-full rounded-md border-0 py-1.5 pl-3 focus-visible:outline-none text-slate-700 shadow-sm ring-2 ring-inset ring-slate-600 placeholder:text-slate-500 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6"
              placeholder="A Kitten That is Just A Koncept"
            />
          </div>
        </div>
        <div className="flex flex-row space-x-4">
          <div className="w-1/2 col-start-1">
            <label
              htmlFor="price"
              className="block pb-4 text-xl font-medium leading-6 text-slate-700"
            >
              Price
            </label>
            <div className="flex rounded-md shadow-sm ring-2 ring-inset ring-slate-600 focus-visible:outline-none focus-within:ring-2 focus-within:ring-inset focus-within:ring-primary sm:max-w-full">
              <input
                type="text"
                name="price"
                id="price"
                autoComplete="price"
                className="block flex-1 border-0 bg-transparent py-1.5 pl-3 text-slate-700 focus-visible:outline-none placeholder:text-slate-500 focus:ring-0 sm:text-sm sm:leading-6"
                placeholder="0.01"
              />
              <span className="flex items-center pr-3 text-gray-500 select-none sm:text-sm">
                MATIC
              </span>
            </div>
          </div>
          <div className="w-1/2 col-start-1 row-start-5">
            <label
              htmlFor="supply"
              className="block pb-4 text-xl font-medium leading-6 text-slate-700"
            >
              Supply
            </label>
            <div className="flex rounded-md shadow-sm ring-2 ring-inset focus-visible:outline-none ring-slate-600 focus-within:ring-2 focus-within:ring-inset focus-within:ring-primary sm:max-w-full">
              <input
                type="text"
                name="supply"
                id="supply"
                autoComplete="supply"
                value={1}
                disabled
                className="block flex-1 border-0 bg-transparent py-1.5 pl-3 text-slate-700 focus-visible:outline-none placeholder:text-slate-500 focus:ring-0 sm:text-sm sm:leading-6"
                placeholder="1"
              />
            </div>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-end mt-6 gap-x-6">
        <button
          type="button"
          className="text-sm font-semibold leading-6 text-gray-900"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-3 py-2 text-sm font-semibold text-white rounded-full shadow-sm bg-primary hover:bg-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        >
          Save
        </button>
      </div>
    </div>
  );
};
export default CreateNFT;
