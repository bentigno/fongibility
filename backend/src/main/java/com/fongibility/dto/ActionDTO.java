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
public class ActionDTO {
    private Long id;
    private String code;
    private String libelle;
    private String description;
    private Long programmeId;
    private String programmeLIbelle;
    private LocalDate dateEffet;
    private LocalDate dateFin;
    private String nipCode;
}
