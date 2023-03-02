import React from "react";
import 'components/DayListItem.scss';
import classNames from "classnames";

export default function DayListItem(props) {
  let text = ""
  
    if(props.spots === 0) {
      text = "no spots remaining"
    }
    if(props.spots === 1) {
      text = "1 spot remaining"
    }
    if(props.spots > 1) {
      text = `${props.spots} spots remaining`
    }
  

  let dayClass = classNames("day-list__item", {
    "day-list__item--selected": props.selected,
    "day-list__item--full": props.spots === 0
  })

  return (
    <li onClick={() => {props.setDay(props.name)}} className={dayClass}  data-testid="day">
      <h2 className="text--regular">{props.name}</h2> 
      <h3 className="text--light"> {text} </h3>
    </li>
  );
}
