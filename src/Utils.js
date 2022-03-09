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

const IMAGE_HASH_PREFIX = "elf-image-";
const ELVES_CONTRACT = "0xA351B769A01B445C04AA1b8E6275e03ec05C1E75";
const POLYGON_ELVES_CONTRACT = "0x4DeAb743F79b582c9b1d46b4aF61A69477185dd5";
const web3 = new Web3(new Web3.providers.HttpProvider(process.env.REACT_APP_ALCHEMY_URL));
const polygonWeb3 = new Web3(new Web3.providers.HttpProvider(process.env.REACT_APP_POLYGON_ALCHEMY_URL));

// const polygonContract = new polygonWeb3.eth.Contract(polygonElvesABI.abi, POLYGON_ELVES_CONTRACT);

const saveImageHash = (hash, image) => {
  if (localStorage.getItem(IMAGE_HASH_PREFIX + hash) !== null) return;
  window.localStorage.setItem(IMAGE_HASH_PREFIX + hash, JSON.stringify(image));
}

const hexToInt = (hex) => parseInt(hex.hex, 16);

const timestampToHealthPercentage = (timestamp) => {
  const now = new Date().getTime()
  const diff = Math.floor(new Date(timestamp * 1000).getTime() - now) / 36e5;
  const result = 100 - 2.5 * diff;
  return Math.min(100, Math.max(5, result));
}

const timestampToTimeString = (timestamp) => {
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

const itemIntToObject = (item) => {
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

export class Elf {
  addressCurrent;
  id;
  imageHash;
  name;
  accessories;
  inventory;
  elfClass;
  elfHair;
  elfRace;
  statAttack;
  statHealth;
  statLevel;
  weaponId;
  weaponTier;
  lastActionId;
  lastActionTimestamp;

  isSelected = false;
  sort;

  constructor(elfData) {
    const {
      addressCurrent,
      id,
      imageHash,
      name,
      accessories,
      inventory,
      elfClass,
      elfHair,
      elfRace,
      statAttack,
      statHealth,
      statLevel,
      weaponId,
      weaponTier,
      lastActionId,
      lastActionTimestamp,
    } = elfData;
    
    this.addressCurrent = addressCurrent;
    this.id = id;
    this.imageHash = imageHash;
    this.name = name;
    this.accessories = accessories;
    this.inventory = inventory;
    this.elfClass = elfClass;
    this.elfHair = elfHair;
    this.elfRace = elfRace;
    this.statAttack = statAttack;
    this.statHealth = statHealth;
    this.statLevel = statLevel;
    this.weaponId = weaponId;
    this.weaponTier = weaponTier;
    this.lastActionId = lastActionId;
    this.lastActionTimestamp = lastActionTimestamp;
  }

  get isDruid() { return this.elfClass === 0 }
  get isAssassin() { return this.elfClass === 1 }
  get isRanger() { return this.elfClass === 2 }
  get isCoolingDown() { return this.lastActionTimestamp > +new Date() / 1000 }
  get isStaked() { return [ELVES_CONTRACT, POLYGON_ELVES_CONTRACT].includes(this.addressCurrent) }
  get didNothing() { return this.lastActionId === 0 }
  get didStake() { return this.lastActionId === 1 }
  get didCampaign() { return this.lastActionId === 2 }
  get didPassive() { return this.lastActionId === 3 }
  get didReturnPassive() { return this.lastActionId === 4 }
  get didWeaponReroll() { return this.lastActionId === 5 }
  get didItemReroll() { return this.lastActionId === 6 }
  get didHeal() { return this.lastActionId === 7 }
  get didBridge() { return this.lastActionId === 8 }
  get didSynergize() { return this.lastActionId === 9 }
  get didBloodthirst() { return this.lastActionId === 10 }
  get hasInventory() { return this.inventory > 0 }
  get isAbleToHeal() { return this.isDruid && !this.isCoolingDown }
  get isAbleToSynergize() { return this.isDruid && (this.lastActionTimestamp + 12 * 1000 > +new Date() / 1000) }
  get cooldownString() { return timestampToTimeString(this.lastActionTimestamp) }
  get image() { return JSON.parse(localStorage.getItem(IMAGE_HASH_PREFIX + this.imageHash)) }
  get inventoryObject() { return itemIntToObject(this.inventory) }
  get idString() { return `#${this.id}` }
  get levelString() { return `Lv. ${this.statLevel}` }
  get nameString() { return this.name ? this.name : `Elf #${this.id}` }
  get healthPercentage() { return timestampToHealthPercentage(this.lastActionTimestamp) }
  get actionString() {
    switch (this.lastActionId) {
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
Elf.prototype.sortBy = function(attr) { this.sort = this[attr] }