package com.fongibility.controller;

import com.fongibility.dto.ActiviteDTO;
import com.fongibility.service.ActiviteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/activites")
@CrossOrigin(origins = "http://localhost:3000")
public class ActiviteController {

    @Autowired
    private ActiviteService activiteService;

    @GetMapping("/action/{actionId}")
    @PreAuthorize("hasAnyRole('OPERATEUR_SAISIE', 'RESPONSABLE_FONCTION')")
    public ResponseEntity<List<ActiviteDTO>> getActivitiesByAction(@PathVariable Long actionId) {
        return ResponseEntity.ok(activiteService.getActivitiesByAction(actionId));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('OPERATEUR_SAISIE', 'RESPONSABLE_FONCTION')")
    public ResponseEntity<ActiviteDTO> getActiviteById(@PathVariable Long id) {
        ActiviteDTO activite = activiteService.getActiviteById(id);
        return activite != null ? ResponseEntity.ok(activite) : ResponseEntity.notFound().build();
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('OPERATEUR_SAISIE', 'ADMIN')")
    public ResponseEntity<ActiviteDTO> createActivite(@RequestBody ActiviteDTO activiteDTO) {
        ActiviteDTO created = activiteService.createActivite(activiteDTO);
        return created != null ? ResponseEntity.ok(created) : ResponseEntity.badRequest().build();
    }
}
