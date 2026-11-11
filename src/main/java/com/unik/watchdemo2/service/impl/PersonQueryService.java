package com.unik.watchdemo2.service.impl;

import java.util.List;

import org.hibernate.Session;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.unik.watchdemo2.model.entity.Doc;
import com.unik.watchdemo2.model.entity.Person;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.CriteriaQuery;
import jakarta.persistence.criteria.Root;

@Service
@Transactional(readOnly = true)
public class PersonQueryService {

  @PersistenceContext
  private EntityManager entityManager;

  // SELECT 1: Criteria API — поиск по диапазону возраста
  public List<Person> findByAgeRange(int min, int max) {
    CriteriaBuilder cb = entityManager.getCriteriaBuilder();

    CriteriaQuery<Person> query = cb.createQuery(Person.class);
    Root<Person> person = query.from(Person.class);

    query.select(person)
        .where(cb.between(person.get("age"), min, max));

    return entityManager.createQuery(query).getResultList();
  }

  // SELECT 2: Criteria API — поиск по отделению
  public List<Person> findByDepartment(String department) {
    CriteriaBuilder cb = entityManager.getCriteriaBuilder();

    CriteriaQuery<Person> query = cb.createQuery(Person.class);
    Root<Person> person = query.from(Person.class);

    query.select(person)
        .where(cb.equal(person.get("department"), department));

    return entityManager.createQuery(query).getResultList();
  }

  // SELECT 3: Criteria API — поиск врачей по специальности
  public List<Doc> findDoctorsBySpecialty(String specialty) {
    CriteriaBuilder cb = entityManager.getCriteriaBuilder();

    CriteriaQuery<Doc> query = cb.createQuery(Doc.class);
    Root<Doc> doctor = query.from(Doc.class);

    query.select(doctor)
        .where(cb.equal(doctor.get("specialty"), specialty));

    return entityManager.createQuery(query).getResultList();
  }

  // Дополнительный пример: Hibernate HQL
  public List<Person> findByAgeHql(int minAge) {
    Session session = entityManager.unwrap(Session.class);

    return session.createSelectionQuery(
        "FROM Person p WHERE p.age >= :minAge",
        Person.class)
        .setParameter("minAge", minAge)
        .getResultList();
  }
}
