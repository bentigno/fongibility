package com.fongibility.controller;

import com.fongibility.dto.ActionDTO;
import com.fongibility.service.ActionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/actions")
@CrossOrigin(origins = {"http://localhost:3000", "https://fongibility.vercel.app"})
public class ActionController {

    @Autowired
    private ActionService actionService;

    @GetMapping("/programme/{programmeId}")
    @PreAuthorize("hasAnyRole('OPERATEUR_SAISIE', 'RESPONSABLE_FONCTION')")
    public ResponseEntity<List<ActionDTO>> getActionsByProgramme(@PathVariable Long programmeId) {
        return ResponseEntity.ok(actionService.getActionsByProgramme(programmeId));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('OPERATEUR_SAISIE', 'RESPONSABLE_FONCTION')")
    public ResponseEntity<ActionDTO> getActionById(@PathVariable Long id) {
        ActionDTO action = actionService.getActionById(id);
        return action != null ? ResponseEntity.ok(action) : ResponseEntity.notFound().build();
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('OPERATEUR_SAISIE', 'ADMIN')")
    public ResponseEntity<ActionDTO> createAction(@RequestBody ActionDTO actionDTO) {
        ActionDTO created = actionService.createAction(actionDTO);
        return created != null ? ResponseEntity.ok(created) : ResponseEntity.badRequest().build();
    }
}
