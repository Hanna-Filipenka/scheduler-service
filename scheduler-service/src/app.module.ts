import { Module } from '@nestjs/common';
import { CsvModule } from 'nest-csv-parser';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AppointmentsController } from './appointments/appointments.controller';
import { AppointmentsService } from './appointments/appointments.service';
import { CliniciansService } from './clinicians/clinicians.service';
import { ClinitiansController } from './clinicians/clinicians.controller';
import { WEEK_DAYS } from './utils/constants.constants';
import { ClinicianDataFactory } from './clinicianDataFactory';

@Module({
  imports: [CsvModule],
  controllers: [AppController, AppointmentsController, ClinitiansController],
  providers: [
    AppService,
    AppointmentsService,
    CliniciansService,
    ClinicianDataFactory,
    {
      provide: 'DATA_MODEL',
      useFactory: async (clinicianDataFacroty: ClinicianDataFactory) => {
        const dataModel = await clinicianDataFacroty.loadDataModel();
        return dataModel;
      },
      inject: [ClinicianDataFactory],
    },
    {
      provide: WEEK_DAYS,
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
  ],
})
export class AppModule {}
