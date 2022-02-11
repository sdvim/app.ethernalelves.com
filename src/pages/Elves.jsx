import React, { useState, useMemo } from "react";
import { Avatar } from "../components";
import { timestampToHealthPercentage } from "../Utils";
import { useDispatch, useTrackedState } from "../Store";

export default function Home() {
  const [displayType, setDisplayType] = useState("level");
  const dispatch = useDispatch();
  const state = useTrackedState();
  const { elves, selection } = state.user;

  const sections = useMemo(() => {
    const collections = [
      {
        title: "Idle",
        elves: [],
      },
      {
        title: "Active",
        elves: [],
      },
      {
        title: "Passive",
        elves: [],
      },
    ];

    elves.forEach((elf) => {
      elf.isSelected = selection?.includes(elf.id);
      elf.healthPercentage = timestampToHealthPercentage(elf.timestamp);
      switch (elf.action) {
        case 3:
          collections[2].elves.push(elf);
          break;
        default:
          collections[elf.isCoolingDown ? 1 : 0].elves.push(elf);
          break;
      }
    });

    return collections;
  }, [elves, selection]);

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
                  healthPercentage={data.healthPercentage}
                  hideBars={data.action === 3}
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
    </div>
  );
}
