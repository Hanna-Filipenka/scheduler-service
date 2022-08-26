import { IsString } from 'class-validator';

export class ConfirmAppointmentDto {
  @IsString()
  readonly id: string;
  @IsString()
  readonly name: string;
}
