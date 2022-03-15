import Web3 from "web3";
import elvesABI from "./abi/elves.json";
import polygonElvesABI from "./abi/polygonElves.json";
import { Multicall } from "ethereum-multicall";
import { IMAGE_HASH_PREFIX, POLYGON_ELVES_CONTRACT, ELVES_CONTRACT } from "./data";

const web3 = new Web3(new Web3.providers.HttpProvider(process.env.REACT_APP_ALCHEMY_URL));
const polygonWeb3 = new Web3(new Web3.providers.HttpProvider(process.env.REACT_APP_POLYGON_ALCHEMY_URL));

// const polygonContract = new polygonWeb3.eth.Contract(polygonElvesABI.abi, POLYGON_ELVES_CONTRACT);

export const pluralizeElves = (count) => {
  return `${count} ${count === 1 ? "Elf" : "Elves"}`;
}

export const inRange = (start, x, end) => {
  return ((x - start) * (x - end)) <= 0;
}

const saveImageHash = (hash, image) => {
  if (localStorage.getItem(IMAGE_HASH_PREFIX + hash) !== null) return;
  window.localStorage.setItem(IMAGE_HASH_PREFIX + hash, JSON.stringify(image));
}

const hexToInt = (hex) => parseInt(hex.hex, 16);

export const fetchElfDataByIds = async (elfIds, chain = "eth") => {
  if (!elfIds || elfIds.length < 1) return;

  let abi, contractAddress, web3Instance;

  if (chain === "polygon") {
    abi = polygonElvesABI.abi;
    contractAddress = POLYGON_ELVES_CONTRACT;
    web3Instance = polygonWeb3;
  } else {
    abi = elvesABI.abi;
    contractAddress = ELVES_CONTRACT;
    web3Instance = web3;
  }

  const txArray = elfIds.map((id) => ({
    abi,
    contractAddress,
    reference: `Elves${id}`,
    calls: [
      { reference: `elves${id}`, methodName: 'elves', methodParameters: [id] },
      { reference: `attributes${id}`, methodName: 'attributes', methodParameters: [id] },
      { reference: `ownerOfCall${id}`, methodName: 'ownerOf', methodParameters: [id] },
      { reference: `tokenURI${id}`, methodName: 'tokenURI', methodParameters: [id] },
     ]
  }));

  const multicall = new Multicall({ web3Instance, tryAggregate: true });
  const results = await multicall.call(txArray);

  return elfIds.map((id) => {
    const [
      stats,
      metadata,
      addresses,
      tokenData,
    ] = results.results[`Elves${id}`].callsReturnContext;
    const [
      , // addressOwner
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
    const [addressCurrent] = addresses.returnValues;
    const [base64metadata] = tokenData.returnValues;

    const tokenObject = base64metadata
      ? JSON.parse(window.atob(base64metadata.split(",")[1]))
      : {
        image: null,
        name: null,
        // body: null,
        // helm: null,
        // mainhand: null,
        // offhand: null,
        // attributes: null,
      };
    
    const { image, name } = tokenObject;

    const imageHashArray = [
      String(hexToInt(race)).padStart(2, "0"),
      String(hexToInt(sentinelClass)).padStart(2, "0"),
      String(hexToInt(hair)).padStart(2, "0"),
      String(hexToInt(primaryWeapon)).padStart(3, "0"),
    ];

    const imageHash = imageHashArray.join("");

    saveImageHash(imageHash, image);

    return {
      addressCurrent,
      id,
      imageHash,
      name,
      accessories: hexToInt(accessories),
      inventory: hexToInt(inventory),
      elfClass: hexToInt(sentinelClass),
      elfHair: hexToInt(hair),
      elfRace: hexToInt(race),
      statAttack: hexToInt(attack),
      statHealth: hexToInt(health),
      statLevel: hexToInt(level),
      weaponId: hexToInt(primaryWeapon),
      weaponTier: hexToInt(weaponTier),
      lastActionId: hexToInt(action),
      lastActionTimestamp: hexToInt(timestamp),
    };
  });
}