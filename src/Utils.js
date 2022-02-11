import Web3 from "web3";
import elvesABI from "./abi/elves.json";
import { Multicall } from "ethereum-multicall";
import env from "react-dotenv";

const ELVES_CONTRACT = "0xA351B769A01B445C04AA1b8E6275e03ec05C1E75";
const web3 = new Web3(new Web3.providers.HttpProvider(env.ALCHEMY_URL));

export const hexToInt = (hex) => parseInt(hex.hex, 16);

export const actionIntToString = (action, isCoolingDown = false) => {
  switch (action) {
    case 0: return "Idle";
    case 1: return "Staked, but Idle";
    case 2: return isCoolingDown ? "On Campaign" : "Campaign Ended";
    case 3: return "Sent to Passive Campaign";
    case 4: return "Returned from Passive Campaign";
    case 5: return "Re-Rolled Weapon";
    case 6: return "Re-Rolled Items";
    case 7: return isCoolingDown ? "Healing" : "Done Healing";
    default: return "Unknown";
  }
}

export const fetchElvesByIds = async (elfIds) => {
  if (!elfIds || elfIds.length < 1) return;

  const txArray = elfIds.map((id) => ({
    reference: `Elves${id}`,
    contractAddress: ELVES_CONTRACT,
    abi: elvesABI.abi,
    calls: [
      { reference: `elves${id}`, methodName: 'elves', methodParameters: [id] },
      { reference: `attributes${id}`, methodName: 'attributes', methodParameters: [id] },
      { reference: `ownerOfCall${id}`, methodName: 'ownerOf', methodParameters: [id] },
      { reference: `tokenURI${id}`, methodName: 'tokenURI', methodParameters: [id] },
     ]
  }));

  const multicall = new Multicall({ web3Instance: web3, tryAggregate: true });
  const results = await multicall.call(txArray);

  return elfIds.map((id) => {
    const [
      stats,
      metadata,
      addresses,
      tokenData,
    ] = results.results[`Elves${id}`].callsReturnContext;
    const [
      addressOwner,
      timestamp,
      action,
      health,
      attack,
      primaryWeapon,
      level,
    ] = stats.returnValues;
    const [
      hair,
      race,
      accessories,
      sentinelClass,
      weaponTier,
      inventory,
    ] = metadata.returnValues;
    const [adddressCurrent] = addresses.returnValues;
    const [base64metadata] = tokenData.returnValues;

    const isBurnedOrIdle = action === 0
      || addressOwner === "0x0000000000000000000000000000000000000000";

    const isCoolingDown = timestamp > Math.floor( Date.now() / 1000 );
    
    const status = isBurnedOrIdle ? "unstaked" : "staked";

    const tokenObject = base64metadata
      ? JSON.parse(window.atob(base64metadata.split(",")[1]))
      : {
        image: null,
        name: null,
        body: null,
        helm: null,
        mainhand: null,
        offhand: null,
        attributes: null,
      };
    
    const { image, name, attributes } = tokenObject;

    return {
      addressOwner,
      timestamp: hexToInt(timestamp),
      action: hexToInt(action),
      health: hexToInt(health),
      attack: hexToInt(attack),
      level: hexToInt(level),
      hair: hexToInt(hair),
      race: hexToInt(race),
      accessories: hexToInt(accessories),
      sentinelClass: hexToInt(sentinelClass),
      weaponTier: hexToInt(weaponTier),
      inventory: hexToInt(inventory),
      primaryWeapon: hexToInt(primaryWeapon),
      adddressCurrent,
      status,
      image,
      name: name ? name : `Elf #${id}`,
      actionString: actionIntToString(hexToInt(action), isCoolingDown),
      attributes,
      id,
    };
  });
}