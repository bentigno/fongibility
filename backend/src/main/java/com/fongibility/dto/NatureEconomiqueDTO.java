package com.fongibility.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class NatureEconomiqueDTO {
    private Long id;
    private String code;
    private String libelle;
    private String type;
    private Boolean valide;
    private String detaillerDepense;
    private Long parentId;
}
