package com.example.veterinary.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "owners")
public class Owner {

    @Id
    private int ownerId;

    private String ownerName;
    private String phone;
    private String email;

    public Owner() {
    }

    public Owner(int ownerId, String ownerName, String phone, String email) {
        this.ownerId = ownerId;
        this.ownerName = ownerName;
        this.phone = phone;
        this.email = email;
    }

    public int getOwnerId() {
        return ownerId;
    }

    public void setOwnerId(int ownerId) {
        this.ownerId = ownerId;
    }

    public String getOwnerName() {
        return ownerName;
    }

    public void setOwnerName(String ownerName) {
        this.ownerName = ownerName;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }
}