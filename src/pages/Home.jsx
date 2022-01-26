import React, { useState, useMemo } from "react";
import ElvesData from "../data/elves";
import { Avatar } from "../components";

const MAX_SELECTION_SIZE = 8;

export default function Home() {
  const [selectedSection, setSelectedSection] = useState(null);
  const [selection, setSelection] = useState([]);
  
  const sections = useMemo(() => {
    const swag = [
      {
        title: "Idle",
        action: "Act",
        elves: [],
      },
      {
        title: "Campaign",
        action: "Unstake",
        elves: [],
      },
      {
        title: "Passive",
        action: "Unstake",
        elves: [],
      },
    ];

    ElvesData.forEach((elf) => {
      elf.isSelected = selection.includes(elf.id);
      switch (elf.action) {
        case 3:
          swag[1].elves.push(elf);
          break;
        case 4:
          swag[2].elves.push(elf);
          break;
        default:
          swag[0].elves.push(elf);
          break;
      }
    });

    return swag;
  }, [selection]);

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

  const sectionsDOM = sections.map((section, sectionIndex) => {
    const isSelected = selectedSection === sectionIndex;
    const maxSize = Math.min(section.elves.length, MAX_SELECTION_SIZE);
    const selectionCount = `(${selection.length}/${maxSize})`;
    const buttonLabel = `${section.action} ${selectionCount}`;
    return (
      <React.Fragment key={sectionIndex}>
        <div class="tmp-flex">
          <h2 key={`${section.title}`}>{ section.title }</h2>
          { isSelected && <button>{ buttonLabel }</button> }
        </div>
        <div key={`${sectionIndex}-grid`} className="tmp-grid">
          {
            section.elves.map((data, index) =>
              <Avatar
                key={`${sectionIndex}-${index}`}
                data-id={data.id}
                data-action={data.action}
                isSelected={data.isSelected}
                onClick={() => handleAvatarClick(sectionIndex, data.id)}
              />
            )
          }
        </div>
      </React.Fragment>
    );
  });

  return (
    <div className="Home page">
      <h1>Home</h1>
      <button>Mint 1 Elf</button>
      { sectionsDOM }
    </div>
  );
}
