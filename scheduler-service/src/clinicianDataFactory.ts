import { Injectable } from '@nestjs/common';
import { CsvParser } from 'nest-csv-parser';
import { Clinician } from './clinicians/model/clinician.model';
import * as fs from 'fs';

@Injectable()
export class ClinicianDataFactory {
  async loadDataModel() {
    const csvParser: CsvParser = new CsvParser();
    const stream = fs.createReadStream(`${__dirname}/schedules.csv`);
    const clinicians = await csvParser.parse(stream, Clinician, 0, 0, {
      separator: ',',
    });
    clinicians.list.forEach((clinician) => {
      clinician.appointments = [];
    });
    return clinicians.list;
  }
}
