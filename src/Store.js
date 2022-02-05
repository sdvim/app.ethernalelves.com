import PlaceholderElf from "./data/PlaceholderElf.svg";
import { useReducerAsync } from "use-reducer-async";
import { createContainer } from "react-tracked";
import Moralis from "moralis/dist/moralis.min.js";
import env from "react-dotenv";

const initialState = {
  ren: 0,
  elves: [],
  selection: [],
  isMoralisConnected: false,
  pending: false,
  wallet: null,
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
    case "MORALIS_CONNECTED":
      return { ...state,  isMoralisConnected: true, };
    case "UPDATE_SELECTION":
      let { selection } = state;
      return {
        ...state,
        selection: selection.includes(action.id)
          ? selection.filter((id) => id !== action.id)
          : [...selection, action.id],
      };
    case "SHOW_ERROR":
      console.log(action.error);
      return null;
    case "UPDATE_WALLET":
      console.log(action.wallet);
      return { ...state,  wallet: action.wallet, };
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

const asyncActionHandlers = {
  INITIALIZE_MORALIS: ({ dispatch }) =>
    async (action) => {
      let appId = env.MORALIS_APP_ID;
      let serverUrl = env.MORALIS_SERVER_URL;
      Moralis.start({ serverUrl, appId });
      dispatch({ type: "MORALIS_CONNECTED" });
    },
  CONNECT_WALLET: ({ dispatch }) =>
    async (action) => {
      await Moralis.authenticate({
        signingMessage: "Log into Ethernal Elves dApp"
      }).then((user) => {
        dispatch({ type: "UPDATE_WALLET", wallet: user.get("ethAddress") });
      }).catch((error) => {
        dispatch({ type: "SHOW_ERROR", error });
      });
      
    },
  DISCONNECT_WALLET: ({ dispatch }) =>
    async (action) => {
      Moralis.User.logOut();
    },
  GET_TOKENS: ({ dispatch }) =>
    async (action) => {

    },
};

const useValue = () => useReducerAsync(reducer, initialState, asyncActionHandlers);

export const {
  Provider,
  useTrackedState,
  useUpdate: useDispatch,
} = createContainer(useValue);