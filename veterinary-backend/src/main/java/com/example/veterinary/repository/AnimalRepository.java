package com.example.veterinary.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.example.veterinary.entity.Animal;

public interface AnimalRepository extends JpaRepository<Animal, Integer> {
}