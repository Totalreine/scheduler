import { useState, useEffect } from "react";
import axios from "axios";

export function useApplicationData() {
  const [state, setState] = useState({
    day: "Monday",
    days: [],
    appointments: {},
    interviewers: {},
  });

  const setDay = (day) => setState({ ...state, day });

  useEffect(() => {
    Promise.all([
      axios.get("/api/days"),
      axios.get("/api/appointments"),
      axios.get("/api/interviewers"),
    ]).then((all) => {
      const newState = {
        days: all[0].data || [],
        appointments: all[1].data || [],
        interviewers: all[2].data || [],
      };
      setState((prev) => ({ ...prev, ...newState }));
    });
  }, []);

  /* This function updates the ramining spots for each day of the week when we make a request to the server 
  and also updates the raminig spots when we call the bookInterview and the cancelInterview functions*/
  const updateSpots = (state, aDay) => {
    const currentDayIndex = state.days.findIndex((day) => day.name === aDay);
    const currentDay = state.days[currentDayIndex];
    const dayListHead = state.days.slice(0, currentDayIndex);
    const dayListTail = state.days.slice(currentDayIndex + 1);

    const listOfAppointments = currentDay.appointments.map(
      (id) => state.appointments[id]
    );

    const listOfEmpty = listOfAppointments.filter(
      (appoint) => appoint.interview === null
    );

    const spots = listOfEmpty.length;

    const newCurrentDay = { ...currentDay, spots };
    const newDays = dayListHead.concat(newCurrentDay).concat(dayListTail);
    const newState = { ...state, days: newDays };

    return newState;
  };

  const bookInterview = (id, interview) => {
    const appointment = {
      ...state.appointments[id],
      interview: { ...interview },
    };
    const appointments = {
      ...state.appointments,
      [id]: appointment,
    };
    return axios
      .put(`/api/appointments/${id}`, { interview: interview })
      .then((res) => {
        const newState = { ...state, appointments };
        const newStateWithNewSpots = updateSpots(newState, newState.day);
        setState(newStateWithNewSpots);
      });
  };

  const notInterview = null;

  const cancelInterview = (id) => {
    const appointment = {
      ...state.appointments[id],
      interview: notInterview,
    };
    const appointments = {
      ...state.appointments,
      [id]: appointment,
    };
    return axios.delete(`/api/appointments/${id}`).then((res) => {
      const newState = { ...state, appointments };
      const newStateWithNewSpots = updateSpots(newState, newState.day);
      setState(newStateWithNewSpots);
    });
  };

  return {
    state,
    setDay,
    bookInterview,
    cancelInterview,
  };
}
