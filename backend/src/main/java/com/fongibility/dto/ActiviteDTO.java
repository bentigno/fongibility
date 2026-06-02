package com.fongibility.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ActiviteDTO {
    private Long id;
    private String code;
    private String libelle;
    private String description;
    private Long actionId;
    private String actionLibelle;
}
