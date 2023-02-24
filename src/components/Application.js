import React, { useState,useEffect } from "react";
import DayList from "./DayList";
import Appointment from "./Appointment";
import axios from "axios";
import "components/Application.scss";
import { getAppointmentsForDay } from "helpers/selectors";


export default function Application(props) {

  const [state, setState] = useState({
    day: "Monday",
    days: [],
    appointments: {}
  });

  const dailyAppointments = getAppointmentsForDay(state, state.day);

  const setDay = day => setState({ ...state, day });

  useEffect(() => {
    Promise.all([
  axios.get('http://localhost:8001/api/days'),
  axios.get('http://localhost:8001/api/appointments'),
  axios.get('http://localhost:8001/api/interviewers')
]).then((all) => {
  
  setState(prev => ({...prev, days:all[0].data, appointments: all[1].data }))
});
  }, [])


  const appointmentItems = dailyAppointments.map((appointment) => {
    return (
      <Appointment
      key={appointment.id}
      {...appointment}
      />
    )
  })

  return (
    <main className="layout">
      <section className="sidebar">
        <img
        className="sidebar--centered"
        src="images/logo.png"
        alt="Interview Scheduler"
      />
      <hr className="sidebar__separator sidebar--centered" />
      <nav className="sidebar__menu">
        <DayList
          days={state.days}
          value={state.day}
          onChange={setDay}
        />
      </nav>
      <img
        className="sidebar__lhl sidebar--centered"
        src="images/lhl.png"
        alt="Lighthouse Labs"
/>

      </section>
      <section className="schedule">
        {appointmentItems}
        <Appointment key="last" time="5pm" />
      </section>
    </main>
  );
}
