package com.fongibility.controller;

import com.fongibility.dto.CategorieDepenseDTO;
import com.fongibility.entity.CategorieDepense;
import com.fongibility.repository.CategorieDepenseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/categories")
@CrossOrigin(origins = {"http://localhost:3000", "https://fongibility.vercel.app"})
public class CategorieDepenseController {

    @Autowired
    private CategorieDepenseRepository categorieDepenseRepository;

    @GetMapping
    @PreAuthorize("hasAnyRole('OPERATEUR_SAISIE', 'RESPONSABLE_FONCTION')")
    public ResponseEntity<List<CategorieDepenseDTO>> getAllCategories() {
        List<CategorieDepenseDTO> categories = categorieDepenseRepository.findAll()
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(categories);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('OPERATEUR_SAISIE', 'RESPONSABLE_FONCTION')")
    public ResponseEntity<CategorieDepenseDTO> getCategoryById(@PathVariable Long id) {
        return categorieDepenseRepository.findById(id)
                .map(categorie -> ResponseEntity.ok(convertToDTO(categorie)))
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('OPERATEUR_SAISIE', 'ADMIN')")
    public ResponseEntity<CategorieDepenseDTO> createCategory(@RequestBody CategorieDepenseDTO dto) {
        CategorieDepense categorie = new CategorieDepense();
        categorie.setCode(dto.getCode());
        categorie.setLibelle(dto.getLibelle());
        categorie.setType(dto.getType());
        categorie.setDotation(dto.getDotation());
        categorie.setTypeBudgetaire(dto.getTypeBudgetaire());

        if (dto.getParentId() != null) {
            CategorieDepense parent = categorieDepenseRepository.findById(dto.getParentId()).orElse(null);
            categorie.setParent(parent);
        }

        CategorieDepense saved = categorieDepenseRepository.save(categorie);
        return ResponseEntity.ok(convertToDTO(saved));
    }

    private CategorieDepenseDTO convertToDTO(CategorieDepense categorie) {
        return CategorieDepenseDTO.builder()
                .id(categorie.getId())
                .code(categorie.getCode())
                .libelle(categorie.getLibelle())
                .type(categorie.getType())
                .dotation(categorie.getDotation())
                .typeBudgetaire(categorie.getTypeBudgetaire())
                .parentId(categorie.getParent() != null ? categorie.getParent().getId() : null)
                .build();
    }
}
