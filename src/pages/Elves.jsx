import React, { useState, useMemo } from "react";
import { Avatar } from "../components";
import { timestampToTimeString, timestampToHealthPercentage } from "../Utils";
import { useDispatch, useTrackedState } from "../Store";

const displayTypes = [
  {
    key: "time",
    label: "Time",
  },
  {
    key: "level",
    label: "Level",
  },
  {
    key: "id",
    label: "ID",
  },
];

export default function Home() {
  const [displayType, setDisplayType] = useState(displayTypes[0].key);
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
      switch (displayType) {
        case "time":
          elf.display = timestampToTimeString(elf.timestamp);
          elf.sort = elf.timestamp;
          break;
        case "level":
          elf.display = `Lv. ${elf.level}`;
          elf.sort = elf.level;
          break;
        case "id":
        default:
          elf.display = `#${elf.id}`;
          elf.sort = elf.id;
          break;
      }
      switch (elf.action) {
        case 3:
          collections[2].elves.push(elf);
          break;
        default:
          let isCoolingDown = elf.timestamp > +new Date() / 1000;
          collections[isCoolingDown ? 1 : 0].elves.push(elf);
          break;
      }
    });

    collections.forEach((collection) => {
      collection.elves.sort((a, b) => a.sort - b.sort);
    });

    return collections;
  }, [displayType, elves, selection]);

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
              return (
                <Avatar
                  key={`${sectionIndex}-${index}`}
                  image={data.image}
                  isSelected={data.isSelected}
                  display={data.display}
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
        { displayTypes.map(({ key, label }) => 
          <label key={`displayType-${key}`}>
            <input
              type="radio"
              name="display"
              value={key}
              checked={displayType === key}
              onChange={handleDisplayTypeChange}
            />
            <span>{label}</span>
          </label>
        )}
      </form>
      { sectionsDOM }
    </div>
  );
}
