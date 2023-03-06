export function getAppointmentsForDay(state, day) {
  const selectedDay = state.days.filter((item) => item.name === day);
  if (selectedDay.length === 0) {
    return [];
  }
  const arrayID = selectedDay[0].appointments;
  if (arrayID.length === 0) {
    return [];
  }
  const arrayAppoint = Object.values(state.appointments);
  const selectedAppointments = arrayAppoint.filter((appointment) =>
    arrayID.includes(appointment.id)
  );

  return selectedAppointments;
}

export function getInterview(state, interview) {
  const array = Object.values(state.interviewers);
  if (interview) {
    const interviewer = array.filter(
      (item) => item.id === interview.interviewer
    );
    const interviewerData = interviewer[0];
    const selectedInterview = {
      student: interview.student,
      interviewer: interviewerData,
    };
    if (interview.student !== "" && interview.interviewer !== null) {
      return selectedInterview;
    }
  } else {
    return null;
  }
}

export function getInterviewersForDay(state, day) {
  const selectedDay = state.days.filter((item) => item.name === day);
  if (selectedDay.length === 0) {
    return [];
  }
  const arrayID = selectedDay[0].interviewers;
  if (arrayID.length === 0) {
    return [];
  }
  const arrayInterviewers = Object.values(state.interviewers);
  const selectedInterviewers = arrayInterviewers.filter((interviewer) =>
    arrayID.includes(interviewer.id)
  );

  return selectedInterviewers;
}
