package com.unik.watchdemo2.controller;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.unik.watchdemo2.model.entity.Doc;
import com.unik.watchdemo2.model.entity.Person;
import com.unik.watchdemo2.service.impl.PersonQueryService;

@RestController
@RequestMapping("/api/jpa-queries")
public class PersonQueryController {

  private final PersonQueryService queryService;

  public PersonQueryController(PersonQueryService queryService) {
    this.queryService = queryService;
  }

  // Criteria SELECT 1
  @GetMapping("/criteria/age")
  public List<Person> findByAge(
      @RequestParam int min,
      @RequestParam int max) {

    return queryService.findByAgeRange(min, max);
  }

  // Criteria SELECT 2
  @GetMapping("/criteria/department")
  public List<Person> findByDepartment(
      @RequestParam String name) {

    return queryService.findByDepartment(name);
  }

  // Criteria SELECT 3
  @GetMapping("/criteria/doctors")
  public List<Doc> findDoctors(
      @RequestParam String specialty) {

    return queryService.findDoctorsBySpecialty(specialty);
  }

  // Hibernate HQL
  @GetMapping("/hql/age")
  public List<Person> findByAgeHql(
      @RequestParam int minAge) {

    return queryService.findByAgeHql(minAge);
  }
}
