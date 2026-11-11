package com.unik.watchdemo2.controller;

import com.unik.watchdemo2.model.dto.AddPersonReq;
import com.unik.watchdemo2.model.dto.ApiResp;
import com.unik.watchdemo2.model.entity.Person;
import com.unik.watchdemo2.service.intr.HospService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/hospital")
@RequiredArgsConstructor
@Slf4j
public class HospController {

    private final HospService hospService;

    @PostMapping("/add")
    public ResponseEntity<ApiResp> addPerson(@RequestBody AddPersonReq request) {
        if (request == null || request.getType() == null) {
            return ResponseEntity.badRequest()
                    .body(new ApiResp("Поле type обязательно", null));
        }
        try {
            Person person;
            switch (request.getType().toLowerCase()) {
                case "patient" -> person = hospService.addPatient(
                        request.getFirstName(),
                        request.getLastName(),
                        request.getAge(),
                        request.getDepartment(),
                        request.getDiagnosis(),
                        request.getInsuranceNum()
                );
                case "doc" -> person = hospService.addDoc(
                        request.getFirstName(),
                        request.getLastName(),
                        request.getAge(),
                        request.getDepartment(),
                        request.getSpecialty(),
                        request.getLicense(),
                        request.getSalary()
                );
                case "nurse" -> person = hospService.addNurse(
                        request.getFirstName(),
                        request.getLastName(),
                        request.getAge(),
                        request.getDepartment(),
                        request.getShift(),
                        request.getQualification(),
                        request.getSalary()
                );
                default -> {
                    return ResponseEntity.badRequest()
                            .body(new ApiResp("Неизвестный type: " + request.getType(), null));
                }
            }

            return ResponseEntity.ok(new ApiResp("Добавлено", person));
        } catch (Exception e) {
            log.error("Ошибка addPerson", e);
            return ResponseEntity.badRequest()
                    .body(new ApiResp("Ошибка: " + e.getMessage(), null));
        }
    }

    @GetMapping("/persons")
    public ResponseEntity<ApiResp> getAll() {
        return ResponseEntity.ok(new ApiResp("OK", hospService.getAll()));
    }

    @GetMapping("/person/{id}")
    public ResponseEntity<ApiResp> getById(@PathVariable UUID id) {
        return hospService.getById(id)
                .map(person -> ResponseEntity.ok(new ApiResp("OK", person)))
                .orElseGet(() -> ResponseEntity
                        .status(HttpStatus.NOT_FOUND)
                        .body(new ApiResp("Человек не найден", null)));
    }

    @GetMapping("/search")
    public ResponseEntity<ApiResp> search(@RequestParam String name) {
        return ResponseEntity.ok(new ApiResp("OK", hospService.searchByName(name)));
    }

    @GetMapping("/filter/role")
    public ResponseEntity<ApiResp> filterByRole(@RequestParam String role) {
        return ResponseEntity.ok(new ApiResp("OK", hospService.filterByRole(role)));
    }

    @GetMapping("/filter/age")
    public ResponseEntity<ApiResp> filterByAge(
            @RequestParam int min,
            @RequestParam int max
    ) {
        return ResponseEntity.ok(new ApiResp("OK", hospService.filterByAge(min, max)));
    }

    @GetMapping("/filter/department")
    public ResponseEntity<ApiResp> filterByDepartment(
            @RequestParam String department
    ) {
        return ResponseEntity.ok(
                new ApiResp("OK", hospService.filterByDepartment(department))
        );
    }

    @GetMapping("/filter/multiple")
    public ResponseEntity<ApiResp> filterMultiple(
            @RequestParam(required = false) String role,
            @RequestParam(required = false) Integer minAge,
            @RequestParam(required = false) Integer maxAge,
            @RequestParam(required = false) String department
    ) {
        return ResponseEntity.ok(
                new ApiResp("OK",
                        hospService.filterByMultiple(role, minAge, maxAge, department))
        );
    }

    @GetMapping("/sort/name")
    public ResponseEntity<ApiResp> sortByName() {
        return ResponseEntity.ok(new ApiResp("OK", hospService.sortByName()));
    }

    @GetMapping("/sort/department")
    public ResponseEntity<ApiResp> sortByDepartment() {
        return ResponseEntity.ok(new ApiResp("OK", hospService.sortByDepartment()));
    }

    @PutMapping("/edit/{id}")
    public ResponseEntity<ApiResp> editMedicalInfo(
            @PathVariable UUID id,
            @RequestParam String newInfo
    ) {
        boolean updated = hospService.editMedicalInfo(id, newInfo);
        return ResponseEntity.ok(
                new ApiResp(updated ? "Обновлено" : "Не найдено", null)
        );
    }

    @PostMapping("/reload")
    public ResponseEntity<ApiResp> reload() {
        hospService.reloadData();
        return ResponseEntity.ok(new ApiResp("Данные перезагружены", null));
    }

    @GetMapping("/statistics")
    public ResponseEntity<ApiResp> getStatistics() {
        try {

            /** general */
            Map<String, Long> generalStats = hospService.getStatistics();

            /** by department */
            Map<String, Map<String, Long>> deptStats = hospService.getDepartmentStatistics();

            /** age statistic */
            Map<String, Double> ageStats = hospService.getAverageAgeByType();

            /** forming response */
            Map<String, Object> fullStats = new LinkedHashMap<>();

            fullStats.put("Общая", generalStats);
            fullStats.put("По отделениям", deptStats);
            fullStats.put("Возрастная статистика", ageStats);

            return ResponseEntity.ok(new ApiResp("OK", fullStats));
        } catch (Exception e) {
            log.error("Ошибка получения статистики", e);
            return ResponseEntity.badRequest()
                    .body(new ApiResp("Ошибка получения статистики: " + e.getMessage(), null));
        }
    }
}