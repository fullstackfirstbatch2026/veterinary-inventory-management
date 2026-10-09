package com.example.veterinary.controller;

import com.example.veterinary.entity.Prescription;
import com.example.veterinary.service.PrescriptionService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/prescriptions")
@CrossOrigin(origins = "http://localhost:5173")
public class PrescriptionController {

    private final PrescriptionService prescriptionService;

    public PrescriptionController(PrescriptionService prescriptionService) {
        this.prescriptionService = prescriptionService;
    }

    // Get all prescriptions
    @GetMapping
    public List<Prescription> getAllPrescriptions() {
        return prescriptionService.getAllPrescriptions();
    }

    // Get prescription by ID
    @GetMapping("/{id}")
    public Prescription getPrescriptionById(@PathVariable int id) {
        return prescriptionService.getPrescriptionById(id);
    }

    // Create prescription using Stored Procedure
    @PostMapping
    public String createPrescription(@RequestBody Prescription prescription) {
        prescriptionService.createPrescription(prescription);
        return "Prescription created successfully";
    }

    // JOIN query
    @GetMapping("/details")
    public List<Object[]> getPrescriptionDetails() {
        return prescriptionService.getPrescriptionDetails();
    }

    // Subquery
    @GetMapping("/above-average")
    public List<Object[]> getMedicinesAboveAverage() {
        return prescriptionService.getMedicinesAboveAverage();
    }

    // Stored Function
    @GetMapping("/{id}/cost")
    public Double calculatePrescriptionCost(@PathVariable int id) {
        return prescriptionService.calculatePrescriptionCost(id);
    }

    // Delete prescription
    @DeleteMapping("/{id}")
    public String deletePrescription(@PathVariable int id) {
        prescriptionService.deletePrescription(id);
        return "Prescription deleted successfully";
    }
}