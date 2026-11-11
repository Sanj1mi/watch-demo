export type PersonType = 'patient' | 'doc' | 'nurse'

export interface Person {
  id: string
  firstName: string
  lastName: string
  age: number
  department: string
  // patient
  diagnosis?: string
  insuranceNum?: string
  // doc
  specialty?: string
  license?: string
  // nurse
  shift?: string
  qualification?: string
  // doc | nurse
  salary?: number | string | null
}

export type NewPerson = Omit<Person, 'id'> & { type: PersonType }

export interface PersonFilter {
  role?: PersonType
  minAge?: number
  maxAge?: number
  department?: string
}
