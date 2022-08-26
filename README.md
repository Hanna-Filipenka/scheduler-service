# scheduler-service


## Installation

```bash
Navigate to scheduler-service
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Examples of requests
```bash
# Get clinicians
$ GET http://localhost:<port>/clinicians

# Get clinicians by province
$ GET http://localhost:<port>/clinicians?province=<province>

# Get available timeslots based on particular clinician
$ GET http://localhost:<port>/clinicians/<clinicianName>?from=<ISOString date>&to=<ISOString date>

# Get all requested appointments
$ GET http://localhost:<port>/appointments/requestedAppointments/<clinicianName>

# Get all confirmed appointments
$ GET http://localhost:<port>/appointments/upcomingAppointments/<patientId>

# Create appointment request
$ POST http://localhost:<port>/appointments/new
  Body => {
    "name": <clinicianName>,
    "from": <appointmentStartDateISOString>,
    "to": <appointmentEndDateISOString>,
    "patientId": <patientId>
}

# Confirm appointment request
$ POST http://localhost:<port>/appointments/confirmAppointment
  Body => {
    "id": <appointment_id>
    "name": <clinician_name>
  }




```
