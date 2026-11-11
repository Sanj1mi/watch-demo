package com.unik.watchdemo2.model.dto;

import lombok.Data;
import java.util.UUID;

@Data
public class LogRequest {
    private UUID patientId;
    private String patientName;
    private String department;
    private String diagnosis;
    private String doctorName;
    private String notes;
}