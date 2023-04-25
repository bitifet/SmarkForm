
import express from "express";
const router = express.Router();

import {
    islands_data,
    municipalities_data,
    hotels_data,
    chains_data,
} from "./dataset.js";


export function islands() {
    return islands_data;
};

export function municipalities({island: i} = {}){
    return municipalities_data.filter(
        ({island})=>!i||island==i
    );
};

export function chains() {
    return chains_data;
};

export function hotels({
    municipality: m,
    island: i,
    chain: c,
} = {}){
    return hotels_data.filter(
        ({
            ine_municipality_code: municipality,
            chain,
        })=>(
            (!m||municipality==m)
            && (!i||(1 + (
                municipalities_data
                .filter(({island})=>island==i)
                .map(({code})=>code)
            ).indexOf(municipality)))
            &&(!c||chain==c)
        )
    );
};


router.get("/islands", ({query}, res)=>res.json(islands(query)));
router.get("/municipalities", ({query}, res)=>res.json(municipalities(query)));
router.get("/chains", ({query}, res)=>res.json(chains(query)));
router.get("/hotels", ({query}, res)=>res.json(hotels(query)));

export default router;

