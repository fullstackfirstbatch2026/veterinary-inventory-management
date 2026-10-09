package com.example.veterinary.service;

import com.example.veterinary.entity.Owner;
import com.example.veterinary.repository.OwnerRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class OwnerService {

    private final OwnerRepository ownerRepository;

    public OwnerService(OwnerRepository ownerRepository) {
        this.ownerRepository = ownerRepository;
    }

    public List<Owner> getAllOwners() {
        return ownerRepository.findAll();
    }

    public Owner getOwnerById(int id) {
        return ownerRepository.findById(id).orElse(null);
    }

    public Owner addOwner(Owner owner) {
        return ownerRepository.save(owner);
    }

    public Owner updateOwner(int id, Owner owner) {
        owner.setOwnerId(id);
        return ownerRepository.save(owner);
    }
   
    public void deleteOwner(int id) {
        ownerRepository.deleteById(id);
    }
}