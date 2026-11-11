package com.unik.watchdemo2.model.entity;

import jakarta.persistence.Column;
import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;
import lombok.*;
import lombok.experimental.SuperBuilder;

import java.math.BigDecimal;

@Entity
@DiscriminatorValue("DOC")
@Getter
@Setter
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = true)
public class Doc extends Person {

    @Column(name = "specialty", length = 128)
    private  String specialty;

    @Column(name = "license", length = 64)
    private  String license;

    @Column(name = "salary", precision = 12, scale = 2)
    private BigDecimal salary;
}
