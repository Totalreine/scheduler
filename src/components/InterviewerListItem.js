import React from "react";
import "components/InterviewerListItem.scss";
import classNames from "classnames";

export default function InterviewerListItem(props) {
  let ivName = "";

  if (props.selected) {
    ivName = `${props.name}`;
  }

  let interviewerClass = classNames("interviewers__item", {
    "interviewers__item--selected": props.selected,
  });

  return (
    <li className={interviewerClass} onClick={props.setInterviewer}>
      <img
        className="interviewers__item-image"
        src={`${props.avatar}`}
        alt={`${props.name}`}
      />
      {ivName}
    </li>
  );
}
