import { Hardware } from "@areatechnology/shields-react";
import { inRange } from "../Utils";
import {
  SELECTION_LIMIT,
  CAMPAIGN_LEVEL_LIMIT,
  SYNERGIZE_COST_REN,
  MERCHANT_COST_REN,
  FORGE_COST_REN,
} from "./";

const actions = [
  {
    path: "*",
    label: "Default",
    hidden: true,
    sections: [
      {
        label: "Ready",
        filter: (elf) => !elf.didBridge && elf.isReady,
        readonly: true,
      },
      {
        label: "Almost ready",
        filter: (elf) => 0 < elf.cooldownSeconds && elf.cooldownSeconds <= 2 * 3600,
        readonly: true,
      },
      {
        label: "Ready soon",
        filter: (elf) => 2 * 3600 < elf.cooldownSeconds && /^\d+$/.test(elf.cooldownString[0]),
        readonly: true,
      },
      {
        label: "Ready later",
        filter: (elf) => 2 * 3600 < elf.cooldownSeconds && !/^\d+$/.test(elf.cooldownString[0]),
        readonly: true,
      },
      {
        label: "Passive",
        filter: (elf) => elf.didPassive,
        readonly: true,
      },
      {
        label: "Bridged (Polygon)",
        filter: (elf) => elf.didBridge,
        readonly: true,
      },
    ],
  },
  {
    path: "merchant",
    label: "Merchant",
    image: <Hardware hardwareId={29} />, // Cauldron
    cost: MERCHANT_COST_REN,
    text: "Reroll items for #ELVES and burn #REN $REN?",
    sections: [
      {
        label: "Itemless",
        filter: (elf) => !elf.didPassive && !elf.hasInventory,
      },
      {
        label: "Has Item",
        filter: (elf) => !elf.didPassive && elf.hasInventory,
      },
    ],
  },
  {
    path: "forge",
    label: "Forge",
    image: <Hardware hardwareId={24} />, // Anvil
    cost: FORGE_COST_REN,
    text: "Reroll weapons for #ELVES and burn #REN $REN?",
    sections: [
      {
        label: "Tier 0-1",
        filter: (elf) => !elf.didPassive && inRange(0, elf.weaponTier, 1),
      },
      {
        label: "Tier 2-3",
        filter: (elf) => !elf.didPassive && inRange(2, elf.weaponTier, 3),
      },
      {
        label: "Tier 4-5",
        filter: (elf) => !elf.didPassive && (3 < elf.weaponTier),
      },
    ],
  },
  {
    path: "synergize",
    label: "Synergize",
    image: <Hardware hardwareId={23} />, // Pocketwatch
    cost: SYNERGIZE_COST_REN,
    text: "Reroll cooldown for #ELVES and burn #REN $REN?",
    sections: [
      {
        label: "Able to Synergize",
        filter: (elf) => elf.isAbleToSynergize,
        required: true,
      },
    ],
  },
  {
    path: "heal",
    label: "Heal",
    image: <Hardware hardwareId={25} />, // Crozier
    text: "Heal #ELVES?",
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
    path: "passive",
    label: "Passive",
    image: <Hardware hardwareId={84} />, // Lyre
    text: "Send #ELVES to Passive?",
    sections: [
      {
        label: "Ready for Passive",
        filter: (elf) => elf.isReady,
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
    image: <Hardware hardwareId={87} />, // Castle
    text: "Send #ELVES to #CAMPAIGN?",
    sections: [
      {
        label: "Ready to Campaign",
        filter: (elf) => elf.isReady && elf.statLevel <= CAMPAIGN_LEVEL_LIMIT,
        required: true,
      },
      {
        label: "In Campaign",
        filter: (elf) => elf.isCoolingDown && elf.didCampaign,
        readonly: true,
      },
    ],
  },
  {
    path: "bloodthirst",
    label: "Bloodthirst",
    image: <Hardware hardwareId={64} />, // Pickaxe
    text: "Send #ELVES to Bloodthirst?",
    sections: [
      {
        label: "Ready to Bloodthirst",
        filter: (elf) => elf.isReady,
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
    image: <Hardware hardwareId={94} />, // Torch
    text: "Send #ELVES to #RAMPAGE and burn #REN?",
    sections: [
      {
        label: "Ready to Rampage",
        filter: (elf) => elf.isReady,
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