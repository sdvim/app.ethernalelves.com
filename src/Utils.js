import AuraOfImmunity from "./assets/items/aura-of-immunity.png";
import DemonicRupture from "./assets/items/demonic-rupture.png";
import MidasRing from "./assets/items/midas-ring.png";
import MoonElixir from "./assets/items/moon-elixir.png";
import SpiritBand from "./assets/items/spirit-band.png";
import TalismanOfEnragement from "./assets/items/talisman-of-enragement.png";

import Web3 from "web3";
import elvesABI from "./abi/elves.json";
import polygonElvesABI from "./abi/polygonElves.json";
import { Multicall } from "ethereum-multicall";
import env from "react-dotenv";

const ELVES_CONTRACT = "0xA351B769A01B445C04AA1b8E6275e03ec05C1E75";
const POLYGON_ELVES_CONTRACT = "0x4DeAb743F79b582c9b1d46b4aF61A69477185dd5";
const web3 = new Web3(new Web3.providers.HttpProvider(env.ALCHEMY_URL));
const polygonWeb3 = new Web3(new Web3.providers.HttpProvider(env.POLYGON_ALCHEMY_URL));

// const polygonContract = new polygonWeb3.eth.Contract(polygonElvesABI.abi, POLYGON_ELVES_CONTRACT);

const saveImageHash = (hash, image) => {
  if (localStorage.getItem(hash) !== null) return;
  window.localStorage.setItem(hash, JSON.stringify(image));
}

export const hexToInt = (hex) => parseInt(hex.hex, 16);

export const timestampToHealthPercentage = (timestamp) => {
  const now = new Date().getTime()
  const diff = Math.floor(new Date(timestamp * 1000).getTime() - now) / 36e5;
  const result = 100 - 2.5 * diff;
  return Math.min(100, Math.max(5, result));
}

export const timestampToTimeString = (timestamp) => {
  let diff = +new Date() / 1000 - timestamp;
  let isFuture = diff < 0;

  diff = Math.abs(diff);
  let hours = Math.floor(diff / 3600);

  if (!isFuture) {
    if (hours >= 24) {
      return `${(hours / 24).toFixed(1)}d ago`;
    }
    if (hours < 1) {
      diff -= hours * 3600;
      return `${Math.floor(diff / 60)}m ago`;
    }
    return `${hours}h ago`;
  }

  if (hours > 1) {
    const timestampDate = new Date(timestamp * 1000);
    const today = new Date().toLocaleString([], { weekday: "short" });
    const day = timestampDate.toLocaleString([], { weekday: "short" });
    const time = timestampDate.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    return today !== day ? `${day} ${time}` : `${time}`;
  }

  diff -= hours * 3600;
  const minutes = String((diff / 60) | 0).padStart(2, "0");
  const seconds = String((diff % 60) | 0).padStart(2, "0");

  return `${hours}:${minutes}:${seconds}`;
}

export const itemIntToObject = (item) => {
  const items = [
    {
      text: "Empty",
      hidden: true,
    },
    {
      text: "Talisman of Enragement",
      description: "Doubles total attack points",
      image: TalismanOfEnragement,
    },
    {
      text: "Moon Elixir",
      description: "Increases HP by 50%",
      image: MoonElixir,
    },
    {
      text: "Midas Ring",
      description: "Doubles rewarded $REN",
      image: MidasRing,
    },
    {
      text: "Spirit Band",
      description: "Doubles gained levels",
      image: SpiritBand,
    },
    {
      text: "Aura of Immunity",
      description: "Eliminates regeneration",
      image: AuraOfImmunity,
    },
    {
      text: "Demonic Rupture",
      description: "Triples total attack points",
      image: DemonicRupture,
    },
  ];

  return items[item] || items[0];
}

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
    const [addressCurrent] = addresses.returnValues;
    const [base64metadata] = tokenData.returnValues;

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
      addressOwner,
      addressCurrent,
      id,
      imageHash,
      name: name ? name : `Elf #${id}`,
      race: hexToInt(race),
      classification: hexToInt(sentinelClass),
      hair: hexToInt(hair),
      stats: {
        health: hexToInt(health),
        attack: hexToInt(attack),
        level: hexToInt(level),
      },
      accessories: hexToInt(accessories),
      inventory: hexToInt(inventory),
      weapon: {
        id: hexToInt(primaryWeapon),
        tier: hexToInt(weaponTier),
      },
      lastAction: {
        id: hexToInt(action),
        timestamp: hexToInt(timestamp),
      },
    };
  });
}

export class Elf {
  addressOwner;
  addressCurrent;
  id;
  imageHash;
  name;
  race;
  classification;
  hair;
  stats;
  accessories;
  inventory;
  weapon;
  lastAction;

  isSelected = false;

  constructor(elfData) {
    const {
      addressOwner,
      addressCurrent,
      id,
      imageHash,
      name,
      race,
      classification,
      hair,
      stats,
      accessories,
      inventory,
      weapon,
      lastAction,
    } = elfData;
    
    this.addressOwner = addressOwner;
    this.addressCurrent = addressCurrent;
    this.id = id;
    this.imageHash = imageHash;
    this.name = name;
    this.race = race;
    this.classification = classification;
    this.hair = hair;
    this.stats = stats;
    this.accessories = accessories;
    this.inventory = inventory;
    this.weapon = weapon;
    this.lastAction = lastAction;
  }

  get isDruid() { return this.classification === 0 }
  get isAssassin() { return this.classification === 1 }
  get isRanger() { return this.classification === 2 }
  get isCoolingDown() { return this.lastAction.timestamp > +new Date() / 1000 }
  get isStaked() { return this.lastAction.id !== 0 && this.addressOwner !== "0x0000000000000000000000000000000000000000" }
  get didNothing() { return this.lastAction.id === 1 }
  get didStake() { return this.lastAction.id === 2 }
  get didPassive() { return this.lastAction.id === 3 }
  get didReturnPassive() { return this.lastAction.id === 4 }
  get didWeaponReroll() { return this.lastAction.id === 5 }
  get didItemReroll() { return this.lastAction.id === 6 }
  get didHeal() { return this.lastAction.id === 7 }
  get didBridge() { return this.lastAction.id === 8 }
  get didSynergize() { return this.lastAction.id === 9 }
  get didBloodthirst() { return this.lastAction.id === 10 }
  get hasInventory() { return this.inventory > 0 }
  get cooldownString() { return timestampToTimeString(this.lastAction.timestamp) }
  get image() { return JSON.parse(localStorage.getItem(this.imageHash)) }
  get inventoryObject() { return itemIntToObject(this.inventory) }
  get idString() { return `#${this.id}` }
  get levelString() { return `Lv. ${this.stats.level}` }
  get healthPercentage() { return timestampToHealthPercentage(this.lastAction.timestamp) }
  get actionString() {
    switch (this.lastAction.id) {
      case 0: return "Idle";
      case 1: return "Staked, but Idle";
      case 2: return this.isCoolingDown ? "On Campaign" : "Campaign Ended";
      case 3: return "Sent to Passive Campaign";
      case 4: return "Returned from Passive Campaign";
      case 5: return "Re-Rolled Weapon";
      case 6: return "Re-Rolled Items";
      case 7: return this.isCoolingDown ? "Healing" : "Done Healing";
      case 8: return "Recently bridged";
      case 9: return "Synergized";
      case 10: return "Bloodthirst";
      default: return "Unknown";
    }
  }
}

Elf.prototype.select = function (bool) { this.isSelected = bool }
Elf.prototype.sort = function(attr) {
  if (attr === "level") this.sort = this.stats.level;
  if (attr === "id") this.sort = this.id;
  if (attr === "timestamp") this.sort = this.lastAction.timestamp;
}