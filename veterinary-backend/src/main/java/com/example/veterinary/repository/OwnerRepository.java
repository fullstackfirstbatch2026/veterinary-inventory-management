package com.example.veterinary.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.example.veterinary.entity.Owner;

public interface OwnerRepository extends JpaRepository<Owner, Integer> {
}