import { Avatar } from "../../components";
import { useDispatch } from "../../Store";

const pluralizeElves = (count) => {
  return `${count} ${count === 1 ? "Elf" : "Elves"}`;
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

export function ElvesCollection({
  sections,
  displayType: { attr },
  viewType: { view },
}) {
  const dispatch = useDispatch();
  const filteredSections = sections.filter((section) => section.elves?.length > 0);

  return (
    <div className="ElvesCollection">
      { filteredSections.map((section, sectionIndex) => 
        <section key={sectionIndex}>
          <SectionHeader section={section} />
          <div key={`${sectionIndex}-view`} className={`ElvesCollection__${view}`}>
            {
              section.elves.map((elf, elfIndex) => {
                const display = (() => {
                  switch (attr) {
                    case "lastActionTimestamp": return elf.isCoolingDown && elf.cooldownString;
                    case "statLevel": return elf.levelString;
                    case "weaponTier": return elf.weaponTierString;
                    case "id":
                    default: return elf.idString;
                  }
                })();
                const onClick = () => !elf.didBridge && dispatch({
                  type: "UPDATE_SELECTION",
                  id: elf.id,
                  sectionId: sectionIndex,
                });
                return (view === "grid")
                  ? <Avatar
                      key={`${sectionIndex}-${elfIndex}`}
                      image={elf.image}
                      isSelected={elf.isSelected}
                      healthPercentage={elf.healthPercentage}
                      hideBars={!elf.isCoolingDown}
                      display={display}
                      onClick={onClick}
                    />
                  : <div
                      className="list-item"
                      key={`${sectionIndex}-${elfIndex}`}
                      onClick={onClick}
                    >
                      <Avatar
                        image={elf.image}
                        isSelected={elf.isSelected}
                        healthPercentage={elf.healthPercentage}
                        hideBars={elf.didPassive}
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
              })
            }
          </div>
        </section>
      )}
    </div>
  );
}