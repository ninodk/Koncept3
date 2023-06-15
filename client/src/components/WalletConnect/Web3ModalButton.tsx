import { Web3Button, Web3NetworkSwitch } from "@web3modal/react";
//import CustomButton from "../components/CustomButton";

export default function Web3ModalButton() {
  return (
    <>
      {/* Predefined button  */}
      <Web3Button
        avatar="show"
        icon="show"
        label="Connect Wallet"
        balance="show"
      />
      <br />

      {/* Network Switcher Button */}
      {/* <Web3NetworkSwitch />
      <br /> */}

      {/* Custom button */}
      {/* <CustomButton /> */}
    </>
  );
}
