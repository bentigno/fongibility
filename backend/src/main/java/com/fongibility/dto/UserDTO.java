package com.fongibility.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;
import java.util.Set;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserDTO {
    private Long id;
    private String username;
    private String email;
    private String nom;
    private String prenom;
    private Long sectionId;
    private String sectionLibelle;
    private Set<String> roles;
    private Boolean actif;
    private LocalDateTime dateCreation;
}
