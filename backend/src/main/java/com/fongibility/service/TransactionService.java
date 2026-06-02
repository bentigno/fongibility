package com.fongibility.service;

import com.fongibility.dto.TransactionDTO;
import com.fongibility.entity.*;
import com.fongibility.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class TransactionService {
    
    @Autowired
    private TransactionRepository transactionRepository;
    
    @Autowired
    private SectionRepository sectionRepository;
    
    @Autowired
    private ProgrammeRepository programmeRepository;
    
    @Autowired
    private ActionRepository actionRepository;
    
    @Autowired
    private ActiviteRepository activiteRepository;
    
    @Autowired
    private ChapitreRepository chapitreRepository;
    
    @Autowired
    private NatureEconomiqueRepository natureEconomiqueRepository;
    
    public List<TransactionDTO> getTransactionsBySection(Long sectionId) {
        Section section = sectionRepository.findById(sectionId).orElse(null);
        if (section == null) return List.of();
        
        return transactionRepository.findBySection(section).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    public TransactionDTO createTransaction(TransactionDTO dto) {
        Section section = sectionRepository.findById(dto.getSectionId()).orElse(null);
        Programme programme = programmeRepository.findById(dto.getProgrammeId()).orElse(null);
        Action action = actionRepository.findById(dto.getActionId()).orElse(null);
        Chapitre chapitre = dto.getChapitreId() != null ? 
                chapitreRepository.findById(dto.getChapitreId()).orElse(null) : null;
        NatureEconomique natureEconomique = dto.getNatureEconomiqueId() != null ? 
                natureEconomiqueRepository.findById(dto.getNatureEconomiqueId()).orElse(null) : null;
        Activite activite = dto.getActiviteId() != null ? 
                activiteRepository.findById(dto.getActiviteId()).orElse(null) : null;
        
        if (section == null || programme == null || action == null) {
            return null;
        }
        
        String numeroTransaction = "DBAT-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
        
        Transaction transaction = new Transaction();
        transaction.setNumeroTransaction(numeroTransaction);
        transaction.setExercice(dto.getExercice());
        transaction.setType(dto.getType());
        transaction.setClassification(dto.getClassification());
        transaction.setSection(section);
        transaction.setProgramme(programme);
        transaction.setAction(action);
        transaction.setActivite(activite);
        transaction.setChapitre(chapitre);
        transaction.setNatureEconomique(natureEconomique);
        transaction.setGroupeDebit(dto.getGroupeDebit());
        transaction.setGroupeCredit(dto.getGroupeCredit());
        transaction.setMontantAE(dto.getMontantAE());
        transaction.setMontantCP(dto.getMontantCP());
        transaction.setTypeTransactionDebit(dto.getTypeTransactionDebit());
        transaction.setTypeTransactionCredit(dto.getTypeTransactionCredit());
        transaction.setDateCreation(LocalDateTime.now());
        transaction.setTransmise(false);
        transaction.setValidee(false);
        
        Transaction saved = transactionRepository.save(transaction);
        return convertToDTO(saved);
    }
    
    public TransactionDTO transmitTransaction(Long id) {
        return transactionRepository.findById(id).map(transaction -> {
            transaction.setTransmise(true);
            transaction.setDateModification(LocalDateTime.now());
            return convertToDTO(transactionRepository.save(transaction));
        }).orElse(null);
    }
    
    public TransactionDTO validateTransaction(Long id) {
        return transactionRepository.findById(id).map(transaction -> {
            transaction.setValidee(true);
            transaction.setDateModification(LocalDateTime.now());
            return convertToDTO(transactionRepository.save(transaction));
        }).orElse(null);
    }
    
    public TransactionDTO rejectTransaction(Long id) {
        return transactionRepository.findById(id).map(transaction -> {
            transaction.setValidee(false);
            transaction.setTransmise(false);
            transaction.setDateModification(LocalDateTime.now());
            return convertToDTO(transactionRepository.save(transaction));
        }).orElse(null);
    }
    
    private TransactionDTO convertToDTO(Transaction transaction) {
        return TransactionDTO.builder()
                .id(transaction.getId())
                .numeroTransaction(transaction.getNumeroTransaction())
                .exercice(transaction.getExercice())
                .type(transaction.getType())
                .classification(transaction.getClassification())
                .dateCreation(transaction.getDateCreation())
                .dateModification(transaction.getDateModification())
                .sectionId(transaction.getSection().getId())
                .programmeId(transaction.getProgramme().getId())
                .actionId(transaction.getAction().getId())
                .activiteId(transaction.getActivite() != null ? transaction.getActivite().getId() : null)
                .chapitreId(transaction.getChapitre() != null ? transaction.getChapitre().getId() : null)
                .natureEconomiqueId(transaction.getNatureEconomique() != null ? transaction.getNatureEconomique().getId() : null)
                .groupeDebit(transaction.getGroupeDebit())
                .groupeCredit(transaction.getGroupeCredit())
                .montantAE(transaction.getMontantAE())
                .montantCP(transaction.getMontantCP())
                .typeTransactionDebit(transaction.getTypeTransactionDebit())
                .typeTransactionCredit(transaction.getTypeTransactionCredit())
                .transmise(transaction.getTransmise())
                .validee(transaction.getValidee())
                .build();
    }
}
