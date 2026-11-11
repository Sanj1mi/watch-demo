package com.unik.watchdemo2.service.intr;

import com.unik.watchdemo2.model.entity.Person;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.*;

public interface HospService {
    Person addPatient(String firstName, String lastName, int age,
                        String department, String diagnosis, String insuranceNum);
    Person addDoc(String firstName, String lastName, int age,
                  String department, String specialty, String license, BigDecimal salary);
    Person addNurse(String firstName, String lastName, int age,
                    String department, String shift, String qualification, BigDecimal salary);

    ArrayList<Person> getAll();
    boolean delete(UUID id);
    boolean editMedicalInfo(UUID id, String newInfo);

    /** find + filter*/
    ArrayList<Person> searchByName(String name);
    ArrayList<Person> filterByRole(String role);
    ArrayList<Person> filterByAge(int minAge, int maxAge);
    ArrayList<Person> filterByDepartment(String department);
    /** lab-3 add */
    ArrayList<Person> filterByMultiple(String role, Integer minAge, Integer maxAge, String department);

    /** sort */
    ArrayList<Person> sortByName();
    ArrayList<Person> sortByDepartment();

    Map<String, Long> getStatistics();
    Map<String, Map<String, Long>> getDepartmentStatistics();

    /** data */
    void reloadData();

    @Transactional(readOnly = true)
    Map<String, Double> getAverageAgeByType();

    Optional<Person> getById(UUID id);

}
