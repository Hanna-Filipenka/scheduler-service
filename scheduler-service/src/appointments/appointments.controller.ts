import { Controller, Get, Param, Post, Body } from '@nestjs/common';
import { AppointmentsService } from './appointments.service';
import { ConfirmAppointmentDto } from './dto/confirm-appointment.dto';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { Appointment, RequestedAppointment } from './model/appointment.model';

@Controller('appointments')
export class AppointmentsController {
  constructor(private readonly appointmentsService: AppointmentsService) {}

  @Post('/new/')
  async createAppointmentRequest(
    @Body() appointmentData: CreateAppointmentDto,
  ): Promise<Appointment> {
    return this.appointmentsService.createAppointmentRequest(appointmentData);
  }

  @Post('/confirmAppointment/')
  async confirmRequestedAppointment(
    @Body() appointment: ConfirmAppointmentDto,
  ): Promise<Appointment[]> {
    return this.appointmentsService.confirmRequestedAppointment(appointment);
  }

  @Get('/requestedAppointments/:name')
  async getRequestedAppointments(
    @Param('name') name: string,
  ): Promise<RequestedAppointment[]> {
    return this.appointmentsService.getRequestedAppointments(name);
  }

  @Get('/upcomingAppointments/:id')
  async getConfirmedAppointments(
    @Param('id') patientId: string,
  ): Promise<Appointment[]> {
    return this.appointmentsService.getConfirmedAppointments(patientId);
  }
}
