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
public class SectionDTO {
    private Long id;
    private String code;
    private String libelle;
    private String abreviation;
    private LocalDate dateEffet;
    private LocalDate dateFin;
    private Boolean valide;
    private String type;
}
