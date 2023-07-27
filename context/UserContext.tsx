import React, {
  useState,
  useContext,
  createContext,
  ReactNode,
  useEffect,
} from "react";
import axios from "axios";
import { ethers } from "ethers";
import { set } from "mongoose";
interface CurrentUserContextType {
  username: string;
}
const AuthedProfileContext = createContext<CurrentUserContextType | any>({});
type Props = {
  children: ReactNode;
};
export const AuthedProfileProvider = ({ children }: Props) => {
  const [authedProfile, setAuthedProfile] = useState(null as any);
  const [loading, setLoading] = useState(true as boolean);

  const value = {
    authedProfile,
    setAuthedProfile,
    loading,
  };

  const [address, setAddress] = useState<number>(0);
  const getAdrress = async () => {
    if (typeof window !== "undefined") {
      const provider = new ethers.providers.Web3Provider(
        (window as CustomWindow).ethereum as any
      );
      // Request access to the user's Ethereum accounts (MetaMask, etc.)
      const accounts = await (window as CustomWindow).ethereum.request({ method: 'eth_requestAccounts' });

      // Return the first account address
      const address = accounts[0];
      setAddress(address);
    }
  }

  useEffect(() => { getAdrress(); }, [])
  return (
    <AuthedProfileContext.Provider value={value}>
      {children}
    </AuthedProfileContext.Provider>
  );
};

export const useAuthedProfile = () => useContext(AuthedProfileContext);
export default useAuthedProfile;
