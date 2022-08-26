export class Appointment {
  id: string;
  name: string;
  from: string;
  to: string;
  patientId: string;
  status: string;
}

export class RequestedAppointment {
  id: string;
  from: string;
  to: string;
  patientId: string;
}
