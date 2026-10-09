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

    @GetMapping
    public List<Prescription> getAllPrescriptions() {
        return prescriptionService.getAllPrescriptions();
    }

    @GetMapping("/{id}")
    public Prescription getPrescriptionById(@PathVariable int id) {
        return prescriptionService.getPrescriptionById(id);
    }

    @PostMapping
    public String createPrescription(@RequestBody Prescription prescription) {
        prescriptionService.createPrescription(prescription);
        return "Prescription created successfully";
    }

    @GetMapping("/details")
    public List<Object[]> getPrescriptionDetails() {
        return prescriptionService.getPrescriptionDetails();
    }

    @GetMapping("/above-average")
    public List<Object[]> getMedicinesAboveAverage() {
        return prescriptionService.getMedicinesAboveAverage();
    }

    @GetMapping("/{id}/cost")
    public Double calculatePrescriptionCost(@PathVariable int id) {
        return prescriptionService.calculatePrescriptionCost(id);
    }

    @DeleteMapping("/{id}")
    public String deletePrescription(@PathVariable int id) {
        prescriptionService.deletePrescription(id);
        return "Prescription deleted successfully";
    }
}