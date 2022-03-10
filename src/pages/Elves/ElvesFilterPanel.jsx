import { displayTypes, viewTypes } from "./Elves";

export function ElvesFilterPanel({
  displayType,
  viewType,
  onDisplayTypeChange,
  onViewTypeChange,
}) {
  return (
    <div className="ElvesFilterPanel">
      <form>
      { displayTypes.map(({ attr, label }) => 
        <label key={`displayType-${attr}`}>
          <input
            type="radio"
            name="display"
            value={attr}
            checked={displayType.attr === attr}
            onChange={onDisplayTypeChange}
          />
          <span>{ label }</span>
        </label>
      ) }
    </form>
    <form>
      { viewTypes.map(({ view, label }) => 
        <label key={`viewType-${view}`}>
          <input
            type="radio"
            name="view"
            value={view}
            checked={viewType.view === view}
            onChange={onViewTypeChange}
          />
          <span>{ label }</span>
        </label>
      )}
    </form>
    </div>
  )
}