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
@Table(name = "actions")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Action {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false, unique = true)
    private String code;
    
    @Column(nullable = false)
    private String libelle;
    
    private String description;
    
    @ManyToOne
    @JoinColumn(name = "programme_id", nullable = false)
    private Programme programme;
    
    @ManyToOne
    @JoinColumn(name = "parent_id")
    private Action parent;
    
    private LocalDate dateEffet;
    private LocalDate dateFin;
    private String nipCode;
    private LocalDateTime dateModification;
    
    @Builder.Default
    @OneToMany(mappedBy = "parent", cascade = CascadeType.ALL)
    private Set<Action> subActions = new HashSet<>();
    
    @Builder.Default
    @OneToMany(mappedBy = "action", cascade = CascadeType.ALL)
    private Set<Activite> activites = new HashSet<>();
    
    @Builder.Default
    @OneToMany(mappedBy = "action", cascade = CascadeType.ALL)
    private Set<Transaction> transactions = new HashSet<>();
}
