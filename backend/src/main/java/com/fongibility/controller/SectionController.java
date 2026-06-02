package com.fongibility.controller;

import com.fongibility.dto.SectionDTO;
import com.fongibility.service.SectionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/sections")
@CrossOrigin(origins = "http://localhost:3000")
public class SectionController {

    @Autowired
    private SectionService sectionService;

    @GetMapping
    @PreAuthorize("hasAnyRole('OPERATEUR_SAISIE', 'RESPONSABLE_FONCTION')")
    public ResponseEntity<List<SectionDTO>> getAllSections() {
        return ResponseEntity.ok(sectionService.getAllSections());
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('OPERATEUR_SAISIE', 'RESPONSABLE_FONCTION')")
    public ResponseEntity<SectionDTO> getSectionById(@PathVariable Long id) {
        SectionDTO section = sectionService.getSectionById(id);
        return section != null ? ResponseEntity.ok(section) : ResponseEntity.notFound().build();
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<SectionDTO> createSection(@RequestBody SectionDTO sectionDTO) {
        return ResponseEntity.ok(sectionService.createSection(sectionDTO));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<SectionDTO> updateSection(@PathVariable Long id, @RequestBody SectionDTO sectionDTO) {
        SectionDTO updated = sectionService.updateSection(id, sectionDTO);
        return updated != null ? ResponseEntity.ok(updated) : ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteSection(@PathVariable Long id) {
        sectionService.deleteSection(id);
        return ResponseEntity.noContent().build();
    }
}
