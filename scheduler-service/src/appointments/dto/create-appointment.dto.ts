import { IsString } from 'class-validator';

export class CreateAppointmentDto {
  @IsString()
  readonly name: string;
  @IsString()
  readonly from: string;
  @IsString()
  readonly to: string;
  @IsString()
  readonly patientId: string;
}
