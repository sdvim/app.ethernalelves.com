import React, { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Avatar } from "../components";
import {
  useDispatch,
  useTrackedState,
  MINT_PRICE_REN,
} from "../Store";

export default function Home() {
  const [displayType, setDisplayType] = useState("level");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const state = useTrackedState();
  const { elves, ren, selection } = state.user;

  useEffect(() => {
    const timer = setInterval(() => {
      dispatch({ type: "UPDATE_REN", value: Math.ceil(Math.random() * 20) });
    }, 1000);
    return () => clearInterval(timer);
  }, [dispatch]);

  const sections = useMemo(() => {
    const collections = [
      {
        title: "Idle",
        action: "Take Action",
        onClick: () => navigate("/actions"),
        elves: [],
      },
      {
        title: "Passive",
        action: "Unstake",
        onClick: () => dispatch({ type: "SET_ELF_ACTION", key: "UNSTAKE" }),
        elves: [],
      },
      {
        title: "Campaign",
        elves: [],
      },
    ];

    elves.forEach((elf) => {
      elf.isSelected = selection?.includes(elf.id);
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
  }, [elves, selection, dispatch, navigate]);

  const mintButtonDisabled = ren < MINT_PRICE_REN;

  const sectionsDOM = sections.map((section, sectionIndex) => {
    return (section.elves.length > 0) && (
      <React.Fragment key={sectionIndex}>
        <div className="tmp-flex">
          <h2 key={`${section.title}`}>
            { section.title }:{ " " }
            { section.elves.length }
          </h2>
          { section.action &&
            <button onClick={section.onClick} disabled={section.isDisabled}>
              {section.action}
            </button>
          }
        </div>
        <div key={`${sectionIndex}-grid`} className="tmp-grid">
          {
            section.elves.map((data, index) => {
              const display = (displayType === "level")
                ? `Lv. ${data.level}`
                : (displayType === "id")
                  ? `#${data.id}`
                  : null;
              return (
                <Avatar
                  key={`${sectionIndex}-${index}`}
                  image={data.image}
                  isSelected={data.isSelected}
                  display={display}
                  onClick={() => dispatch({
                    type: "UPDATE_SELECTION",
                    id: data.id,
                    sectionId: sectionIndex,
                  })}
                />
              );
            })
          }
        </div>
      </React.Fragment>
    );
  });

  const handleDisplayTypeChange = (e) => {
    setDisplayType(e.target.value);
  };

  return (
    <div className="Home page">
      <button
        onClick={() => dispatch({ type: "MINT_ELF" })}
        disabled={mintButtonDisabled}
      >
        Mint 1 Elf for { MINT_PRICE_REN } $REN
      </button>
      <p>Balance: {ren} $REN</p>
      <p>Earn free $REN by staring at this page.</p>
      <form>
        <label>
          <input
            type="radio"
            name="display"
            value="level"
            checked={displayType === "level"}
            onChange={handleDisplayTypeChange}
          />
          <span>Levels</span>
        </label>
        <label>
          <input
            type="radio"
            name="display"
            value="id"
            checked={displayType === "id"}
            onChange={handleDisplayTypeChange}
          />
          <span>IDs</span>
        </label>
      </form>
      { sectionsDOM }
      {/* { focusedCharacter &&
        <Modal
          character={focusedCharacter}
          actionCallback={handleActionCallback}
        />
      } */}
    </div>
  );
}
