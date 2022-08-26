import { Inject, Injectable } from '@nestjs/common';
import { Appointment } from 'src/appointments/model/appointment.model';
import {
  Clinician,
  AvailableTimeSlot,
  DateRange,
  Schedule,
  ClinicianDM,
} from './model/clinician.model';
import {
  WEEK_DAYS,
  DATA_MODEL,
  ERROR_NO_CLINICIAN,
  ERROR_INCORRECT_DATES,
} from '../utils/constants.constants';

@Injectable()
export class CliniciansService {
  constructor(
    @Inject(WEEK_DAYS)
    private readonly weekDays,
    @Inject(DATA_MODEL)
    private cliniciansData,
  ) {}

  async getCliniciansByProvince(province?: string): Promise<Clinician[]> {
    if (!province) {
      return this.cliniciansData;
    }

    return this.cliniciansData.filter((clinician) => {
      return clinician.province === province;
    });
  }

  async getAvailableSlotsByClinician(
    clinicianName: string,
    from: string,
    to: string,
  ): Promise<Schedule[]> {
    const availableTimeslotsPerDay: Schedule[] = [];
    if (!this.checkIfClinicianExists(clinicianName)) throw ERROR_NO_CLINICIAN;

    const dateRange: DateRange = this.getDaysOfWeekBetweenDates(from, to);
    if (!this.checkIfDateRangeIsValid(dateRange)) throw ERROR_INCORRECT_DATES;

    this.cliniciansData.forEach((clinician: ClinicianDM) => {
      if (clinician.name !== clinicianName) return;

      const timeslots: AvailableTimeSlot[] = this.getTimeSlots(
        dateRange[clinician.day],
        clinician.start,
        clinician.end,
        clinician.appointments,
      );

      const scheduleOfTheDay: Schedule = {
        name: clinicianName,
        date: dateRange[clinician.day],
        timeslots: timeslots,
      };

      availableTimeslotsPerDay.push(scheduleOfTheDay);
    });

    return availableTimeslotsPerDay;
  }

  getDaysOfWeekBetweenDates(from: string, to: string): DateRange {
    const startDate = new Date(from);
    const endDate = new Date(to);

    endDate.setDate(endDate.getDate() + 1);
    const daysOfWeek: DateRange = {};

    let i = 0;
    while (i < 7 && startDate < endDate) {
      const dateISOFormat: string = startDate.toISOString();
      daysOfWeek[this.weekDays[startDate.getDay()]] = dateISOFormat;
      startDate.setDate(startDate.getDate() + 1);
      i++;
    }
    return daysOfWeek;
  }

  getTimeSlots(
    dateValue: string,
    from: string,
    to: string,
    appointments: Appointment[],
  ): AvailableTimeSlot[] {
    const offset: number = 30 * 1000 * 60;
    const val: Date = new Date(dateValue);
    const timeSlots: AvailableTimeSlot[] = [];

    let workingHoursStartInMs: number =
      new Date(
        `${val.getFullYear()}-${
          val.getMonth() + 1
        }-${val.getDate()} ${from} UTC`,
      ).getTime() - offset;

    const workingHoursEndInMs: number = new Date(
      `${val.getFullYear()}-${val.getMonth() + 1}-${val.getDate()} ${to} UTC`,
    ).getTime();

    while (workingHoursStartInMs < workingHoursEndInMs) {
      workingHoursStartInMs = workingHoursStartInMs + offset;
      
      const isTimeSlotReserved: boolean = appointments.some((el) => {
        return (
          new Date(el.from).getTime() === workingHoursStartInMs &&
          new Date(el.to).getTime() === workingHoursStartInMs + offset
        );
      });

      if (!isTimeSlotReserved && workingHoursStartInMs < workingHoursEndInMs) {
        timeSlots.push({
          from: new Date(workingHoursStartInMs).toISOString(),
          to: new Date(workingHoursStartInMs + offset).toISOString(),
        });
      }
    }
    return timeSlots;
  }

  checkIfClinicianExists(clinicianName: string): boolean {
    return this.cliniciansData.some(
      (clinician) => clinician.name === clinicianName,
    );
  }

  checkIfDateRangeIsValid(dateRange: DateRange): boolean {
    return dateRange && Object.keys(dateRange).length !== 0;
  }
}
