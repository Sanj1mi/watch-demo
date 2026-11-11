package com.unik.watchdemo2.repo;

import com.unik.watchdemo2.model.entity.Person;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface PersonRepository extends JpaRepository<Person, UUID> {

    List<Person> findByFirstNameContainingIgnoreCaseOrLastNameContainingIgnoreCase(String firstName, String lastName);

    List<Person> findByDepartment(String department);

    List<Person> findByAgeBetween(int minAge, int maxAge);

    @Query("SELECT p FROM Person p WHERE TYPE(p) = :typeClass")
    List<Person> findByType(@Param("typeClass") Class<? extends Person> typeClass);

    @Query("SELECT TYPE(p), COUNT(p) FROM Person p GROUP BY TYPE(p)")
    List<Object[]> getStatisticsByType();

}
