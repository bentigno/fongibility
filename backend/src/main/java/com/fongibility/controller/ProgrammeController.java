package com.fongibility.controller;

import com.fongibility.dto.ProgrammeDTO;
import com.fongibility.service.ProgrammeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/programmes")
@CrossOrigin(origins = {"http://localhost:3000", "https://fongibility.vercel.app"})
public class ProgrammeController {

    @Autowired
    private ProgrammeService programmeService;

    @GetMapping
    @PreAuthorize("hasAnyRole('OPERATEUR_SAISIE', 'RESPONSABLE_FONCTION')")
    public ResponseEntity<List<ProgrammeDTO>> getAllProgrammes() {
        return ResponseEntity.ok(programmeService.getAllProgrammes());
    }

    @GetMapping("/section/{sectionId}")
    @PreAuthorize("hasAnyRole('OPERATEUR_SAISIE', 'RESPONSABLE_FONCTION')")
    public ResponseEntity<List<ProgrammeDTO>> getProgrammesBySection(@PathVariable Long sectionId) {
        return ResponseEntity.ok(programmeService.getProgrammesBySection(sectionId));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('OPERATEUR_SAISIE', 'RESPONSABLE_FONCTION')")
    public ResponseEntity<ProgrammeDTO> getProgrammeById(@PathVariable Long id) {
        ProgrammeDTO programme = programmeService.getProgrammeById(id);
        return programme != null ? ResponseEntity.ok(programme) : ResponseEntity.notFound().build();
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('OPERATEUR_SAISIE', 'ADMIN')")
    public ResponseEntity<ProgrammeDTO> createProgramme(@RequestBody ProgrammeDTO programmeDTO) {
        ProgrammeDTO created = programmeService.createProgramme(programmeDTO);
        return created != null ? ResponseEntity.ok(created) : ResponseEntity.badRequest().build();
    }
}
