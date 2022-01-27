import { useState } from "react";
import { createContainer } from "react-tracked";

const initialState = {
  ren: 400,
  elves: [],
};

const useValue = () => useState(initialState);

export const {
  Provider,
  useTrackedState,
  useUpdate: useSetState,
} = createContainer(useValue);