package com.example.veterinary.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.example.veterinary.entity.Medicine;

public interface MedicineRepository extends JpaRepository<Medicine, Integer> {
}