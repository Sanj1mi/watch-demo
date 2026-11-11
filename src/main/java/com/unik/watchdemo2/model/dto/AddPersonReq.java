package com.unik.watchdemo2.model.dto;

import lombok.*;

import java.math.BigDecimal;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class AddPersonReq {
    private String firstName;
    private String lastName;
    private int age;
    private String department;

    /** patient */
    private String diagnosis;
    private String insuranceNum;

    /** doc */
    private String specialty;
    private String license;

    /** nurse */
    private String shift;
    private String qualification;

    /** type  "patient", "doc", "nurse" */
    private String type;

    /** salary */
    private BigDecimal salary;

}
