import { Controller, Get, Param, Query } from '@nestjs/common';
import { CliniciansService } from './clinicians.service';
import { Clinician, Schedule } from './model/clinician.model';

@Controller('clinicians')
export class ClinitiansController {
  constructor(private readonly cliniciansService: CliniciansService) {}

  @Get()
  getClinicians(@Query('province') province?: string): Promise<Clinician[]> {
    return this.cliniciansService.getCliniciansByProvince(province);
  }

  @Get(':clinician')
  getAvailableSlotsByClinician(
    @Param('clinician') clinician: string,
    @Query('from') from: string,
    @Query('to') to: string,
  ): Promise<Schedule[]> {
    return this.cliniciansService.getAvailableSlotsByClinician(
      clinician,
      from,
      to,
    );
  }
}
