package com.fongibility.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "programmes")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Programme {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false, unique = true)
    private String code;
    
    @Column(nullable = false)
    private String libelle;
    
    @ManyToOne
    @JoinColumn(name = "section_id", nullable = false)
    private Section section;
    
    private String referenceActe;
    private String diffusion;
    private LocalDate dateEffet;
    private LocalDate dateFin;
    private String validite;
    private String statut;
    private String description;
    private String typeProgram;
    private LocalDateTime dateModification;
    private LocalDateTime dateActualisation;
    
    @OneToMany(mappedBy = "programme", cascade = CascadeType.ALL)
    private Set<Action> actions = new HashSet<>();
    
    @OneToMany(mappedBy = "programme", cascade = CascadeType.ALL)
    private Set<Transaction> transactions = new HashSet<>();
}
