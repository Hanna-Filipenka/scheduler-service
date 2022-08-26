import { Appointment } from '../../appointments/model/appointment.model';

export class Clinician {
  name: string;
  day: string;
  start: string;
  end: string;
}

export class ClinicianDM {
  name: string;
  day: string;
  start: string;
  end: string;
  appointments: Appointment[];
}

export class AvailableTimeSlot {
  from: string;
  to: string;
}

export class DateRange {
  [key: string]: string;
}

export class Schedule {
  name: string;
  date: string;
  timeslots: AvailableTimeSlot[];
}
