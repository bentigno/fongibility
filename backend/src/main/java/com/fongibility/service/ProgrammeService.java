package com.fongibility.service;

import com.fongibility.dto.ProgrammeDTO;
import com.fongibility.entity.Programme;
import com.fongibility.entity.Section;
import com.fongibility.repository.ProgrammeRepository;
import com.fongibility.repository.SectionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ProgrammeService {
    
    @Autowired
    private ProgrammeRepository programmeRepository;
    
    @Autowired
    private SectionRepository sectionRepository;
    
    public List<ProgrammeDTO> getAllProgrammes() {
        return programmeRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    public List<ProgrammeDTO> getProgrammesBySection(Long sectionId) {
        Section section = sectionRepository.findById(sectionId).orElse(null);
        if (section == null) return List.of();
        
        return programmeRepository.findBySection(section).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    public ProgrammeDTO getProgrammeById(Long id) {
        return programmeRepository.findById(id)
                .map(this::convertToDTO)
                .orElse(null);
    }
    
    public ProgrammeDTO createProgramme(ProgrammeDTO dto) {
        Section section = sectionRepository.findById(dto.getSectionId()).orElse(null);
        if (section == null) return null;
        
        Programme programme = new Programme();
        programme.setCode(dto.getCode());
        programme.setLibelle(dto.getLibelle());
        programme.setSection(section);
        programme.setReferenceActe(dto.getReferenceActe());
        programme.setDiffusion(dto.getDiffusion());
        programme.setDateEffet(dto.getDateEffet());
        programme.setDateFin(dto.getDateFin());
        programme.setValidite(dto.getValidite());
        programme.setStatut(dto.getStatut());
        programme.setDescription(dto.getDescription());
        programme.setTypeProgram(dto.getTypeProgram());
        
        Programme saved = programmeRepository.save(programme);
        return convertToDTO(saved);
    }
    
    private ProgrammeDTO convertToDTO(Programme programme) {
        return ProgrammeDTO.builder()
                .id(programme.getId())
                .code(programme.getCode())
                .libelle(programme.getLibelle())
                .sectionId(programme.getSection().getId())
                .sectionLibelle(programme.getSection().getLibelle())
                .referenceActe(programme.getReferenceActe())
                .diffusion(programme.getDiffusion())
                .dateEffet(programme.getDateEffet())
                .dateFin(programme.getDateFin())
                .validite(programme.getValidite())
                .statut(programme.getStatut())
                .description(programme.getDescription())
                .typeProgram(programme.getTypeProgram())
                .build();
    }
}
