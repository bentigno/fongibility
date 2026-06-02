package com.fongibility.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "natures_economique")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class NatureEconomique {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false, unique = true)
    private String code;
    
    @Column(nullable = false)
    private String libelle;
    
    private String type;
    private Boolean valide;
    private String detaillerDepense;
    
    @ManyToOne
    @JoinColumn(name = "parent_id")
    private NatureEconomique parent;
}
