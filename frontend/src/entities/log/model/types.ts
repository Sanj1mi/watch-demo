export type LogAction = 'ADMISSION' | 'DISCHARGE'

export interface HospitalizationLog {
  id: string | number
  action: LogAction
  patientId: string
  patientName: string
  department?: string
  diagnosis?: string
  doctorName?: string
  notes?: string
  timestamp: string
}

export interface LogPayload {
  patientId: string
  patientName: string
  department: string
  diagnosis?: string
  doctorName: string
  notes: string
}
