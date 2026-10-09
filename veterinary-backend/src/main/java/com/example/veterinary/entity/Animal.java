package com.example.veterinary.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "animals")
public class Animal {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer animalId;

    private String animalName;
    private String species;
    private String breed;
    private Integer age;
    private Integer ownerId;

    public Animal() {
    }

    public Animal(Integer animalId, String animalName, String species,
                  String breed, Integer age, Integer ownerId) {
        this.animalId = animalId;
        this.animalName = animalName;
        this.species = species;
        this.breed = breed;
        this.age = age;
        this.ownerId = ownerId;
    }

    public Integer getAnimalId() { return animalId; }
    public void setAnimalId(Integer animalId) { this.animalId = animalId; }

    public String getAnimalName() { return animalName; }
    public void setAnimalName(String animalName) { this.animalName = animalName; }

    public String getSpecies() { return species; }
    public void setSpecies(String species) { this.species = species; }

    public String getBreed() { return breed; }
    public void setBreed(String breed) { this.breed = breed; }

    public Integer getAge() { return age; }
    public void setAge(Integer age) { this.age = age; }

    public Integer getOwnerId() { return ownerId; }
    public void setOwnerId(Integer ownerId) { this.ownerId = ownerId; }
}