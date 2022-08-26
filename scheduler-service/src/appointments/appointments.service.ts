import { Injectable, Inject } from '@nestjs/common';
import { v4 as uuid } from 'uuid';
import { CliniciansService } from '../clinicians/clinicians.service';
import { Appointment, RequestedAppointment } from './model/appointment.model';
import { ClinicianDM, Schedule } from '../clinicians/model/clinician.model';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { ConfirmAppointmentDto } from './dto/confirm-appointment.dto';
import {
  STATUS_CONFIRMATION_PENDING,
  STATUS_CONFIRMED,
  WEEK_DAYS,
  DATA_MODEL,
  ERROR_TIMESLOT_IS_NOT_AVAILABLE
} from '../utils/constants.constants';

@Injectable()
export class AppointmentsService {
  constructor(
    @Inject(WEEK_DAYS)
    private readonly weekDays,
    @Inject(DATA_MODEL)
    private cliniciansData,
    private cliniciansService: CliniciansService
  ) {
  }

  async createAppointmentRequest(
    appointmentData: CreateAppointmentDto,
  ): Promise<Appointment> {
    const { name, from, to, patientId } = appointmentData;

    const isAvailableTimeSlot : boolean = await this.checkClinicianAvailableTimeSlots({ name, from, to});
    if (!isAvailableTimeSlot) throw ERROR_TIMESLOT_IS_NOT_AVAILABLE;

    const dayOfTheWeek: string = this.weekDays[new Date(from).getDay()];
    const createdAppointment: Appointment = {
      id: uuid(),
      name: name,
      from: from,
      to: to,
      patientId: patientId,
      status: STATUS_CONFIRMATION_PENDING,
    };

    const clinicianItem: ClinicianDM = this.cliniciansData.find((clinician) => {
      return clinician.name === name && clinician.day === dayOfTheWeek;
    });

    clinicianItem.appointments.push(createdAppointment);
    return createdAppointment;
  }

  async getRequestedAppointments(
    name: string,
  ): Promise<RequestedAppointment[]> {
    const requestedAppointmentsByUser: RequestedAppointment[] = [];
    this.cliniciansData.forEach((clinician) => {
      if (clinician.name !== name) return;

        const appointmentsToConfirm = clinician.appointments.filter(
          (appointment: Appointment) =>
            appointment.status === STATUS_CONFIRMATION_PENDING,
        );
        requestedAppointmentsByUser.push(...appointmentsToConfirm);
    });
    return requestedAppointmentsByUser;
  }

  async confirmRequestedAppointment(
    appointment: ConfirmAppointmentDto,
  ): Promise<Appointment[]> {
    const confirmedAppointments: Appointment[] = [];
    const { id, name } = appointment;
    this.cliniciansData.forEach((clinician: ClinicianDM) => {
      if (clinician.name !== name) return;

      clinician.appointments.forEach((appointment: Appointment) => {
        if (appointment.id !== id) return;

        appointment.status = STATUS_CONFIRMED;
        confirmedAppointments.push(appointment);
      });
    });
    return confirmedAppointments;
  }

  async getConfirmedAppointments(patientId: string): Promise<Appointment[]> {
    const allConfirmedAppointments: Appointment[] = [];

    this.cliniciansData.forEach((clinician) => {
      if (!clinician.appointments.length) return;

      const confirmedAppointments = clinician.appointments.filter(
        (appointment) => {
          return (
            appointment.status === STATUS_CONFIRMED &&
            appointment.patientId === patientId
          );
        });
      allConfirmedAppointments.push(...confirmedAppointments);
    });
    return allConfirmedAppointments;
  }

  async checkClinicianAvailableTimeSlots(appointment) : Promise<boolean> {
    const arr : boolean[]= [];
    const { name, from, to } = appointment;
    const availableTimeSlots: Schedule[] = await this.cliniciansService.getAvailableSlotsByClinician(name, from, to);

    availableTimeSlots.forEach(timeSlot => {
      if (!timeSlot.timeslots.length) return;
      
      const timeslotAvailable: boolean = timeSlot.timeslots.some(timeslot => timeslot.from === from && timeslot.to === to);
      if (timeslotAvailable) arr.push(timeslotAvailable);
    });

    return arr.length > 0;
  }
}
