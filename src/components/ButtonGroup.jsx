import { useState } from "react";
import "./ButtonGroup.scss";

export default function ButtonGroup({
  groupName,
  items = [],
  onValueChange,
}) {
  const [checked, setChecked] = useState(items[0]);

  const onChange = (e) => {
    const newValue = items.find(({ value }) => value === e.target.value);
    setChecked(newValue);
    onValueChange(newValue);
  };

  return (
    <form className="ButtonGroup">
      <label className="ButtonGroup__container">
        <span className="ButtonGroup__group-name">{ groupName }</span>
        { items.map(({ value, label }) => 
          <label
            className="ButtonGroup__item"
            key={`${groupName}-${value}`}
          >
            <input
              type="radio"
              name={groupName}
              value={value}
              checked={checked.value === value}
              onChange={onChange}
            />
            <span>{ label }</span>
          </label>
        ) }
      </label>
    </form>
  );
}

