package com.example.veterinary.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "owners")
public class Owner {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer ownerId;

    private String ownerName;
    private String phone;
    private String email;
    private String address;

    public Owner() {
    }

    public Owner(Integer ownerId, String ownerName, String phone,
                 String email, String address) {
        this.ownerId = ownerId;
        this.ownerName = ownerName;
        this.phone = phone;
        this.email = email;
        this.address = address;
    }

    public Integer getOwnerId() { return ownerId; }
    public void setOwnerId(Integer ownerId) { this.ownerId = ownerId; }

    public String getOwnerName() { return ownerName; }
    public void setOwnerName(String ownerName) { this.ownerName = ownerName; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }
}