import PlaceholderElf from "./data/PlaceholderElf.svg";
import { useReducerAsync } from "use-reducer-async";
import { createContainer } from "react-tracked";
import Moralis from "moralis/dist/moralis.min.js";
import env from "react-dotenv";
import { useEffect } from "react";

const storageKey = "ethernalElves";
const initialState = {
  isMoralisConnected: false,
  pending: false,
  user: {
    ren: 0,
    nextId: 0,
    elves: [],
    selection: [],
    wallet: null,
  },
};

export const MINT_PRICE_REN = 200;
export const ELF_ACTION = {
  UNSTAKE: 0,
  SEND_CAMPAIGN: 3,
  SEND_PASSIVE: 4,
  REROLL_WEAPON: 5,
  REROLL_ITEMS: 6,
  HEAL: 7,
};

const init = () => {
  if (typeof window === "undefined") return initialState;
  const preloadedState = JSON.parse(window.localStorage.getItem(storageKey));
  if (preloadedState) preloadedState.isMoralisConnected = false;
  return preloadedState || initialState;
}

const reducer = (state, action) => {
  switch (action.type) {
    case "UPDATE_MORALIS_CONNECTED":
      return { ...state,  isMoralisConnected: true, };
    case "SHOW_ERROR":
      console.error(action.error);
      return null;
    
    // User Actions
    case "UPDATE_SELECTION":
      const { selection } = state.user;
      return {
        ...state,
        user: {
          ...state.user,
          selection: selection.includes(action.id)
          ? selection.filter((id) => id !== action.id)
          : [...selection, action.id],
        },
      };
    case "UPDATE_WALLET":
      const { wallet } = action;
      const user = (wallet)
        ? { ...state.user, wallet }
        : { ...initialState.user };
      return { ...state, user };
    case "UPDATE_REN":
      return { ...state, user: {
        ...state.user,
        ren: state.user.ren + action.value,
      }};
    // case "SET_ELF_ACTION":
    //   return {
    //     ...state,
    //     selection: [],
    //     elves: [...state.elves.map((elf) => {
    //       return {
    //         ...elf,
    //         action: state.selection.includes(elf.id)
    //           ? ELF_ACTION[action.key]
    //           : elf.action,
    //       };
    //     })],
    //   };
    case "MINT_ELF":
      if (state.user.ren >= MINT_PRICE_REN) {
        const nextId = state.user.nextId + 1;
        return {
          ...state,
          user: {
            ...state.user,
            nextId,
            ren: state.user.ren - MINT_PRICE_REN,
            elves: [...state.user.elves, {
              id: nextId,
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
          },
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
      dispatch({ type: "UPDATE_MORALIS_CONNECTED" });
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
      await Moralis.User.logOut().then(() => {
        dispatch({ type: "UPDATE_WALLET", wallet: null });
      });
    },
  GET_TOKENS: ({ dispatch }) =>
    async (action) => {

    },
};

const useValue = () => {
  const [state, dispatch] = useReducerAsync(reducer, init(), asyncActionHandlers);
  useEffect(() => {
    window.localStorage.setItem(storageKey, JSON.stringify(state));
  }, [state]);

  return [state, dispatch];
};

export const {
  Provider,
  useTrackedState,
  useUpdate: useDispatch,
} = createContainer(useValue);