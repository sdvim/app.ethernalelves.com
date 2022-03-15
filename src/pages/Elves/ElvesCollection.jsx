import { useEffect, useMemo, useState } from "react";
import { Avatar } from "../../components";
import { useDispatch, useTrackedState } from "../../Store";
import { pluralizeElves } from "../../Utils";

const attrToDisplayString = ({ elf, attr }) => {
  switch (attr) {
    case "lastActionTimestamp": return elf.isCoolingDown && elf.cooldownString;
    case "statLevel": return elf.levelString;
    case "weaponTier": return elf.weaponTierString;
    case "id":
    default: return elf.idString;
  }
}

const SectionHeader = ({ section: { label, elves }}) => {
  return (
    <h3 key={`${label}`} className="ElvesCollection__header">
    <span>{ label }</span>
    <span className="ElvesCollection__count">
      { pluralizeElves(elves.length) }
    </span>
  </h3>
  );
}

const SectionElfItem = ({ elf, attr, view }) => {
  const dispatch = useDispatch();
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [nextUpdate, setNextUpdate] = useState(1000);
  const { user: { selection } } = useTrackedState();

  useEffect(() => {
    // TODO(sdvim): clean up; ensure slower cooldown for further times
    const interval = setInterval(() => {
      if (0 <= elf.cooldownSeconds && elf.cooldownSeconds <= (2 * 3600)) {
        if (nextUpdate !== 1000) setNextUpdate(1000);
        setLastUpdated(new Date());
        return;
      }
    }, nextUpdate);
    return () => clearInterval(interval);
  }, [elf.cooldownSeconds, nextUpdate]);

  return useMemo(() => {
    const isSelected = selection?.includes(elf.id);
    const onClick = () => !elf.didBridge && dispatch({
      type: "UPDATE_SELECTION",
      id: elf.id,
    });

    return (view === "grid")
     ? <Avatar
          image={elf.image}
          isSelected={isSelected}
          healthPercentage={elf.healthPercentage}
          hideBars={!elf.isCoolingDown}
          display={attrToDisplayString({ elf, attr })}
          onClick={onClick}
          lastUpdated={lastUpdated}
        />
      : <div
          className="ElvesCollection__list-item"
          onClick={onClick}
        >
          <Avatar
            image={elf.image}
            isSelected={isSelected}
            healthPercentage={elf.healthPercentage}
            hideBars={elf.didPassive}
            lastUpdated={lastUpdated}
          />
          <span>{ elf.idString }</span>
          <span>{ elf.actionString }</span>
          <span>{ elf.levelString }</span>
          <span>{ elf.cooldownString }</span>
          { elf.hasInventory && (
            <>
              <img className="item-image" src={elf.inventoryObject.image} alt="" />
              <strong>{ elf.inventoryObject.text }</strong>
              <span>{ elf.inventoryObject.description }</span>
            </>
          ) }
        </div>
  }, [attr, dispatch, elf, lastUpdated, selection, view]);
}

export function ElvesCollection({
  sections,
  displayType: { attr },
  viewType: { view },
}) {
  const filteredSections = sections.filter((section) => section.elves?.length > 0);

  return (
    <div className="ElvesCollection">
      { filteredSections.map((section, sectionIndex) => 
        <section key={sectionIndex}>
          <SectionHeader section={section} />
          <div key={`${sectionIndex}-view`} className={`ElvesCollection__${view}`}>
            { section.elves.map((elf, elfIndex) =>
              <SectionElfItem
                elf={elf}
                attr={attr}
                view={view}
                key={`${sectionIndex}-${elfIndex}`}
              />
            )}
          </div>
        </section>
      )}
    </div>
  );
}