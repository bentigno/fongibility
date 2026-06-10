package com.fongibility.controller;

import com.fongibility.dto.NatureEconomiqueDTO;
import com.fongibility.entity.NatureEconomique;
import com.fongibility.repository.NatureEconomiqueRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/natures")
@CrossOrigin(origins = "http://localhost:3000")
public class NatureEconomiqueController {

    @Autowired
    private NatureEconomiqueRepository natureEconomiqueRepository;

    @GetMapping
    @PreAuthorize("hasAnyRole('OPERATEUR_SAISIE', 'RESPONSABLE_FONCTION')")
    public ResponseEntity<List<NatureEconomiqueDTO>> getAllNatures() {
        List<NatureEconomiqueDTO> natures = natureEconomiqueRepository.findAll()
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(natures);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('OPERATEUR_SAISIE', 'RESPONSABLE_FONCTION')")
    public ResponseEntity<NatureEconomiqueDTO> getNatureById(@PathVariable Long id) {
        return natureEconomiqueRepository.findById(id)
                .map(nature -> ResponseEntity.ok(convertToDTO(nature)))
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('OPERATEUR_SAISIE', 'ADMIN')")
    public ResponseEntity<NatureEconomiqueDTO> createNature(@RequestBody NatureEconomiqueDTO dto) {
        NatureEconomique nature = new NatureEconomique();
        nature.setCode(dto.getCode());
        nature.setLibelle(dto.getLibelle());
        nature.setType(dto.getType());
        nature.setValide(dto.getValide());
        nature.setDetaillerDepense(dto.getDetaillerDepense());

        if (dto.getParentId() != null) {
            NatureEconomique parent = natureEconomiqueRepository.findById(dto.getParentId()).orElse(null);
            nature.setParent(parent);
        }

        NatureEconomique saved = natureEconomiqueRepository.save(nature);
        return ResponseEntity.ok(convertToDTO(saved));
    }

    private NatureEconomiqueDTO convertToDTO(NatureEconomique nature) {
        return NatureEconomiqueDTO.builder()
                .id(nature.getId())
                .code(nature.getCode())
                .libelle(nature.getLibelle())
                .type(nature.getType())
                .valide(nature.getValide())
                .detaillerDepense(nature.getDetaillerDepense())
                .parentId(nature.getParent() != null ? nature.getParent().getId() : null)
                .build();
    }
}
