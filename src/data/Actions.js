import { SELECTION_LIMIT, CAMPAIGN_LEVEL_LIMIT } from "./";

const actions = [
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
        filter: (elf) => elf.isCoolingDown && elf.didBloodthirst,
        readonly: true,
      },
    ],
  },
];

export default actions;