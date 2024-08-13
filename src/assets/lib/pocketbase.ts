/** @format */

import PocketBase from "pocketbase"
/** @format */

const pb = new PocketBase(import.meta.env.VITE_POCKETBASE_URL)

pb.autoCancellation(false)

export default pb
