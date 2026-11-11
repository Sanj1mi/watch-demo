package com.unik.watchdemo2.model.collections;

import lombok.*;

import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@Data
public class DiagnosisRegistry {
    private final Map<UUID, String> patientDiagnoses = new HashMap<>();
    private final Map<String, Integer> diagnosisStatistics = new HashMap<>();

    public void addDiagnosis(UUID patientId, String diagnosis) {
        patientDiagnoses.put(patientId, diagnosis);

        /** statistic by diagnosis */
        diagnosisStatistics.merge(diagnosis, 1, Integer::sum);
    }

    public String getDiagnosis(UUID patientId) {
        return patientDiagnoses.get(patientId);
    }

    public void removeDiagnosis(UUID patientId) {
        String diagnosis = patientDiagnoses.remove(patientId);
        if (diagnosis != null) {
            diagnosisStatistics.computeIfPresent(diagnosis, (k, v) -> v > 1 ? v - 1 : null);
        }
    }

    public Map<String, Integer> getDiagnosisStats() {
        return new HashMap<>(diagnosisStatistics);
    }
}

