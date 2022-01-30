import ElvesData from "./data/elves";
import PlaceholderElf from "./data/PlaceholderElf.svg";
import { useReducer } from "react";
import { createContainer } from "react-tracked";

const initialState = {
  ren: 400,
  elves: ElvesData,
  selectedGroupId: null,
  selection: [],
};

let nextId = ElvesData.length + 1;

export const MAX_SELECTION_SIZE = 8;
export const MINT_PRICE_REN = 200;
export const ELF_ACTION = {
  UNSTAKE: 0,
  SEND_CAMPAIGN: 3,
  SEND_PASSIVE: 4,
  REROLL_WEAPON: 5,
  REROLL_ITEMS: 6,
  HEAL: 7,
};

const reducer = (state, action) => {
  switch (action.type) {
    case "UPDATE_SELECTION":
      let { selection, selectedGroupId } = state;
      let newSelection;
      if (selectedGroupId === null || selectedGroupId !== action.sectionId) {
        // Set
        newSelection = [action.id];
      } else if (selection.includes(action.id)) {
        // Remove
        newSelection = selection.filter((id) => id !== action.id);
      } else if (selection.length === MAX_SELECTION_SIZE) {
        // Cycle
        newSelection = [...selection.slice(1), action.id];
      } else {
        // Add
        newSelection = [...selection, action.id];
      }
      return {
        ...state,
        selection: newSelection,
        selectedGroupId: newSelection.length > 0 ? action.sectionId : null,
      };
    case "UPDATE_REN":
      return {
        ...state,
        ren: state.ren + action.value,
      };
    case "SET_ELF_ACTION":
      return {
        ...state,
        selection: [],
        selectedGroupId: null,
        elves: [...state.elves.map((elf) => {
          return {
            ...elf,
            action: state.selection.includes(elf.id)
              ? ELF_ACTION[action.key]
              : elf.action,
          };
        })],
      };
    case "MINT_ELF":
      if (state.ren >= MINT_PRICE_REN) {
        return {
          ...state,
          ren: state.ren - MINT_PRICE_REN,
          elves: [...state.elves, {
            id: nextId++,
            action: 0,
            attack: 1,
            class: 1,
            hair: 1,
            image: PlaceholderElf,
            inventory: [],
            name: `Elf #${nextId}`,
            level: Math.ceil(Math.random() * 10),
            primaryWeapon: 1,
            race: 1,
            time: new Date(),
            weaponTier: 1,
          }]
        };
      } else {
        return state;
      }
    default:
      return state;
  }
};

const useValue = () => useReducer(reducer, initialState);

export const {
  Provider,
  useTrackedState,
  useUpdate: useDispatch,
} = createContainer(useValue);