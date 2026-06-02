package com.fongibility.service;

import com.fongibility.dto.ActionDTO;
import com.fongibility.entity.Action;
import com.fongibility.entity.Programme;
import com.fongibility.repository.ActionRepository;
import com.fongibility.repository.ProgrammeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ActionService {
    
    @Autowired
    private ActionRepository actionRepository;
    
    @Autowired
    private ProgrammeRepository programmeRepository;
    
    public List<ActionDTO> getActionsByProgramme(Long programmeId) {
        Programme programme = programmeRepository.findById(programmeId).orElse(null);
        if (programme == null) return List.of();
        
        return actionRepository.findByProgramme(programme).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    public ActionDTO getActionById(Long id) {
        return actionRepository.findById(id)
                .map(this::convertToDTO)
                .orElse(null);
    }
    
    public ActionDTO createAction(ActionDTO dto) {
        Programme programme = programmeRepository.findById(dto.getProgrammeId()).orElse(null);
        if (programme == null) return null;
        
        Action action = new Action();
        action.setCode(dto.getCode());
        action.setLibelle(dto.getLibelle());
        action.setDescription(dto.getDescription());
        action.setProgramme(programme);
        action.setDateEffet(dto.getDateEffet());
        action.setDateFin(dto.getDateFin());
        action.setNipCode(dto.getNipCode());
        
        Action saved = actionRepository.save(action);
        return convertToDTO(saved);
    }
    
    private ActionDTO convertToDTO(Action action) {
        return ActionDTO.builder()
                .id(action.getId())
                .code(action.getCode())
                .libelle(action.getLibelle())
                .description(action.getDescription())
                .programmeId(action.getProgramme().getId())
                .programmeLIbelle(action.getProgramme().getLibelle())
                .dateEffet(action.getDateEffet())
                .dateFin(action.getDateFin())
                .nipCode(action.getNipCode())
                .build();
    }
}
