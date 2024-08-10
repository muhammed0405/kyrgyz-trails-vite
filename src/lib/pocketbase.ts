/** @format */

import PocketBase from "pocketbase"
/** @format */

export const url = "https://kyrgyz-tra.pockethost.io/"
const pb = new PocketBase(url)

pb.autoCancellation(false)

export default pb
