package com.unik.watchdemo2.service.impl;

import com.unik.watchdemo2.model.entity.HospitalizationLog;
import com.unik.watchdemo2.repo.LogRepo;
import com.unik.watchdemo2.service.intr.LogService;
import jakarta.annotation.PostConstruct;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.File;
import java.io.IOException;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Stack;
import java.util.UUID;

@Slf4j
@Service
public class LogServiceImpl implements LogService {

    private final LogRepo logRepo;
    private final List<HospitalizationLog> logs;

    private final Stack<HospitalizationLog> stack;


    @Autowired
    public LogServiceImpl(LogRepo logRepo) {
        this.logRepo = logRepo;
        this.logs = new ArrayList<>();
        this.stack = new Stack<>();
    }

    @PostConstruct
    public void init() {
        reloadLogs();
        log.info("Log service initialized with {} entries", logs.size());

        if (logs.isEmpty()) {
            log.warn("No logs loaded. Checking file...");
            try {
                File file = new File("data/hospital_logs.json");
                if (file.exists()) {
                    log.info("Log file exists at: {}", file.getAbsolutePath());
                    log.info("File size: {} bytes", file.length());

                    String content = new String(java.nio.file.Files.readAllBytes(file.toPath()));
                    log.info("File content preview: {}", content.substring(0, Math.min(200, content.length())));
                } else {
                    log.info("Log file does not exist at: {}", file.getAbsolutePath());
                }
            } catch (Exception e) {
                log.error("Error checking log file: {}", e.getMessage());
            }
        }
    }

    @Override
    public HospitalizationLog logAdmission(UUID patientId, String patientName,
                                           String department, String diagnosis,
                                           String doctorName, String notes) {

        HospitalizationLog logEntry = HospitalizationLog.builder()
                .id(UUID.randomUUID())
                .patientId(patientId)
                .patientName(patientName)
                .action("ADMISSION")
                .timestamp(LocalDateTime.now())
                .department(department)
                .diagnosis(diagnosis)
                .doctorName(doctorName)
                .notes(notes)
                .build();

        logs.add(logEntry);
        stack.push(logEntry);  // last note on top
        saveLogs();
        log.info("Patient admission logged: {} (ID: {})", patientName, patientId);
        return logEntry;
    }

    @Override
    public HospitalizationLog logDischarge(UUID patientId, String patientName,
                                           String department, String doctorName,
                                           String notes) {

        HospitalizationLog logEntry = HospitalizationLog.builder()
                .id(UUID.randomUUID())
                .patientId(patientId)
                .patientName(patientName)
                .action("DISCHARGE")
                .timestamp(LocalDateTime.now())
                .department(department)
                .doctorName(doctorName)
                .notes(notes)
                .build();

        logs.add(logEntry);
        stack.push(logEntry);  // Stack LIFO
        saveLogs();
        log.info("Patient discharge logged: {} (ID: {})", patientName, patientId);
        return logEntry;
    }

    @Override
    public List<HospitalizationLog> getPatientLogs(UUID patientId) {
        List<HospitalizationLog> patientLogs = new ArrayList<>();
        for (HospitalizationLog logEntry : logs) {
            if (logEntry.getPatientId().equals(patientId)) {
                patientLogs.add(logEntry);
            }
        }
        return patientLogs;
    }

    @Override
    public List<HospitalizationLog> getAllLogs() {
        return new ArrayList<>(logs);
    }

    @Override
    public List<HospitalizationLog> getRecentLogs(int limit) {
        // last N (LIFO)
        List<HospitalizationLog> result = new ArrayList<>();
        for (int i = stack.size() - 1; i >= 0 && result.size() < limit; i--) {
            result.add(stack.get(i));
        }
        return result;
    }


    @Override
    public List<HospitalizationLog> getLogsByDepartment(String department) {
        List<HospitalizationLog> deptLogs = new ArrayList<>();
        for (HospitalizationLog logEntry : logs) {
            if (logEntry.getDepartment() != null &&
                    logEntry.getDepartment().equalsIgnoreCase(department)) {
                deptLogs.add(logEntry);
            }
        }
        return deptLogs;
    }

    private void saveLogs() {
        try {
            logRepo.saveAllLogs(logs);
        } catch (IOException e) {
            log.error("Failed to save logs: {}", e.getMessage());
        }
    }

    private void reloadLogs() {
        try {
            List<HospitalizationLog> loaded = logRepo.loadAllLogs();
            logs.clear();
            logs.addAll(loaded);
            stack.clear();
            loaded.forEach(stack::push);  // Stack: push
            log.info("Logs reloaded successfully. Total entries: {}", logs.size());
        } catch (IOException e) {
            logs.clear();
            stack.clear();
            log.error("Error loading logs: {}", e.getMessage());
        }
    }
}