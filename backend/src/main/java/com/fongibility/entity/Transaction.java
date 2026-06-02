package com.fongibility.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "transactions")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Transaction {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false, unique = true)
    private String numeroTransaction;
    
    private Integer exercice;
    private String type;
    private String classification;
    private LocalDateTime dateCreation;
    private LocalDateTime dateModification;
    
    @ManyToOne
    @JoinColumn(name = "section_id", nullable = false)
    private Section section;
    
    @ManyToOne
    @JoinColumn(name = "programme_id", nullable = false)
    private Programme programme;
    
    @ManyToOne
    @JoinColumn(name = "action_id", nullable = false)
    private Action action;
    
    @ManyToOne
    @JoinColumn(name = "activite_id")
    private Activite activite;
    
    @ManyToOne
    @JoinColumn(name = "chapitre_id")
    private Chapitre chapitre;
    
    @ManyToOne
    @JoinColumn(name = "nature_economique_id")
    private NatureEconomique natureEconomique;
    
    @Column(name = "groupe_debit")
    private Integer groupeDebit;
    
    @Column(name = "groupe_credit")
    private Integer groupeCredit;
    
    @Column(precision = 15, scale = 2)
    private BigDecimal montantAE;
    
    @Column(precision = 15, scale = 2)
    private BigDecimal montantCP;
    
    private String typeTransactionDebit;
    private String typeTransactionCredit;
    
    private Boolean transmise = false;
    private Boolean validee = false;
    
    @ManyToOne
    @JoinColumn(name = "user_saisie_id")
    private User userSaisie;
    
    @ManyToOne
    @JoinColumn(name = "user_validation_id")
    private User userValidation;
}
