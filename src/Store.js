import ElvesData from "./data/elves";
import { useReducer } from "react";
import { createContainer } from "react-tracked";

const initialState = {
  ren: 400,
  elves: ElvesData,
};

let nextId = ElvesData.length + 1;

export const MINT_PRICE_REN = 200;

const reducer = (state, action) => {
  switch (action.type) {
    case "UPDATE_REN":
      return {
        ...state,
        ren: state.ren + action.value,
      }
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
            inventory: [],
            name: `Elf #${nextId}`,
            level: Math.ceil(Math.random() * 10),
            primaryWeapon: 1,
            race: 1,
            time: new Date(),
            weaponTier: 1,
          }]
        }
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