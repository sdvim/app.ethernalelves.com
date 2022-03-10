import {
  ELVES_CONTRACT,
  POLYGON_ELVES_CONTRACT,
  IMAGE_HASH_PREFIX,
  items
} from "./";

const timestampToHealthPercentage = (timestamp) => {
  const now = new Date().getTime()
  const diff = Math.floor(new Date(timestamp * 1000).getTime() - now) / 36e5;
  const result = 100 - 3 * diff;
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

  return hours ? `${hours}:${minutes}:${seconds}` : `${minutes}:${seconds}`;
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

  get cooldownSeconds() { return Math.floor(this.lastActionTimestamp - +new Date() / 1000) }
  get cooldownString() { return timestampToTimeString(this.lastActionTimestamp) }
  get isDruid() { return this.elfClass === 0 }
  get isAssassin() { return this.elfClass === 1 }
  get isRanger() { return this.elfClass === 2 }
  get isCoolingDown() { return this.cooldownSeconds > 0 }
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
  get isAbleToSynergize() { return this.isDruid && (0 < this.cooldownSeconds) && (this.cooldownSeconds < 12 * 60 * 60) }
  get image() { return JSON.parse(localStorage.getItem(IMAGE_HASH_PREFIX + this.imageHash)) }
  get inventoryObject() { return items[this.inventory] }
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

Elf.prototype.select = function(bool) { this.isSelected = bool }
Elf.prototype.sortBy = function(attr) { this.sort = this[attr] }