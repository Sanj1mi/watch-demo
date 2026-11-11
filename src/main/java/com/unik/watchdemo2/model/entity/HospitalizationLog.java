package com.unik.watchdemo2.model.entity;

import lombok.*;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class HospitalizationLog {
    private UUID id;
    private UUID patientId;
    private String patientName;
    private String action;
    private LocalDateTime timestamp;
    private String department;
    private String diagnosis;
    private String doctorName;
    private String notes;
}