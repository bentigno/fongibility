package com.fongibility.controller;

import com.fongibility.dto.TransactionDTO;
import com.fongibility.service.TransactionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/transactions")
@CrossOrigin(origins = "http://localhost:3000")
public class TransactionController {

    @Autowired
    private TransactionService transactionService;

    @GetMapping("/section/{sectionId}")
    @PreAuthorize("hasAnyRole('OPERATEUR_SAISIE', 'RESPONSABLE_FONCTION')")
    public ResponseEntity<List<TransactionDTO>> getTransactionsBySection(@PathVariable Long sectionId) {
        return ResponseEntity.ok(transactionService.getTransactionsBySection(sectionId));
    }

    @PostMapping
    @PreAuthorize("hasRole('OPERATEUR_SAISIE')")
    public ResponseEntity<TransactionDTO> createTransaction(@RequestBody TransactionDTO transactionDTO) {
        TransactionDTO created = transactionService.createTransaction(transactionDTO);
        return created != null ? ResponseEntity.ok(created) : ResponseEntity.badRequest().build();
    }

    @PostMapping("/{id}/transmit")
    @PreAuthorize("hasRole('OPERATEUR_SAISIE')")
    public ResponseEntity<TransactionDTO> transmitTransaction(@PathVariable Long id) {
        TransactionDTO updated = transactionService.transmitTransaction(id);
        return updated != null ? ResponseEntity.ok(updated) : ResponseEntity.notFound().build();
    }

    @PostMapping("/{id}/validate")
    @PreAuthorize("hasRole('RESPONSABLE_FONCTION')")
    public ResponseEntity<TransactionDTO> validateTransaction(@PathVariable Long id) {
        TransactionDTO updated = transactionService.validateTransaction(id);
        return updated != null ? ResponseEntity.ok(updated) : ResponseEntity.notFound().build();
    }

    @PostMapping("/{id}/reject")
    @PreAuthorize("hasRole('RESPONSABLE_FONCTION')")
    public ResponseEntity<TransactionDTO> rejectTransaction(@PathVariable Long id) {
        TransactionDTO updated = transactionService.rejectTransaction(id);
        return updated != null ? ResponseEntity.ok(updated) : ResponseEntity.notFound().build();
    }
}
