
export function getAppointmentsForDay(state, day) {
    const selectedDay = state.days.filter(item => item.name === day)
    if (selectedDay.length === 0) {return []}
    const arrayID =  selectedDay[0].appointments
    if (arrayID.length === 0) {return []}
    const arrayAppoint = Object.values(state.appointments)
    const selectedAppointments = arrayAppoint.filter(appointment => arrayID.includes(appointment.id))

    return selectedAppointments
}


  