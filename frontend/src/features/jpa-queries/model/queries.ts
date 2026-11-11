export interface QueryParam {
  name: string
  label: string
  type: 'number' | 'text'
  defaultValue: string
  placeholder?: string
}

export interface JpaQuery {
  id: string
  kind: 'Criteria API' | 'HQL'
  title: string
  description: string
  /** путь относительно /api */
  endpoint: string
  params: QueryParam[]
  /** серверный код — показываем для наглядности */
  code: string
}

export const JPA_QUERIES: JpaQuery[] = [
  {
    id: 'criteria-age',
    kind: 'Criteria API',
    title: 'SELECT 1: диапазон возраста',
    description: 'Все Person, у которых age BETWEEN min AND max.',
    endpoint: '/jpa-queries/criteria/age',
    params: [
      { name: 'min', label: 'Мин. возраст', type: 'number', defaultValue: '18' },
      { name: 'max', label: 'Макс. возраст', type: 'number', defaultValue: '60' },
    ],
    code: `CriteriaBuilder cb = em.getCriteriaBuilder();
CriteriaQuery<Person> query = cb.createQuery(Person.class);
Root<Person> person = query.from(Person.class);

query.select(person)
     .where(cb.between(person.get("age"), min, max));`,
  },
  {
    id: 'criteria-department',
    kind: 'Criteria API',
    title: 'SELECT 2: по отделению',
    description: 'Все Person из заданного отделения (department = name).',
    endpoint: '/jpa-queries/criteria/department',
    params: [{ name: 'name', label: 'Отделение', type: 'text', defaultValue: '', placeholder: 'Например, Кардиология' }],
    code: `CriteriaQuery<Person> query = cb.createQuery(Person.class);
Root<Person> person = query.from(Person.class);

query.select(person)
     .where(cb.equal(person.get("department"), department));`,
  },
  {
    id: 'criteria-doctors',
    kind: 'Criteria API',
    title: 'SELECT 3: врачи по специальности',
    description: 'Только Doc (наследник Person) с указанной specialty.',
    endpoint: '/jpa-queries/criteria/doctors',
    params: [{ name: 'specialty', label: 'Специальность', type: 'text', defaultValue: '', placeholder: 'Например, Хирург' }],
    code: `CriteriaQuery<Doc> query = cb.createQuery(Doc.class);
Root<Doc> doctor = query.from(Doc.class);

query.select(doctor)
     .where(cb.equal(doctor.get("specialty"), specialty));`,
  },
  {
    id: 'hql-age',
    kind: 'HQL',
    title: 'HQL: возраст от N',
    description: 'Тот же поиск по возрасту, но через Hibernate Session и HQL.',
    endpoint: '/jpa-queries/hql/age',
    params: [{ name: 'minAge', label: 'Мин. возраст', type: 'number', defaultValue: '30' }],
    code: `Session session = em.unwrap(Session.class);

return session.createSelectionQuery(
        "FROM Person p WHERE p.age >= :minAge", Person.class)
    .setParameter("minAge", minAge)
    .getResultList();`,
  },
]
