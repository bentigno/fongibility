package com.fongibility.service;

import com.fongibility.dto.ActiviteDTO;
import com.fongibility.entity.Activite;
import com.fongibility.entity.Action;
import com.fongibility.repository.ActiviteRepository;
import com.fongibility.repository.ActionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ActiviteService {
    
    @Autowired
    private ActiviteRepository activiteRepository;
    
    @Autowired
    private ActionRepository actionRepository;
    
    public List<ActiviteDTO> getActivitiesByAction(Long actionId) {
        Action action = actionRepository.findById(actionId).orElse(null);
        if (action == null) return List.of();
        
        return activiteRepository.findByAction(action).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    public ActiviteDTO getActiviteById(Long id) {
        return activiteRepository.findById(id)
                .map(this::convertToDTO)
                .orElse(null);
    }
    
    public ActiviteDTO createActivite(ActiviteDTO dto) {
        Action action = actionRepository.findById(dto.getActionId()).orElse(null);
        if (action == null) return null;
        
        Activite activite = new Activite();
        activite.setCode(dto.getCode());
        activite.setLibelle(dto.getLibelle());
        activite.setDescription(dto.getDescription());
        activite.setAction(action);
        
        Activite saved = activiteRepository.save(activite);
        return convertToDTO(saved);
    }
    
    private ActiviteDTO convertToDTO(Activite activite) {
        return ActiviteDTO.builder()
                .id(activite.getId())
                .code(activite.getCode())
                .libelle(activite.getLibelle())
                .description(activite.getDescription())
                .actionId(activite.getAction().getId())
                .actionLibelle(activite.getAction().getLibelle())
                .build();
    }
}
