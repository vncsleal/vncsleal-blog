import { sanityClient } from "sanity:client"
import { createStore } from "@blog/adapter-sanity"

export const store = createStore(sanityClient)
