package com.fongibility.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "categories_depense")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CategorieDepense {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false, unique = true)
    private String code;
    
    @Column(nullable = false)
    private String libelle;
    
    private String type;
    private String dotation;
    private String typeBudgetaire;
    
    @ManyToOne
    @JoinColumn(name = "parent_id")
    private CategorieDepense parent;
}
