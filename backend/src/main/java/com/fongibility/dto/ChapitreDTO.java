package com.fongibility.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ChapitreDTO {
    private Long id;
    private String code;
    private String libelle;
    private Long sectionId;
    private String sectionLibelle;
    private String type;
    private String statut;
    private String ancienCode;
    private String codePtip;
    private Boolean useExe;
}
