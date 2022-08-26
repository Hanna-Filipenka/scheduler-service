import { Test, TestingModule } from '@nestjs/testing';
import { AppointmentsService } from './appointments.service';
import { CliniciansService } from '../clinicians/clinicians.service';
import { DATA_MODEL } from '../testUtils/clinicianTestData';

describe('AppointmentsService', () => {
  let service: AppointmentsService;
 // let clinicianService: CliniciansService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AppointmentsService,
        CliniciansService,
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

    service = module.get<AppointmentsService>(AppointmentsService);
  });

  it('Should create appointment request', async () => {
    const appointment = {
      name: 'Isadore Knotte',
      from: '2022-08-27T13:00:00.000Z',
      to: '2022-08-27T13:30:00.000Z',
      patientId: '5000',
    };
    const res = await service.createAppointmentRequest(appointment);
    expect(res).toMatchObject({
      id: expect.anything(),
      name: appointment.name,
      from: appointment.from,
      to: appointment.to,
      patientId: appointment.patientId,
      status: 'confirmationPending',
    });
  });

  it('Should fail to create appointment request as it has already been busy', async () => {
    const appointment = {
      name: 'Isadore Knotte',
      from: '2022-08-27T13:00:00.000Z',
      to: '2022-08-27T13:30:00.000Z',
      patientId: '5000',
    };
    await expect(service.createAppointmentRequest(appointment)).rejects.toEqual("Timeslot is no longer available");
  });

  it('Should fetch requested appointments', async () => {
    const name = 'Isadore Knotte';
    const appointment = {
      name: 'Isadore Knotte',
      from: '2022-08-27T12:00:00.000Z',
      to: '2022-08-27T12:30:00.000Z',
      patientId: '5000',
    };
    await service.createAppointmentRequest(appointment);
    const res = await service.getRequestedAppointments(name);

    expect(res).toHaveLength(2);
    expect(res[1]).toMatchObject({
      id: expect.anything(),
      name: appointment.name,
      from: appointment.from,
      to: appointment.to,
      patientId: appointment.patientId,
      status: 'confirmationPending',
    });
  });

  it('Should confirm appointment and fetch empty requested appointments', async () => {
    const name = 'Dorry Taaffe';
    const appointment = {
      name: 'Dorry Taaffe',
      from: '2022-08-29T12:00:00.000Z',
      to: '2022-08-29T12:30:00.000Z',
      patientId: '5908',
    };
    await service.createAppointmentRequest(appointment);
    const requestedAppointments = await service.getRequestedAppointments(name);

    expect(requestedAppointments).toHaveLength(1);

    const id = requestedAppointments[0].id;
    const res = await service.confirmRequestedAppointment({ id, name });

    expect(res).toHaveLength(1);
    expect(res[0]).toMatchObject({
      id: id,
      name: name,
      from: appointment.from,
      to: appointment.to,
      patientId: appointment.patientId,
      status: 'confirmed',
    });

    const requestedAppointmentsAfterConfirmation =
      await service.getRequestedAppointments(name);

    expect(requestedAppointmentsAfterConfirmation).toHaveLength(0);
  });

  it('Should fetch all upcoming confirmed appointments', async () => {
    const name = 'Dorry Taaffe';
    const appointment = {
      name: 'Dorry Taaffe',
      from: '2022-08-29T11:00:00.000Z',
      to: '2022-08-29T11:30:00.000Z',
      patientId: '5908',
    };
    await service.createAppointmentRequest(appointment);
    const requestedAppointments = await service.getRequestedAppointments(name);

    expect(requestedAppointments).toHaveLength(1);

    const id = requestedAppointments[0].id;
    const res = await service.confirmRequestedAppointment({ id, name });

    expect(res).toHaveLength(1);
    expect(res[0]).toMatchObject({
      id: id,
      name: name,
      from: appointment.from,
      to: appointment.to,
      patientId: appointment.patientId,
      status: 'confirmed',
    });

    const requestedAppointmentsAfterConfirmation =
      await service.getRequestedAppointments(name);

    expect(requestedAppointmentsAfterConfirmation).toHaveLength(0);
  });
});
