import { ButtonGroup } from "../../components";
import { displayTypes, viewTypes } from "./Elves";

export function ElvesFilterPanel({
  onDisplayTypeChange,
  onViewTypeChange,
}) {
  return (
    <div className="ElvesFilterPanel">
      <ButtonGroup
        groupName="Sort by"
        items={displayTypes}
        onValueChange={onDisplayTypeChange}
      />
      <ButtonGroup
        groupName="View as"
        items={viewTypes}
        onValueChange={onViewTypeChange}
      />
    </div>
  )
}