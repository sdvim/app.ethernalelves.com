import AuraOfImmunity from "../assets/items/aura-of-immunity.png";
import DemonicRupture from "../assets/items/demonic-rupture.png";
import MidasRing from "../assets/items/midas-ring.png";
import MoonElixir from "../assets/items/moon-elixir.png";
import SpiritBand from "../assets/items/spirit-band.png";
import TalismanOfEnragement from "../assets/items/talisman-of-enragement.png";

export const IMAGE_HASH_PREFIX = "elf-image-";
export const ELVES_CONTRACT = "0xA351B769A01B445C04AA1b8E6275e03ec05C1E75";
export const POLYGON_ELVES_CONTRACT = "0x4DeAb743F79b582c9b1d46b4aF61A69477185dd5";
export const CAMPAIGN_LEVEL_LIMIT = 50;
export const SELECTION_LIMIT = 10;

export const actions = [
  {
    path: "*",
    label: "Default",
    hidden: true,
    sections: [
      {
        label: "Idle",
        filter: (elf) => !elf.didBridge && !elf.isCoolingDown,
      },
      {
        label: "Active",
        filter: (elf) => elf.isCoolingDown,
      },
      {
        label: "Passive",
        filter: (elf) => elf.didPassive,
      },
      {
        label: "Bridged (Polygon)",
        filter: (elf) => elf.didBridge,
      },
    ],
  },
  {
    path: "heal",
    label: "Heal",
    sections: [
      {
        label: "Healers",
        limit: SELECTION_LIMIT / 2,
        filter: (elf) => elf.isAbleToHeal,
        required: true,
      },
      {
        label: "Damaged",
        limit: SELECTION_LIMIT / 2,
        filter: (elf) => !elf.isDruid && elf.isCoolingDown,
        required: true,
      },
    ],
  },
  {
    path: "synergize",
    label: "Synergize",
    sections: [
      {
        label: "Able to Synergize",
        filter: (elf) => elf.isAbleToSynergize,
        required: true,
      },
    ],
  },
  {
    path: "merchant",
    label: "Merchant",
    sections: [
      {
        label: "Itemless",
        filter: (elf) => !elf.hasInventory,
      },
      {
        label: "Has Item",
        filter: (elf) => elf.hasInventory,
      },
    ],
  },
  {
    path: "forge",
    label: "Forge",
    sections: [
      {
        label: "Tier 0",
        filter: (elf) => elf.weaponTier === 0,
      },
      {
        label: "Tier 1",
        filter: (elf) => elf.weaponTier === 1,
      },
      {
        label: "Tier 2",
        filter: (elf) => elf.weaponTier === 2,
      },
      {
        label: "Tier 3",
        filter: (elf) => elf.weaponTier === 3,
      },
      {
        label: "Tier 4-5",
        filter: (elf) => elf.weaponTier > 3,
      },
    ],
  },
  {
    path: "passive",
    label: "Passive",
    sections: [
      {
        label: "Ready for Passive",
        filter: (elf) => !elf.didPassive && !elf.isCoolingDown,
        required: true,
      },
      {
        label: "In Passive",
        filter: (elf) => elf.didPassive,
        readonly: true,
      },
    ],
  },
  {
    path: "campaign",
    label: "Campaign",
    sections: [
      {
        label: "Ready to Campaign",
        filter: (elf) => !elf.isCoolingDown && elf.statLevel <= CAMPAIGN_LEVEL_LIMIT,
        required: true,
      },
      {
        label: "In Campaign",
        filter: (elf) => elf.didCampaign,
        readonly: true,
      },
    ],
  },
  {
    path: "bloodthirst",
    label: "Bloodthirst",
    sections: [
      {
        label: "Ready to Bloodthirst",
        filter: (elf) => !elf.isCoolingDown,
        required: true,
      },
      {
        label: "In Bloodthirst",
        filter: (elf) => elf.didBloodthirst,
        readonly: true,
      },
    ],
  },
];

export const items = [
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