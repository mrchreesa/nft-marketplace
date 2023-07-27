import { Fragment, useEffect, useState } from "react";
import { Menu, Transition } from "@headlessui/react";
import Link from "next/link";
import axios from "axios";
import { useAuthedProfile } from "../../context/UserContext";
import Web3 from "web3";

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

export default function ProfileMenu() {
  const { authedProfile, setAuthedProfile } = useAuthedProfile();
  const [address, setAddress] = useState<string>("");

  const reg = (userData: any) => {
    axios
      .post("/api/signIn", userData)
      .then((res) => {
        console.log(res);
        setAuthedProfile(res.data.user);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const connectWallet = async () => {
    try {
      if (typeof window !== "undefined") {
        let web3;
        web3 = new Web3(window.ethereum);
        // Request account access
        await (window.ethereum as any).enable();
        const accounts = await web3.eth.getAccounts();
        const accountAddress = accounts[0];
        console.log("Account address:", accountAddress);
        setAddress(accountAddress);

        // const web3 = await new Web3(window.ethereum);
        // const accounts = await web3.eth.getAccounts();

        // setAddress(accountAddress);
        // console.log('Account address:', accountAddress);
        //
        const userData = {
          address: accountAddress,
        };
        reg(userData);
      }
    } catch (error) {
      console.error("Error:", error);
    }
    // Connect to an Ethereum provider
    // Get the account address
  };
  const checkIfConnected = () => {
    if (typeof window !== "undefined") {
      if (window.localStorage.getItem("tw:provider:connectors")) {
        connectWallet();
      }
    }
  };

  // const connectWalletAndUser = () => {
  //   if (!address) return;
  //   (async () => {
  //     const userData = {
  //       address,
  //     };

  //     axios
  //       .post("/api/signIn", userData)
  //       .then((res) => {
  //         console.log(res);
  //         setAuthedProfile(res.data.user);
  //       })
  //       .catch((err) => {
  //         console.log(err);
  //       });
  //   })();
  // };

  const disconnectWalletAndUser = async () => {
    if (typeof window !== "undefined") {
      if (window.localStorage.getItem("tw:provider:connectors")) {
        const web3 = new Web3(window.ethereum);
        if (
          typeof web3 !== "undefined" &&
          typeof web3.currentProvider !== "undefined"
        ) {
          const accounts = await web3.eth.getAccounts();
          const address = accounts[0];
          if (web3.currentProvider.disconnect) {
            const userData = {
              address,
            };
            axios
              .delete("/api/signIn")
              .then((res) => {
                console.log(res);
                setAuthedProfile(res.data.user);
              })
              .catch((err) => {
                console.log(err);
              });
            web3.currentProvider.disconnect();
            setAddress("");
          }
        }
      }
    }
    setAuthedProfile(null);
  };

  useEffect(() => {
    checkIfConnected();
  }, []);

  return (
    <Menu as="div" className="relative inline-block">
      {!address ? (
        <button
          className="text-center w-content z-0 font-ibmPlex text-xs text-green border border-green bg-white bg-opacity-20 hover:bg-opacity-40 p-1"
          onClick={connectWallet}
        >
          <h1>Connect Wallet</h1>
        </button>
      ) : (
        <>
          <div>
            <Menu.Button className="inline-flex w-[110px] justify-end gap-x-1.5 rounded-full ">
              <div className="h-6 w-6 bg-green rounded-full hover:opacity-80"></div>
            </Menu.Button>
          </div>
          <Transition
            as={Fragment}
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            <Menu.Items className="absolute right-0 text-left z-10 mt-2 w-[15rem] border border-white origin-top-right rounded-md bg-black shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
              <div className=" font-ibmPlex text-green">
                <Menu.Item>
                  {({ active }) => (
                    <Link
                      href="/profile"
                      className={classNames(
                        active ? "bg-gray-400 text-white" : "text-white",
                        " px-4 py-2 text-xl uppercase font-bold flex items-center justify-start"
                      )}
                    >
                      <div className="h-5 w-5 bg-green rounded-full mr-3"></div>
                      my profile {">"}
                      {">"}
                    </Link>
                  )}
                </Menu.Item>
                <div className="flex items-center">
                  <p className="block px-4 py-2 text-xs text-white">
                    {address
                      .slice(0, 6)
                      .concat("...")
                      .concat(address.slice(-4))}
                  </p>
                  <div className="h-2 w-2 bg-green rounded-full mr-3"></div>
                </div>
                <Menu.Item>
                  {({ active }) => (
                    <Link
                      href="/profile/settings"
                      className={classNames(
                        active ? "bg-gray-400 text-green" : "text-green",
                        "block px-4 py-2 text-xs"
                      )}
                    >
                      {">"}
                      {">"}
                      {">"} Settings
                    </Link>
                  )}
                </Menu.Item>
                <Menu.Item>
                  {({ active }) => (
                    <Link
                      href="#"
                      className={classNames(
                        active ? "bg-gray-400 text-green" : "text-green",
                        "block px-4 py-2 text-xs"
                      )}
                    >
                      {">"}
                      {">"}
                      {">"} help
                    </Link>
                  )}
                </Menu.Item>
                <Menu.Item>
                  {({ active }) => (
                    <>
                      <Link
                        href="/"
                        className={classNames(
                          active ? "bg-gray-400 text-green" : "text-green",
                          "block px-4 py-2 text-xs  hover:bg-gray-400"
                        )}
                        onClick={disconnectWalletAndUser}
                      >
                        <h1>
                          {">"}
                          {">"}
                          {">"} Disconnect
                        </h1>
                      </Link>
                    </>
                  )}
                </Menu.Item>
              </div>
            </Menu.Items>
          </Transition>
        </>
      )}
    </Menu>
  );
}
