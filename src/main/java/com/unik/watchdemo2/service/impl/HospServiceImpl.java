package com.unik.watchdemo2.service.impl;

import com.unik.watchdemo2.model.entity.*;
import com.unik.watchdemo2.repo.PersonRepository;
import com.unik.watchdemo2.service.intr.HospService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.*;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.TimeoutException;
import java.util.stream.Collectors;

@Slf4j
@Service
@Transactional
public class HospServiceImpl implements HospService {
    private final PersonRepository personRepository;

    @Autowired
    public HospServiceImpl(PersonRepository personRepository) {
        this.personRepository = personRepository;
        log.info("Hospital service initialized with JPA/PostgreSQL");
    }

    @Override
    public Person addPatient(String firstName, String lastName, int age,
                             String department, String diagnosis, String insuranceNum) {
        Patient patient = Patient.builder()
                .firstName(firstName)
                .lastName(lastName)
                .age(age)
                .department(department)
                .diagnosis(diagnosis)
                .insuranceNum(insuranceNum)
                .build();

        Patient saved = personRepository.save(patient);
        log.info("Patient added: {} {}", firstName, lastName);
        return saved;
    }

    @Override
    public Person addDoc(String firstName, String lastName, int age,
                         String department, String specialty,
                         String license, BigDecimal salary) {
        Doc doc = Doc.builder()
                .firstName(firstName)
                .lastName(lastName)
                .age(age)
                .department(department)
                .specialty(specialty)
                .license(license)
                .salary(salary)
                .build();
        Doc saved = personRepository.save(doc);
        log.info("Doctor added: {} {} with salary {}", firstName, lastName, salary);
        return saved;
    }

    @Override
    public Person addNurse(String firstName, String lastName, int age,
                           String department, String shift,
                           String qualification, BigDecimal salary) {
        Nurse nurse = Nurse.builder()
                .firstName(firstName)
                .lastName(lastName)
                .age(age)
                .department(department)
                .shift(shift)
                .qualification(qualification)
                .salary(salary)
                .build();
        Nurse saved = personRepository.save(nurse);
        log.info("Nurse added: {} {} with salary {}", firstName, lastName, salary);
        return saved;
    }

    @Override
    @Transactional(readOnly = true)
    public ArrayList<Person> getAll() {
        return (ArrayList<Person>) personRepository.findAll();
    }

    @Override
    public boolean delete(UUID id) {
        if (personRepository.existsById(id)) {
            personRepository.deleteById(id);
            log.info("Record deleted: {}", id);
            return true;
        }
        log.warn("Record not found for deletion: {}", id);
        return false;
    }

    @Override
    public boolean editMedicalInfo(UUID id, String newInfo) {
        Optional<Person> personOpt = personRepository.findById(id);
        if (personOpt.isEmpty()) {
            log.warn("Record not found for editing: {}", id);
            return false;
        }

        Person person = personOpt.get();
        boolean updated = false;

        if (person instanceof Doc) {
            Doc doc = (Doc) person;
            doc.setSpecialty(newInfo);
            personRepository.save(doc);
            updated = true;
            log.info("Doctor specialty updated: {} -> {}", person.getFullName(), newInfo);
        } else if (person instanceof Patient) {
            Patient patient = (Patient) person;
            patient.setDiagnosis(newInfo);
            personRepository.save(patient);
            updated = true;
            log.info("Patient diagnosis updated: {} -> {}", person.getFullName(), newInfo);
        } else {
            log.warn("Cannot edit medical info for Nurse: {}", person.getFullName());
            return false;
        }

        return updated;
    }

    @Override
    @Transactional(readOnly = true)
    public ArrayList<Person> searchByName(String name) {
        return (ArrayList<Person>) personRepository.findByFirstNameContainingIgnoreCaseOrLastNameContainingIgnoreCase(name, name);
    }

    @Override
    @Transactional(readOnly = true)
    public ArrayList<Person> filterByRole(String role) {
        Class<? extends Person> typeClass = switch (role.toLowerCase()) {
            case "doc", "doctor" -> Doc.class;
            case "nurse" -> Nurse.class;
            case "patient" -> Patient.class;
            default -> Person.class;
        };

        return (ArrayList<Person>) personRepository.findByType(typeClass);
    }

    @Override
    @Transactional(readOnly = true)
    public ArrayList<Person> filterByAge(int minAge, int maxAge) {
        return (ArrayList<Person>) personRepository.findByAgeBetween(minAge, maxAge);
    }

    @Override
    @Transactional(readOnly = true)
    public ArrayList<Person> filterByDepartment(String department) {
        return (ArrayList<Person>) personRepository.findByDepartment(department);
    }

    @Override
    @Transactional(readOnly = true)
    public ArrayList<Person> filterByMultiple(String role, Integer minAge, Integer maxAge, String department) {
        List<Person> allPersons = personRepository.findAll();

        log.info("Parallel filter ");


        CompletableFuture<ArrayList<Person>> allPersonsFuture = CompletableFuture.supplyAsync(() ->
                getPeople(role, minAge, maxAge, department, allPersons)
        );

        try {
            return allPersonsFuture.get(5, TimeUnit.SECONDS);
        } catch(TimeoutException e) {
            log.error("Timeout while waiting for parallel filter");
            allPersonsFuture.cancel(true);
            log.error("Fallback option!");
            return getPeople(role, minAge, maxAge, department, allPersons);
        } catch (ExecutionException e) {
            throw new RuntimeException(e);
        } catch (InterruptedException e) {
            throw new RuntimeException(e);
        }
    }

    private ArrayList<Person> getPeople(String role, Integer minAge, Integer maxAge, String department, List<Person> allPersons) {
        return (ArrayList<Person>) allPersons.parallelStream()
                .filter(p -> role == null || role.isEmpty() || role.equalsIgnoreCase("all") || matchesRole(p, role))
                .filter(p -> minAge == null || p.getAge() >= minAge)
                .filter(p -> maxAge == null || p.getAge() <= maxAge)
                .filter(p -> department == null || department.isEmpty() ||
                        (p.getDepartment() != null && p.getDepartment().equalsIgnoreCase(department)))
                .collect(Collectors.toList());
    }

    private boolean matchesRole(Person person, String role) {
        return switch (role.toLowerCase()) {
            case "doc", "doctor" -> person instanceof Doc;
            case "nurse" -> person instanceof Nurse;
            case "patient" -> person instanceof Patient;
            default -> false;
        };
    }

    @Override
    @Transactional(readOnly = true)
    public Map<String, Map<String, Long>> getDepartmentStatistics() {
        Map<String, Map<String, Long>> deptStats = new LinkedHashMap<>();
        List<Person> allPersons = personRepository.findAll();

        String[] allTypes = {"Врачи", "Медсестры", "Пациенты", "Другие"};

        for (Person person : allPersons) {
            String department = person.getDepartment();
            if (department == null || department.trim().isEmpty()) {
                department = "Без отделения";
            }

            if (!deptStats.containsKey(department)) {
                Map<String, Long> deptData = new LinkedHashMap<>();
                for (String type : allTypes) {
                    deptData.put(type, 0L);
                }
                deptData.put("Всего", 0L);
                deptStats.put(department, deptData);
            }

            Map<String, Long> deptData = deptStats.get(department);
            String type = getPersonType(person);

            deptData.put(type, deptData.getOrDefault(type, 0L) + 1);
            deptData.put("Всего", deptData.get("Всего") + 1);
        }

        Map<String, Map<String, Long>> sortedStats = new LinkedHashMap<>();
        deptStats.entrySet().stream()
                .sorted(Map.Entry.comparingByKey())
                .forEach(entry -> sortedStats.put(entry.getKey(), entry.getValue()));

        log.info("Статистика по отделениям сгенерирована: {} отделений", sortedStats.size());
        log.info("Department stats result: {}", deptStats);
        return sortedStats;
    }

    private String getPersonType(Person person) {
        if (person instanceof Doc) return "Врачи";
        if (person instanceof Nurse) return "Медсестры";
        if (person instanceof Patient) return "Пациенты";
        return "Другие";
    }

    @Override
    @Transactional(readOnly = true)
    public ArrayList<Person> sortByName() {
        return (ArrayList<Person>) personRepository.findAll().stream()
                .sorted(Comparator
                        .comparing(Person::getFirstName, String.CASE_INSENSITIVE_ORDER)
                        .thenComparing(Person::getLastName, String.CASE_INSENSITIVE_ORDER))
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public ArrayList<Person> sortByDepartment() {
        return (ArrayList<Person>) personRepository.findAll().stream()
                .sorted((p1, p2) -> {
                    String dept1 = p1.getDepartment() != null ? p1.getDepartment() : "";
                    String dept2 = p2.getDepartment() != null ? p2.getDepartment() : "";
                    return dept1.compareToIgnoreCase(dept2);
                })
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public Map<String, Long> getStatistics() {
        Map<String, Long> stats = new LinkedHashMap<>();

        List<Object[]> typeStats = personRepository.getStatisticsByType();

        long doctors = 0, nurses = 0, patients = 0;

        for (Object[] stat : typeStats) {
            Class<?> type = (Class<?>) stat[0];
            Long count = (Long) stat[1];

            if (type.equals(Doc.class)) {
                doctors = count;
            } else if (type.equals(Nurse.class)) {
                nurses = count;
            } else if (type.equals(Patient.class)) {
                patients = count;
            }
        }

        stats.put("Доктора", doctors);
        stats.put("Медсестры", nurses);
        stats.put("Пациенты", patients);
        stats.put("Всего", personRepository.count());

        log.info("Statistics generated: {}", stats);
        return stats;
    }

    @Override
    public void reloadData() {
        log.info("Data is managed by JPA/PostgreSQL");
    }

    @Transactional(readOnly = true)
    @Override
    public Map<String, Double> getAverageAgeByType() {
        List<Person> allPersons = personRepository.findAll();

        return allPersons.stream()
                .collect(Collectors.groupingBy(
                        p -> {
                            if (p instanceof Doc) return "Врачи";
                            if (p instanceof Nurse) return "Медсестры";
                            return "Пациенты";
                        },
                        Collectors.averagingInt(Person::getAge)
                ));
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<Person> getById(UUID id) {
        return personRepository.findById(id);
    }

    private List<Person> getAllDocsToList() {
        return  personRepository.findByType(Doc.class);
    }

}