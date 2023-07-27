import type { NextPage } from "next";
import ListingComponent from "../../components/Listing/ListingComponent";
import { getCookie } from "cookies-next";

const ListingPage: NextPage = () => {
  return <ListingComponent />;
};

export const getServerSideProps = async ({ req, res }: any) => {
  let auth = getCookie("auth", { req, res });
  if (!auth) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  } else {
    return {
      props: {},
    };
  }
};

export default ListingPage;
