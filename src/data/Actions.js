import Bloodthirst from "../assets/actions/bloodthirst.png";
import Campaign from "../assets/actions/campaign.png";
import Forge from "../assets/actions/forge.png";
import Heal from "../assets/actions/heal.png";
import Merchant from "../assets/actions/merchant.png";
import Passive from "../assets/actions/passive.png";
import Rampage from "../assets/actions/rampage.png";
import Synergize from "../assets/actions/synergize.png";

import { SELECTION_LIMIT, CAMPAIGN_LEVEL_LIMIT } from "./";

const actions = [
  {
    path: "*",
    label: "Default",
    hidden: true,
    sections: [
      {
        label: "Ready",
        filter: (elf) => !elf.didBridge && !elf.isCoolingDown,
      },
      {
        label: "Almost ready",
        filter: (elf) => 0 < elf.cooldownSeconds && elf.cooldownSeconds <= 2 * 3600,
      },
      {
        label: "Ready soon",
        filter: (elf) => 2 * 3600 < elf.cooldownSeconds && /^\d+$/.test(elf.cooldownString[0]),
      },
      {
        label: "Ready later",
        filter: (elf) => 2 * 3600 < elf.cooldownSeconds && !/^\d+$/.test(elf.cooldownString[0]),
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
    image: Heal,
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
    image: Synergize,
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
    image: Merchant,
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
    image: Forge,
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
    image: Passive,
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
    image: Campaign,
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
    image: Bloodthirst,
    sections: [
      {
        label: "Ready to Bloodthirst",
        filter: (elf) => !elf.isCoolingDown,
        required: true,
      },
      {
        label: "In Bloodthirst",
        filter: (elf) => elf.isCoolingDown && elf.didBloodthirst,
        readonly: true,
      },
    ],
  },
  {
    path: "rampage",
    label: "Rampage",
    image: Rampage,
    sections: [
      {
        label: "Ready to Rampage",
        filter: (elf) => !elf.isCoolingDown,
        required: true,
      },
      {
        label: "In Rampage",
        filter: (elf) => elf.isCoolingDown && elf.didRampage,
        readonly: true,
      },
    ],
  },
];

export default actions;