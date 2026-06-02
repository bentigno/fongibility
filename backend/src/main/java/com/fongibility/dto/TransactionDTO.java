package com.fongibility.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TransactionDTO {
    private Long id;
    private String numeroTransaction;
    private Integer exercice;
    private String type;
    private String classification;
    private LocalDateTime dateCreation;
    private LocalDateTime dateModification;
    
    private Long sectionId;
    private Long programmeId;
    private Long actionId;
    private Long activiteId;
    private Long chapitreId;
    private Long natureEconomiqueId;
    
    private Integer groupeDebit;
    private Integer groupeCredit;
    
    private BigDecimal montantAE;
    private BigDecimal montantCP;
    
    private String typeTransactionDebit;
    private String typeTransactionCredit;
    
    private Boolean transmise;
    private Boolean validee;
}
