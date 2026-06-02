package com.fongibility.service;

import com.fongibility.dto.SectionDTO;
import com.fongibility.entity.Section;
import com.fongibility.repository.SectionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class SectionService {
    
    @Autowired
    private SectionRepository sectionRepository;
    
    public List<SectionDTO> getAllSections() {
        return sectionRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    public SectionDTO getSectionById(Long id) {
        return sectionRepository.findById(id)
                .map(this::convertToDTO)
                .orElse(null);
    }
    
    public SectionDTO getSectionByCode(String code) {
        return sectionRepository.findByCode(code)
                .map(this::convertToDTO)
                .orElse(null);
    }
    
    public SectionDTO createSection(SectionDTO dto) {
        Section section = new Section();
        section.setCode(dto.getCode());
        section.setLibelle(dto.getLibelle());
        section.setAbreviation(dto.getAbreviation());
        section.setDateEffet(dto.getDateEffet());
        section.setDateFin(dto.getDateFin());
        section.setValide(dto.getValide());
        section.setType(dto.getType());
        
        Section saved = sectionRepository.save(section);
        return convertToDTO(saved);
    }
    
    public SectionDTO updateSection(Long id, SectionDTO dto) {
        return sectionRepository.findById(id).map(section -> {
            section.setLibelle(dto.getLibelle());
            section.setAbreviation(dto.getAbreviation());
            section.setDateEffet(dto.getDateEffet());
            section.setDateFin(dto.getDateFin());
            section.setValide(dto.getValide());
            section.setType(dto.getType());
            return convertToDTO(sectionRepository.save(section));
        }).orElse(null);
    }
    
    public void deleteSection(Long id) {
        sectionRepository.deleteById(id);
    }
    
    private SectionDTO convertToDTO(Section section) {
        return SectionDTO.builder()
                .id(section.getId())
                .code(section.getCode())
                .libelle(section.getLibelle())
                .abreviation(section.getAbreviation())
                .dateEffet(section.getDateEffet())
                .dateFin(section.getDateFin())
                .valide(section.getValide())
                .type(section.getType())
                .build();
    }
}
