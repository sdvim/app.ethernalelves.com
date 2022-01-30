import React, { useState, useMemo, useEffect } from "react";
import { Avatar } from "../components";
import CharacterWindow from "../components/CharacterWindow";
import { useDispatch, useTrackedState, MINT_PRICE_REN } from "../Store";

const MAX_SELECTION_SIZE = 8;

export default function Home() {
  const [selectedSection, setSelectedSection] = useState(null);
  const [selection, setSelection] = useState([]);
  const dispatch = useDispatch();
  const state = useTrackedState();

  useEffect(() => {
    const timer = setInterval(() => {
      dispatch({ type: "UPDATE_REN", value: Math.ceil(Math.random() * 20) });
    }, 1000);
    return () => clearInterval(timer);
  }, [dispatch]);
  
  const sections = useMemo(() => {
    const unstakeElves = (selection) => {
      dispatch({ type: "UNSTAKE_ELVES", selection });
      setSelectedSection(null);
      setSelection([]);
    }

    const collections = [
      {
        title: "Idle",
        action: "Act",
        onClick: () => null,
        isDisabled: true,
        elves: [],
      },
      {
        title: "Campaign",
        action: "Unstake",
        onClick: () => unstakeElves(selection),
        elves: [],
      },
      {
        title: "Passive",
        action: "Unstake",
        onClick: () => unstakeElves(selection),
        elves: [],
      },
    ];

    state.elves.forEach((elf) => {
      elf.isSelected = selection.includes(elf.id);
      switch (elf.action) {
        case 3:
          collections[1].elves.push(elf);
          break;
        case 4:
          collections[2].elves.push(elf);
          break;
        default:
          collections[0].elves.push(elf);
          break;
      }
    });

    return collections;
  }, [selection, state, dispatch]);

  const handleAvatarClick = (sectionIndex, avatarId) => {
    if (selectedSection === null || selectedSection !== sectionIndex) {
      setSelection([avatarId]);
      setSelectedSection(sectionIndex);
      return;
    }

    if (selection.includes(avatarId)) {
      const reducedSelection = selection.filter((id) => id !== avatarId);
      setSelection(reducedSelection);
      if (reducedSelection.length === 0) {
        setSelectedSection(null);
      }
    } else if (selection.length === MAX_SELECTION_SIZE) {
      const shiftedSelection = selection.slice(1);
      setSelection([...shiftedSelection, avatarId]);
    } else {
      setSelection([...selection, avatarId]);
    }

  };

  const handleMintClick = () => dispatch({ type: "MINT_ELF" });
  const mintButtonDisabled = state.ren < MINT_PRICE_REN;

  const sectionsDOM = sections.map((section, sectionIndex) => {
    const isSelected = selectedSection === sectionIndex;
    const maxSize = Math.min(section.elves.length, MAX_SELECTION_SIZE);
    const selectionCount = `(${selection.length}/${maxSize})`;
    const buttonLabel = `${section.action} ${selectionCount}`;
    if (maxSize <= 0) return null;
    return (
      <React.Fragment key={sectionIndex}>
        <div className="tmp-flex">
          <h2 key={`${section.title}`}>
            { section.title }:
            { section.elves.length }
          </h2>
          { isSelected &&
            <button onClick={section.onClick} disabled={section.isDisabled}>
              { buttonLabel }
            </button>
          }
        </div>
        <div key={`${sectionIndex}-grid`} className="tmp-grid">
          {
            section.elves.map((data, index) => {
              const selectionIndex = data.isSelected
                ? selection.indexOf(data.id)
                : -1
              return (
                <Avatar
                  key={`${sectionIndex}-${index}`}
                  image={data.image}
                  isSelected={data.isSelected}
                  selectionIndex={selectionIndex}
                  level={data.level}
                  onClick={() => handleAvatarClick(sectionIndex, data.id)}
                />
              );
            })
          }
        </div>
      </React.Fragment>
    );
  });

  const focusedCharacter = useMemo(() => {
    const selectedId = selection[selection.length - 1];
    return state.elves.find((elf) => elf.id === selectedId);
  }, [selection, state.elves]);

  const handleActionCallback = (data) => {
    dispatch(data);
    setSelection([...selection.slice(0, -1)]);
  }

  return (
    <div className="Home page">
      <h1>Home</h1>
      <button onClick={handleMintClick} disabled={mintButtonDisabled}>
        Mint 1 Elf for { MINT_PRICE_REN } $REN
      </button>
      <p>Earn free $REN by staring at this page.</p>
      { sectionsDOM }
      { focusedCharacter &&
        <CharacterWindow
          character={focusedCharacter}
          actionCallback={handleActionCallback}
        />
      }
    </div>
  );
}
