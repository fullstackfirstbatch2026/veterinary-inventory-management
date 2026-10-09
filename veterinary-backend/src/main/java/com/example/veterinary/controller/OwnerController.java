package com.example.veterinary.controller;

import com.example.veterinary.entity.Owner;
import com.example.veterinary.service.OwnerService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/owners")
@CrossOrigin(origins = "http://localhost:5173")
public class OwnerController {

    private final OwnerService ownerService;

    public OwnerController(OwnerService ownerService) {
        this.ownerService = ownerService;
    }

    @GetMapping
    public List<Owner> getAllOwners() {
        return ownerService.getAllOwners();
    }

    @GetMapping("/{id}")
    public Owner getOwnerById(@PathVariable int id) {
        return ownerService.getOwnerById(id);
    }

    @PostMapping
    public Owner addOwner(@RequestBody Owner owner) {
        return ownerService.addOwner(owner);
    }

    @PutMapping("/{id}")
    public Owner updateOwner(@PathVariable int id,
                             @RequestBody Owner owner) {
        return ownerService.updateOwner(id, owner);
    }

    @DeleteMapping("/{id}")
    public String deleteOwner(@PathVariable int id) {
        ownerService.deleteOwner(id);
        return "Owner deleted successfully";
    }
}