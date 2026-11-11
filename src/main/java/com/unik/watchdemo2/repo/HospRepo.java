package com.unik.watchdemo2.repo;

import com.fasterxml.jackson.annotation.JsonTypeInfo;
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.type.CollectionType;
import com.unik.watchdemo2.model.entity.Person;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Repository;

import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

@Slf4j
@Repository
public class HospRepo {
    private static final String DATA_FILE = "data/hospital_storage.json";
    private final ObjectMapper objectMapper;

    public HospRepo() {
        this.objectMapper = new ObjectMapper();
        objectMapper.activateDefaultTyping(
                objectMapper.getPolymorphicTypeValidator(),
                ObjectMapper.DefaultTyping.NON_FINAL,
                JsonTypeInfo.As.PROPERTY
        );

        objectMapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);

        log.info("HospRepo initialized. Current working dir: {}", System.getProperty("user.dir"));
        log.info("Data file will be at: {}", new File(DATA_FILE).getAbsolutePath());
        log.info("HospRepo initialized");
    }

    public List<Person> loadAll() throws IOException {
        File file = new File(DATA_FILE);
        if (!file.exists()) {
            log.info("Data file not found, starting with empty database");
            return new ArrayList<>();
        }

        try {
            log.info("Loading data from: {}", file.getAbsolutePath());

            CollectionType listType = objectMapper.getTypeFactory()
                    .constructCollectionType(List.class, Person.class);

            List<Person> persons = objectMapper.readValue(file, listType);
            log.info("Loaded {} records from file", persons.size());
            return persons;

        } catch (Exception e) {
            log.error("Error loading data from file: {}", e.getMessage());
            log.error("Creating new empty database");

            if (file.exists() && file.delete()) {
                log.info("Deleted corrupted file: {}", DATA_FILE);
            }

            return new ArrayList<>();
        }
    }

    public void saveAll(List<Person> persons) throws IOException {
        File file = new File(DATA_FILE);

        log.info("=== SAVE START ===");
        log.info("Saving to: {}", file.getAbsolutePath());
        log.info("Records count: {}", persons.size());

        File parent = file.getParentFile();
        if (parent != null) {
            log.info("Parent dir: {}", parent.getAbsolutePath());
            boolean created = parent.mkdirs();
            log.info("Dirs created: {}", created);
        }

        try {
            objectMapper.writerWithDefaultPrettyPrinter().writeValue(file, persons);
            log.info("=== SAVE SUCCESS ===");
            log.info("File exists: {}", file.exists());
            log.info("File size: {} bytes", file.length());

        } catch (Exception e) {
            log.error("=== SAVE FAILED ===");
            log.error("Error: {}", e.getClass().getName());
            log.error("Message: {}", e.getMessage());
            log.error("Full path: {}", file.getAbsolutePath());
            log.error("Parent can write: {}", parent != null && parent.canWrite());
            throw e;
        }
    }
}