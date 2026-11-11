package com.unik.watchdemo2.model.collections;

import lombok.*;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@Data
public class SalaryRegistry {
    private final Map<UUID, BigDecimal> salaries = new HashMap<>();
    private BigDecimal totalSalaryExpenses = BigDecimal.ZERO;

    public void addSalary(UUID employeeId, BigDecimal salary) {
        BigDecimal oldSalary = salaries.get(employeeId);
        salaries.put(employeeId, salary);

        /** update general expenses */
        if (oldSalary != null) {
            totalSalaryExpenses = totalSalaryExpenses.subtract(oldSalary);
        }
        totalSalaryExpenses = totalSalaryExpenses.add(salary);
    }

    public BigDecimal getSalary(UUID employeeId) {
        return salaries.get(employeeId);
    }

    public void removeSalary(UUID employeeId) {
        BigDecimal salary = salaries.remove(employeeId);
        if (salary != null) {
            totalSalaryExpenses = totalSalaryExpenses.subtract(salary);
        }
    }

    public BigDecimal getAverageSalary() {
        if (salaries.isEmpty()) {
            return BigDecimal.ZERO;
        }
        return totalSalaryExpenses.divide(BigDecimal.valueOf(salaries.size()), 2, BigDecimal.ROUND_HALF_UP);
    }

    public Map<String, BigDecimal> getSalaryStatistics() {
        Map<String, BigDecimal> stats = new HashMap<>();
        stats.put("total", totalSalaryExpenses);
        stats.put("average", getAverageSalary());
        stats.put("employees", BigDecimal.valueOf(salaries.size()));
        return stats;
    }
}
