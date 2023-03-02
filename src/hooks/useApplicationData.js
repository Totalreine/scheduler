import { useState, useEffect } from "react";
import axios from "axios";


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
    axios.get('/api/days'),
    axios.get('/api/appointments'),
    axios.get('/api/interviewers')
    ]).then((all) => {
       const newState = updateAllSpots({day: state.day, days: all[0].data, appointments:all[1].data, interviewers:all[2].data})
       setState(prev => ({...prev, ...newState }))
    })
      }, [])


    const updateAllSpots = (state) => {
    return state.days.reduce((acc, dayObj) => { 
        return updateSpots(acc, dayObj.name)
    }, state)
    }
      
    const updateSpots = (state, aDay) => {
        
        const currentDayIndex = state.days.findIndex(day => day.name === aDay)
        const currentDay = state.days[currentDayIndex]
        const dayListHead = state.days.slice(0, currentDayIndex)
        const dayListTail = state.days.slice(currentDayIndex+1)

        const listOfAppointments = currentDay.appointments.map(id => state.appointments[id])
        
        const listOfEmpty = listOfAppointments.filter(appoint => appoint.interview.interviewer === null)

        const spots = listOfEmpty.length

        const newCurrentDay = {...currentDay, spots}
        const newDays = dayListHead.concat(newCurrentDay).concat(dayListTail)
        const newState = {...state, days: newDays}

        return newState
    } 

    
    
    const bookInterview = (id, interview) => {
    
    const appointment = {
        ...state.appointments[id],
        interview: { ...interview }
    };
    const appointments = {
        ...state.appointments,
        [id]: appointment
    };
    return axios.put(`/api/appointments/${id}`,
    {interview: interview})
    .then((res) => {
        const newState = {...state, appointments}
        const newStateWithNewSpots = updateSpots(newState, newState.day)
        setState(newStateWithNewSpots)
    })   
    
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
    return axios.put(`/api/appointments/${id}`,
    {interview: notInterview})
    .then((res) => { 
        const newState = {...state, appointments}
        const newStateWithNewSpots = updateSpots(newState, newState.day)
        setState(newStateWithNewSpots)
    })   
    
    }

    return {
    state,
    setDay,
    bookInterview,
    cancelInterview
    }
    
    
}