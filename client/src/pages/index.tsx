import type { NextPage } from "next";

import Image from "next/image";
import styles from "../styles/Home.module.css";

const HomePage: React.FC = () => {
  return (
    <div>
      <div className="flex flex-col justify-end max-w-xs pt-8 mx-auto sm:max-w-xl md:max-w-2xl lg:max-w-screen xl:mr-6">
        <div className="pb-4">
          <div className="mb-4 text-2xl font-extrabold text-center sm:text-right lg:text-right text-slate-800 sm:text-4xl md:text-5xl lg:text-5xl ">
            Stay ahead of the <span className="text-primary">Kurve.</span>{" "}
          </div>
          <p className="font-normal leading-snug text-center sm:text-right sm:text-lg lg:text-right text-md text-slate-600 lg:text-xl">
            Koncept3 enables you to connect with your brand identity and creates
            a bridge between you and your customers to improve engagement and
            connectivity.
          </p>
        </div>
        <div className="flex items-center justify-center space-x-2 sm:justify-end lg:justify-end max-h-fit">
          <button className="px-2 py-1 text-sm text-white rounded-full sm:text-md sm:px-3 sm:py-1.5 lg:px-4 lg:py-1 xl:px-4 xl:py-1 xl:text-lg bg-slate-800 hover:bg-slate-900">
            Learn more
          </button>
          <button className="px-2 py-1 text-sm text-white rounded-full sm:text-md sm:px-3 sm:py-1.5 lg:px-4 lg:py-1 xl:px-4 xl:py-1 xl:text-lg bg-primary hover:bg-hoverPrimary">
            Get started
          </button>
        </div>
      </div>
      <div className="relative block pt-2 pb-20 overflow-hidden">
        <div className="mb-4">
          <div className="mb-2 text-2xl font-extrabold leading-none tracking-tight text-left text-slate-800 md:text-3xl lg:text-3xl ">
            Into <span className="text-primary">web3</span>{" "}
          </div>
          <p className="text-lg font-normal text-left text-slate-600 lg:text-xl">
            Learn more about web3 concepts.
          </p>
        </div>
        <div className="flex flex-row space-x-4">
          <div className="flex-row w-full h-full">
            <div className="border-2 rounded-xl w-96 h-80 border-primary bg-slate-700"></div>
            <p className="font-bold text-slate-600">What is web3?</p>
          </div>
          <div className="flex-row w-full h-full">
            <div className="border-2 rounded-xl w-96 h-80 border-primary bg-slate-700"></div>
            <p className="font-bold text-slate-600">How is cryptocurrency?</p>
          </div>
          <div className="flex-row w-full h-full">
            <div className="border-2 rounded-xl w-96 h-80 border-primary bg-slate-700 "></div>
            <p className="font-bold text-slate-600">What is a crypto wallet?</p>
          </div>
          <div className="flex-row w-full h-full">
            <div className="border-2 rounded-xl w-96 h-80 border-primary bg-slate-700 "></div>
            <p className="font-bold text-slate-600">
              How to stay protected in web3
            </p>
          </div>
        </div>
      </div>
      <div className="relative block pt-2 pb-20 overflow-hidden">
        <div className="mb-4">
          <div className="mb-2 text-2xl font-extrabold leading-none tracking-tight text-left text-slate-800 md:text-3xl lg:text-3xl ">
            NFT <span className="text-primary">101</span>{" "}
          </div>
          <p className="text-lg font-normal text-left text-slate-600 lg:text-xl">
            Learn the basics.
          </p>
        </div>
        <div className="flex flex-row space-x-4">
          <div className="flex-row w-full h-full">
            <div className="border-2 rounded-xl w-96 h-80 border-primary bg-slate-700"></div>
            <p className="font-bold text-slate-600">What is an NFT?</p>
          </div>
          <div className="flex-row w-full h-full">
            <div className="border-2 rounded-xl w-96 h-80 border-primary bg-slate-700"></div>
            <p className="font-bold text-slate-600">How to buy an NFT</p>
          </div>
          <div className="flex-row w-full h-full">
            <div className="border-2 rounded-xl w-96 h-80 border-primary bg-slate-700 "></div>
            <p className="font-bold text-slate-600">What are NFT drops?</p>
          </div>
          <div className="flex-row w-full h-full">
            <div className="border-2 rounded-xl w-96 h-80 border-primary bg-slate-700 "></div>
            <p className="font-bold text-slate-600">What is minting?</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
