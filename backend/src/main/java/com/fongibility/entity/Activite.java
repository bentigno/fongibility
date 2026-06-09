package com.fongibility.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "activites")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Activite {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false, unique = true)
    private String code;
    
    @Column(nullable = false)
    private String libelle;
    
    private String description;
    
    @ManyToOne
    @JoinColumn(name = "action_id", nullable = false)
    private Action action;
    
    private LocalDateTime dateModification;
    
    @Builder.Default
    @OneToMany(mappedBy = "activite", cascade = CascadeType.ALL)
    private Set<Transaction> transactions = new HashSet<>();
}
