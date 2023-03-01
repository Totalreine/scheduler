import { useState, useEffect } from "react";
import axios from "axios";
import { getAppointmentsForDay } from "helpers/selectors";

export function useApplicationData() {

    const [state, setState] = useState({
        day: "Monday",
        days: [],
        appointments: {},
        interviewers: {}
      });
    
    const setDay = day => setState({ ...state, day });

    useEffect(() => {
    Promise.all([
    axios.get('http://localhost:8001/api/days'),
    axios.get('http://localhost:8001/api/appointments'),
    axios.get('http://localhost:8001/api/interviewers')
    ]).then((all) => {
      setState(prev => ({...prev, days:all[0].data, appointments: all[1].data, interviewers: all[2].data }))
      //const array = [state.days]
    });
      }, [])
      
      const dailyAppointments = getAppointmentsForDay(state, state.day);
      const appointments = dailyAppointments.filter(item => item.interview.interviewer === null)
      const remainigSpots = appointments.length
      
      const array = [...state.days]
      for (let day of array) {
        
        day.spots = remainigSpots
      }

      console.log("array", array)
    
    const bookInterview = (id, interview) => {
    
    const appointment = {
        ...state.appointments[id],
        interview: { ...interview }
    };
    const appointments = {
        ...state.appointments,
        [id]: appointment
    };
    return axios.put(`http://localhost:8001/api/appointments/${id}`,
    {interview: interview})
    .then((res) => setState({...state, appointments}))   
    .then(() => {})
    }

    const notInterview = {student: "", interviewer: null}

    const cancelInterview = (id) => {
    const appointment = {
        ...state.appointments[id],
        interview: notInterview
    };
    const appointments = {
        ...state.appointments,
        [id]: appointment
    };
    return axios.put(`http://localhost:8001/api/appointments/${id}`,
    {interview: notInterview})
    .then((res) => { setState({...state, appointments})})   
    .then(()=> {})
    }

    return {
    state,
    setDay,
    bookInterview,
    cancelInterview
    }
    
    
}