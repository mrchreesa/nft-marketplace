import Users from "../../model/users";
import connectDB from "../../lib/connectDB";
import type { NextApiRequest, NextApiResponse } from "next";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  await connectDB();
  console.log("Connected to Mongo");

  //Save to Profile
  if (req.method === "POST") {
    const data = req.body;
    if (!data) {
      return res.status(400).send({ message: "Bad request" });
    }
    const { address, nft} = req.body;

    if (nft) {
      await Users.findOneAndUpdate(
        { address },
          {
         $addToSet: {
          savedNfts: nft
        },
      },

       {  new: true }
      )
        .then((response) => {
          res.status(200).send(response);
        })
        .catch((err: any) => {
          res.status(400).send({ message: "Saving failed" });
          console.log("Saving failed.", err);
        });
    }
  } else {
    console.log("Wrong method");
  }
};

export default handler;
