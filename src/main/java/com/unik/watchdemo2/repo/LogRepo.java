package com.unik.watchdemo2.repo;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.databind.type.CollectionType;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import com.unik.watchdemo2.model.entity.HospitalizationLog;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Repository;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;
import java.util.Stack;

@Slf4j
@Repository
public class LogRepo {
    private static final String LOG_FILE = "data/hospital_logs.json";
    private final ObjectMapper objectMapper;

    public LogRepo() {
        this.objectMapper = new ObjectMapper();
        this.objectMapper.registerModule(new JavaTimeModule());
        this.objectMapper.disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);
        this.objectMapper.enable(SerializationFeature.INDENT_OUTPUT);

        log.info("LogRepo initialized with JavaTimeModule");

        createDataDirectory();
        initializeLogFile();
    }

    private void initializeLogFile() {
        try {
            File file = new File(LOG_FILE);

            if (file.getParentFile() != null && !file.getParentFile().exists()) {
                boolean dirsCreated = file.getParentFile().mkdirs();
                log.info("Data directories created: {}", dirsCreated);
            }

            if (!file.exists()) {
                boolean fileCreated = file.createNewFile();
                log.info("Log file created: {} at {}", fileCreated, file.getAbsolutePath());

               objectMapper.writerWithDefaultPrettyPrinter().writeValue(file, new ArrayList<>());
                log.info("Initialized empty log file: {}", file.getAbsolutePath());
            } else {
                log.info("Log file already exists at: {}", file.getAbsolutePath());
                log.info("File size: {} bytes", file.length());
            }

            log.info("Log file absolute path: {}", file.getAbsolutePath());

        } catch (IOException e) {
            log.error("Failed to initialize log file: {}", e.getMessage(), e);
        }
    }

    private void createDataDirectory() {
        try {
            Path path = Paths.get("data");
            if (!Files.exists(path)) {
                Files.createDirectories(path);
                log.info("Created data directory: {}", path.toAbsolutePath());
            }
        } catch (IOException e) {
            log.error("Failed to create data directory: {}", e.getMessage());
        }
    }

    public List<HospitalizationLog> loadAllLogs() throws IOException {
        File file = new File(LOG_FILE);

        if (!file.exists()) {
            log.info("Log file not found at: {}. Starting with empty logs", file.getAbsolutePath());
            return new ArrayList<>();
        }

         if (file.length() == 0) {
            log.warn("Log file is empty: {}", file.getAbsolutePath());
            return new ArrayList<>();
        }

        try {
            CollectionType listType = objectMapper.getTypeFactory()
                    .constructCollectionType(List.class, HospitalizationLog.class);

            List<HospitalizationLog> logs = objectMapper.readValue(file, listType);
            log.info("Successfully loaded {} log entries from {}", logs.size(), file.getAbsolutePath());

            if (!logs.isEmpty()) {
                log.debug("First log: {}", logs.get(0));
                log.debug("Last log: {}", logs.get(logs.size() - 1));
            }

            return logs;
        } catch (Exception e) {
            log.error("Error loading logs from {}: {}", file.getAbsolutePath(), e.getMessage(), e);

            try {
                File backupFile = new File(LOG_FILE + ".backup." + System.currentTimeMillis());
                Files.copy(file.toPath(), backupFile.toPath());
                log.info("Created backup of corrupted file: {}", backupFile.getAbsolutePath());
            } catch (IOException backupError) {
                log.error("Failed to create backup: {}", backupError.getMessage());
            }

           return new ArrayList<>();
        }
    }

    public void saveAllLogs(List<HospitalizationLog> logs) throws IOException {
        File file = new File(LOG_FILE);

        file.getParentFile().mkdirs();

        try {
            File tempFile = new File(LOG_FILE + ".tmp");
            objectMapper.writerWithDefaultPrettyPrinter().writeValue(tempFile, logs);

           if (tempFile.exists()) {
                if (file.exists()) {
                    file.delete();
                }
                tempFile.renameTo(file);
            }

            log.info("Successfully saved {} log entries to {}", logs.size(), file.getAbsolutePath());
        } catch (Exception e) {
            log.error("Error saving logs to {}: {}", file.getAbsolutePath(), e.getMessage(), e);
            throw e;
        }
    }
    /* STACK */
    public void saveAllLogs(Stack<HospitalizationLog> logs) throws IOException {
        File file = new File(LOG_FILE);
        log.debug("STACK SAVE TRY");

        file.getParentFile().mkdirs();

        try {
            File tempFile = new File(LOG_FILE + ".tmp");
            objectMapper.writerWithDefaultPrettyPrinter().writeValue(tempFile, logs);

            if (tempFile.exists()) {
                if (file.exists()) {
                    file.delete();
                }
                tempFile.renameTo(file);
            }

            log.info("Successfully saved {} log entries to {}", logs.size(), file.getAbsolutePath());
        } catch (Exception e) {
            log.error("Error saving logs to {}: {}", file.getAbsolutePath(), e.getMessage(), e);
            throw e;
        }
    }

    public boolean validateLogFile() {
        try {
            File file = new File(LOG_FILE);
            if (!file.exists()) {
                return false;
            }

            List<HospitalizationLog> logs = loadAllLogs();
            return logs != null;
        } catch (Exception e) {
            log.error("Log file validation failed: {}", e.getMessage());
            return false;
        }
    }
}