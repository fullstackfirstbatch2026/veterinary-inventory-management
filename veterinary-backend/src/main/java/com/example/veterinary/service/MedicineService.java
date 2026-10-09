package com.example.veterinary.service;

import com.example.veterinary.entity.Medicine;
import com.example.veterinary.repository.MedicineRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MedicineService {

    private final MedicineRepository medicineRepository;

    public MedicineService(MedicineRepository medicineRepository) {
        this.medicineRepository = medicineRepository;
    }

    public List<Medicine> getAllMedicines() {
        return medicineRepository.findAll();
    }

    public Medicine getMedicineById(int id) {
        return medicineRepository.findById(id).orElse(null);
    }

    public Medicine addMedicine(Medicine medicine) {
        return medicineRepository.save(medicine);
    }

    public Medicine updateMedicine(int id, Medicine medicine) {
        medicine.setMedicineId(id);
        return medicineRepository.save(medicine);
    }

    public void deleteMedicine(int id) {
        medicineRepository.deleteById(id);
    }
}