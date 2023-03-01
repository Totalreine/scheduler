import React from "react";
import 'components/Appointment/styles.scss'
import Header from "./Header";
import Show from "./Show";
import Empty from "./Empty";
import Form from "./Form";
import Status from "./Status";
import Confirm from "./Confirm";
import Error from "./Error";
import { useVisualMode } from "hooks/useVisualMode";

const EMPTY = "EMPTY";
const SHOW = "SHOW";
const CREATE = "CREATE";
const SAVING = "SAVING"
const CONFIRM = "CONFIRM"
const DELETING = "DELETING"
const EDIT = "EDIT"
const ERROR_SAVE = "ERROR_SAVE"
const ERROR_DELETE = "ERROR_DELETE"

export default function Appointment(props) {

    const { mode, transition, back } = useVisualMode(
        props.interview ? SHOW : EMPTY
      );

    function save(name, interviewer) {
        
        const interview = {
            student: name,
            interviewer
        };
        let id = props.id
        transition(SAVING)

        props.bookInterview(id, interview)
        .then(() => {transition(SHOW)})
        .catch(error => transition(ERROR_SAVE, true));
    }
    

    function deleteInterview() {
        let id = props.id
        transition(DELETING, true)
        props.cancelInterview(id)
        .then(() => {transition(EMPTY)})
        .catch(error => transition(ERROR_DELETE, true));
    }

    return (
        <article className="appointment">
            <Header time={props.time} />
            {mode === EMPTY && <Empty onAdd={() => transition(CREATE)} />}
            {mode === SHOW && (
            <Show
                student={props.interview.student}
                interviewer={props.interview.interviewer}
                onDelete={() => {transition(CONFIRM)}}
                onEdit={() => {transition(EDIT)}}

            />
            )}
            {mode === CREATE && (
            <Form 
                
                interviewers={props.interviewers}
                onCancel={() => transition(EMPTY)}
                onSave={save}
            />)}
            {mode === EDIT && (
            <Form 
                
                interviewers={props.interviewers}
                onCancel={() => transition(SHOW)}
                student={props.interview.student}
                interviewer={props.interview.interviewer.id}
                onSave={save}

            />)}
            {mode === SAVING && <Status message={"Saving"}/>}
            {mode === DELETING && <Status message={"Deleting"}/>}
            {mode === CONFIRM && <Confirm 
            onCancel={() => {back(SHOW)}}
            onConfirm={deleteInterview}
            message={"Are you sure you would like to delete?"}
            />}
            {mode === ERROR_SAVE && <Error message={"Error saving the appointment"} onClose={() => {back(SHOW)}} />}
            {mode === ERROR_DELETE && <Error message={"Error deleting the appointment"} onClose={() => {back(SHOW)}} />}
        </article>

    )
}