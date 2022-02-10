import elvesABI from "./abi/elves.json";
import { Multicall } from "ethereum-multicall";
import PlaceholderElf from "./data/PlaceholderElf.svg";
import { useReducerAsync } from "use-reducer-async";
import { createContainer } from "react-tracked";
import Moralis from "moralis/dist/moralis.min.js";
import env from "react-dotenv";
import { useEffect } from "react";
import WalletConnectProvider from "@walletconnect/web3-provider";

const storageKey = "ethernalElves";
const initialState = {
  isMoralisConnected: false,
  pending: false,
  errors: [],
  user: {
    address: null,
    ren: 0,
    nextId: 0,
    elves: [],
    elfIds: [],
    selection: [],
  },
};

const ELVES_CONTRACT = "0xA351B769A01B445C04AA1b8E6275e03ec05C1E75";
const MIREN_CONTRACT = "0xe6b055abb1c40b6c0bf3a4ae126b6b8dbe6c5f3f";
const CAMPAIGNS_CONTRACT = "0x367Dd3A23451B8Cc94F7EC1ecc5b3db3745D254e";
const ELF_PAGE_LIMIT = 50;

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
  if (preloadedState) {
    preloadedState.isMoralisConnected = false;
    preloadedState.errors = [];
  }
  return { ...initialState, ...preloadedState };
}

const reducer = (state, action) => {
  switch (action.type) {
    case "UPDATE_MORALIS_CONNECTED":
      return { ...state, isMoralisConnected: true, };
    case "SHOW_ERROR":
      return {
        ...state,
        errors: [
          ...state.errors,
          action.message
        ]
      };
    
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
    case "UPDATE_ELF_IDS":
      return { ...state, user: { ...state.user, elfIds: action.elfIds } };
    case "UPDATE_ADDRESS":
      const { address } = action;
      const user = (address)
        ? { ...state.user, address }
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
      let infuraId = env.INFURA_ID;
      let provider = window.ethereum?.isMetaMask
        ? "metamask"
        : new WalletConnectProvider({ infuraId });
      
      Moralis.start({ serverUrl, appId });
      Moralis.enableWeb3({ provider });
      Moralis.onWeb3Enabled((result) => {
        dispatch({ type: "UPDATE_MORALIS_CONNECTED" });
      });
    },
  CONNECT_WALLET: ({ dispatch }) =>
    async (action) => {
      let infuraId = env.INFURA_ID;
      let provider = window.ethereum?.isMetaMask
        ? "metamask"
        : new WalletConnectProvider({ infuraId });

      if (provider !== "metamask") {
        try {
          await provider.enable();
        } catch (error) {
          dispatch({ type: "SHOW_ERROR", message: error.message });
        }
      }

      try {
        await Moralis.Web3.authenticate({
          provider,
          mobileLinks: ["metamask", "rainbow"],
          signingMessage: "Log into Ethernal Elves dApp"
        }).then((user) => {
          let address = user.get("ethAddress");
          dispatch({ type: "LOAD_ELVES", address });
          dispatch({ type: "UPDATE_ADDRESS", address });
        }).catch((error) => {
          dispatch({ type: "SHOW_ERROR", message: error.message });
        });
      } catch (error) {
        dispatch({ type: "SHOW_ERROR", error: "RIP" });
      }
    },
  DISCONNECT_WALLET: ({ dispatch }) =>
    async (action) => {
      await Moralis.User.logOut().then(() => {
        dispatch({ type: "UPDATE_ADDRESS", address: null });
      });
    },
  LOAD_ELVES: ({ dispatch }) =>
    async (action) => {
      await Moralis.enableWeb3();

      let elfIds = [];
      let elvesQuery = new Moralis.Query(Moralis.Object.extend("Elves"));
      let isMoreElves = true;
      let page = 1;

      while (isMoreElves) {
        let currentIndex = ELF_PAGE_LIMIT * page;

        elvesQuery.equalTo("owner_of", action.address);
        elvesQuery.limit(ELF_PAGE_LIMIT);
        elvesQuery.skip(ELF_PAGE_LIMIT * (page - 1));
        elvesQuery.withCount();

        let response = await elvesQuery.find();
        isMoreElves = currentIndex < response.count;
        elfIds.push(...response.results.map((obj) => obj.attributes.token_id));
        page++;
      }

      dispatch({ type: "UPDATE_ELF_IDS", elfIds });

      lookupMultipleElves(elfIds);
    },
};

const lookupMultipleElves = async (elfIds) => {
  if (!elfIds || elfIds.length < 1) return;

  console.log(elfIds);
  console.log(typeof elfIds);

  const calls = ["elves", "attributes", "ownerOfCall", "tokenURI"];
  const txArr = elfIds.map((id) => ({
    reference: `Elves${id}`,
    contractAddress: ELVES_CONTRACT,
    abi: elvesABI.abi,
    calls: calls.map((call) => ({
      reference: `${call}${id}`,
      methodName: call,
      methodParameters: [id],
    }))
  }));

  // console.log(txArr);

  const web3Instance = await Moralis.enableWeb3();
  // console.log(web3Instance);

  const multicall = new Multicall({ web3Instance, tryAggregate: true });
  console.log(multicall);

  // const results = await multicall.call(txArr);
  // console.log(results);
  
}

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