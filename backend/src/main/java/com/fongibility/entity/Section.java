package com.fongibility.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "sections")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Section {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false, unique = true)
    private String code;
    
    @Column(nullable = false)
    private String libelle;
    
    private String abreviation;
    
    private LocalDate dateEffet;
    private LocalDate dateFin;
    private Boolean valide;
    private String type;
    
    @Builder.Default
    @OneToMany(mappedBy = "section", cascade = CascadeType.ALL)
    private Set<Programme> programmes = new HashSet<>();
    
    @Builder.Default
    @OneToMany(mappedBy = "section", cascade = CascadeType.ALL)
    private Set<Chapitre> chapitres = new HashSet<>();
    
    @Builder.Default
    @OneToMany(mappedBy = "section", cascade = CascadeType.ALL)
    private Set<Transaction> transactions = new HashSet<>();
}
