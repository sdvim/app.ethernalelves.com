import { forwardRef } from "react";
import { ButtonGroup } from "../../components";
import { displayTypes, viewTypes } from "./Elves";

export const ElvesFilterPanel = forwardRef(({
  onDisplayTypeChange,
  onViewTypeChange,
}, ref) => {
  return (
    <div className="ElvesFilterPanel" ref={ref}>
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
});
