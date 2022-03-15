import { useReducerAsync } from "use-reducer-async";
import { createContainer } from "react-tracked";
import Moralis from "moralis/dist/moralis.min.js";
import { useEffect } from "react";
import WalletConnectProvider from "@walletconnect/web3-provider";
import { fetchElfDataByIds } from "./Utils.js";

const storageKey = "ethernalElves";
const initialState = {
  isMoralisConnected: false,
  pending: false,
  errors: [],
  chain: "eth",
  user: {
    address: null,
    ren: 0,
    elfData: [],
    selection: [],
  },
};
const ELF_PAGE_LIMIT = 50;

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
    case "UPDATE_CHAIN":
      return { ...state, chain: action.chain };
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
    case "CLEAR_SELECTION":
      return { ...state, user: { ...state.user, selection: [] } };
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
    case "UPDATE_ELF_DATA":
      return { ...state, user: { ...state.user, elfData: action.elfData } };
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
    default:
      return state;
  }
};

const asyncActionHandlers = {
  INITIALIZE_MORALIS: ({ dispatch }) =>
    async (action) => {
      let appId = process.env.REACT_APP_MORALIS_APP_ID;
      let serverUrl = process.env.REACT_APP_MORALIS_SERVER_URL;
      let infuraId = process.env.REACT_APP_INFURA_ID;
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
      let infuraId = process.env.REACT_APP_INFURA_ID;
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
          dispatch({ type: "UPDATE_ADDRESS", address });
          dispatch({ type: "LOAD_ELF_DATA" });
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
  TOGGLE_CHAIN: ({ dispatch, getState }) =>
    async (action) => {
      const chain = getState().chain === "eth" ? "polygon" : "eth";
      dispatch({ type: "UPDATE_CHAIN", chain });
      dispatch({ type: "LOAD_ELF_DATA", address: getState().user?.address });
    },
  LOAD_ELF_DATA: ({ dispatch, getState }) =>
    async (action) => {
      if (!getState().user?.address) {
        dispatch({ type: "SHOW_ERROR", message: "Address unknown" });
        return false;
      }

      await Moralis.enableWeb3();

      const { chain, user: { address } } = getState();
      const elfIds = [];
      const elvesQuery = new Moralis.Query(Moralis.Object.extend("Elves"));
      let isMoreElves = true;
      let page = 1;

      while (isMoreElves) {
        let currentIndex = ELF_PAGE_LIMIT * page;

        elvesQuery.equalTo("owner_of", address);
        if (chain !== "eth") elvesQuery.equalTo("chain", chain);
        elvesQuery.limit(ELF_PAGE_LIMIT);
        elvesQuery.skip(ELF_PAGE_LIMIT * (page - 1));
        elvesQuery.withCount();

        let response = await elvesQuery.find();
        isMoreElves = currentIndex < response.count;
        elfIds.push(...response.results.map((obj) => obj.attributes.token_id));
        page++;
      }

      let elfData = await fetchElfDataByIds(elfIds, chain);
      if (elfData) {
        dispatch({ type: "UPDATE_ELF_DATA", elfData });
      }
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