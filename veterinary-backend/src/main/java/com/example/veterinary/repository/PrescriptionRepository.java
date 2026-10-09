package com.example.veterinary.repository;

import com.example.veterinary.entity.Prescription;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.query.Procedure;
import org.springframework.data.repository.query.Param;

import java.sql.Date;
import java.util.List;

public interface PrescriptionRepository extends JpaRepository<Prescription, Integer> {

    // JOIN: Prescription + Animal + Owner + Medicine
    @Query(value = """
        SELECT
            p.prescription_id,
            a.animal_name,
            o.owner_name,
            m.medicine_name,
            p.quantity,
            p.dosage,
            p.prescription_date
        FROM prescriptions p
        JOIN animals a
            ON p.animal_id = a.animal_id
        JOIN owners o
            ON a.owner_id = o.owner_id
        JOIN medicines m
            ON p.medicine_id = m.medicine_id
        """, nativeQuery = true)
    List<Object[]> getPrescriptionDetails();


    // SUBQUERY: Medicines prescribed above average
    @Query(value = """
        SELECT
            m.medicine_id,
            m.medicine_name,
            m.price,
            m.stock
        FROM medicines m
        WHERE m.medicine_id IN (
            SELECT p.medicine_id
            FROM prescriptions p
            GROUP BY p.medicine_id
            HAVING SUM(p.quantity) > (
                SELECT AVG(total_quantity)
                FROM (
                    SELECT SUM(quantity) AS total_quantity
                    FROM prescriptions
                    GROUP BY medicine_id
                ) x
            )
        )
        """, nativeQuery = true)
    List<Object[]> getMedicinesAboveAverage();


    // STORED PROCEDURE
    @Procedure(procedureName = "create_prescription")
    void createPrescription(
            @Param("p_animal_id") Integer animalId,
            @Param("p_medicine_id") Integer medicineId,
            @Param("p_quantity") Integer quantity,
            @Param("p_dosage") String dosage,
            @Param("p_prescription_date") Date prescriptionDate
    );
}