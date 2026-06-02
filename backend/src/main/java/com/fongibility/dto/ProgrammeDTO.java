package com.fongibility.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProgrammeDTO {
    private Long id;
    private String code;
    private String libelle;
    private Long sectionId;
    private String sectionLibelle;
    private String referenceActe;
    private String diffusion;
    private LocalDate dateEffet;
    private LocalDate dateFin;
    private String validite;
    private String statut;
    private String description;
    private String typeProgram;
}
