import { Test, TestingModule } from '@nestjs/testing';
import { AppointmentsService } from '../appointments/appointments.service';
import { CliniciansService } from './clinicians.service';
import {
  DATA_MODEL,
  EXPECTED_TIME_SLOTS,
} from '../testUtils/clinicianTestData';

describe('CliniciansService', () => {
  let service: CliniciansService;
  let appointmentService: AppointmentsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CliniciansService,
        AppointmentsService,
        {
          provide: 'WEEK_DAYS',
          useValue: [
            'Sunday',
            'Monday',
            'Tuesday',
            'Wednesday',
            'Thursday',
            'Friday',
            'Saturday',
          ],
        },
        { provide: 'DATA_MODEL', useValue: DATA_MODEL },
      ],
    }).compile();

    service = module.get<CliniciansService>(CliniciansService);
    appointmentService = module.get<AppointmentsService>(AppointmentsService);
  });

  it('Should get clinicians by province', async () => {
    const res = await service.getCliniciansByProvince('Manitoba');
    expect(res).toHaveLength(6);
  });

  it('Should get all the clinicians as province was not provided', async () => {
    const res = await service.getCliniciansByProvince();
    expect(res).toHaveLength(DATA_MODEL.length);
  });

  it('Should get available slots at particular clinician', async () => {
    const from = '2022-08-20T17:21:58.692Z';
    const to = '2022-08-30T17:21:58.692Z';
    const res = await service.getAvailableSlotsByClinician(
      'Isadore Knotte',
      from,
      to,
    );
    expect(res).toMatchObject(EXPECTED_TIME_SLOTS);
  });

  it('Should throw an error if clinician does not exist', async () => {
    const from = '2022-08-20T17:21:58.692Z';
    const to = '2022-08-30T17:21:58.692Z';
    await expect(
      service.getAvailableSlotsByClinician('test', from, to),
    ).rejects.toEqual('Requested clinician does not exist');
  });

  it('Should throw an error if from and to dates are incorrect', async () => {
    const from = '2022-08-31T17:21:58.692Z';
    const to = '2022-08-30T17:21:58.692Z';
    await expect(
      service.getAvailableSlotsByClinician('Isadore Knotte', from, to),
    ).rejects.toEqual('Incorrect dates');
  });

  it('Should get available slots at particular clinician when one of them has already been booked', async () => {
    const from = '2022-08-20T17:21:58.692Z';
    const to = '2022-08-30T17:21:58.692Z';
    const reservedFrom = '2022-08-23T10:30:00.000Z';
    const reservedTo = '2022-08-23T11:00:00.000Z';
    await appointmentService.createAppointmentRequest({
      name: 'Isadore Knotte',
      from: reservedFrom,
      to: reservedTo,
      patientId: '12345',
    });
    const res = await service.getAvailableSlotsByClinician(
      'Isadore Knotte',
      from,
      to,
    );
    expect(res[0].timeslots).toHaveLength(4);
  });

  it('Should get all the week days between given dates', () => {
    const from = '2022-08-25T17:21:58.692Z';
    const to = '2022-08-30T17:21:58.692Z';
    const res = service.getDaysOfWeekBetweenDates(from, to);
    expect(res).toMatchObject({
      Thursday: '2022-08-25T17:21:58.692Z',
      Friday: '2022-08-26T17:21:58.692Z',
      Saturday: '2022-08-27T17:21:58.692Z',
      Sunday: '2022-08-28T17:21:58.692Z',
      Monday: '2022-08-29T17:21:58.692Z',
      Tuesday: '2022-08-30T17:21:58.692Z',
    });
  });
});
