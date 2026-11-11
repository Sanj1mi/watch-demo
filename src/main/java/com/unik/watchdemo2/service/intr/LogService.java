package com.unik.watchdemo2.service.intr;

import com.unik.watchdemo2.model.entity.HospitalizationLog;
import java.util.List;
import java.util.Stack;
import java.util.UUID;

public interface LogService {
    HospitalizationLog logAdmission(UUID patientId, String patientName,
                                    String department, String diagnosis,
                                    String doctorName, String notes);

    HospitalizationLog logDischarge(UUID patientId, String patientName,
                                    String department, String doctorName,
                                    String notes);

    List<HospitalizationLog> getPatientLogs(UUID patientId);
    List<HospitalizationLog> getAllLogs();
    List<HospitalizationLog> getRecentLogs(int limit);
    List<HospitalizationLog> getLogsByDepartment(String department);
}