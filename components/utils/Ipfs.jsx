import { Buffer } from 'buffer';
import { create } from 'ipfs-http-client';


const projectId = process.env.NEXT_APP_IPFS_ID?process.env.NEXT_APP_IPFS_ID : "2Qv6VYKxtPQgSd8keQNU1BjwGCP";   // <---------- your Infura Project ID

const projectSecret = process.env.NEXT_APP_IPFS_SECRET ? process.env.NEXT_APP_IPFS_SECRET : "03e0ecdfe83b9df872453709b850b8ff";  // <---------- your Infura Secret
// console.log(projectId,projectSecret);
const auth = 'Basic ' + Buffer.from(projectId + ':' + projectSecret).toString('base64');

const ipfs = create({
    host: 'infura-ipfs.io',
    port: 5001,
    protocol: 'https',
    headers: {
        authorization: auth,
    },
});

 
export default ipfs;
