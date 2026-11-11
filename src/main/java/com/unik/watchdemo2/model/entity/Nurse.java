package com.unik.watchdemo2.model.entity;

import jakarta.persistence.Column;
import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;
import lombok.*;
import lombok.experimental.SuperBuilder;

import java.math.BigDecimal;

@Entity
@DiscriminatorValue("NURSE")
@Getter
@Setter
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = true)
public class Nurse extends Person {

    @Column(name = "shift", length = 64)
    private String shift;

    @Column(name = "qualification", length = 128)
    private String qualification;

    @Column(name = "salary", precision = 12, scale = 2)
    private BigDecimal salary;
}
