package com.fongibility.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "chapitres")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Chapitre {
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
    
    private String type;
    private String statut;
    private LocalDateTime dateEnregistrement;
    private LocalDateTime dateValidation;
    private String ancienCode;
    private String codeAncien;
    private String codePtip;
    private String codeAnc;
    private Boolean useExe;
    private LocalDate dateActe;
    private String numeroActe;
}
