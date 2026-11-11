import type { Person, PersonType } from './types'

export function getPersonType(person: Person): PersonType {
  if (person.specialty) return 'doc'
  if (person.shift) return 'nurse'
  return 'patient'
}
