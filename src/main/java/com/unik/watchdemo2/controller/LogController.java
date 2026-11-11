package com.unik.watchdemo2.controller;

import com.unik.watchdemo2.model.dto.ApiResp;
import com.unik.watchdemo2.model.dto.LogRequest;
import com.unik.watchdemo2.model.entity.HospitalizationLog;
import com.unik.watchdemo2.service.intr.LogService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;


@Slf4j
@RestController
@RequestMapping("/api/logs")
@RequiredArgsConstructor
public class LogController {

    private final LogService logService;

    /** hospitalization */
    @PostMapping("/admission")
    public ResponseEntity<ApiResp> logAdmission(@RequestBody LogRequest request) {
        log.info("Logging admission for patient: {}", request.getPatientName());
        try {
            HospitalizationLog logEntry = logService.logAdmission(
                    request.getPatientId(),
                    request.getPatientName(),
                    request.getDepartment(),
                    request.getDiagnosis(),
                    request.getDoctorName(),
                    request.getNotes()
            );
            return ResponseEntity.ok(
                    new ApiResp("Госпитализация залогирована", logEntry)
            );
        } catch (Exception e) {
            log.error("Error logging admission", e);
            return ResponseEntity.badRequest().body(
                    new ApiResp("Ошибка логирования: " + e.getMessage(), null)
            );
        }
    }

    /** extract */
    @PostMapping("/discharge")
    public ResponseEntity<ApiResp> logDischarge(@RequestBody LogRequest request) {
        log.info("Logging discharge for patient: {}", request.getPatientName());
        try {
            HospitalizationLog logEntry = logService.logDischarge(
                    request.getPatientId(),
                    request.getPatientName(),
                    request.getDepartment(),
                    request.getDoctorName(),
                    request.getNotes()
            );
            return ResponseEntity.ok(
                    new ApiResp("Выписка залогирована", logEntry)
            );
        } catch (Exception e) {
            log.error("Error logging discharge", e);
            return ResponseEntity.badRequest().body(
                    new ApiResp("Ошибка логирования: " + e.getMessage(), null)
            );
        }
    }

    /** get patient logs */
    @GetMapping("/patient/{patientId}")
    public ResponseEntity<ApiResp> getPatientLogs(@PathVariable UUID patientId) {
        log.info("Getting logs for patient ID: {}", patientId);
        try {
            List<HospitalizationLog> logs = logService.getPatientLogs(patientId);
            return ResponseEntity.ok(
                    new ApiResp("Логи пациента загружены", logs)
            );
        } catch (Exception e) {
            log.error("Error getting patient logs", e);
            return ResponseEntity.badRequest().body(
                    new ApiResp("Ошибка загрузки логов: " + e.getMessage(), null)
            );
        }
    }

    /** all logs */
    @GetMapping("/all")
    public ResponseEntity<ApiResp> getAllLogs() {
        log.info("Getting all logs");
        try {
            List<HospitalizationLog> logs = logService.getAllLogs();
            return ResponseEntity.ok(
                    new ApiResp("Все логи загружены", logs)
            );
        } catch (Exception e) {
            log.error("Error getting all logs", e);
            return ResponseEntity.badRequest().body(
                    new ApiResp("Ошибка загрузки логов: " + e.getMessage(), null)
            );
        }
    }

    /** last logs */
    @GetMapping("/recent")
    public ResponseEntity<ApiResp> getRecentLogs(@RequestParam(defaultValue = "10") int limit) {
        log.info("Getting recent logs (limit: {})", limit);
        try {
            List<HospitalizationLog> logs = logService.getRecentLogs(limit);
            return ResponseEntity.ok(
                    new ApiResp("Последние логи загружены", logs)
            );
        } catch (Exception e) {
            log.error("Error getting recent logs", e);
            return ResponseEntity.badRequest().body(
                    new ApiResp("Ошибка загрузки логов: " + e.getMessage(), null)
            );
        }
    }

    /** separated logs */
    @GetMapping("/department/{department}")
    public ResponseEntity<ApiResp> getLogsByDepartment(@PathVariable String department) {
        log.info("Getting logs for department: {}", department);
        try {
            List<HospitalizationLog> logs = logService.getLogsByDepartment(department);
            return ResponseEntity.ok(
                    new ApiResp("Логи отделения загружены", logs)
            );
        } catch (Exception e) {
            log.error("Error getting department logs", e);
            return ResponseEntity.badRequest().body(
                    new ApiResp("Ошибка загрузки логов: " + e.getMessage(), null)
            );
        }
    }
}
