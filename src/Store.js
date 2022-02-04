import PlaceholderElf from "./data/PlaceholderElf.svg";
import { useReducer } from "react";
import { createContainer } from "react-tracked";

const initialState = {
  ren: 400,
  elves: [],
  selection: [],
};

let nextId = 0;

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
      let { selection } = state;
      return {
        ...state,
        selection: selection.includes(action.id)
          ? selection.filter((id) => id !== action.id)
          : [...selection, action.id],
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