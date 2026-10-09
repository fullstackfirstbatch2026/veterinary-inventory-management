package com.example.veterinary.service;

import com.example.veterinary.entity.Prescription;
import com.example.veterinary.repository.PrescriptionRepository;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

import java.sql.Date;
import java.util.List;

@Service
public class PrescriptionService {

    private final PrescriptionRepository prescriptionRepository;
    private final JdbcTemplate jdbcTemplate;

    public PrescriptionService(PrescriptionRepository prescriptionRepository,
                                JdbcTemplate jdbcTemplate) {
        this.prescriptionRepository = prescriptionRepository;
        this.jdbcTemplate = jdbcTemplate;
    }

    // Get all prescriptions
    public List<Prescription> getAllPrescriptions() {
        return prescriptionRepository.findAll();
    }

    // Get prescription by ID
    public Prescription getPrescriptionById(int id) {
        return prescriptionRepository.findById(id).orElse(null);
    }

    // Create prescription using @Procedure
    public void createPrescription(Prescription prescription) {

        prescriptionRepository.createPrescription(
                prescription.getAnimalId(),
                prescription.getMedicineId(),
                prescription.getQuantity(),
                prescription.getDosage(),
                Date.valueOf(prescription.getPrescriptionDate())
        );
    }

    // JOIN query
    public List<Object[]> getPrescriptionDetails() {
        return prescriptionRepository.getPrescriptionDetails();
    }

    // Subquery
    public List<Object[]> getMedicinesAboveAverage() {
        return prescriptionRepository.getMedicinesAboveAverage();
    }

    // MySQL Function
    public Double calculatePrescriptionCost(int prescriptionId) {

        String sql = "SELECT calculate_prescription_cost(?)";

        return jdbcTemplate.queryForObject(
                sql,
                Double.class,
                prescriptionId
        );
    }

    // Delete prescription
    public void deletePrescription(int id) {
        prescriptionRepository.deleteById(id);
    }
}